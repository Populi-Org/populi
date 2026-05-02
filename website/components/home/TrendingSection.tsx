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
    title: "Maria Santos",
    description:
      "Deputada em foco pelas propostas sobre habitação acessível e renda jovem.",
    category: "Deputada",
    metric: "1.8k Menções",
    icon: "person",
    image: "/images/politicians/maria-santos.jpg",
  },
  {
    title: "João Ferreira",
    description:
      "Intervenções recentes nas comissões económicas com impacto nas PME.",
    category: "Deputado",
    metric: "1.1k Interações",
    icon: "person",
    image: "/images/politicians/joao-ferreira.jpg",
  },
  {
    title: "Ana Costa",
    description:
      "Posições de destaque na agenda ambiental e energia renovável.",
    category: "Deputada",
    metric: "980 Menções",
    icon: "person",
    image: "/images/politicians/ana-costa.jpg",
  },
  {
    title: "Carlos Silva",
    description:
      "Debate intenso em torno das propostas sobre saúde e cuidados primários.",
    category: "Deputado",
    metric: "2.3k Reações",
    icon: "person",
    image: "/images/politicians/carlos-silva.jpg",
  },
];

export default function TrendingSection() {
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
        ))}
      </div>
    </section>
  );
}
