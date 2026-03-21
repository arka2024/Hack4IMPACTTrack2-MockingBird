# Training Pipeline (YOLOv11 + DeBERTa)

This folder provides a practical end-to-end workflow for:

- labeling datasets
- training a YOLOv11n detector for patch/sticker attacks
- training a DeBERTa-v3-small classifier for text intent
- exporting artifacts that plug directly into backend-engine.py

## 1) Install training dependencies

Use a Python virtual environment, then install:

```bash
pip install -r training/requirements-training.txt
```

## 2) YOLOv11 labeling and training

### Dataset layout

Store your data like this:

```text
training/datasets/yolo/
  images/
    train/
    val/
    test/
  labels/
    train/
    val/
    test/
  data.yaml
```

Each image must have one .txt label file using YOLO format:

```text
class_id center_x center_y width height
```

All coordinates are normalized to [0,1].

### Class IDs (recommended)

- 0: patch_attack
- 1: sticker_attack
- 2: normal_object_noise (optional)

### Quick conversion helper

If you label in a CSV tool, use:

```bash
python training/scripts/prepare_yolo_labels.py \
  --input-csv training/datasets/yolo/raw_boxes.csv \
  --output-dir training/datasets/yolo \
  --class-map patch_attack:0 sticker_attack:1
```

### Train YOLOv11n

```bash
python training/scripts/train_yolo.py \
  --data training/datasets/yolo/data.yaml \
  --model yolo11n.pt \
  --epochs 60 \
  --imgsz 640 \
  --batch 16 \
  --project training/runs/yolo
```

Best weights are copied to:

- models/yolov11n-patch.pt

## 3) DeBERTa labeling and training

### Label taxonomy

Use exactly these labels:

- normal
- objection
- manipulation_or_coercion

### Annotation template

Use this file as your source annotation sheet:

- training/datasets/deberta/labeling_template.csv

### Build train/val/test JSONL

```bash
python training/scripts/prepare_deberta_dataset.py \
  --input-csv training/datasets/deberta/labeled.csv \
  --output-dir training/datasets/deberta/processed
```

This creates:

- train.jsonl
- val.jsonl
- test.jsonl
- label_map.json

### Train DeBERTa-v3-small

```bash
python training/scripts/train_deberta.py \
  --train-file training/datasets/deberta/processed/train.jsonl \
  --val-file training/datasets/deberta/processed/val.jsonl \
  --test-file training/datasets/deberta/processed/test.jsonl \
  --model-name microsoft/deberta-v3-small \
  --output-dir models/deberta-v3-small-objection \
  --epochs 4 \
  --batch-size 16 \
  --lr 2e-5
```

The script saves model and tokenizer in:

- models/deberta-v3-small-objection

## 4) Connect trained models to backend

Default paths already match backend-engine.py:

- YOLO_MODEL_PATH=models/yolov11n-patch.pt
- DEBERTA_MODEL_PATH=models/deberta-v3-small-objection
- TEXT_LABELS=normal,objection,manipulation_or_coercion

Verify load:

- http://127.0.0.1:8000/api/v1/model-status

## 5) Data quality checklist

- Keep class balance reasonably close for text classes.
- Include hard negatives for YOLO (clean frames with no attack patches).
- Add multilingual examples if your users do not speak only English.
- Deduplicate near-identical text rows to avoid inflated validation metrics.
- Always review false positives from real camera captures and add them back to training.
