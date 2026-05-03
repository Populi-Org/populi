import Image from "next/image";
import { getPrismaClient } from "@/lib/prisma";

interface TrendingTopic {
  title: string;
  description: string;
  category: string;
  metric: string;
  icon: string;
  image: string;
  href: string;
}

const formatCount = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `${value}`;
};

export default async function TrendingSection() {
  const prisma = getPrismaClient();
  const deputies = await prisma.deputy.findMany({
    take: 4,
    where: {
      depImageUrl: { not: null },
    },
    orderBy: {
      intev: {
        _count: "desc",
      },
    },
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
      _count: {
        select: { intev: true },
      },
    },
  });

  const trendingTopics: TrendingTopic[] = deputies.map((deputy) => {
    const activePartyHistory = deputy.partyHistory[0];
    const partySigla = activePartyHistory?.party?.sigla || "Sem partido";
    const committee = deputy.cms[0]?.cmsNo;
    const constituency = deputy.depCPDes;
    const legislature = deputy.legDes;
    const description = committee
      ? `Membro${partySigla ? ` (${partySigla})` : ""} da Comissão de ${committee}.${constituency ? ` Representa ${constituency}.` : ""}`
      : `Deputado${partySigla ? ` (${partySigla})` : ""}${legislature ? ` na ${legislature}` : ""}.${constituency ? ` Representa ${constituency}.` : ""}`;
    const href = `/deputy/${deputy.id}`;

    return {
      title: deputy.depNomeParlamentar,
      description,
      category: partySigla,
      metric: `${formatCount(deputy._count.intev)} Intervenções`,
      icon: "record_voice_over",
      image: deputy.depImageUrl || "/defaultNoImage.png",
      href,
    };
  });

  return (
    <section>
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary">
          Deputados em Destaque
        </h2>
        <div className="h-[2px] flex-grow bg-stone-900 opacity-20" />
        <span className="font-label text-on-surface-variant text-xs font-medium uppercase tracking-wider">
          Políticos Mais Debatidos
        </span>
      </div>
      {trendingTopics.length === 0 ? (
        <div className="border-2 border-stone-900 p-6 bg-surface-container-lowest">
          <p className="font-body text-on-surface-variant">
            Sem dados suficientes para destacar deputados neste momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {trendingTopics.map((topic) => (
            <a href={topic.href} key={topic.title}>
              <div className="bg-surface-container-lowest border-2 border-stone-900 solid-shadow p-6 flex flex-col glossy-finish group hover:-translate-y-1 transition-transform duration-300">
                <div className="w-full aspect-square bg-surface-variant mb-4 border-2 border-stone-900 overflow-hidden relative">
                  <Image
                    className="w-full h-full object-cover contrast-125"
                    src={topic.image}
                    alt={topic.title}
                    width={400}
                    height={400}
                  />
                  <div className="absolute top-2 right-2 accent-color text-white text-[10px] font-bold px-2 py-1 uppercase">
                    {topic.category}
                  </div>
                </div>
                <h3 className="font-headline text-xl font-semibold text-on-surface mb-2">
                  {topic.title}
                </h3>
                <p className="font-body text-on-surface-variant flex-grow">
                  {topic.description}
                </p>
                <div className="mt-4 pt-4 border-t-2 border-stone-100 flex justify-between items-center">
                  <span className="text-primary font-bold text-sm uppercase tracking-wider">
                    {topic.metric}
                  </span>
                  <span className="material-symbols-outlined text-primary">
                    {topic.icon}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
