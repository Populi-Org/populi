"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type FilterCategory = "Partidos" | "Região" | "Tema" | "Período";

interface PartyFilter {
  id: number;
  label: string;
  color: string | null;
}

const filterCategories: { label: FilterCategory; icon: string }[] = [
  { label: "Partidos", icon: "token" },
  { label: "Região", icon: "map" },
  { label: "Tema", icon: "topic" },
  { label: "Período", icon: "calendar_month" },
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

const themes = [
  "Economia",
  "Saúde",
  "Educação",
  "Habitação",
  "Ambiente",
  "Transportes",
  "Justiça",
  "Energia",
];

const sinceYears = ["1980", "1990", "2000", "2010", "2015", "2019", "2024"];

export default function ExploreSection() {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory | null>(
    "Partidos",
  );
  const [partyFilters, setPartyFilters] = useState<PartyFilter[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchParties = async () => {
      try {
        const response = await fetch("/api/parties");
        if (!response.ok) return;
        const data = await response.json();
        const parties = Array.isArray(data.parties) ? data.parties : [];
        if (!cancelled) {
          setPartyFilters(
            parties.map(
              (party: { id: number; sigla?: string; label?: string; color?: string | null }) => ({
                id: party.id,
                label: party.label ?? party.sigla ?? "",
                color: party.color ?? null,
              }),
            ),
          );
        }
      } catch {
        if (!cancelled) setPartyFilters([]);
      }
    };

    fetchParties();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-surface-variant p-8 border-4 border-stone-900">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/4">
          <h3 className="font-headline text-xl font-semibold text-primary mb-2">
            Explore o Mosaico
          </h3>
          <p className="font-body text-on-surface-variant">
            Filtre políticos e deputados por categoria para encontrar o que lhe
            interessa.
          </p>
        </div>
        <div className="md:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {filterCategories.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() =>
                setSelectedCategory((prev) =>
                  prev === cat.label ? null : cat.label,
                )
              }
              className="group cursor-pointer"
            >
              <div className="bg-white border-2 border-stone-900 p-4 text-center group-hover:bg-primary group-hover:text-white transition-all glossy-finish">
                <span className="material-symbols-outlined text-3xl mb-2 block">
                  {cat.icon}
                </span>
                <p className="font-label text-xs font-medium uppercase tracking-wider">
                  {cat.label}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
      {selectedCategory === "Partidos" && (
        <div className="mt-8 pt-8 border-t-2 border-stone-900/10 flex flex-wrap gap-3">
          {partyFilters.length === 0 ? (
            <span className="bg-white border-2 border-stone-900 px-4 py-2 font-label text-xs">
              Sem partidos disponíveis.
            </span>
          ) : (
            partyFilters.map((party) => (
              <Link
                key={party.id}
                href={{
                  pathname: "/assembly",
                  query: { party: party.label, filters: "1" },
                }}
                className="bg-white border-2 border-stone-900 px-4 py-2 font-label text-xs flex items-center gap-2"
              >
                <span
                  className={`w-3 h-3 ${party.color ? "" : "bg-stone-200"}`}
                  style={
                    party.color ? { backgroundColor: party.color } : undefined
                  }
                />
                {party.label}
              </Link>
            ))
          )}
        </div>
      )}
      {selectedCategory === "Região" && (
        <div className="mt-8 pt-8 border-t-2 border-stone-900/10 flex flex-wrap gap-3">
          {constituencies.map((region) => (
            <Link
              key={region}
              href={{
                pathname: "/assembly",
                query: { constituency: region, filters: "1" },
              }}
              className="bg-white border-2 border-stone-900 px-4 py-2 font-label text-xs"
            >
              {region}
            </Link>
          ))}
        </div>
      )}
      {selectedCategory === "Tema" && (
        <div className="mt-8 pt-8 border-t-2 border-stone-900/10 flex flex-wrap gap-3">
          {themes.map((theme) => (
            <Link
              key={theme}
              href={{ pathname: "/assembly", query: { theme, filters: "1" } }}
              className="bg-white border-2 border-stone-900 px-4 py-2 font-label text-xs"
            >
              {theme}
            </Link>
          ))}
        </div>
      )}
      {selectedCategory === "Período" && (
        <div className="mt-8 pt-8 border-t-2 border-stone-900/10 flex flex-wrap gap-3">
          {sinceYears.map((year) => (
            <Link
              key={year}
              href={{
                pathname: "/assembly",
                query: { since: year, filters: "1" },
              }}
              className="bg-white border-2 border-stone-900 px-4 py-2 font-label text-xs"
            >
              Desde {year}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
