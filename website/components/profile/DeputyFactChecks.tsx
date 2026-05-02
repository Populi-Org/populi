"use client";

import { useState, useEffect } from "react";
import ProfileSection from "./ProfileSection";

interface FactCheck {
  id: number;
  deputyId: number;
  title: string;
  url: string;
  lead: string | null;
  truthLevel: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DeputyFactChecksProps {
  deputyId: number;
}

export default function DeputyFactChecks({ deputyId }: DeputyFactChecksProps) {
  const [factChecks, setFactChecks] = useState<FactCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/deputies/${deputyId}/fact-checks`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setFactChecks(data.factChecks || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [deputyId]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const truthLevelMap = (level: string | null): { label: string; color: string } => {
    if (!level) return { label: "N/A", color: "bg-stone-600" };
    const lower = level.toLowerCase();
    switch (lower) {
      case "true":
        return { label: "Verdadeiro", color: "bg-green-600" };
      case "true-but":
        return { label: "Verdadeiro, mas...", color: "bg-[#c5c10c]" };
      case "false":
        return { label: "Falso", color: "bg-red-600" };
      case "imprecise":
      case "impreciso":
        return { label: "Impreciso", color: "bg-orange-500" };
      case "decontextualized":
      case "descontextualizado":
        return { label: "Descontextualizado", color: "bg-yellow-500" };
      case "manipulated":
      case "manipulado":
        return { label: "Manipulado", color: "bg-rose-600" };
      case "pepper":
        return { label: "Pimenta na Língua", color: "bg-rose-900" };
      default:
        return { label: level, color: "bg-stone-600" };
    }
  };

  return (
    <ProfileSection variant="primary" className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-headline text-2xl font-semibold text-primary-container uppercase tracking-wider">
          Polígrafo
        </h2>
        {factChecks.length > 0 && (
          <span className="font-label text-xs uppercase tracking-wider text-primary-container/60">
            {factChecks.length} verificações
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border-2 border-stone-900 bg-surface p-6 glossy-finish animate-pulse"
            >
              <div className="h-5 bg-stone-300 rounded w-3/4 mb-3" />
              <div className="h-4 bg-stone-300 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : factChecks.length === 0 ? (
        <p className="font-body text-on-surface-variant">
          Nenhuma verificação do Polígrafo encontrada para este deputado.
        </p>
      ) : (
        <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
          {factChecks.map((factCheck) => (
            <a
              key={factCheck.id}
              href={factCheck.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border-2 border-stone-900 bg-surface p-6 glossy-finish hover:bg-surface-container transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-body text-on-surface text-lg font-medium leading-snug mb-3">
                    {factCheck.title}
                  </h3>
                  {factCheck.lead && (
                    <p className="font-body text-on-surface-variant text-base leading-relaxed mb-3 line-clamp-3">
                      {factCheck.lead}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    {factCheck.truthLevel && (
                      <span
                        className={`font-label text-sm uppercase tracking-wider text-white px-3 py-1 border border-stone-900 ${truthLevelMap(factCheck.truthLevel).color}`}
                      >
                        {truthLevelMap(factCheck.truthLevel).label}
                      </span>
                    )}
                    {factCheck.createdAt && (
                      <span className="font-label text-sm uppercase tracking-wider text-on-surface-variant">
                        {formatDate(factCheck.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </ProfileSection>
  );
}
