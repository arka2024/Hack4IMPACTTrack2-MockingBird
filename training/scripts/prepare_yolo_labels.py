import argparse
import csv
from pathlib import Path


def parse_class_map(items):
    out = {}
    for item in items:
        k, v = item.split(":", 1)
        out[k.strip()] = int(v.strip())
    return out


def clamp(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, x))


def main():
    parser = argparse.ArgumentParser(description="Convert box CSV to YOLO txt labels.")
    parser.add_argument("--input-csv", required=True, help="CSV with image_path,class_name,xmin,ymin,xmax,ymax,width,height")
    parser.add_argument("--output-dir", required=True, help="Root folder containing labels/train|val|test")
    parser.add_argument("--class-map", nargs="+", required=True, help="Mappings like patch_attack:0 sticker_attack:1")
    args = parser.parse_args()

    class_map = parse_class_map(args.class_map)
    output_dir = Path(args.output_dir)

    with open(args.input_csv, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            image_path = Path(row["image_path"])
            split = image_path.parent.name
            stem = image_path.stem
            class_name = row["class_name"].strip()
            if class_name not in class_map:
                continue

            xmin = float(row["xmin"])
            ymin = float(row["ymin"])
            xmax = float(row["xmax"])
            ymax = float(row["ymax"])
            w = float(row["width"])
            h = float(row["height"])

            cx = clamp(((xmin + xmax) / 2.0) / w)
            cy = clamp(((ymin + ymax) / 2.0) / h)
            bw = clamp((xmax - xmin) / w)
            bh = clamp((ymax - ymin) / h)

            label_dir = output_dir / "labels" / split
            label_dir.mkdir(parents=True, exist_ok=True)
            label_file = label_dir / f"{stem}.txt"

            with open(label_file, "a", encoding="utf-8") as lf:
                lf.write(f"{class_map[class_name]} {cx:.6f} {cy:.6f} {bw:.6f} {bh:.6f}\n")

    print("YOLO label conversion completed.")


if __name__ == "__main__":
    main()
