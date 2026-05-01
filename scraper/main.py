import json
import os
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

BASE_URL = "https://www.parlamento.pt"
URL = f"{BASE_URL}/Cidadania/Paginas/DAatividadeDeputado.aspx"
DOWNLOADS_DIR = os.path.join(os.path.dirname(__file__), "downloads")


def fetch_page(url: str) -> str:
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.text


def extract_legislaturas(html: str) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    items = soup.find_all("div", class_="archive-item")

    legislaturas = []
    for item in items:
        link = item.find("a", class_="TextoRegular")
        if not link:
            continue

        name = link.get_text(strip=True)
        href = link.get("href")
        if href:
            href = urljoin(BASE_URL, href)

        legislaturas.append({"name": name, "url": href, "files": []})

    return legislaturas


def extract_files(html: str) -> list[dict[str, str]]:
    soup = BeautifulSoup(html, "html.parser")
    items = soup.find_all("div", class_="archive-item")

    files = []
    for item in items:
        link = item.find("a", class_="TextoRegular")
        if not link:
            continue

        name = link.get_text(strip=True)
        href = link.get("href")
        if href:
            href = urljoin(BASE_URL, href)

        files.append({"name": name, "url": href})

    return files


def sanitize_folder_name(name: str) -> str:
    """Remove characters that are invalid for folder names."""
    return re.sub(r'[\\/:*?"<>|]', "_", name)


def rename_json_file(original_name: str) -> str:
    """Rename _json.txt files to .json extension."""
    if original_name.lower().endswith("_json.txt"):
        return original_name[:-9] + ".json"
    return original_name


def download_file(url: str, dest_path: str) -> None:
    """Download a file from URL and save it to dest_path."""
    response = requests.get(url, timeout=60)
    response.raise_for_status()
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    with open(dest_path, "wb") as f:
        f.write(response.content)


def format_json_file(path: str) -> None:
    """Pretty-print a JSON file in-place."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
    except (json.JSONDecodeError, UnicodeDecodeError) as e:
        print(f"    ⚠ Failed to format JSON: {e}")


def main():
    print(f"Fetching {URL} ...")
    html = fetch_page(URL)
    legislaturas = extract_legislaturas(html)

    print(f"\nFound {len(legislaturas)} legislatura(s)\n")

    index = []

    for leg in legislaturas:
        print(f"{leg['name']}")
        leg_folder = os.path.join(DOWNLOADS_DIR, sanitize_folder_name(leg["name"]))
        json_files = []

        try:
            leg_html = fetch_page(leg["url"])
            files = extract_files(leg_html)
            leg["files"] = files

            if files:
                for f in files:
                    print(f"  • {f['name']}")

                    if "json" in f["name"].lower():
                        new_name = rename_json_file(f["name"])
                        dest_path = os.path.join(leg_folder, new_name)
                        rel_path = os.path.relpath(dest_path, DOWNLOADS_DIR)

                        if os.path.exists(dest_path):
                            print(f"    ↳ Already exists: {new_name}")
                            json_files.append(rel_path)
                        else:
                            print(f"    ↳ Downloading as {new_name} ...")
                            try:
                                download_file(f["url"], dest_path)
                                format_json_file(dest_path)
                                json_files.append(rel_path)
                            except requests.RequestException as e:
                                print(f"    ✗ Failed to download: {e}")
            else:
                print("  (no files found)")
        except requests.RequestException as e:
            print(f"  (failed to fetch: {e})")

        index.append(
            {
                "name": leg["name"],
                "url": leg["url"],
                "json_files": json_files,
            }
        )

        print()

    # Write global index
    index_path = os.path.join(DOWNLOADS_DIR, "index.json")
    os.makedirs(DOWNLOADS_DIR, exist_ok=True)
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index, f, indent=2, ensure_ascii=False)

    total_files = sum(len(leg["json_files"]) for leg in index)
    print(f"Done! Downloaded {total_files} file(s) to {DOWNLOADS_DIR}")
    print(f"Global index saved to: {index_path}")


if __name__ == "__main__":
    main()
