"use client";

import { useCallback, useEffect, useState } from "react";
import FilterChip from "@/components/ui/FilterChip";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";

interface Proposal {
  id: number;
  iniId: number;
  iniNr: string | null;
  titulo: string;
  descTipo: string | null;
  tipo: string | null;
  tipoLabel: string | null;
  authorSigla: string | null;
  authorType: string | null;
  status: string | null;
  statusDescription: string | null;
  dataUltimoEvento: string | null;
  linkTexto: string | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const STATUS_STYLES: Record<string, string> = {
  Aprovado: "bg-green-100 text-green-800",
  Rejeitado: "bg-red-100 text-red-800",
  Prejudicado: "bg-orange-100 text-orange-800",
};

const PARTY_COLORS: Record<string, string> = {
  PSD: "rgb(255, 153, 0)",
  CH: "rgb(32, 32, 86)",
  PS: "rgb(255, 102, 204)",
  IL: "rgb(0, 170, 255)",
  L: "rgb(0, 170, 0)",
  PCP: "rgb(204, 0, 0)",
  "CDS-PP": "rgb(0, 71, 171)",
  CDS: "rgb(0, 71, 171)",
  BE: "rgb(153, 0, 0)",
  PAN: "rgb(0, 204, 102)",
  JPP: "rgb(58, 224, 172)",
  Governo: "rgb(87, 83, 78)",
};

const PARTIDOS = [
  "Governo",
  "PS",
  "PSD",
  "CH",
  "IL",
  "PCP",
  "BE",
  "L",
  "PAN",
  "CDS-PP",
];

const TIPOS: Record<string, string> = {
  R: "Proj. Resolução",
  J: "Proj. Lei",
  P: "Prop. Lei",
  D: "Proj. Deliberação",
  S: "Prop. Resolução",
  A: "Apreciação Parl.",
  I: "Inquérito Parl.",
};

export default function ProposalsSection() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [party, setParty] = useState("");
  const [search, setSearch] = useState("");
  const [resultado, setResultado] = useState("");
  const [tipo, setTipo] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);

  const fetchProposals = useCallback(
    async (page: number) => {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "12");
      if (party) params.set("party", party);
      if (search) params.set("search", search);
      if (resultado) params.set("resultado", resultado);
      if (tipo) params.set("tipo", tipo);

      try {
        const res = await fetch(`/api/proposals?${params.toString()}`);
        const data = await res.json();
        setProposals(data.proposals);
        setPagination(data.pagination);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    },
    [party, search, resultado, tipo],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProposals(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [fetchProposals]);

  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchProposals(newPage);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statusStyle = (status: string | null) => {
    if (!status) return "";
    if (status.includes("Aprovad")) return STATUS_STYLES.Aprovado;
    if (status.includes("Rejeitad")) return STATUS_STYLES.Rejeitado;
    if (status.includes("Prejudicad")) return STATUS_STYLES.Prejudicado;
    return "";
  };

  const statusLabel = (p: Proposal) => {
    return p.status || "Pendente";
  };

  const partyColor = (sigla: string | null) => {
    if (!sigla) return undefined;
    return PARTY_COLORS[sigla] || undefined;
  };

  const hasActiveFilters = Boolean(party || resultado || tipo);

  return (
    <section>
      {/* Search */}
      <div className="mb-8">
        <SearchBar
          placeholder="Pesquisar iniciativas por título..."
          value={search}
          onChange={setSearch}
          onSearch={() => fetchProposals(1)}
          onFilterToggle={() => setFiltersVisible((v) => !v)}
          filtersVisible={filtersVisible}
        />

        {/* Hidden filters */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            filtersVisible
              ? "max-h-[70vh] opacity-100 mt-6 overflow-y-auto"
              : "max-h-0 opacity-0 mt-0"
          }`}
        >
          {/* Type filter */}
          <div className="mb-4">
            <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
              Tipo
            </p>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label="Todos os Tipos"
                active={tipo === ""}
                onClick={() => setTipo("")}
              />
              {Object.entries(TIPOS).map(([code, label]) => (
                <FilterChip
                  key={code}
                  label={label}
                  active={tipo === code}
                  onClick={() => setTipo(tipo === code ? "" : code)}
                />
              ))}
            </div>
          </div>

          {/* Party filter */}
          <div className="mb-4">
            <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
              Autor
            </p>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label="Todos os Autores"
                active={party === ""}
                onClick={() => setParty("")}
              />
              {PARTIDOS.map((p) => (
                <FilterChip
                  key={p}
                  label={p}
                  active={party === p}
                  onClick={() => setParty(party === p ? "" : p)}
                />
              ))}
            </div>
          </div>

          {/* Result filter */}
          <div className="mb-4">
            <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
              Resultado
            </p>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label="Todos os Resultados"
                active={resultado === ""}
                onClick={() => setResultado("")}
              />
              <FilterChip
                label="Aprovado"
                active={resultado === "Aprovado"}
                onClick={() =>
                  setResultado(resultado === "Aprovado" ? "" : "Aprovado")
                }
              />
              <FilterChip
                label="Rejeitado"
                active={resultado === "Rejeitado"}
                onClick={() =>
                  setResultado(resultado === "Rejeitado" ? "" : "Rejeitado")
                }
              />
            </div>
          </div>
        </div>

        {/* Active filter summary */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
              Filtros ativos:
            </span>
            {party && (
              <button
                type="button"
                onClick={() => setParty("")}
                className="inline-flex items-center gap-1 border-2 border-stone-900 px-2 py-0.5 font-label text-xs uppercase tracking-wider bg-surface-container-high"
              >
                {party}
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
            {tipo && (
              <button
                type="button"
                onClick={() => setTipo("")}
                className="inline-flex items-center gap-1 border-2 border-stone-900 px-2 py-0.5 font-label text-xs uppercase tracking-wider bg-surface-container-high"
              >
                {TIPOS[tipo] || tipo}
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
            {resultado && (
              <button
                type="button"
                onClick={() => setResultado("")}
                className="inline-flex items-center gap-1 border-2 border-stone-900 px-2 py-0.5 font-label text-xs uppercase tracking-wider bg-surface-container-high"
              >
                {resultado}
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">
          Carregando iniciativas...
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          Nenhuma iniciativa encontrada.
        </div>
      ) : (
        <>
          <p className="text-sm text-on-surface-variant mb-4 font-label">
            {pagination.total} iniciativa{pagination.total !== 1 ? "s" : ""}{" "}
            encontrada{pagination.total !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {proposals.map((p) => (
              <a
                key={p.id}
                href={`/proposals/${p.id}`}
                className="border-2 border-stone-900 bg-surface-container p-4 glossy-finish flex flex-col hover:border-primary transition-colors group h-full"
              >
                <div className="flex items-start justify-between gap-2 mb-2 min-h-[1.5rem]">
                  <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant truncate">
                    {p.tipoLabel || p.descTipo || "Iniciativa"}
                    {p.iniNr ? ` ${p.iniNr}` : ""}
                  </span>
                  {p.authorSigla && (
                    <span
                      className="font-label text-xs font-bold uppercase px-2 py-0.5 border border-stone-900 shrink-0 text-white truncate max-w-[90px]"
                      style={
                        partyColor(p.authorSigla)
                          ? { backgroundColor: partyColor(p.authorSigla) }
                          : { backgroundColor: "rgb(120, 113, 108)" }
                      }
                    >
                      {p.authorSigla}
                    </span>
                  )}
                </div>
                <h3 className="font-headline text-base font-semibold mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-3">
                  {p.titulo}
                </h3>
                <div className="flex items-center justify-between gap-2 mt-auto pt-2">
                  {p.status ? (
                    <span
                      className={`text-xs font-label uppercase tracking-wide px-2 py-0.5 shrink-0 ${statusStyle(p.status)}`}
                    >
                      {statusLabel(p)}
                    </span>
                  ) : (
                    <span className="text-xs font-label uppercase tracking-wide px-2 py-0.5 bg-gray-100 text-gray-800 shrink-0">
                      Pendente
                    </span>
                  )}
                  {p.dataUltimoEvento && (
                    <span className="text-xs text-on-surface-variant font-label truncate">
                      {formatDate(p.dataUltimoEvento)}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}
