import FilterChip from "../ui/FilterChip";
import SearchBar from "../ui/SearchBar";
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
    accentColor: "bg-secondary",
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
    accentColor: "bg-secondary",
  },
  {
    name: "Ana Costa",
    district: "Distrito 7 - Faro",
    description:
      "Especialista em regulação turística e políticas de proteção costeira. Uma voz forte pelos distritos do sul.",
    image: "/images/politicians/ana-costa.jpg",
    accentColor: "bg-secondary",
  },
];

const districts = ["Norte", "Sul", "Centro", "Lisboa", "Porto", "Incumbentes"];

export default function AssemblySection() {
  return (
    <section>
      {/* Search Section */}
      <div className="mb-12">
        <h1 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-6">
          Assembleia de Representantes
        </h1>
        <SearchBar placeholder="Pesquisar representantes por nome ou distrito..." />
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
