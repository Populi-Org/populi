import { type NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const TIPO_LABELS: Record<string, string> = {
  R: "Projeto de Resolução",
  J: "Projeto de Lei",
  P: "Proposta de Lei",
  D: "Projeto de Deliberação",
  S: "Proposta de Resolução",
  A: "Apreciação Parlamentar",
  I: "Inquérito Parlamentar",
};

export async function GET(request: NextRequest) {
  const prisma = getPrismaClient();
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";
  const party = searchParams.get("party") || "";
  const tipo = searchParams.get("tipo") || "";
  const resultado = searchParams.get("resultado") || "";
  const page = Math.max(
    1,
    Number.parseInt(searchParams.get("page") || "1", 10),
  );
  const limit = Math.max(
    1,
    Math.min(50, Number.parseInt(searchParams.get("limit") || "12", 10)),
  );

  const skip = (page - 1) * limit;

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`li.ini_titulo ILIKE $${params.length}`);
  }

  if (tipo) {
    params.push(tipo);
    conditions.push(`li.ini_tipo = $${params.length}`);
  }

  if (party) {
    params.push(party);
    conditions.push(
      `EXISTS (SELECT 1 FROM initiative_authors ia WHERE ia.initiative_id = li.id AND ia.author_sigla = $${params.length})`,
    );
  }

  // Filter by resultado: only match initiatives whose latest vote (among votes WITH a resultado) matches
  if (resultado) {
    const matchingIds = await prisma.$queryRaw<{ id: number }[]>`
      WITH ranked AS (
        SELECT
          ie.initiative_id,
          iv.resultado,
          ROW_NUMBER() OVER (
            PARTITION BY ie.initiative_id
            ORDER BY ie.data_fase DESC NULLS LAST, iv.data DESC NULLS LAST, iv.id DESC
          ) as rn
        FROM initiative_votes iv
        JOIN initiative_events ie ON ie.id = iv.event_id
        WHERE iv.resultado IS NOT NULL
      )
      SELECT initiative_id as id
      FROM ranked
      WHERE rn = 1 AND resultado ILIKE ${`%${resultado}%`}
    `;

    if (matchingIds.length === 0) {
      return NextResponse.json({
        proposals: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      });
    }

    const idPlaceholders = matchingIds
      .map((_, i) => `$${params.length + i + 1}`)
      .join(",");
    params.push(...matchingIds.map((r) => r.id));
    conditions.push(`li.id IN (${idPlaceholders})`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countQuery = `
    SELECT COUNT(*)::int as total
    FROM legislative_initiatives li
    ${whereClause}
  `;

  const dataQuery = `
    WITH latest_votes AS (
      SELECT DISTINCT ON (ie.initiative_id)
        ie.initiative_id,
        iv.resultado,
        iv.descricao,
        ie.data_fase,
        ie.fase
      FROM initiative_votes iv
      JOIN initiative_events ie ON ie.id = iv.event_id
      WHERE iv.resultado IS NOT NULL
      ORDER BY ie.initiative_id, ie.data_fase DESC NULLS LAST, iv.data DESC NULLS LAST, iv.id DESC
    ), first_author AS (
      SELECT DISTINCT ON (initiative_id)
        initiative_id,
        author_sigla,
        author_type
      FROM initiative_authors
      ORDER BY initiative_id, id ASC
    )
    SELECT
      li.id,
      li.ini_id,
      li.ini_nr,
      li.ini_titulo,
      li.ini_desc_tipo,
      li.ini_tipo,
      li.ini_link_texto,
      fa.author_sigla,
      fa.author_type,
      lv.resultado as vote_resultado,
      lv.descricao as vote_descricao,
      lv.data_fase as last_event_date,
      lv.fase as last_event_fase
    FROM legislative_initiatives li
    LEFT JOIN first_author fa ON fa.initiative_id = li.id
    LEFT JOIN latest_votes lv ON lv.initiative_id = li.id
    ${whereClause}
    ORDER BY li.id DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

  const [countRows, rawProposals] = await Promise.all([
    prisma.$queryRawUnsafe<{ total: number }[]>(countQuery, ...params),
    prisma.$queryRawUnsafe<
      {
        id: number;
        ini_id: number;
        ini_nr: string | null;
        ini_titulo: string;
        ini_desc_tipo: string | null;
        ini_tipo: string | null;
        ini_link_texto: string | null;
        author_sigla: string | null;
        author_type: string | null;
        vote_resultado: string | null;
        vote_descricao: string | null;
        last_event_date: Date | null;
        last_event_fase: string | null;
      }[]
    >(dataQuery, ...params, limit, skip),
  ]);

  const total = countRows[0]?.total ?? 0;

  const mapped = rawProposals.map((p) => ({
    id: p.id,
    iniId: p.ini_id,
    iniNr: p.ini_nr,
    titulo: p.ini_titulo,
    descTipo: p.ini_desc_tipo,
    tipo: p.ini_tipo,
    tipoLabel: p.ini_tipo ? TIPO_LABELS[p.ini_tipo] || p.ini_tipo : null,
    authorSigla: p.author_sigla,
    authorType: p.author_type,
    status: p.vote_resultado,
    statusDescription: p.vote_descricao,
    dataUltimoEvento: p.last_event_date,
    linkTexto: p.ini_link_texto,
  }));

  return NextResponse.json({
    proposals: mapped,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
