import argparse
import shutil
from pathlib import Path

from ultralytics import YOLO


def main():
    parser = argparse.ArgumentParser(description="Train YOLOv11 for patch/sticker detection.")
    parser.add_argument("--data", required=True, help="Path to YOLO data.yaml")
    parser.add_argument("--model", default="yolo11n.pt", help="Base model checkpoint")
    parser.add_argument("--epochs", type=int, default=60)
    parser.add_argument("--imgsz", type=int, default=640)
    parser.add_argument("--batch", type=int, default=16)
    parser.add_argument("--project", default="training/runs/yolo")
    parser.add_argument("--name", default="patch_sticker_detector")
    parser.add_argument("--device", default="auto")
    args = parser.parse_args()

    model = YOLO(args.model)
    results = model.train(
        data=args.data,
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        project=args.project,
        name=args.name,
        device=args.device,
    )

    best_path = Path(results.save_dir) / "weights" / "best.pt"
    if not best_path.exists():
        raise FileNotFoundError(f"Expected best model at {best_path}")

    export_path = Path("models") / "yolov11n-patch.pt"
    export_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(best_path, export_path)

    print(f"Training complete. Exported best weights to {export_path}")


if __name__ == "__main__":
    main()
