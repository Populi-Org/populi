"use client";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onFilterToggle: () => void;
  filtersVisible: boolean;
}

export default function SearchBar({
  placeholder = "Pesquisar...",
  value,
  onChange,
  onSearch,
  onFilterToggle,
}: SearchBarProps) {
  return (
    <div className="border-4 border-stone-900 bg-surface-container glossy-finish azulejo-crazing solid-shadow p-4 sm:p-6 md:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 geometric-bg opacity-10" />
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex-grow border-2 border-stone-900 bg-surface flex items-center p-2 glossy-finish focus-within:border-primary transition-colors">
          <span className="material-symbols-outlined text-outline ml-2">
            search
          </span>
          <input
            className="w-full bg-transparent border-none outline-none font-body text-on-surface ml-2"
            placeholder={placeholder}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            type="button"
            onClick={onFilterToggle}
            className="border-2 border-stone-900 bg-surface text-primary-container px-4 py-2 font-label text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 glossy-finish hover:bg-surface-container-high transition-colors"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              filter_alt
            </span>
            Filtrar
          </button>
          <button
            type="button"
            onClick={onSearch}
            className="border-2 border-stone-900 bg-primary-container text-on-primary px-6 py-2 font-label text-xs font-medium uppercase tracking-wider glossy-finish hover:bg-primary transition-colors"
          >
            Pesquisar
          </button>
        </div>
      </div>
    </div>
  );
}
