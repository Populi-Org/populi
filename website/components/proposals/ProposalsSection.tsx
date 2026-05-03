"use client";

import { useCallback, useEffect, useState } from "react";
import FilterChip from "@/components/ui/FilterChip";
import Pagination from "@/components/ui/Pagination";

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
  const [searchInput, setSearchInput] = useState("");
  const [resultado, setResultado] = useState("");
  const [tipo, setTipo] = useState("");

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
    fetchProposals(1);
  }, [fetchProposals]);

  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchProposals(newPage);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
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

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Pesquisar propostas..."
            className="flex-1 max-w-md border-2 border-stone-900 px-4 py-2 font-body text-sm bg-surface focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="border-2 border-stone-900 bg-primary-container text-on-primary px-4 py-2 font-label text-sm uppercase tracking-wider cursor-pointer glossy-finish"
          >
            Buscar
          </button>
        </form>

        {/* Type filter */}
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

        {/* Party filter */}
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

        {/* Result filter */}
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

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">
          Carregando propostas...
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          Nenhuma proposta encontrada.
        </div>
      ) : (
        <>
          <p className="text-sm text-on-surface-variant mb-4 font-label">
            {pagination.total} proposta{pagination.total !== 1 ? "s" : ""}{" "}
            encontrada{pagination.total !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proposals.map((p) => (
              <a
                key={p.id}
                href={`/propostas/${p.id}`}
                className="border-2 border-stone-900 bg-surface-container p-4 glossy-finish block hover:border-primary transition-colors group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                    {p.tipoLabel || p.descTipo || "Proposta"}
                    {p.iniNr ? ` ${p.iniNr}` : ""}
                  </span>
                  {p.authorSigla && (
                    <span className="font-label text-xs font-bold uppercase px-2 py-0.5 border border-stone-900 bg-surface-container-high shrink-0">
                      {p.authorSigla}
                    </span>
                  )}
                </div>
                <h3 className="font-headline text-base font-semibold mb-3 leading-tight group-hover:text-primary transition-colors">
                  {p.titulo}
                </h3>
                <div className="flex items-center justify-between gap-2 mt-auto">
                  {p.status ? (
                    <span
                      className={`text-xs font-label uppercase tracking-wide px-2 py-0.5 ${statusStyle(p.status)}`}
                    >
                      {statusLabel(p)}
                    </span>
                  ) : (
                    <span className="text-xs font-label uppercase tracking-wide px-2 py-0.5 bg-gray-100 text-gray-800">
                      Pendente
                    </span>
                  )}
                  {p.dataUltimoEvento && (
                    <span className="text-xs text-on-surface-variant font-label">
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
    </div>
  );
}
