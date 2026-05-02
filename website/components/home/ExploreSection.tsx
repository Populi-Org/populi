interface FilterCategory {
  label: string;
  icon: string;
}

interface PartyFilter {
  label: string;
  color: string;
}

const filterCategories: FilterCategory[] = [
  { label: "PARTIDOS", icon: "token" },
  { label: "REGIÃO", icon: "map" },
  { label: "TEMA", icon: "topic" },
  { label: "PERÍODO", icon: "calendar_month" },
];

const partyFilters: PartyFilter[] = [
  { label: "PARTIDO A", color: "bg-stone-400" },
  { label: "PARTIDO B", color: "bg-stone-900" },
  { label: "PARTIDO C", color: "bg-stone-200" },
  { label: "PARTIDO D", color: "border border-stone-900 bg-transparent" },
  { label: "PARTIDO E", color: "bg-primary" },
];

export default function ExploreSection() {
  return (
    <section className="bg-surface-variant p-8 border-4 border-stone-900">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/4">
          <h3 className="font-headline text-xl font-semibold text-primary mb-2">
            Explore o Mosaico
          </h3>
          <p className="font-body text-on-surface-variant">
            Filtre as peças por categoria para encontrar o que lhe interessa.
          </p>
        </div>
        <div className="md:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {filterCategories.map((cat) => (
            <div key={cat.label} className="group cursor-pointer">
              <div className="bg-white border-2 border-stone-900 p-4 text-center group-hover:bg-primary group-hover:text-white transition-all glossy-finish">
                <span className="material-symbols-outlined text-3xl mb-2 block">
                  {cat.icon}
                </span>
                <p className="font-label text-xs font-medium uppercase tracking-wider">
                  {cat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 pt-8 border-t-2 border-stone-900/10 flex flex-wrap gap-3">
        {partyFilters.map((party) => (
          <span
            key={party.label}
            className="bg-white border-2 border-stone-900 px-4 py-2 font-label text-xs flex items-center gap-2"
          >
            <span className={`w-3 h-3 ${party.color}`} />
            {party.label}
          </span>
        ))}
        <span className="text-on-surface-variant font-body text-sm italic ml-2">
          As cores representam neutralidade geométrica, sem afiliação cromática
          partidária.
        </span>
      </div>
    </section>
  );
}
