#!/usr/bin/env python3
"""
News Articles Scraper for Portuguese Deputies
Reads serving deputies from PostgreSQL, scrapes news from:
  - Expresso.pt
  - Publico.pt
  - Observador.pt (via Google CSE API — requires GOOGLE_CSE_API_KEY)
Stores articles back in DB.
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
MAX_WORKERS = 12
MAX_ARTICLES_PER_SOURCE = 20
MAX_PAGES = 50

EXPRESSO_API_URL = "https://expresso.pt/api/molecule/search"
PUBLICO_API_URL = "https://www.publico.pt/api/search"
OBSERVADOR_CSE_ID = "018163261140574844532:-lpyfofgllu"

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


# ── Shared helpers ───────────────────────────────────────────────────────────


def _throttled_sleep():
    time.sleep(REQUEST_DELAY + random.uniform(0, JITTER))


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


def _dedup_and_sort(articles: List[Dict], name: str, max_articles: int) -> List[Dict]:
    """Score, deduplicate by URL, sort and limit articles."""
    seen_urls = set()
    result = []
    for art in articles:
        url = art.get("url")
        if not url or url in seen_urls:
            continue
        seen_urls.add(url)
        art["_score"] = _match_score(name, art.get("title", ""))
        result.append(art)

    result.sort(
        key=lambda a: (
            a["_score"],
            a.get("published_at") or "1970-01-01T00:00:00",
        ),
        reverse=True,
    )
    return result[:max_articles]


# ── Expresso ─────────────────────────────────────────────────────────────────


def _fetch_expresso(session: requests.Session, name: str, page: int, offset: int) -> Optional[str]:
    params = {"q": name, "page": page, "offset": offset}
    try:
        resp = session.get(EXPRESSO_API_URL, params=params, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        return resp.text
    except requests.RequestException:
        return None


def _parse_expresso(html: str) -> List[Dict]:
    soup = BeautifulSoup(html, "html.parser")
    articles = []

    for article_tag in soup.find_all("article"):
        # Extract type from AT-* class
        article_type = None
        for cls in article_tag.get("class", []):
            if cls.startswith("AT-"):
                article_type = cls.replace("AT-", "")
                break

        # Skip non-news content
        if article_type and article_type.lower() not in ("noticia", "article"):
            continue

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

        if not title or not url:
            continue

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

        has_picture = bool("hasPicture" in " ".join(article_tag.get("class", [])))

        articles.append({
            "title": title,
            "url": url,
            "section": section,
            "published_at": published_at,
            "authors": authors_str,
            "lead": lead,
            "has_picture": has_picture,
            "source": "expresso",
        })

    return articles


def scrape_expresso(session: requests.Session, name: str) -> List[Dict]:
    all_articles = []
    empty_page_count = 0
    page_num = 1

    while empty_page_count < 2 and page_num <= MAX_PAGES:
        html = _fetch_expresso(session, name, page_num, 0)
        if html is None:
            time.sleep(0.5)
            html = _fetch_expresso(session, name, page_num, 0)
            if html is None:
                break

        articles = _parse_expresso(html)
        if not articles:
            empty_page_count += 1
            page_num += 1
            continue

        empty_page_count = 0
        all_articles.extend(articles)

        if sum(1 for a in all_articles if _match_score(name, a.get("title", "")) == 2) >= MAX_ARTICLES_PER_SOURCE:
            break

        _throttled_sleep()
        page_num += 1

    return _dedup_and_sort(all_articles, name, MAX_ARTICLES_PER_SOURCE)


# ── Publico ──────────────────────────────────────────────────────────────────


def _fetch_publico(session: requests.Session, name: str, page: int = 1) -> Optional[List[Dict]]:
    params = {"q": name}
    if page > 1:
        params["page"] = page
    try:
        resp = session.get(PUBLICO_API_URL, params=params, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except (requests.RequestException, ValueError):
        return None


def _parse_publico(data: List[Dict]) -> List[Dict]:
    articles = []
    for item in data:
        title = item.get("titulo")
        url = item.get("url") or item.get("fullUrl")
        if not title or not url:
            continue

        # Skip non-news content
        tipo = item.get("tipo")
        if tipo and tipo.lower() not in ("noticia", "article"):
            continue

        # Authors
        authors_list = item.get("autores", [])
        authors_str = ", ".join(a.get("nome", "") for a in authors_list if a.get("nome")) or None

        # Published date
        published_at = item.get("data")

        # Lead / description
        lead = item.get("descricao") or item.get("lead")

        # Section from rubrica or principal tag
        section = item.get("rubrica")
        if not section:
            tags = item.get("tags", [])
            for tag in tags:
                if tag.get("isPrincipal"):
                    section = tag.get("nome")
                    break

        # Has picture if multimediaPrincipal is present and not empty
        has_picture = bool(item.get("multimediaPrincipal"))

        articles.append({
            "title": title,
            "url": url,
            "section": section,
            "published_at": published_at,
            "authors": authors_str,
            "lead": lead,
            "has_picture": has_picture,
            "source": "publico",
        })

    return articles


def scrape_publico(session: requests.Session, name: str) -> List[Dict]:
    all_articles = []
    empty_page_count = 0
    page_num = 1

    while empty_page_count < 2 and page_num <= MAX_PAGES:
        data = _fetch_publico(session, name, page_num)
        if data is None:
            time.sleep(0.5)
            data = _fetch_publico(session, name, page_num)
            if data is None:
                break

        articles = _parse_publico(data)
        if not articles:
            empty_page_count += 1
            page_num += 1
            continue

        empty_page_count = 0
        all_articles.extend(articles)

        if sum(1 for a in all_articles if _match_score(name, a.get("title", "")) == 2) >= MAX_ARTICLES_PER_SOURCE:
            break

        _throttled_sleep()
        page_num += 1

    return _dedup_and_sort(all_articles, name, MAX_ARTICLES_PER_SOURCE)


# ── Observador (Google CSE API) ──────────────────────────────────────────────


def _fetch_observador_cse(name: str, start: int = 1) -> Optional[Dict]:
    api_key = os.environ.get("GOOGLE_CSE_API_KEY")
    if not api_key:
        return None
    params = {
        "key": api_key,
        "cx": OBSERVADOR_CSE_ID,
        "q": name,
        "start": start,
        "num": 10,
        "lr": "lang_pt",
    }
    try:
        resp = requests.get(
            "https://www.googleapis.com/customsearch/v1",
            params=params,
            headers=HEADERS,
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()
    except (requests.RequestException, ValueError):
        return None


def _parse_observador_cse(data: Dict) -> List[Dict]:
    articles = []
    for item in data.get("items", []):
        title = item.get("title")
        url = item.get("link")
        if not title or not url:
            continue

        # Try to extract metadata from pagemap
        pagemap = item.get("pagemap", {})
        metatags = pagemap.get("metatags", [{}])[0]

        published_at = metatags.get("article:published_time") or metatags.get("datePublished")
        section = metatags.get("article:section")
        authors_str = metatags.get("author")

        lead = item.get("snippet")
        has_picture = bool(pagemap.get("cse_image", [{}])[0].get("src"))

        articles.append({
            "title": title,
            "url": url,
            "section": section,
            "published_at": published_at,
            "authors": authors_str,
            "lead": lead,
            "has_picture": has_picture,
            "source": "observador",
        })

    return articles


def scrape_observador(name: str) -> List[Dict]:
    all_articles = []
    for start in (1, 11):
        data = _fetch_observador_cse(name, start=start)
        if not data:
            break
        articles = _parse_observador_cse(data)
        if not articles:
            break
        all_articles.extend(articles)
        _throttled_sleep()

    return _dedup_and_sort(all_articles, name, MAX_ARTICLES_PER_SOURCE)


# ── Worker ────────────────────────────────────────────────────────────────────


def scrape_deputy(deputy: Dict) -> Dict:
    """Scrape articles for one deputy from all enabled sources."""
    deputy_id = deputy["id"]
    name = deputy["name"]
    party = deputy.get("party", "")

    session = requests.Session()
    all_articles = []

    # Expresso
    all_articles.extend(scrape_expresso(session, name))

    # Publico
    all_articles.extend(scrape_publico(session, name))

    # Observador (only if API key is configured)
    observador_articles = scrape_observador(name)
    all_articles.extend(observador_articles)

    if not all_articles:
        return {"name": name, "party": party, "total_new": 0}

    conn = get_connection()
    total_new = 0
    with conn.cursor() as cur:
        for art in all_articles:
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
                    (deputy_id, title, url, section, published_at, authors, lead, has_picture, source, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (deputy_id, url) DO NOTHING
                """, (
                    deputy_id,
                    art["title"],
                    art["url"],
                    art.get("section"),
                    pub_dt,
                    art.get("authors"),
                    art.get("lead"),
                    bool(art.get("has_picture")),
                    art.get("source"),
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


# ── Main ──────────────────────────────────────────────────────────────────────


def main():
    conn = get_connection()
    deputies = get_deputies(conn)
    conn.close()

    total_politicians = len(deputies)
    total_articles = 0
    completed = 0

    has_observador_key = bool(os.environ.get("GOOGLE_CSE_API_KEY"))
    sources_msg = "Expresso + Publico"
    if has_observador_key:
        sources_msg += " + Observador"
    else:
        sources_msg += " (Observador skipped — set GOOGLE_CSE_API_KEY env var to enable)"

    print(f"[i] Starting scrape of {total_politicians} deputies from {sources_msg} with {MAX_WORKERS} workers...")
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
