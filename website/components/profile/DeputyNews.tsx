"use client";

import { useEffect, useState } from "react";
import ProfileSection from "./ProfileSection";

interface Article {
  id: number;
  deputyId: number;
  title: string;
  url: string;
  section: string | null;
  publishedAt: string | null;
  authors: string | null;
  lead: string | null;
  hasPicture: boolean;
  source: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DeputyNewsProps {
  deputyId: number;
}

export default function DeputyNews({ deputyId }: DeputyNewsProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/deputy/${deputyId}/news`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setArticles(data.articles || []);
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

  const sourceLabel = (source: string | null) => {
    if (!source) return null;
    const labels: Record<string, string> = {
      expresso: "Expresso",
      publico: "Público",
      observador: "Observador",
    };
    return labels[source.toLowerCase()] || source;
  };

  return (
    <ProfileSection variant="secondary" className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-headline text-2xl font-semibold text-primary-container uppercase tracking-wider">
          Notícias
        </h2>
        {articles.length > 0 && (
          <span className="font-label text-xs uppercase tracking-wider text-primary-container/60">
            {articles.length} notícias
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-6">
          {["a", "b", "c", "d"].map((id) => (
            <div
              key={`skeleton-${id}`}
              className="border-2 border-stone-900 bg-surface p-6 glossy-finish animate-pulse"
            >
              <div className="h-5 bg-stone-300 rounded w-3/4 mb-3" />
              <div className="h-4 bg-stone-300 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <p className="font-body text-on-surface-variant">
          Nenhuma notícia encontrada para este deputado.
        </p>
      ) : (
        <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
          {articles.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border-2 border-stone-900 bg-surface p-6 glossy-finish hover:bg-surface-container transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-body text-on-surface text-lg font-medium leading-snug mb-3">
                    {article.title}
                  </h3>
                  {article.lead && (
                    <p className="font-body text-on-surface-variant text-base leading-relaxed mb-3 line-clamp-2">
                      {article.lead}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    {article.source && (
                      <span className="font-label text-sm uppercase tracking-wider bg-primary-container text-on-primary-container px-3 py-1 border border-stone-900">
                        {sourceLabel(article.source)}
                      </span>
                    )}
                    {article.section && (
                      <span className="font-label text-sm uppercase tracking-wider text-on-surface-variant">
                        {article.section}
                      </span>
                    )}
                    {article.publishedAt && (
                      <span className="font-label text-sm uppercase tracking-wider text-on-surface-variant">
                        {formatDate(article.publishedAt)}
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
