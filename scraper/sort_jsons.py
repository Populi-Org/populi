import json
import os
from pathlib import Path

DOWNLOADS_DIR = Path(__file__).parent / "downloads"
SORTED_DIR = Path(__file__).parent / "sorted"


def sort_json_file(src_path: Path, dest_path: Path) -> None:
    with open(src_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list):
        print(f"  ⚠ Skipping {src_path.name}: not a list (type={type(data).__name__})")
        return

    # Sort by DepNomeParlamentar
    data.sort(key=lambda entry: entry["Deputado"]["DepNomeParlamentar"])

    os.makedirs(dest_path.parent, exist_ok=True)
    with open(dest_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def main():
    json_files = sorted(DOWNLOADS_DIR.rglob("*.json"))
    # Exclude index.json
    json_files = [p for p in json_files if p.name != "index.json"]

    print(f"Found {len(json_files)} JSON file(s) to sort\n")

    for src_path in json_files:
        rel = src_path.relative_to(DOWNLOADS_DIR)
        dest_path = SORTED_DIR / rel
        print(f"Sorting {rel} ...")
        sort_json_file(src_path, dest_path)

    print(f"\nDone! Sorted files saved to {SORTED_DIR}")


if __name__ == "__main__":
    main()
