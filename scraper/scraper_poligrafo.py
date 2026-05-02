#!/usr/bin/env python3
"""
Polígrafo Fact-Check Scraper for Portuguese Deputies
Reads deputies from PostgreSQL, scrapes Polígrafo fact-checks, stores back in DB.
"""

import os
import sys
import time
import random
import re
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
BASE_URL = "https://poligrafo.sapo.pt"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "pt-PT,pt;q=0.9,en;q=0.8",
}
REQUEST_DELAY = 0.5
JITTER = 0.2
MAX_WORKERS = 6


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
    """Fetch all serving deputies (excluding suplentes) with their IDs and parliamentary names."""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT d.id, d.dep_nome_parlamentar as name, d.dep_cp_des as party
            FROM deputies d
            WHERE EXISTS (
                SELECT 1 FROM status_history sh
                WHERE sh.deputy_id = d.id
                AND sh.sio_dt_fim IS NULL
                AND sh.sio_des != 'Suplente'
            )
            ORDER BY d.id
        """)
        return [dict(row) for row in cur.fetchall()]


# ── HTTP & Parsing ─────────────────────────────────────────────────────────────

def _throttled_sleep():
    time.sleep(REQUEST_DELAY + random.uniform(0, JITTER))


def fetch_search_page(session: requests.Session, name: str, page: int) -> Optional[str]:
    """Fetch one search result page for a deputy name."""
    params = {"s": name}
    if page > 1:
        params["paged"] = page
    try:
        resp = session.get(BASE_URL, params=params, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        return resp.text
    except requests.RequestException:
        return None


def parse_fact_checks(html: str) -> List[Dict]:
    """Extract fact-check cards from a Polígrafo search result page."""
    soup = BeautifulSoup(html, "html.parser")
    fact_checks = []

    container = soup.find("div", class_="ecs-posts")
    if not container:
        container = soup

    for article in container.find_all("article"):
        classes = article.get("class", [])
        if "fact_check" not in classes:
            continue

        # Title & URL
        title_tag = article.find("h6", class_="elementor-heading-title")
        title = None
        url = None
        if title_tag:
            a = title_tag.find("a", href=True)
            if a:
                title = a.get_text(strip=True)
                url = a["href"]

        # Lead / excerpt
        lead = None
        lead_widget = article.find("div", {"data-widget_type": "theme-post-excerpt.default"})
        if lead_widget:
            container_div = lead_widget.find("div", class_="elementor-widget-container")
            if container_div:
                lead = container_div.get_text(strip=True)

        # Truth level from meter image
        truth_level = None
        meter_div = article.find("div", class_="fact_check_meter_image")
        if meter_div:
            img = meter_div.find("img")
            if img:
                src = img.get("src", "")
                match = re.search(r"meter-03-([^/]+)-light\.gif", src)
                if match:
                    truth_level = match.group(1)

        if title and url:
            fact_checks.append({
                "title": title,
                "url": url,
                "lead": lead,
                "truth_level": truth_level,
            })

    return fact_checks


def _match_score(name: str, title: str) -> int:
    """Return match score: 2=full name in title, 1=partial name, 0=no match."""
    if not title:
        return 0
    title_lower = title.lower()
    name_lower = name.lower()

    if name_lower in title_lower:
        return 2

    for part in name_lower.split():
        if len(part) > 2 and part in title_lower:
            return 1

    return 0


# ── Worker ─────────────────────────────────────────────────────────────────────

def scrape_deputy(deputy: Dict) -> Dict:
    """Scrape sequential pages for one deputy, store matching fact-checks."""
    deputy_id = deputy["id"]
    name = deputy["name"]
    party = deputy.get("party", "")
    MAX_PAGES = 20

    conn = get_connection()
    session = requests.Session()
    seen_urls = set()
    all_checks = []
    empty_page_count = 0
    page_num = 1

    while empty_page_count < 2 and page_num <= MAX_PAGES:
        html = fetch_search_page(session, name, page_num)
        if html is None:
            time.sleep(0.5)
            html = fetch_search_page(session, name, page_num)
            if html is None:
                break

        checks = parse_fact_checks(html)
        if not checks:
            empty_page_count += 1
            page_num += 1
            continue

        empty_page_count = 0
        for fc in checks:
            if fc["url"] not in seen_urls:
                seen_urls.add(fc["url"])
                fc["_score"] = _match_score(name, fc.get("title", ""))
                all_checks.append(fc)

        _throttled_sleep()
        page_num += 1

    if not all_checks:
        conn.close()
        return {"name": name, "party": party, "total_new": 0}

    matched = [fc for fc in all_checks if fc["_score"] == 2]

    total_new = 0
    with conn.cursor() as cur:
        for fc in matched:
            try:
                cur.execute("SAVEPOINT insert_sp")
                cur.execute("""
                    INSERT INTO fact_checks
                    (deputy_id, title, url, lead, truth_level, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (deputy_id, url) DO NOTHING
                """, (
                    deputy_id,
                    fc["title"],
                    fc["url"],
                    fc["lead"],
                    fc["truth_level"],
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
    total_new = 0
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
            total_new += result["total_new"]
            msg = f"[{completed}/{total_politicians}] {result['name']}: {result['total_new']} new fact-checks"

            if pbar:
                pbar.write(msg)
                pbar.update(1)
            else:
                print(msg)
                sys.stdout.flush()

        if pbar:
            pbar.close()

    print(f"\n[✓] Done. Processed {completed}/{total_politicians} deputies, stored {total_new} new fact-checks.")


if __name__ == "__main__":
    main()
