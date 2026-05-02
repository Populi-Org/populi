import FilterChip from "../ui/FilterChip";
import RepresentativeCard from "./RepresentativeCard";

interface Representative {
  name: string;
  district: string;
  description: string;
  image: string;
  accentColor: string;
}

const representatives: Representative[] = [
  {
    name: "Carlos Silva",
    district: "Distrito 1 - Porto",
    description:
      "Focado em infraestruturas e desenvolvimento urbano. Veterano da assembleia com uma abordagem pragmática ao planeamento urbano.",
    image: "/images/politicians/carlos-silva.jpg",
    accentColor: "bg-primary-container",
  },
  {
    name: "Maria Santos",
    district: "Distrito 4 - Lisboa",
    description:
      "Defensora da reforma educacional e programas de literacia digital. Lidera o comité de tecnologias futuras.",
    image: "/images/politicians/maria-santos.jpg",
    accentColor: "bg-secondary",
  },
  {
    name: "João Ferreira",
    district: "Distrito 2 - Braga",
    description:
      "Promove a sustentabilidade ambiental e iniciativas de energia verde. Frequentemente organiza assembleias abertas.",
    image: "/images/politicians/joao-ferreira.jpg",
    accentColor: "bg-tertiary-container",
  },
  {
    name: "Ana Costa",
    district: "Distrito 7 - Faro",
    description:
      "Especialista em regulação turística e políticas de proteção costeira. Uma voz forte pelos distritos do sul.",
    image: "/images/politicians/ana-costa.jpg",
    accentColor: "bg-primary-container",
  },
];

const districts = ["Norte", "Sul", "Centro", "Lisboa", "Porto", "Incumbentes"];

export default function AssemblySection() {
  return (
    <section>
      {/* Search Section */}
      <div className="mb-12 border-4 border-stone-900 bg-surface-container glossy-finish azulejo-crazing solid-shadow p-6 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 geometric-bg opacity-10" />
        <h1 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-6 relative z-10">
          Assembleia de Representantes
        </h1>
        <div className="flex flex-col md:flex-row gap-4 relative z-10">
          <div className="flex-grow border-2 border-stone-900 bg-surface flex items-center p-2 glossy-finish focus-within:ring-2 focus-within:ring-primary-container">
            <span className="material-symbols-outlined text-outline ml-2">
              search
            </span>
            <input
              className="w-full bg-transparent border-none focus:ring-0 font-body text-on-surface ml-2"
              placeholder="Pesquisar representantes por nome ou distrito..."
              type="text"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              className="border-2 border-stone-900 bg-surface text-primary-container px-4 py-2 font-label text-xs font-medium uppercase tracking-wider flex items-center gap-2 glossy-finish hover:bg-surface-container-high transition-colors"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                filter_alt
              </span>
              FILTRAR
            </button>
            <button
              type="button"
              className="border-2 border-stone-900 bg-primary-container text-on-primary px-6 py-2 font-label text-xs font-medium uppercase tracking-wider glossy-finish hover:bg-primary transition-colors"
            >
              PESQUISAR
            </button>
          </div>
        </div>
        {/* Quick Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {districts.map((district) => (
            <FilterChip key={district} label={district} />
          ))}
        </div>
      </div>

      {/* Representatives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {representatives.map((rep) => (
          <RepresentativeCard
            key={rep.name}
            name={rep.name}
            district={rep.district}
            description={rep.description}
            image={rep.image}
            accentColor={rep.accentColor}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-center gap-2">
        <button
          type="button"
          className="border-2 border-stone-900 bg-surface w-10 h-10 flex items-center justify-center glossy-finish text-primary-container hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button
          type="button"
          className="border-2 border-stone-900 bg-primary-container w-10 h-10 flex items-center justify-center glossy-finish text-on-primary font-label text-xs font-medium uppercase"
        >
          1
        </button>
        <button
          type="button"
          className="border-2 border-stone-900 bg-surface w-10 h-10 flex items-center justify-center glossy-finish text-on-surface hover:bg-surface-container-high font-label text-xs font-medium uppercase"
        >
          2
        </button>
        <button
          type="button"
          className="border-2 border-stone-900 bg-surface w-10 h-10 flex items-center justify-center glossy-finish text-on-surface hover:bg-surface-container-high font-label text-xs font-medium uppercase"
        >
          3
        </button>
        <button
          type="button"
          className="border-2 border-stone-900 bg-surface w-10 h-10 flex items-center justify-center glossy-finish text-primary-container hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </section>
  );
}
