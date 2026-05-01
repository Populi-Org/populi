#!/usr/bin/env python3
"""
Expresso.pt News Scraper for Portuguese Politicians
Concurrent, fast, polite scraper that stores results in SQLite.
"""

import json
import sqlite3
import sys
import time
import urllib.parse
from datetime import datetime
from typing import List, Dict, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading
import random

import requests
from bs4 import BeautifulSoup

try:
    from tqdm import tqdm
except ImportError:  # pragma: no cover
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
REQUEST_DELAY = 0.6          # base seconds between API calls per thread
JITTER = 0.3                 # random additional delay
PAGE_SIZE = 10
DB_PATH = "expresso_news.db"
MAX_WORKERS = 5              # concurrent threads; tune if you hit rate-limits

# ── Politician Data (embedded) ───────────────────────────────────────────────
POLITICIANS_DATA = {
    "Assembleia da Republica - Portugal": {
        "Partido Socialista (PS)": [
            "Pedro Nuno Santos", "Alexandra Leitão", "Mariana Vieira da Silva",
            "Fernando Medina", "Marta Temido", "José Luís Carneiro",
            "Ana Catarina Mendes", "Francisco Assis", "Manuel Pizarro",
            "Eurico Brilhante Dias", "Ana Abrunhosa", "Ana Mendes Godinho",
            "Edite Estrela", "Tiago Barbosa Ribeiro", "Sérgio Sousa Pinto",
            "João Torres", "Marcos Perestrello", "Miguel Cabrita",
            "Pedro Delgado Alves", "Carlos Neto Brandão", "Hugo Oliveira",
            "Susana Correia", "Nelson Brito", "Palmira Maciel", "Pedro Sousa",
            "Ricardo Costa", "Irene Costa", "Gilberto Anjos", "Isabel Ferreira",
            "Nuno Fazenda", "Patrícia Caixinha", "Pedro Coimbra",
            "Ricardo Lino", "Raquel Ferreira", "Paulo Pisco", "Luís Dias",
            "Jamila Madeira", "Jorge Botelho", "Luís Graça Nunes",
            "Ana Sofia Antunes", "Walter Chicharro", "Pedro Vaz",
            "Ana Paula Bernardo", "Carlos Pereira", "Isabel Moreira",
            "Ricardo Lima", "Cristina Begonha", "André Rijo", "Paulo Cafôfo",
            "José Iglésias", "Ricardo Pinheiro", "Rosário Gamboa",
            "Patrícia Faro", "João Paulo Correia", "Isabel Oneto",
            "Joana Lima", "Eduardo Pinheiro", "José Carlos Barbosa",
            "Isabel Andrade", "Carlos Braz", "Hugo Costa", "Mara Coelho",
            "Miguel Costa Matos", "António Mendonça Mendes", "Eurídice Pereira",
            "André Pinotes Batista", "João Paulo Rebelo", "Clarisse Campos",
            "Marina Gonçalves", "José Maria Costa", "Fátima Pinto",
            "Carlos Silva", "Elsa Pais", "José Rui Cruz", "João Azevedo",
            "Cláudia Santos"
        ],
        "Partido Social Democrata (PSD)": [
            "Luís Montenegro", "Hugo Soares", "António Leitão Amaro",
            "Joaquim Miranda Sarmento", "Miguel Pinto Luz", "Ana Paula Martins",
            "Rita Júdice", "Emídio Sousa", "Silvério Regalado", "Ângela Almeida",
            "Salvador Malheiro", "Almiro Moreira", "Paula Cardoso",
            "Paulo Cavaleiro", "Ricardo Araújo", "Clara Marques Mendes",
            "Jorge Paulo Oliveira", "Emídio Guerreiro", "Ana Cristina Araújo",
            "Carlos Eduardo Reis", "Carlos Cação", "Maurício Teixeira",
            "Martim Syder", "Cristóvão Norte", "Ofélia Ramos", "Telmo Faria",
            "Hugo Oliveira", "Sofia Carreira", "João Antunes dos Santos",
            "Ricardo Carvalho", "João Vale e Azevedo", "Sandra Pereira",
            "Bruno Ventura", "António Oliveira", "Francisco Lopes",
            "Olga Freire", "Hugo Carneiro", "Eduardo Sousa", "João Moura",
            "Isaura Morais", "Pedro Alves", "Inês Domingos", "Paulo Moniz",
            "Francisco Pimentel", "Dulcineia Moura", "Gonçalo Valente",
            "Hernâni Dias", "Liliana Reis", "Sónia Ramos", "Rogério Silva",
            "Guilherme Silva", "João Carlos Dias", "Margarida Balseiro Lopes",
            "Paulo Rios de Oliveira", "Pedro Machado", "Ana Oliveira"
        ],
        "Chega (CH)": [
            "André Ventura", "Pedro Pinto", "Rui Cristina", "Jorge Galveias",
            "Diva Ribeiro", "Filipe Melo", "José Pires", "João Ribeiro",
            "António Pinto Pereira", "Nuno Simões de Melo",
            "Gabriel Mithá Ribeiro", "Henrique de Freitas",
            "Rui Paulo Duque de Sousa", "Marta Trindade", "Pedro Fernandes",
            "Ricardo Blaufuks", "Rui Afonso", "Diogo Pacheco de Amorim",
            "Maria Rodrigues", "José Carvalho", "Marcus Santos",
            "Sónia Monteiro", "Raúl Melo", "Pedro Frazão", "Pedro Correia",
            "Luísa Macedo", "Rita Matias", "Patrícia Carvalho",
            "Nuno Gabriel", "Daniel Teixeira", "António Peixoto",
            "Rodrigo Taxa", "Vanessa Barata", "Carlos Vieira Pinto",
            "Pedro Soares Pinto", "João Paulo Graça", "Sandra Ribeiro",
            "Paulo Seco", "Eliseu da Costa Neves"
        ],
        "Iniciativa Liberal (IL)": [
            "Rui Rocha", "Bernardo Blanco", "Mariana Leitão",
            "Rodrigo Saraiva", "Mário Amorim Lopes", "Pedro Brinca",
            "Carlos Guimarães Pinto", "Joana Cordeiro"
        ],
        "Bloco de Esquerda (BE)": [
            "Mariana Mortágua", "Joana Mortágua", "José Gusmão",
            "Marisa Matias", "Fabian Figueiredo"
        ],
        "Partido Comunista Português (PCP)": [
            "Paulo Raimundo", "Paula Santos", "António Filipe", "Alfredo Maia"
        ],
        "Livre (L)": [
            "Rui Tavares", "Isabel Mendes Lopes", "Jorge Pinto", "Paulo Muacho"
        ],
        "CDS - Partido Popular (CDS-PP)": [
            "Nuno Melo", "Paulo Núncio"
        ],
        "Pessoas-Animais-Natureza (PAN)": [
            "Inês Sousa Real"
        ]
    }
}

# ── Database Setup ─────────────────────────────────────────────────────────────

def init_db(db_path: str = DB_PATH) -> None:
    """Initialize SQLite database with required tables."""
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA journal_mode=WAL")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS politicians (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            party TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            politician_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            url TEXT NOT NULL,
            section TEXT,
            published_at TEXT,
            authors TEXT,
            lead TEXT,
            has_picture INTEGER DEFAULT 0,
            article_type TEXT,
            scraped_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (politician_id) REFERENCES politicians(id),
            UNIQUE(politician_id, url)
        )
    """)

    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_articles_politician_id ON articles(politician_id)
    """)

    conn.commit()
    conn.close()


# ── HTTP & Parsing ─────────────────────────────────────────────────────────────

def _throttled_sleep():
    time.sleep(REQUEST_DELAY + random.uniform(0, JITTER))


def fetch_search_page(session: requests.Session, name: str, page: int, offset: int) -> Optional[str]:
    params = {"q": name, "page": page, "offset": offset}
    try:
        resp = session.get(BASE_API_URL, params=params, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        return resp.text
    except requests.RequestException as exc:
        print(f"  [!] Request failed for '{name}' page={page}: {exc}")
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


def _name_in_title(name: str, title: str) -> bool:
    if not title:
        return False
    title_lower = title.lower()
    if name.lower() in title_lower:
        return True
    surname = name.split()[-1]
    if len(surname) > 2 and surname.lower() in title_lower:
        return True
    return False


# ── Worker ─────────────────────────────────────────────────────────────────────

def _distribute_across_pages(pages: List[List[Dict]], max_total: int) -> List[Dict]:
    """Round-robin pick articles from pages to spread across time."""
    result = []
    idx = 0
    while len(result) < max_total:
        added = False
        for page_arts in pages:
            if idx < len(page_arts):
                result.append(page_arts[idx])
                added = True
                if len(result) >= max_total:
                    break
        if not added:
            break
        idx += 1
    return result


def scrape_politician(name: str, party: str) -> Dict:
    """Scrape up to 4 pages, filter by name (fallback if 0), store max 20 diverse articles."""
    MAX_ARTICLES = 20
    MAX_PAGES = 20

    db = sqlite3.connect(DB_PATH)
    db.execute("PRAGMA journal_mode=WAL")
    cursor = db.cursor()

    cursor.execute("SELECT id FROM politicians WHERE name = ?", (name,))
    row = cursor.fetchone()
    if row:
        politician_id = row[0]
    else:
        cursor.execute("INSERT INTO politicians (name, party) VALUES (?, ?)", (name, party))
        politician_id = cursor.lastrowid
        db.commit()

    session = requests.Session()
    all_pages: List[List[Dict]] = []
    page = 1
    offset = 0
    empty_page_count = 0

    while page <= MAX_PAGES:
        html = fetch_search_page(session, name, page, offset)
        if html is None:
            time.sleep(2)
            html = fetch_search_page(session, name, page, offset)
            if html is None:
                break

        articles = parse_articles(html)
        if not articles:
            empty_page_count += 1
            if empty_page_count >= 2:
                break
        else:
            empty_page_count = 0
            all_pages.append(articles)

        if len(articles) < PAGE_SIZE and empty_page_count >= 1:
            break

        page += 1
        offset += len(articles)
        _throttled_sleep()

    if not all_pages:
        db.close()
        return {"name": name, "party": party, "total_new": 0}

    # Try name-filter first
    filtered_pages = [[art for art in pg if _name_in_title(name, art.get("title", ""))] for pg in all_pages]
    total_filtered = sum(len(pg) for pg in filtered_pages)

    # Fallback: if no name matches, use everything
    use_pages = filtered_pages if total_filtered > 0 else all_pages

    # Round-robin across pages for temporal diversity, cap at 20
    diverse = _distribute_across_pages(use_pages, MAX_ARTICLES)

    total_new = 0
    for art in diverse:
        try:
            cursor.execute("""
                INSERT OR IGNORE INTO articles
                (politician_id, title, url, section, published_at, authors, lead, has_picture, article_type)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                politician_id,
                art["title"],
                art["url"],
                art["section"],
                art["published_at"],
                art["authors"],
                art["lead"],
                art["has_picture"],
                art["article_type"],
            ))
            if cursor.rowcount > 0:
                total_new += 1
        except sqlite3.Error as exc:
            print(f"  [!] DB insert error: {exc}")

    db.commit()
    db.close()
    return {"name": name, "party": party, "total_new": total_new}


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    init_db()
    jobs = []
    for assembly, parties in POLITICIANS_DATA.items():
        for party, names in parties.items():
            for name in names:
                jobs.append((name, party))

    total_politicians = len(jobs)
    total_articles = 0
    completed = 0

    print(f"[i] Starting scrape of {total_politicians} politicians with {MAX_WORKERS} workers...")
    print(f"[i] Database: {DB_PATH}\n")
    sys.stdout.flush()

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(scrape_politician, name, party): (name, party) for name, party in jobs}
        pbar = tqdm(total=total_politicians, desc="Scraping", unit="politician", ncols=100) if tqdm else None

        for future in as_completed(futures):
            try:
                result = future.result()
            except Exception as exc:
                name, party = futures[future]
                err = f"[✗] {name} ({party}) failed: {exc}"
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
            msg = f"[{completed}/{total_politicians}] {result['name']} ({result['party']}): {result['total_new']} new articles"

            if pbar:
                pbar.write(msg)
                pbar.update(1)
            else:
                print(msg)
                sys.stdout.flush()

        if pbar:
            pbar.close()

    print(f"\n[✓] Done. Processed {completed}/{total_politicians} politicians, stored {total_articles} new articles.")
    print(f"[i] Database: {DB_PATH}")


if __name__ == "__main__":
    main()
