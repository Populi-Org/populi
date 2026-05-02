#!/usr/bin/env python3
"""
Legislative Initiatives Scraper
Reads IniciativasXVII.json from parlamento.pt, inserts into PostgreSQL.
"""

import json
import os
import sys
from datetime import datetime
from typing import Optional

import psycopg2

# ── Configuration ────────────────────────────────────────────────────────────

JSON_PATH = os.environ.get(
    "INICIATIVAS_JSON",
    os.path.join(os.path.expanduser("~"), "Downloads", "IniciativasXVII.json"),
)


# ── DB helpers ───────────────────────────────────────────────────────────────

def _find_env_file() -> Optional[str]:
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


# ── Parsing helpers ──────────────────────────────────────────────────────────

def safe_str(val) -> Optional[str]:
    """Convert any value to a string or None, handling dicts/lists."""
    if val is None:
        return None
    if isinstance(val, (dict, list)):
        return None
    return str(val)


def parse_date(val: Optional[str]) -> Optional[datetime]:
    if not val:
        return None
    try:
        return datetime.strptime(str(val), "%Y-%m-%d")
    except (ValueError, TypeError):
        return None


def parse_authors(data: dict) -> list[dict]:
    authors = []
    for gp in (data.get("IniAutorGruposParlamentares") or []):
        if gp.get("GP"):
            authors.append({
                "author_type": "GP",
                "author_name": None,
                "author_sigla": gp["GP"],
            })
    outros = data.get("IniAutorOutros")
    if outros and outros.get("nome"):
        authors.append({
            "author_type": "OUTROS",
            "author_name": outros["nome"],
            "author_sigla": outros.get("sigla"),
        })
    for dep in (data.get("IniAutorDeputados") or []):
        nome = dep.get("nome") or dep.get("DepNomeParlamentar")
        if nome:
            authors.append({
                "author_type": "DEPUTADO",
                "author_name": nome,
                "author_sigla": None,
            })
    return authors


# ── Import ───────────────────────────────────────────────────────────────────

def load_initiatives(path: str) -> list[dict]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def import_initiatives(conn, initiatives: list[dict]):
    total_ini = 0
    total_authors = 0
    total_events = 0
    total_votes = 0

    with conn.cursor() as cur:
        for idx, ini in enumerate(initiatives):
            ini_id_raw = ini.get("IniId")
            if not ini_id_raw:
                continue

            try:
                cur.execute("SAVEPOINT ini_sp")

                now = datetime.now()

                # Check if initiative already exists
                cur.execute(
                    "SELECT id FROM legislative_initiatives WHERE ini_id = %s",
                    (int(ini_id_raw),),
                )
                existing = cur.fetchone()

                ini_nr = safe_str(ini.get("IniNr"))
                ini_titulo = ini.get("IniTitulo") or ""
                ini_desc_tipo = safe_str(ini.get("IniDescTipo"))
                ini_tipo = safe_str(ini.get("IniTipo"))
                ini_leg = safe_str(ini.get("IniLeg"))
                ini_epigrafe = safe_str(ini.get("IniEpigrafe"))
                ini_obs = safe_str(ini.get("IniObs"))
                ini_link = safe_str(ini.get("IniLinkTexto"))
                data_ini = parse_date(ini.get("DataInicioleg"))
                data_fim = parse_date(ini.get("DataFimleg"))

                if existing:
                    db_id = existing[0]
                    cur.execute(
                        """
                        UPDATE legislative_initiatives SET
                            ini_nr = %s, ini_titulo = %s, ini_desc_tipo = %s,
                            ini_tipo = %s, ini_leg = %s, ini_epigrafe = %s,
                            ini_obs = %s, ini_link_texto = %s,
                            data_inicio_leg = %s, data_fim_leg = %s,
                            updated_at = %s
                        WHERE id = %s
                        """,
                        (ini_nr, ini_titulo, ini_desc_tipo, ini_tipo,
                         ini_leg, ini_epigrafe, ini_obs, ini_link,
                         data_ini, data_fim, now, db_id),
                    )
                else:
                    cur.execute(
                        """
                        INSERT INTO legislative_initiatives
                            (ini_id, ini_nr, ini_titulo, ini_desc_tipo, ini_tipo,
                             ini_leg, ini_epigrafe, ini_obs, ini_link_texto,
                             data_inicio_leg, data_fim_leg, created_at, updated_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING id
                        """,
                        (int(ini_id_raw), ini_nr, ini_titulo, ini_desc_tipo,
                         ini_tipo, ini_leg, ini_epigrafe, ini_obs, ini_link,
                         data_ini, data_fim, now, now),
                    )
                    db_id = cur.fetchone()[0]
                    total_ini += 1

                # ── Delete existing children for update ──────────────────
                cur.execute(
                    "DELETE FROM initiative_votes WHERE event_id IN "
                    "(SELECT id FROM initiative_events WHERE initiative_id = %s)",
                    (db_id,),
                )
                cur.execute(
                    "DELETE FROM initiative_events WHERE initiative_id = %s",
                    (db_id,),
                )
                cur.execute(
                    "DELETE FROM initiative_authors WHERE initiative_id = %s",
                    (db_id,),
                )

                # ── Authors ─────────────────────────────────────────────

                for author in parse_authors(ini):
                    cur.execute(
                        """
                        INSERT INTO initiative_authors
                            (initiative_id, author_type, author_name, author_sigla)
                        VALUES (%s, %s, %s, %s)
                        """,
                        (
                            db_id,
                            author["author_type"],
                            author["author_name"],
                            author["author_sigla"],
                        ),
                    )
                    total_authors += 1

                # ── Events & Votes ──────────────────────────────────────

                for evt in ini.get("IniEventos") or []:
                    cur.execute(
                        """
                        INSERT INTO initiative_events
                            (initiative_id, evt_id, codigo_fase, fase, data_fase,
                             oev_id, obs_fase)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                        RETURNING id
                        """,
                        (
                            db_id,
                            safe_str(evt.get("EvtId")),
                            safe_str(evt.get("CodigoFase")),
                            safe_str(evt.get("Fase")),
                            parse_date(evt.get("DataFase")),
                            safe_str(evt.get("OevId")),
                            safe_str(evt.get("ObsFase")),
                        ),
                    )
                    evt_row = cur.fetchone()
                    if evt_row:
                        evt_db_id = evt_row[0]
                        total_events += 1

                        for vote in evt.get("Votacao") or []:
                            cur.execute(
                                """
                                INSERT INTO initiative_votes
                                    (event_id, vote_id, data, resultado, detalhe,
                                     descricao, reuniao, tipo_reuniao, unanime)
                                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                                """,
                                (
                                    evt_db_id,
                                    safe_str(vote.get("id")),
                                    parse_date(vote.get("data")),
                                    safe_str(vote.get("resultado")),
                                    safe_str(vote.get("detalhe")),
                                    safe_str(vote.get("descricao")),
                                    safe_str(vote.get("reuniao")),
                                    safe_str(vote.get("tipoReuniao")),
                                    safe_str(vote.get("unanime")),
                                ),
                            )
                            total_votes += 1

                cur.execute("RELEASE SAVEPOINT ini_sp")

                if (idx + 1) % 100 == 0:
                    print(
                        f"  [{idx + 1}/{len(initiatives)}] "
                        f"{ini.get('IniTitulo', '')[:70]}..."
                    )
                    sys.stdout.flush()

            except Exception as exc:
                cur.execute("ROLLBACK TO SAVEPOINT ini_sp")
                print(
                    f"  [!] Error on initiative {ini_id_raw}: {exc}",
                    file=sys.stderr,
                )
                sys.stderr.flush()

    conn.commit()
    return total_ini, total_authors, total_events, total_votes


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    if not os.path.exists(JSON_PATH):
        print(f"[✗] JSON file not found: {JSON_PATH}")
        print("    Set INICIATIVAS_JSON env var or place file in ~/Downloads/")
        sys.exit(1)

    print(f"[i] Loading {JSON_PATH} ...")
    sys.stdout.flush()
    initiatives = load_initiatives(JSON_PATH)
    print(f"[i] Loaded {len(initiatives)} initiatives")

    conn = get_connection()
    print("[i] Connected to database")

    try:
        ni, na, ne, nv = import_initiatives(conn, initiatives)
    finally:
        conn.close()

    print(f"\n[✓] Import complete:")
    print(f"    {ni} new initiatives")
    print(f"    {na} authors")
    print(f"    {ne} events")
    print(f"    {nv} votes")


if __name__ == "__main__":
    main()
