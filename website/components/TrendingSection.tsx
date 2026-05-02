import Image from "next/image";

interface TrendingTopic {
  title: string;
  description: string;
  category: string;
  metric: string;
  icon: string;
  image: string;
}

const trendingTopics: TrendingTopic[] = [
  {
    title: "Reforma da Saúde",
    description:
      "O novo plano para o SNS está a gerar debate intenso nas comissões parlamentares.",
    category: "Política",
    metric: "852 Comentários",
    icon: "trending_up",
    image: "/images/reforma-saude.jpg",
  },
  {
    title: "Orçamento 2025",
    description:
      "Análise detalhada das dotações para educação e habitação no próximo ano fiscal.",
    category: "Institucional",
    metric: "1.2k Atividade",
    icon: "account_balance",
    image: "/images/orcamento-2025.jpg",
  },
  {
    title: "Pacto Ecológico",
    description:
      "Novas diretrizes para a transição energética e impacto na indústria local.",
    category: "Sociedade",
    metric: "643 Peças",
    icon: "eco",
    image: "/images/pacto-ecologico.jpg",
  },
  {
    title: "Direito à Habitação",
    description:
      "Acompanhamento legislativo das medidas de apoio ao arrendamento jovem.",
    category: "Lei",
    metric: "2.4k Votos",
    icon: "gavel",
    image: "/images/direito-habitacao.jpg",
  },
];

export default function TrendingSection() {
  return (
    <section>
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary">
          Em Destaque
        </h2>
        <div className="h-[2px] flex-grow bg-stone-900 opacity-20" />
        <span className="font-label text-on-surface-variant text-xs font-medium uppercase tracking-wider">
          AS PEÇAS MAIS DEBATIDAS
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {trendingTopics.map((topic) => (
          <div
            key={topic.title}
            className="bg-surface-container-lowest border-2 border-stone-900 solid-shadow p-6 flex flex-col glossy-finish"
          >
            <div className="w-full aspect-square bg-surface-variant mb-4 border-2 border-stone-900 overflow-hidden relative">
              <Image
                className="w-full h-full object-cover grayscale contrast-125"
                src={topic.image}
                alt={topic.title}
                width={400}
                height={400}
              />
              <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase">
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
        ))}
      </div>
    </section>
  );
}
