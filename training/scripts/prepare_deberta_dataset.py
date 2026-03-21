import argparse
import json
from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split

ALLOWED_LABELS = ["normal", "objection", "manipulation_or_coercion"]


def write_jsonl(df: pd.DataFrame, out_file: Path):
    with open(out_file, "w", encoding="utf-8") as f:
        for _, row in df.iterrows():
            payload = {"text": row["text"], "label": row["label"]}
            f.write(json.dumps(payload, ensure_ascii=True) + "\n")


def main():
    parser = argparse.ArgumentParser(description="Prepare DeBERTa dataset splits from CSV.")
    parser.add_argument("--input-csv", required=True, help="CSV with columns: text,label")
    parser.add_argument("--output-dir", required=True, help="Folder for JSONL splits")
    parser.add_argument("--test-size", type=float, default=0.10)
    parser.add_argument("--val-size", type=float, default=0.10)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    df = pd.read_csv(args.input_csv)
    if "text" not in df.columns or "label" not in df.columns:
        raise ValueError("Input CSV must include text,label columns")

    df = df[["text", "label"]].dropna()
    df["text"] = df["text"].astype(str).str.strip()
    df["label"] = df["label"].astype(str).str.strip()
    df = df[df["text"] != ""]

    invalid = sorted(set(df["label"].unique()) - set(ALLOWED_LABELS))
    if invalid:
        raise ValueError(f"Found invalid labels: {invalid}. Allowed: {ALLOWED_LABELS}")

    train_val_df, test_df = train_test_split(
        df,
        test_size=args.test_size,
        random_state=args.seed,
        stratify=df["label"],
    )

    val_ratio_from_train_val = args.val_size / (1.0 - args.test_size)
    train_df, val_df = train_test_split(
        train_val_df,
        test_size=val_ratio_from_train_val,
        random_state=args.seed,
        stratify=train_val_df["label"],
    )

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    write_jsonl(train_df, out_dir / "train.jsonl")
    write_jsonl(val_df, out_dir / "val.jsonl")
    write_jsonl(test_df, out_dir / "test.jsonl")

    label_map = {label: idx for idx, label in enumerate(ALLOWED_LABELS)}
    with open(out_dir / "label_map.json", "w", encoding="utf-8") as f:
        json.dump(label_map, f, indent=2)

    print("DeBERTa dataset prepared.")
    print(f"Train: {len(train_df)}, Val: {len(val_df)}, Test: {len(test_df)}")


if __name__ == "__main__":
    main()
