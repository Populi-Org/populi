#!/usr/bin/env python3
"""
Fetch deputy images from Portuguese Wikipedia.
Parses https://pt.wikipedia.org/wiki/Lista_de_deputados_de_Portugal
to find deputy Wikipedia pages, then fetches page images via API.
"""

import os
import sys
import time
import re
import urllib.parse
from typing import Optional, Dict, List

import requests
from bs4 import BeautifulSoup
import psycopg2
from psycopg2.extras import RealDictCursor

HEADERS = {
    "User-Agent": (
        "PopuliScraper/1.0 (opencode-agent) python-requests"
    ),
    "Accept": "application/json",
}

WIKI_API = "https://pt.wikipedia.org/w/api.php"
LIST_URL = "https://pt.wikipedia.org/wiki/Lista_de_deputados_de_Portugal"


def get_db_url() -> str:
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith("DATABASE_URL="):
                    return line.strip().split("=", 1)[1].strip('"').strip("'")
    return os.environ.get("DATABASE_URL", "postgresql://populi:populi@localhost:5432/populi-db")


def get_connection():
    return psycopg2.connect(get_db_url())


def get_deputies(conn) -> List[Dict]:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT id, dep_id, dep_nome_parlamentar, dep_nome_completo
            FROM deputies
            ORDER BY id
        """)
        return [dict(r) for r in cur.fetchall()]


def parse_wiki_list() -> Dict[str, str]:
    """
    Parse the Wikipedia list page and return a mapping of:
    {normalized_name: wikipedia_page_title}
    """
    print("[i] Fetching Wikipedia list page...")
    resp = requests.get(LIST_URL, headers=HEADERS, timeout=60)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    tables = soup.find_all("table", {"class": "wikitable"})
    if not tables:
        raise RuntimeError("No wikitable found on the list page")

    t = tables[0]
    rows = t.find_all("tr")
    pages = {}

    for row in rows[3:]:
        cols = row.find_all(["td", "th"])
        if len(cols) < 4:
            continue
        name_cell = cols[3]
        links = name_cell.find_all("a", href=True)
        for a in links:
            href = a["href"]
            # Skip redlinks (non-existent pages)
            if "redlink=1" in href or "action=edit" in href:
                continue
            m = re.search(r"/wiki/([^?]+)", href)
            if not m:
                continue
            title = urllib.parse.unquote(m.group(1).replace("_", " "))
            text = a.get_text(strip=True)
            # Use the Wikipedia page title as the key
            pages[title] = title

    print(f"[i] Found {len(pages)} unique Wikipedia pages")
    return pages


def normalize(name: str) -> str:
    """Lowercase, remove accents, keep only letters and spaces."""
    name = name.lower()
    # Remove common Portuguese accents
    accents = {
        'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a', 'ä': 'a',
        'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
        'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
        'ó': 'o', 'ò': 'o', 'õ': 'o', 'ô': 'o', 'ö': 'o',
        'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
        'ç': 'c', 'ñ': 'n',
    }
    for k, v in accents.items():
        name = name.replace(k, v)
    # Keep only letters and spaces
    name = re.sub(r"[^a-z\s]", "", name)
    name = re.sub(r"\s+", " ", name).strip()
    return name


def build_wiki_index(wiki_pages: Dict[str, str]) -> Dict[str, str]:
    """Build index: normalized name -> wiki title."""
    index = {}
    for title in wiki_pages:
        norm = normalize(title)
        if norm:
            index[norm] = title
    return index


def match_deputy_to_wiki(dep: Dict, wiki_index: Dict[str, str]) -> Optional[str]:
    """Find best matching Wikipedia page title for a deputy."""
    full = dep.get("dep_nome_completo", "")
    parl = dep.get("dep_nome_parlamentar", "")

    for name in (full, parl):
        if not name:
            continue
        norm = normalize(name)
        if norm in wiki_index:
            return wiki_index[norm]

    # Try partial matching: if all significant words of the deputy name
    # are present in a Wikipedia title
    for name in (full, parl):
        if not name:
            continue
        words = set(normalize(name).split())
        if not words:
            continue
        for wiki_norm, wiki_title in wiki_index.items():
            wiki_words = set(wiki_norm.split())
            # Require at least 2 shared significant words, or all if < 3 words
            shared = words & wiki_words
            if len(words) >= 3:
                if len(shared) >= max(2, len(words) - 1):
                    return wiki_title
            else:
                if shared == words:
                    return wiki_title

    return None


def fetch_images_batch(titles: List[str]) -> Dict[str, Optional[str]]:
    """Fetch thumbnail URLs for up to 50 titles at once via Wikipedia API."""
    result = {}
    if not titles:
        return result

    # API batch limit is 50 for pageimages
    chunks = [titles[i:i+50] for i in range(0, len(titles), 50)]
    for chunk in chunks:
        params = {
            "action": "query",
            "titles": "|".join(chunk),
            "prop": "pageimages",
            "pithumbsize": 500,
            "format": "json",
            "origin": "*",
        }
        try:
            resp = requests.get(WIKI_API, params=params, headers=HEADERS, timeout=30)
            resp.raise_for_status()
            data = resp.json()
            pages = data.get("query", {}).get("pages", {})
            for page_id, page in pages.items():
                title = page.get("title", "")
                thumb = page.get("thumbnail", {})
                if thumb and "source" in thumb:
                    result[title] = thumb["source"]
                else:
                    result[title] = None
        except Exception as exc:
            print(f"  [!] Batch image fetch error: {exc}")
            for t in chunk:
                result[t] = None
        time.sleep(0.3)
    return result


def main():
    conn = get_connection()
    deputies = get_deputies(conn)
    conn.close()

    wiki_pages = parse_wiki_list()
    wiki_index = build_wiki_index(wiki_pages)

    # Match deputies to Wikipedia pages
    matched = []  # list of (deputy_id, wiki_title)
    unmatched = []
    for dep in deputies:
        title = match_deputy_to_wiki(dep, wiki_index)
        if title:
            matched.append((dep["id"], title, dep["dep_nome_parlamentar"]))
        else:
            unmatched.append(dep["dep_nome_parlamentar"])

    print(f"[i] Matched {len(matched)} deputies to Wikipedia pages")
    print(f"[i] Unmatched: {len(unmatched)}")

    # Fetch images in batches
    unique_titles = list({t for _, t, _ in matched})
    print(f"[i] Fetching images for {len(unique_titles)} unique pages...")
    title_to_image = fetch_images_batch(unique_titles)

    found = sum(1 for url in title_to_image.values() if url)
    print(f"[i] Found images for {found}/{len(unique_titles)} pages")

    # Update DB
    conn = get_connection()
    updated = 0
    with conn.cursor() as cur:
        for dep_id, title, name in matched:
            img_url = title_to_image.get(title)
            if img_url:
                cur.execute("""
                    UPDATE deputies
                    SET dep_image_url = %s, updated_at = NOW()
                    WHERE id = %s
                """, (img_url, dep_id))
                updated += 1

    conn.commit()
    conn.close()
    print(f"\n[✓] Done. Updated {updated} deputies with images.")


if __name__ == "__main__":
    main()
