#!/usr/bin/env python3
"""
Expresso.pt News Scraper for Portuguese Deputies
Reads deputies from PostgreSQL, scrapes Expresso news, stores articles back in DB.
"""

import os
import sys
import time
import random
from datetime import datetime
from typing import List, Dict, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests
from bs4 import BeautifulSoup
import psycopg2
from psycopg2.extras import RealDictCursor

try:
    from tqdm import tqdm
except ImportError:
    tqdm = None

# ── Configuration ────────────────────────────────────────────────────────────
BASE_API_URL = "https://expresso.pt/api/molecule/search"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "pt-PT,pt;q=0.9,en;q=0.8",
}
REQUEST_DELAY = 0.15
JITTER = 0.1
PAGE_SIZE = 10
MAX_WORKERS = 12


# ── DB helpers ───────────────────────────────────────────────────────────────

def _find_env_file() -> Optional[str]:
    """Look for website/.env or .env walking up from this file."""
    start = os.path.dirname(os.path.abspath(__file__))
    for _ in range(5):
        for name in ("website/.env", ".env"):
            candidate = os.path.join(start, name)
            if os.path.exists(candidate):
                return candidate
        parent = os.path.dirname(start)
        if parent == start:
            break
        start = parent
    return None


def get_db_url() -> str:
    """Read DATABASE_URL from .env or environment."""
    env_path = _find_env_file()
    if env_path:
        with open(env_path) as f:
            for line in f:
                if line.startswith("DATABASE_URL="):
                    return line.strip().split("=", 1)[1].strip('"').strip("'")
    return os.environ.get(
        "DATABASE_URL", "postgresql://populi:populi@localhost:5432/populi-db"
    )


def get_connection():
    db_url = get_db_url()
    if not db_url:
        raise RuntimeError("DATABASE_URL not found in .env or environment")
    return psycopg2.connect(db_url)


def get_deputies(conn) -> List[Dict]:
    """Fetch all deputies with their IDs and parliamentary names."""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT id, dep_nome_parlamentar as name, dep_cp_des as party
            FROM deputies
            ORDER BY id
        """)
        return [dict(row) for row in cur.fetchall()]


# ── HTTP & Parsing ─────────────────────────────────────────────────────────────

def _throttled_sleep():
    time.sleep(REQUEST_DELAY + random.uniform(0, JITTER))


def fetch_search_page(session: requests.Session, name: str, page: int, offset: int) -> Optional[str]:
    params = {"q": name, "page": page, "offset": offset}
    try:
        resp = session.get(BASE_API_URL, params=params, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        return resp.text
    except requests.RequestException:
        return None


def parse_articles(html: str) -> List[Dict]:
    soup = BeautifulSoup(html, "html.parser")
    articles = []

    for article_tag in soup.find_all("article"):
        article_type = None
        for cls in article_tag.get("class", []):
            if cls.startswith("AT-"):
                article_type = cls.replace("AT-", "")
                break

        title_tag = article_tag.find("h2", class_="title")
        title = None
        url = None
        if title_tag:
            a = title_tag.find("a", href=True)
            if a:
                title = a.get_text(strip=True)
                url = a["href"]
                if url.startswith("/"):
                    url = f"https://expresso.pt{url}"

        section_tag = article_tag.find("p", class_="mainSection")
        section = None
        if section_tag:
            section_a = section_tag.find("a")
            section = section_a.get_text(strip=True) if section_a else section_tag.get_text(strip=True)

        date_tag = article_tag.find("p", class_="publishedDate")
        published_at = date_tag.get("datetime") if date_tag else None

        author_tag = article_tag.find("p", class_="author")
        authors = []
        if author_tag:
            for a in author_tag.find_all("a"):
                authors.append(a.get_text(strip=True))
        authors_str = ", ".join(authors) if authors else None

        lead_tag = article_tag.find("h3", class_="lead")
        lead = lead_tag.get_text(strip=True) if lead_tag else None

        has_picture = 1 if "hasPicture" in " ".join(article_tag.get("class", [])) else 0

        if title and url:
            articles.append({
                "title": title,
                "url": url,
                "section": section,
                "published_at": published_at,
                "authors": authors_str,
                "lead": lead,
                "has_picture": has_picture,
                "article_type": article_type,
            })

    return articles


def _match_score(name: str, title: str) -> int:
    """Return match score: 2=full name in title, 1=partial name, 0=no match."""
    if not title:
        return 0
    title_lower = title.lower()
    name_lower = name.lower()

    # Full name match
    if name_lower in title_lower:
        return 2

    # Partial name match: any name part longer than 2 chars
    for part in name_lower.split():
        if len(part) > 2 and part in title_lower:
            return 1

    return 0


# ── Worker ─────────────────────────────────────────────────────────────────────

def scrape_deputy(deputy: Dict) -> Dict:
    """Scrape sequential pages for one deputy, store up to 20 best-matching articles."""
    deputy_id = deputy["id"]
    name = deputy["name"]
    party = deputy.get("party", "")
    MAX_ARTICLES = 20
    MAX_PAGES = 50

    conn = get_connection()
    session = requests.Session()
    seen_urls = set()
    all_articles = []
    empty_page_count = 0
    page_num = 1

    while empty_page_count < 2 and page_num <= MAX_PAGES:
        html = fetch_search_page(session, name, page_num, 0)
        if html is None:
            time.sleep(0.5)
            html = fetch_search_page(session, name, page_num, 0)
            if html is None:
                break

        articles = parse_articles(html)
        if not articles:
            empty_page_count += 1
            page_num += 1
            continue

        empty_page_count = 0
        for art in articles:
            if art["url"] not in seen_urls:
                seen_urls.add(art["url"])
                art["_score"] = _match_score(name, art.get("title", ""))
                all_articles.append(art)

        # Stop early if we already have enough full-name matches
        if sum(1 for a in all_articles if a["_score"] == 2) >= MAX_ARTICLES:
            break

        _throttled_sleep()
        page_num += 1

    if not all_articles:
        conn.close()
        return {"name": name, "party": party, "total_new": 0}

    # Sort by score descending, then by published_at descending (most recent first)
    all_articles.sort(
        key=lambda a: (
            a["_score"],
            a.get("published_at") or "1970-01-01T00:00:00",
        ),
        reverse=True,
    )
    chosen = all_articles[:MAX_ARTICLES]

    total_new = 0
    with conn.cursor() as cur:
        for art in chosen:
            try:
                # Parse ISO datetime
                pub_dt = None
                if art.get("published_at"):
                    try:
                        pub_dt = datetime.fromisoformat(art["published_at"].replace("Z", "+00:00"))
                    except ValueError:
                        pass

                cur.execute("SAVEPOINT insert_sp")
                cur.execute("""
                    INSERT INTO articles
                    (deputy_id, title, url, section, published_at, authors, lead, has_picture, article_type, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (deputy_id, url) DO NOTHING
                """, (
                    deputy_id,
                    art["title"],
                    art["url"],
                    art["section"],
                    pub_dt,
                    art["authors"],
                    art["lead"],
                    bool(art["has_picture"]),
                    art["article_type"],
                    datetime.now(),
                ))
                if cur.rowcount > 0:
                    total_new += 1
                cur.execute("RELEASE SAVEPOINT insert_sp")
            except Exception as exc:
                cur.execute("ROLLBACK TO SAVEPOINT insert_sp")
                print(f"  [!] DB insert error for {name}: {exc}")

    conn.commit()
    conn.close()
    return {"name": name, "party": party, "total_new": total_new}


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    conn = get_connection()
    deputies = get_deputies(conn)
    conn.close()

    total_politicians = len(deputies)
    total_articles = 0
    completed = 0

    print(f"[i] Starting scrape of {total_politicians} deputies with {MAX_WORKERS} workers...")
    sys.stdout.flush()

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(scrape_deputy, dep): dep for dep in deputies}
        pbar = tqdm(total=total_politicians, desc="Scraping", unit="deputy", ncols=100) if tqdm else None

        for future in as_completed(futures):
            dep = futures[future]
            try:
                result = future.result()
            except Exception as exc:
                err = f"[✗] {dep['name']} failed: {exc}"
                if pbar:
                    pbar.write(err)
                else:
                    print(err)
                    sys.stdout.flush()
                completed += 1
                if pbar:
                    pbar.update(1)
                continue

            completed += 1
            total_articles += result["total_new"]
            msg = f"[{completed}/{total_politicians}] {result['name']}: {result['total_new']} new articles"

            if pbar:
                pbar.write(msg)
                pbar.update(1)
            else:
                print(msg)
                sys.stdout.flush()

        if pbar:
            pbar.close()

    print(f"\n[✓] Done. Processed {completed}/{total_politicians} deputies, stored {total_articles} new articles.")


if __name__ == "__main__":
    main()
