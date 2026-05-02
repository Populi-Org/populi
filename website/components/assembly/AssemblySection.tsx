"use client";

import { useCallback, useEffect, useState } from "react";
import FilterChip from "../ui/FilterChip";
import SearchBar from "../ui/SearchBar";
import RepresentativeCard from "./RepresentativeCard";

interface Deputy {
  id: number;
  name: string;
  fullName: string;
  constituency: string | null;
  party: string | null;
  position: string | null;
  legislature: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const mockImages = [
  "/images/politicians/carlos-silva.jpg",
  "/images/politicians/maria-santos.jpg",
  "/images/politicians/joao-ferreira.jpg",
  "/images/politicians/ana-costa.jpg",
];

const constituencies = [
  "Aveiro",
  "Beja",
  "Braga",
  "Bragança",
  "Castelo Branco",
  "Coimbra",
  "Évora",
  "Faro",
  "Guarda",
  "Leiria",
  "Lisboa",
  "Portalegre",
  "Porto",
  "Santarém",
  "Setúbal",
  "Viana do Castelo",
  "Vila Real",
  "Viseu",
  "Açores",
  "Madeira",
  "Europa",
  "Fora da Europa",
];

function getMockImage(index: number): string {
  return mockImages[index % mockImages.length];
}

export default function AssemblySection() {
  const [deputies, setDeputies] = useState<Deputy[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [constituency, setConstituency] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeputies = useCallback(
    async (page: number, searchTerm: string, constituencyFilter: string) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", "12");
        if (searchTerm) params.set("search", searchTerm);
        if (constituencyFilter) params.set("constituency", constituencyFilter);

        const response = await fetch(`/api/deputies?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch deputies");
        }

        const data = await response.json();
        setDeputies(data.deputies);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setDeputies([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchDeputies(1, search, constituency);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, constituency, fetchDeputies]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchDeputies(page, search, constituency);
  };

  const toggleConstituency = (c: string) => {
    setConstituency((prev) => (prev === c ? "" : c));
  };

  return (
    <section>
      {/* Search Section */}
      <div className="mb-12">
        <h1 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-6">
          Assembleia de Representantes
        </h1>
        <SearchBar
          placeholder="Pesquisar representantes por nome ou distrito..."
          value={search}
          onChange={setSearch}
          onSearch={() => fetchDeputies(1, search, constituency)}
          onFilterToggle={() => setFiltersVisible((v) => !v)}
          filtersVisible={filtersVisible}
        />
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            filtersVisible
              ? "max-h-96 opacity-100 mt-6"
              : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <div className="flex flex-wrap gap-2">
            {constituencies.map((c) => (
              <FilterChip
                key={c}
                label={c}
                active={constituency === c}
                onClick={() => toggleConstituency(c)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            "skeleton-a",
            "skeleton-b",
            "skeleton-c",
            "skeleton-d",
            "skeleton-e",
            "skeleton-f",
            "skeleton-g",
            "skeleton-h",
            "skeleton-i",
            "skeleton-j",
            "skeleton-k",
            "skeleton-l",
          ].map((key) => (
            <div
              key={key}
              className="border-4 border-stone-900 bg-surface flex flex-col glossy-finish animate-pulse"
            >
              <div className="h-4 w-full bg-surface-dim" />
              <div className="p-6 flex flex-col items-center flex-grow">
                <div className="w-32 h-32 bg-surface-dim mb-4" />
                <div className="h-6 w-32 bg-surface-dim mb-2" />
                <div className="h-4 w-24 bg-surface-dim mb-4" />
                <div className="h-16 w-full bg-surface-dim mb-6" />
                <div className="h-10 w-full bg-surface-dim" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="border-4 border-stone-900 bg-surface p-8 text-center">
          <p className="font-body text-error mb-4">{error}</p>
          <button
            type="button"
            onClick={() => fetchDeputies(pagination.page, search, constituency)}
            className="border-2 border-stone-900 bg-primary text-white px-6 py-2 font-label text-xs font-medium uppercase tracking-wider glossy-finish hover:bg-primary-container transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Deputies Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deputies.map((deputy, index) => (
              <RepresentativeCard
                key={deputy.id}
                name={deputy.name}
                constituency={deputy.constituency}
                party={deputy.party}
                image={getMockImage(index)}
              />
            ))}
          </div>

          {/* Empty State */}
          {deputies.length === 0 && (
            <div className="border-4 border-stone-900 bg-surface p-8 text-center">
              <p className="font-body text-on-surface-variant">
                Nenhum deputado encontrado para os critérios selecionados.
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="border-2 border-stone-900 bg-surface w-10 h-10 flex items-center justify-center glossy-finish text-primary-container hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1,
              ).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`border-2 border-stone-900 w-10 h-10 flex items-center justify-center glossy-finish font-label text-xs font-medium uppercase ${
                    pageNum === pagination.page
                      ? "bg-primary-container text-on-primary"
                      : "bg-surface text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="border-2 border-stone-900 bg-surface w-10 h-10 flex items-center justify-center glossy-finish text-primary-container hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
