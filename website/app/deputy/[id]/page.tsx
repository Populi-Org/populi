import { notFound } from "next/navigation";
import { getPrismaClient } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  ProfileHero,
  BiographicalHighlights,
  LegislativeActivity,
  FeaturedQuote,
  ProfileStats,
  TownHallBanner,
} from "@/components/profile";

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

  const imageIndex = deputy.id % 4;
  const mockImages = [
    "/images/politicians/carlos-silva.jpg",
    "/images/politicians/maria-santos.jpg",
    "/images/politicians/joao-ferreira.jpg",
    "/images/politicians/ana-costa.jpg",
  ];

  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full space-y-4">
        <ProfileHero
          name={deputy.depNomeParlamentar}
          fullName={deputy.depNomeCompleto}
          party={partySigla}
          constituency={deputy.depCPDes}
          legislature={deputy.legDes}
          image={mockImages[imageIndex]}
          committees={committees}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BiographicalHighlights
            statusHistory={deputy.statusHistory.map((s) => ({
              description: s.sioDes,
              startDate: s.sioDtInicio,
              endDate: s.sioDtFim,
            }))}
          />
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
          <FeaturedQuote
            quote={deputy.intev[0].intTe}
            date={deputy.intev[0].pubDtreu}
          />
        )}

        <ProfileStats
          debateRank={debateRank}
          integrity={98}
          allies={alliesCount}
          muralViews={1200}
        />

        <TownHallBanner />
      </main>
      <Footer />
    </div>
  );
}
