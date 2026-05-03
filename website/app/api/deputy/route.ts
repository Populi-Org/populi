import { type NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@/app/generated/prisma/client";
import { getProxiedImageUrl } from "@/lib/image-proxy";
import { getPrismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const prisma = getPrismaClient();
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";
  const constituency = searchParams.get("constituency") || "";
  const party = searchParams.get("party") || "";
  const showSuplentes = searchParams.get("showSuplentes") === "true";
  const sortByPhoto = searchParams.get("sortByPhoto") !== "false";
  const theme = searchParams.get("theme") || "";
  const since = searchParams.get("since") || "";
  const page = Math.max(
    1,
    Number.parseInt(searchParams.get("page") || "1", 10),
  );
  const limit = Math.max(
    1,
    Math.min(50, Number.parseInt(searchParams.get("limit") || "12", 10)),
  );

  const where: Prisma.DeputyWhereInput = {};
  const andFilters: Prisma.DeputyWhereInput[] = [];

  if (search) {
    where.depNomeParlamentar = { contains: search, mode: "insensitive" };
  }

  if (constituency) {
    where.depCPDes = constituency;
  }

  let partyDeputyIds: number[] | null = null;

  if (party) {
    const rows = await prisma.$queryRaw<{ deputy_id: number }[]>`
      SELECT latest.deputy_id
      FROM (
        SELECT DISTINCT ON (ph.deputy_id)
          ph.deputy_id,
          p.sigla
        FROM party_history ph
        JOIN parties p ON p.id = ph.party_id
        ORDER BY ph.deputy_id, ph.gp_dt_inicio DESC NULLS LAST, ph.id DESC
      ) latest
      WHERE latest.sigla = ${party}
    `;

    partyDeputyIds = rows.map((row) => row.deputy_id);
  }

  if (theme) {
    andFilters.push({
      intev: {
        some: {
          OR: [
            { intTe: { contains: theme, mode: "insensitive" } },
            { intSu: { contains: theme, mode: "insensitive" } },
            { tinDs: { contains: theme, mode: "insensitive" } },
          ],
        },
      },
    });
  }

  if (since) {
    const year = Number.parseInt(since, 10);
    if (!Number.isNaN(year)) {
      const sinceDate = new Date(year, 0, 1);
      andFilters.push({
        partyHistory: {
          some: {
            gpDtInicio: { gte: sinceDate },
          },
        },
      });
    }
  }

  if (partyDeputyIds) {
    if (partyDeputyIds.length === 0) {
      return NextResponse.json({
        deputies: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      });
    }

    where.id = { in: partyDeputyIds };
  }

  if (!showSuplentes) {
    where.statusHistory = {
      none: {
        sioDes: { contains: "suplent", mode: "insensitive" },
        sioDtFim: null,
      },
    };
  }

  if (andFilters.length > 0) {
    where.AND = andFilters;
  }

  const skip = (page - 1) * limit;
  let deputies: Awaited<
    ReturnType<
      typeof prisma.deputy.findMany<{
        include: {
          partyHistory: {
            include: { party: true };
            orderBy: { gpDtInicio: "desc" };
            take: 1;
          };
          cms: {
            where: { cmsSituacao: { not: "Suspenso" } };
            orderBy: { cmsCargo: "asc" };
            take: 1;
          };
          statusHistory: {
            where: {
              sioDes: { contains: "suplent"; mode: "insensitive" };
              sioDtFim: null;
            };
            take: 1;
          };
        };
      }>
    >
  >;
  let total: number;

  if (sortByPhoto) {
    const allDeputies = await prisma.deputy.findMany({
      where,
      include: {
        partyHistory: {
          include: { party: true },
          orderBy: { gpDtInicio: "desc" },
          take: 1,
        },
        cms: {
          where: { cmsSituacao: { not: "Suspenso" } },
          orderBy: { cmsCargo: "asc" },
          take: 1,
        },
        statusHistory: {
          where: {
            sioDes: { contains: "suplent", mode: "insensitive" },
            sioDtFim: null,
          },
          take: 1,
        },
      },
      orderBy: { depNomeParlamentar: "asc" },
    });

    allDeputies.sort((a, b) => {
      const aHasPhoto = !!a.depImageUrl;
      const bHasPhoto = !!b.depImageUrl;
      if (aHasPhoto !== bHasPhoto) return bHasPhoto ? 1 : -1;
      return a.depNomeParlamentar.localeCompare(b.depNomeParlamentar);
    });

    total = allDeputies.length;
    deputies = allDeputies.slice(skip, skip + limit);
  } else {
    const [dbDeputies, dbTotal] = await Promise.all([
      prisma.deputy.findMany({
        where,
        include: {
          partyHistory: {
            include: { party: true },
            orderBy: { gpDtInicio: "desc" },
            take: 1,
          },
          cms: {
            where: { cmsSituacao: { not: "Suspenso" } },
            orderBy: { cmsCargo: "asc" },
            take: 1,
          },
          statusHistory: {
            where: {
              sioDes: { contains: "suplent", mode: "insensitive" },
              sioDtFim: null,
            },
            take: 1,
          },
        },
        skip,
        take: limit,
        orderBy: { depNomeParlamentar: "asc" },
      }),
      prisma.deputy.count({ where }),
    ]);
    deputies = dbDeputies;
    total = dbTotal;
  }

  const mappedDeputies = deputies.map((deputy) => {
    const activePartyHistory = deputy.partyHistory[0];
    const partySigla = activePartyHistory?.party?.sigla || null;
    const partyColor = activePartyHistory?.party?.color || null;
    const committee = deputy.cms[0];
    const isSuplente = deputy.statusHistory.length > 0;

    let description: string;
    if (committee?.cmsNo) {
      description = `Deputado${partySigla ? ` (${partySigla})` : ""} na Comissão de ${committee.cmsNo}.${deputy.depCPDes ? ` Representando ${deputy.depCPDes}.` : ""}`;
    } else {
      description = `Deputado${partySigla ? ` (${partySigla})` : ""}${deputy.legDes ? ` na ${deputy.legDes}` : ""}.${deputy.depCPDes ? ` Representando ${deputy.depCPDes}.` : ""}`;
    }

    return {
      id: deputy.id,
      name: deputy.depNomeParlamentar,
      fullName: deputy.depNomeCompleto,
      constituency: deputy.depCPDes,
      party: partySigla,
      partyColor,
      image: getProxiedImageUrl(deputy.depImageUrl),
      description,
      isSuplente,
    };
  });

  return NextResponse.json({
    deputies: mappedDeputies,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
