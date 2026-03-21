import argparse
import json
from pathlib import Path

import numpy as np
from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    DataCollatorWithPadding,
    Trainer,
    TrainingArguments,
)


def read_label_map(path: Path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def main():
    parser = argparse.ArgumentParser(description="Train DeBERTa-v3-small text classifier.")
    parser.add_argument("--train-file", required=True)
    parser.add_argument("--val-file", required=True)
    parser.add_argument("--test-file", required=True)
    parser.add_argument("--model-name", default="microsoft/deberta-v3-small")
    parser.add_argument("--output-dir", default="models/deberta-v3-small-objection")
    parser.add_argument("--label-map", default="training/datasets/deberta/processed/label_map.json")
    parser.add_argument("--epochs", type=int, default=4)
    parser.add_argument("--batch-size", type=int, default=16)
    parser.add_argument("--lr", type=float, default=2e-5)
    parser.add_argument("--max-length", type=int, default=256)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    label2id = read_label_map(Path(args.label_map))
    id2label = {v: k for k, v in label2id.items()}

    dataset = load_dataset(
        "json",
        data_files={
            "train": args.train_file,
            "validation": args.val_file,
            "test": args.test_file,
        },
    )

    tokenizer = AutoTokenizer.from_pretrained(args.model_name)

    def preprocess(batch):
        tokenized = tokenizer(batch["text"], truncation=True, max_length=args.max_length)
        tokenized["labels"] = [label2id[label] for label in batch["label"]]
        return tokenized

    encoded = dataset.map(preprocess, batched=True, remove_columns=["text", "label"])

    model = AutoModelForSequenceClassification.from_pretrained(
        args.model_name,
        num_labels=len(label2id),
        id2label=id2label,
        label2id=label2id,
    )

    collator = DataCollatorWithPadding(tokenizer=tokenizer)

    def compute_metrics(eval_pred):
        logits, labels = eval_pred
        preds = np.argmax(logits, axis=-1)
        acc = (preds == labels).mean().item()
        return {"accuracy": acc}

    training_args = TrainingArguments(
        output_dir=str(Path(args.output_dir) / "runs"),
        learning_rate=args.lr,
        per_device_train_batch_size=args.batch_size,
        per_device_eval_batch_size=args.batch_size,
        num_train_epochs=args.epochs,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        logging_steps=25,
        load_best_model_at_end=True,
        metric_for_best_model="accuracy",
        greater_is_better=True,
        seed=args.seed,
        report_to="none",
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=encoded["train"],
        eval_dataset=encoded["validation"],
        tokenizer=tokenizer,
        data_collator=collator,
        compute_metrics=compute_metrics,
    )

    trainer.train()
    test_metrics = trainer.evaluate(encoded["test"])

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    trainer.save_model(str(out_dir))
    tokenizer.save_pretrained(str(out_dir))

    with open(out_dir / "test_metrics.json", "w", encoding="utf-8") as f:
        json.dump(test_metrics, f, indent=2)

    print(f"Saved DeBERTa model to {out_dir}")
    print(f"Test metrics: {test_metrics}")


if __name__ == "__main__":
    main()
