import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import {
  BiographicalHighlights,
  FeaturedQuote,
  LegislativeActivity,
  ProfileHero,
  ProfileStats,
  TownHallBanner,
  DeputyNews,
  DeputyFactChecks,
  DeputyProfileTabs,
} from "@/components/profile";
import { getPrismaClient } from "@/lib/prisma";

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

  const image = deputy.depImageUrl || "/defaultNoImage.png";

  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-6 pt-24 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-12 gap-[2px]">
          <div className="col-span-12 lg:col-span-8">
            <ProfileHero
              name={deputy.depNomeParlamentar}
              fullName={deputy.depNomeCompleto}
              party={partySigla}
              constituency={deputy.depCPDes}
              legislature={deputy.legDes}
              image={image}
              committees={committees}
            />
          </div>

          <DeputyProfileTabs
            tabs={[
              {
                id: "general",
                label: "Geral",
                content: (
                  <div className="space-y-4">
                    <div className="col-span-12 lg:col-span-4">
                        <BiographicalHighlights
                          statusHistory={deputy.statusHistory.map((s) => ({
                            description: s.sioDes,
                            startDate: s.sioDtInicio,
                            endDate: s.sioDtFim,
                          }))}
                        />
                      </div>

                      <div className="col-span-12 md:col-span-6 lg:col-span-4">
                        <LegislativeActivity
                          initiatives={deputy.ini.map((i) => ({
                            id: i.iniId,
                            title: i.iniTi,
                            type: i.iniTpdesc,
                            number: i.iniNr,
                          }))}
                        />
                      </div>

                    <div className="col-span-12 md:col-span-6 lg:col-span-8">
                      {deputy.intev[0]?.intTe && (
                        <FeaturedQuote
                          quote={deputy.intev[0].intTe}
                          author={deputy.depNomeParlamentar}
                          date={deputy.intev[0].pubDtreu}
                        />
                      )}
                    </div>

                    <div className="col-span-12 lg:col-span-4">
                      <ProfileStats
                        debateRank={debateRank}
                        integrity={98}
                        allies={alliesCount}
                        muralViews={1200}
                      />
                    </div>

                    <div className="col-span-12 lg:col-span-8">
                      <TownHallBanner />
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
