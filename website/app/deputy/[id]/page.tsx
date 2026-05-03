import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import {
  BiographicalHighlights,
  DeputyFactChecks,
  DeputyNews,
  DeputyProfileTabs,
  FeaturedQuote,
  LegislativeActivity,
  ProfileHero,
  ProfileStats,
} from "@/components/profile";
import { getProxiedImageUrl } from "@/lib/image-proxy";
import { getPrismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const prisma = getPrismaClient();
  const { id } = await params;
  const deputyId = Number.parseInt(id, 10);

  if (Number.isNaN(deputyId)) {
    return { title: "Deputado não encontrado | Populi" };
  }

  const deputy = await prisma.deputy.findUnique({
    where: { id: deputyId },
    include: {
      partyHistory: {
        where: { gpDtFim: null },
        include: { party: { select: { sigla: true } } },
        take: 1,
      },
    },
  });

  if (!deputy) {
    return { title: "Deputado não encontrado | Populi" };
  }

  const party = deputy.partyHistory[0]?.party?.sigla;
  const title = `${deputy.depNomeParlamentar}${party ? ` (${party})` : ""} — Perfil no Populi`;
  const description = `Perfil parlamentar de ${deputy.depNomeParlamentar}${party ? `, deputado ${party}` : ""}${deputy.depCPDes ? ` por ${deputy.depCPDes}` : ""}. Consulta atividade legislativa, iniciativas, comissões e estatísticas.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: deputy.depImageUrl ? [deputy.depImageUrl] : undefined,
    },
  };
}

export default async function DeputyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const prisma = getPrismaClient();
  const { id } = await params;
  const deputyId = Number.parseInt(id, 10);

  if (Number.isNaN(deputyId)) {
    notFound();
  }

  const deputy = await prisma.deputy.findUnique({
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
        },
      },
    },
  });

  if (!deputy) {
    notFound();
  }

  const activePartyHistory = deputy.partyHistory[0];
  const partySigla = activePartyHistory?.party?.sigla || null;

  const committees = deputy.cms.map((c) => ({
    name: c.cmsNo,
    role: c.cmsCargo,
    situation: c.cmsSituacao,
  }));

  const debateRank = deputy._count.intev;

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

  const image = getProxiedImageUrl(deputy.depImageUrl);

  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow px-4 py-8 md:py-20 max-w-7xl mx-auto w-full space-y-4">
        <ProfileHero
          name={deputy.depNomeParlamentar}
          fullName={deputy.depNomeCompleto}
          party={partySigla}
          constituency={deputy.depCPDes}
          legislature={deputy.legDes}
          image={image}
          committees={committees}
        />

        <DeputyProfileTabs
          tabs={[
            {
              id: "general",
              label: "Geral",
              content: (
                <div className="grid grid-cols-12 gap-[2px]">
                  <div className="col-span-12 lg:col-span-4">
                    <BiographicalHighlights
                      statusHistory={deputy.statusHistory.map((s) => ({
                        description: s.sioDes,
                        startDate: s.sioDtInicio,
                        endDate: s.sioDtFim,
                      }))}
                    />
                  </div>

                  <div className="col-span-12 lg:col-span-8">
                    <LegislativeActivity
                      initiatives={deputy.ini.map((i) => ({
                        id: i.iniId,
                        title: i.iniTi,
                        type: i.iniTpdesc,
                        number: i.iniNr,
                      }))}
                    />
                  </div>

                  {deputy.intev[0]?.intTe && (
                    <div className="col-span-12 md:col-span-6 lg:col-span-8 h-full">
                      <FeaturedQuote
                        quote={deputy.intev[0].intTe}
                        author={deputy.depNomeParlamentar}
                        date={deputy.intev[0].pubDtreu}
                      />
                    </div>
                  )}

                  <div
                    className={
                      deputy.intev[0]?.intTe
                        ? "col-span-12 lg:col-span-4 h-full"
                        : "col-span-12"
                    }
                  >
                    <ProfileStats
                      debateRank={debateRank}
                      initiatives={deputy.ini.length}
                      allies={alliesCount}
                      committees={deputy.cms.length}
                    />
                  </div>
                </div>
              ),
            },
            {
              id: "news",
              label: "Notícias",
              content: <DeputyNews deputyId={deputy.id} />,
            },
            {
              id: "poligrafo",
              label: "Polígrafo",
              content: <DeputyFactChecks deputyId={deputy.id} />,
            },
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}
