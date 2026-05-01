import asyncio
import json
import os
from datetime import date, datetime
from pathlib import Path

import psycopg
from dotenv import load_dotenv

# Load .env file from the same directory as this script
load_dotenv(Path(__file__).parent / ".env")

DATA_FILE = Path(__file__).parent / "final_data.json"
DATABASE_URL = os.environ.get("DATABASE_URL")

# ---------------------------------------------------------------------------
# Date parsing helpers
# ---------------------------------------------------------------------------


def parse_date(value: str | None) -> date | None:
    if value is None:
        return None
    value = value.strip()
    if not value:
        return None
    # "2025-06-03"
    if len(value) == 10 and value[4] == "-" and value[7] == "-":
        return datetime.strptime(value, "%Y-%m-%d").date()
    # "17-04-2026"  (DD-MM-YYYY)
    if len(value) == 10 and value[2] == "-" and value[5] == "-":
        return datetime.strptime(value, "%d-%m-%Y").date()
    return None


def parse_datetime(value: str | None) -> datetime | None:
    if value is None:
        return None
    value = value.strip()
    if not value:
        return None
    # "2026-03-01 00:00:00.0"
    if " " in value:
        value = value.rstrip("0").rstrip(".")
        for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M"):
            try:
                return datetime.strptime(value, fmt)
            except ValueError:
                continue
    # "2025-06-03"
    try:
        return datetime.strptime(value, "%Y-%m-%d")
    except ValueError:
        pass
    # "17-04-2026"
    try:
        return datetime.strptime(value, "%d-%m-%Y")
    except ValueError:
        pass
    return None


# ---------------------------------------------------------------------------
# Transform helpers
# ---------------------------------------------------------------------------


def make_party_history(
    dep_id: int, gp_list: list[dict], party_map: dict
) -> list[tuple]:
    return [
        (
            dep_id,
            party_map.get(int(g["GpId"])) if g.get("GpId") else None,
            parse_date(g.get("GpDtInicio")),
            parse_date(g.get("GpDtFim")),
        )
        for g in (gp_list or [])
    ]


def make_status_history(dep_id: int, sio_list: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            s.get("SioDes"),
            parse_date(s.get("SioDtInicio")),
            parse_date(s.get("SioDtFim")),
        )
        for s in (sio_list or [])
    ]


def make_dados_legis(dep_id: int, dl_list: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            d.get("Dpl_grpar"),
            d.get("Dpl_lg"),
            d.get("Nome"),
        )
        for d in (dl_list or [])
    ]


def make_actp_list(dep_id: int, items: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            i.get("ActAs"),
            parse_date(i.get("ActDtdeb")),
            parse_date(i.get("ActDtent")),
            str(i["ActId"]) if i.get("ActId") else None,
            str(i["ActNr"]) if i.get("ActNr") else None,
            i.get("ActSelLg"),
            str(i["ActSelNr"]) if i.get("ActSelNr") else None,
            i.get("ActTp"),
            i.get("ActTpdesc"),
        )
        for i in (items or [])
    ]


def make_audicoes_list(dep_id: int, items: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            parse_date(i.get("AccDtaud")),
            i.get("ActAs"),
            parse_date(i.get("ActDtdes1")),
            parse_date(i.get("ActDtdes2")),
            parse_date(i.get("ActDtent")),
            str(i["ActId"]) if i.get("ActId") else None,
            i.get("ActLg"),
            i.get("ActLoc"),
            i.get("ActNr"),
            str(i["ActSl"]) if i.get("ActSl") else None,
            i.get("ActTp"),
            i.get("ActTpdesc"),
            i.get("CmsAb"),
            i.get("CmsNo"),
            i.get("NomeEntidadeExterna"),
            i.get("TevTp"),
        )
        for i in (items or [])
    ]


def make_audiencias_list(dep_id: int, items: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            parse_date(i.get("AccDtaud")),
            i.get("ActAs"),
            parse_date(i.get("ActDtdes1")),
            parse_date(i.get("ActDtdes2")),
            parse_date(i.get("ActDtent")),
            str(i["ActId"]) if i.get("ActId") else None,
            i.get("ActLg"),
            i.get("ActLoc"),
            i.get("ActNr"),
            str(i["ActSl"]) if i.get("ActSl") else None,
            i.get("ActTp"),
            i.get("ActTpdesc"),
            i.get("CmsAb"),
            i.get("CmsNo"),
            i.get("NomeEntidadeExterna"),
            i.get("TevTp"),
        )
        for i in (items or [])
    ]


def make_cms_list(dep_id: int, items: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            i.get("CmsCargo"),
            str(i["CmsCd"]) if i.get("CmsCd") else None,
            i.get("CmsLg"),
            i.get("CmsNo"),
            i.get("CmsSituacao"),
            i.get("CmsSubCargo"),
        )
        for i in (items or [])
    ]


def make_deslocacoes_list(dep_id: int, items: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            parse_date(i.get("AccDtaud")),
            i.get("ActAs"),
            parse_date(i.get("ActDtdes1")),
            parse_date(i.get("ActDtdes2")),
            parse_date(i.get("ActDtent")),
            str(i["ActId"]) if i.get("ActId") else None,
            i.get("ActLg"),
            i.get("ActLoc"),
            i.get("ActNr"),
            str(i["ActSl"]) if i.get("ActSl") else None,
            i.get("ActTp"),
            i.get("ActTpdesc"),
            i.get("CmsAb"),
            i.get("CmsNo"),
            i.get("NomeEntidadeExterna"),
            i.get("TevTp"),
        )
        for i in (items or [])
    ]


def make_dle_list(dep_id: int, items: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            parse_datetime(i.get("DevDtfim")),
            parse_datetime(i.get("DevDtini")),
            str(i["DevId"]) if i.get("DevId") else None,
            i.get("DevLoc"),
            i.get("DevNo"),
            i.get("DevSelLg"),
            str(i["DevSelNr"]) if i.get("DevSelNr") else None,
            i.get("DevTp"),
        )
        for i in (items or [])
    ]


def make_eventos_list(dep_id: int, items: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            parse_date(i.get("AccDtaud")),
            i.get("ActAs"),
            parse_date(i.get("ActDtdes1")),
            parse_date(i.get("ActDtdes2")),
            parse_date(i.get("ActDtent")),
            str(i["ActId"]) if i.get("ActId") else None,
            i.get("ActLg"),
            i.get("ActLoc"),
            i.get("ActNr"),
            str(i["ActSl"]) if i.get("ActSl") else None,
            i.get("ActTp"),
            i.get("ActTpdesc"),
            i.get("CmsAb"),
            i.get("CmsNo"),
            i.get("NomeEntidadeExterna"),
            i.get("TevTp"),
        )
        for i in (items or [])
    ]


def make_gpa_list(dep_id: int, items: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            i.get("CgaCrg"),
            parse_datetime(i.get("CgaDtfim")),
            parse_datetime(i.get("CgaDtini")),
            str(i["GplId"]) if i.get("GplId") else None,
            i.get("GplNo"),
            i.get("GplSelLg"),
        )
        for i in (items or [])
    ]


def make_ini_list(dep_id: int, items: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            str(i["IniId"]) if i.get("IniId") else None,
            str(i["IniNr"]) if i.get("IniNr") else None,
            i.get("IniSelLg"),
            str(i["IniSelNr"]) if i.get("IniSelNr") else None,
            i.get("IniTi"),
            i.get("IniTp"),
            i.get("IniTpdesc"),
        )
        for i in (items or [])
    ]


def make_intev_list(dep_id: int, items: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            str(i["IntId"]) if i.get("IntId") else None,
            i.get("IntSu"),
            i.get("IntTe"),
            i.get("PubDar"),
            parse_date(i.get("PubDtreu")),
            i.get("PubLg"),
            str(i["PubNr"]) if i.get("PubNr") else None,
            str(i["PubSl"]) if i.get("PubSl") else None,
            i.get("PubTp"),
            i.get("TinDs"),
        )
        for i in (items or [])
    ]


def make_pj_list(dep_id: int, items: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            i.get("CirculoEleitoral"),
            parse_date(i.get("Data")),
            i.get("Estabelecimento"),
            i.get("Legislatura"),
            i.get("Sessao"),
            i.get("TipoReuniao"),
        )
        for i in (items or [])
    ]


def make_req_list(dep_id: int, items: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            i.get("ReqAs"),
            parse_datetime(i.get("ReqDt")),
            str(i["ReqId"]) if i.get("ReqId") else None,
            i.get("ReqLg"),
            str(i["ReqNr"]) if i.get("ReqNr") else None,
            i.get("ReqPerTp"),
            str(i["ReqSl"]) if i.get("ReqSl") else None,
            i.get("ReqTp"),
        )
        for i in (items or [])
    ]


def make_scgt_list(dep_id: int, items: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            i.get("CcmDscom"),
            i.get("CmsCargo"),
            i.get("CmsSituacao"),
            str(i["ScmCd"]) if i.get("ScmCd") else None,
            str(i["ScmComCd"]) if i.get("ScmComCd") else None,
            i.get("ScmComLg"),
        )
        for i in (items or [])
    ]


def make_rel_iniciativas(dep_id: int, items: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            parse_date(i.get("AccDtrel")),
            str(i["IniId"]) if i.get("IniId") else None,
            str(i["IniNr"]) if i.get("IniNr") else None,
            i.get("IniSelLg"),
            i.get("IniTi"),
            i.get("IniTp"),
            i.get("RelFase"),
        )
        for i in (items or [])
    ]


def make_rel_ini_europeias(dep_id: int, items: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            parse_date(i.get("IneDataRelatorio")),
            str(i["IneId"]) if i.get("IneId") else None,
            i.get("IneReferencia"),
            i.get("IneTitulo"),
            i.get("Leg"),
        )
        for i in (items or [])
    ]


def make_rel_peticoes(dep_id: int, items: list[dict]) -> list[tuple]:
    return [
        (
            dep_id,
            parse_date(i.get("PecDtrelf")),
            i.get("PetAspet"),
            str(i["PetId"]) if i.get("PetId") else None,
            str(i["PetNr"]) if i.get("PetNr") else None,
            i.get("PetSelLgPk"),
            str(i["PetSelNrPk"]) if i.get("PetSelNrPk") else None,
        )
        for i in (items or [])
    ]


# ---------------------------------------------------------------------------
# SQL statements
# ---------------------------------------------------------------------------

INSERT_DEPUTY = """
    INSERT INTO deputies
        (dep_id, dep_cad_id, dep_nome_parlamentar, dep_nome_completo,
         dep_cp_id, dep_cp_des, dep_cargo, leg_des, created_at, updated_at)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
    RETURNING id
"""

INSERT_PARTY_TABLE = """
    INSERT INTO parties (gp_id, sigla)
    VALUES (%s, %s)
    RETURNING id
"""

INSERT_PARTY = """
    INSERT INTO party_history
        (deputy_id, party_id, gp_dt_inicio, gp_dt_fim)
    VALUES (%s, %s, %s, %s)
"""

INSERT_STATUS = """
    INSERT INTO status_history
        (deputy_id, sio_des, sio_dt_inicio, sio_dt_fim)
    VALUES (%s, %s, %s, %s)
"""

INSERT_DADOS = """
    INSERT INTO dados_legis_deputado
        (deputy_id, dpl_grpar, dpl_lg, nome)
    VALUES (%s, %s, %s, %s)
"""

INSERT_ACTP = """
    INSERT INTO act_p
        (deputy_id, act_as, act_dtdeb, act_dtent, act_id, act_nr,
         act_sel_lg, act_sel_nr, act_tp, act_tpdesc)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

INSERT_AUDICOES = """
    INSERT INTO audicoes
        (deputy_id, acc_dtaud, act_as, act_dtdes1, act_dtdes2, act_dtent,
         act_id, act_lg, act_loc, act_nr, act_sl, act_tp, act_tpdesc,
         cms_ab, cms_no, nome_entidade_externa, tev_tp)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

INSERT_AUDIENCIAS = """
    INSERT INTO audiencias
        (deputy_id, acc_dtaud, act_as, act_dtdes1, act_dtdes2, act_dtent,
         act_id, act_lg, act_loc, act_nr, act_sl, act_tp, act_tpdesc,
         cms_ab, cms_no, nome_entidade_externa, tev_tp)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

INSERT_CMS = """
    INSERT INTO cms
        (deputy_id, cms_cargo, cms_cd, cms_lg, cms_no, cms_situacao, cms_sub_cargo)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

INSERT_DESLOC = """
    INSERT INTO deslocacoes
        (deputy_id, acc_dtaud, act_as, act_dtdes1, act_dtdes2, act_dtent,
         act_id, act_lg, act_loc, act_nr, act_sl, act_tp, act_tpdesc,
         cms_ab, cms_no, nome_entidade_externa, tev_tp)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

INSERT_DLE = """
    INSERT INTO dle
        (deputy_id, dev_dtfim, dev_dtini, dev_id, dev_loc, dev_no,
         dev_sel_lg, dev_sel_nr, dev_tp)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

INSERT_EVENTOS = """
    INSERT INTO eventos
        (deputy_id, acc_dtaud, act_as, act_dtdes1, act_dtdes2, act_dtent,
         act_id, act_lg, act_loc, act_nr, act_sl, act_tp, act_tpdesc,
         cms_ab, cms_no, nome_entidade_externa, tev_tp)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

INSERT_GPA = """
    INSERT INTO gpa
        (deputy_id, cga_crg, cga_dtfim, cga_dtini, gpl_id, gpl_no, gpl_sel_lg)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

INSERT_INI = """
    INSERT INTO ini
        (deputy_id, ini_id, ini_nr, ini_sel_lg, ini_sel_nr, ini_ti, ini_tp, ini_tpdesc)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
"""

INSERT_INTEV = """
    INSERT INTO intev
        (deputy_id, int_id, int_su, int_te, pub_dar, pub_dtreu,
         pub_lg, pub_nr, pub_sl, pub_tp, tin_ds)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

INSERT_PJ = """
    INSERT INTO parlamento_jovens
        (deputy_id, circulo_eleitoral, data, estabelecimento,
         legislatura, sessao, tipo_reuniao)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

INSERT_REQ = """
    INSERT INTO req
        (deputy_id, req_as, req_dt, req_id, req_lg, req_nr,
         req_per_tp, req_sl, req_tp)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

INSERT_SCGT = """
    INSERT INTO scgt
        (deputy_id, ccm_dscom, cms_cargo, cms_situacao,
         scm_cd, scm_com_cd, scm_com_lg)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

INSERT_REL_INI = """
    INSERT INTO rel_iniciativas
        (deputy_id, acc_dtrel, ini_id, ini_nr, ini_sel_lg, ini_ti, ini_tp, rel_fase)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
"""

INSERT_REL_INE = """
    INSERT INTO rel_ini_europeias
        (deputy_id, ine_data_relatorio, ine_id, ine_referencia, ine_titulo, leg)
    VALUES (%s, %s, %s, %s, %s, %s)
"""

INSERT_REL_PET = """
    INSERT INTO rel_peticoes
        (deputy_id, pec_dtrelf, pet_aspet, pet_id, pet_nr, pet_sel_lg_pk, pet_sel_nr_pk)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
"""


# ---------------------------------------------------------------------------
# Import logic
# ---------------------------------------------------------------------------


async def truncate_all(conn: psycopg.AsyncConnection) -> None:
    tables = [
        "rel_peticoes",
        "rel_ini_europeias",
        "rel_iniciativas",
        "rel_contas_publicas",
        "rel_autores_pareceres",
        "scgt",
        "req",
        "parlamento_jovens",
        "intev",
        "ini",
        "gpa",
        "eventos",
        "dle",
        "deslocacoes",
        "cms",
        "audiencias",
        "audicoes",
        "act_p",
        "dados_legis_deputado",
        "status_history",
        "party_history",
        "deputies",
        "parties",
    ]
    for t in tables:
        await conn.execute(f'TRUNCATE TABLE "{t}" RESTART IDENTITY CASCADE')
    print("  ✓ All tables truncated")


async def insert_deputy(
    conn: psycopg.AsyncConnection, entry: dict, party_map: dict
) -> int:
    dep = entry["Deputado"]
    act = (
        entry["AtividadeDeputadoList"][0] if entry.get("AtividadeDeputadoList") else {}
    )

    # DepCargo can be a string or a list of dicts like [{"carDes": "...", ...}]
    cargo = dep.get("DepCargo")
    if isinstance(cargo, list) and len(cargo) > 0:
        cargo = cargo[0].get("carDes")
    elif isinstance(cargo, dict):
        cargo = cargo.get("carDes")

    cur = await conn.execute(
        INSERT_DEPUTY,
        (
            int(dep["DepId"]),
            int(dep["DepCadId"]) if dep.get("DepCadId") else None,
            dep["DepNomeParlamentar"],
            dep["DepNomeCompleto"],
            int(dep["DepCPId"]) if dep.get("DepCPId") else None,
            dep.get("DepCPDes"),
            cargo,
            dep.get("LegDes"),
        ),
    )
    row = await cur.fetchone()
    dep_db_id = row[0]

    batches = [
        (INSERT_PARTY, make_party_history(dep_db_id, dep.get("DepGP"), party_map)),
        (INSERT_STATUS, make_status_history(dep_db_id, dep.get("DepSituacao"))),
        (INSERT_DADOS, make_dados_legis(dep_db_id, act.get("DadosLegisDeputado"))),
        (INSERT_ACTP, make_actp_list(dep_db_id, act.get("ActP"))),
        (INSERT_AUDICOES, make_audicoes_list(dep_db_id, act.get("Audicoes"))),
        (INSERT_AUDIENCIAS, make_audiencias_list(dep_db_id, act.get("Audiencias"))),
        (INSERT_CMS, make_cms_list(dep_db_id, act.get("Cms"))),
        (INSERT_DESLOC, make_deslocacoes_list(dep_db_id, act.get("Deslocacoes"))),
        (INSERT_DLE, make_dle_list(dep_db_id, act.get("DlE"))),
        (INSERT_EVENTOS, make_eventos_list(dep_db_id, act.get("Eventos"))),
        (INSERT_GPA, make_gpa_list(dep_db_id, act.get("Gpa"))),
        (INSERT_INI, make_ini_list(dep_db_id, act.get("Ini"))),
        (INSERT_INTEV, make_intev_list(dep_db_id, act.get("Intev"))),
        (INSERT_PJ, make_pj_list(dep_db_id, act.get("ParlamentoJovens"))),
        (INSERT_REQ, make_req_list(dep_db_id, act.get("Req"))),
        (INSERT_SCGT, make_scgt_list(dep_db_id, act.get("Scgt"))),
        (
            INSERT_REL_INI,
            make_rel_iniciativas(
                dep_db_id, act.get("Rel", {}).get("RelatoresIniciativas")
            ),
        ),
        (
            INSERT_REL_INE,
            make_rel_ini_europeias(
                dep_db_id, act.get("Rel", {}).get("RelatoresIniEuropeias")
            ),
        ),
        (
            INSERT_REL_PET,
            make_rel_peticoes(dep_db_id, act.get("Rel", {}).get("RelatoresPeticoes")),
        ),
    ]

    async with conn.cursor() as cur:
        for sql, rows in batches:
            if rows:
                await cur.executemany(sql, rows)

    return dep_db_id


async def main() -> None:
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL environment variable is not set")

    print("Connecting to database ...")
    async with await psycopg.AsyncConnection.connect(DATABASE_URL) as conn:
        print("\nTruncating tables ...")
        await truncate_all(conn)

        print("\nLoading data ...")
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)

        total = len(data)
        print(f"Found {total} deputies\n")

        # Extract unique parties
        parties = {}
        for entry in data:
            for gp in entry["Deputado"].get("DepGP", []):
                gp_id = int(gp["GpId"]) if gp.get("GpId") else None
                sigla = gp.get("GpSigla")
                if gp_id and sigla and gp_id not in parties:
                    parties[gp_id] = sigla

        print(f"Found {len(parties)} unique parties")

        # Insert parties and build mapping gp_id -> party_db_id
        party_map = {}
        for gp_id, sigla in sorted(parties.items()):
            cur = await conn.execute(INSERT_PARTY_TABLE, (gp_id, sigla))
            row = await cur.fetchone()
            party_map[gp_id] = row[0]

        print(f"  ✓ Inserted {len(party_map)} parties\n")

        errors = 0
        print("Importing deputies ...")
        for idx, entry in enumerate(data):
            try:
                await insert_deputy(conn, entry, party_map)
                if (idx + 1) % 100 == 0 or idx == total - 1:
                    name = entry["Deputado"]["DepNomeParlamentar"]
                    print(f"  [{idx + 1}/{total}] {name}")
            except Exception as e:
                errors += 1
                name = entry.get("Deputado", {}).get("DepNomeParlamentar", "UNKNOWN")
                print(f"  ✗ Failed on {name}: {e}")

        print(f"\nDone!")
        print(f"  Total deputies: {total}")
        print(f"  Total parties: {len(party_map)}")
        print(f"  Errors: {errors}")


if __name__ == "__main__":
    asyncio.run(main())
