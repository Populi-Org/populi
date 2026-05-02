import { type NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const prisma = getPrismaClient();
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";
  const constituency = searchParams.get("constituency") || "";
  const showSuplentes = searchParams.get("showSuplentes") === "true";
  const sortByPhoto = searchParams.get("sortByPhoto") !== "false";
  const page = Math.max(
    1,
    Number.parseInt(searchParams.get("page") || "1", 10),
  );
  const limit = Math.max(
    1,
    Math.min(50, Number.parseInt(searchParams.get("limit") || "12", 10)),
  );

  const where: Prisma.DeputyWhereInput = {};

  if (search) {
    where.depNomeParlamentar = { contains: search, mode: "insensitive" };
  }

  if (constituency) {
    where.depCPDes = constituency;
  }

  if (!showSuplentes) {
    where.statusHistory = {
      none: {
        sioDes: { contains: "suplent", mode: "insensitive" },
        sioDtFim: null,
      },
    };
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
      image: deputy.depImageUrl || "/defaultNoImage.png",
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
