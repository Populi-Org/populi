import { type NextRequest, NextResponse } from "next/server";
import { getProxiedImageUrl } from "@/lib/image-proxy";
import { getPrismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = getPrismaClient();
  const { id } = await params;
  const deputyId = Number.parseInt(id, 10);

  if (Number.isNaN(deputyId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const deputyResult = await prisma.deputy.findUnique({
    where: { id: deputyId },
    include: {
      partyHistory: {
        where: { gpDtFim: null },
        include: {
          party: {
            select: { sigla: true },
          },
        },
        take: 1,
      },
      statusHistory: {
        orderBy: { sioDtInicio: "desc" },
      },
      cms: {
        where: { cmsSituacao: { not: "Suspenso" } },
        orderBy: { cmsCargo: "asc" },
      },
      ini: {
        orderBy: { id: "desc" },
        take: 5,
      },
      intev: {
        orderBy: { id: "desc" },
        take: 1,
      },
      _count: {
        select: {
          intev: true,
          ini: true,
          cms: true,
        },
      },
    },
  });

  if (!deputyResult) {
    return NextResponse.json(
      { error: "Deputado não encontrado" },
      { status: 404 },
    );
  }

  const deputy = deputyResult;

  const activePartyHistory = deputy.partyHistory[0];
  const partySigla = activePartyHistory?.party?.sigla || null;

  const committees = deputy.cms.map((c) => ({
    name: c.cmsNo,
    role: c.cmsCargo,
    situation: c.cmsSituacao,
  }));

  const alliesCount = await prisma.deputy.count({
    where: {
      id: { not: deputyId },
      cms: {
        some: {
          cmsNo: {
            in: deputy.cms
              .map((c) => c.cmsNo)
              .filter((cmsNo): cmsNo is string => cmsNo !== null),
          },
          cmsSituacao: { not: "Suspenso" },
        },
      },
    },
  });

  const initiatives = deputy.ini.map((i) => ({
    id: i.iniId,
    title: i.iniTi,
    type: i.iniTpdesc,
    number: i.iniNr,
  }));

  const latestIntervention = deputy.intev[0]
    ? {
        text: deputy.intev[0].intTe,
        date: deputy.intev[0].pubDtreu,
      }
    : null;

  const image = getProxiedImageUrl(deputy.depImageUrl);

  return NextResponse.json({
    id: deputy.id,
    depId: deputy.depId,
    name: deputy.depNomeParlamentar,
    fullName: deputy.depNomeCompleto,
    constituency: deputy.depCPDes,
    legislature: deputy.legDes,
    party: partySigla,
    image,
    committees,
    statusHistory: deputy.statusHistory.map((s) => ({
      description: s.sioDes,
      startDate: s.sioDtInicio,
      endDate: s.sioDtFim,
    })),
    initiatives,
    latestIntervention,
    stats: {
      interventions: deputy._count.intev,
      initiatives: deputy._count.ini,
      committees: deputy._count.cms,
      allies: alliesCount,
    },
  });
}
