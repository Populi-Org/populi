"use client";

import { ExternalLink, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProfileSection from "./ProfileSection";

interface Article {
  id: number;
  code: string | null;
  title: string;
  lead: string | null;
  friendlyUri: string | null;
  link: string;
  publishedDate: string | null;
  lastModifiedDate: string | null;
  mainCategory: string | null;
  articleType: string | null;
  exclusive: number;
  authors: string | null;
  pictureUrl: string | null;
  pictureCaption: string | null;
  pictureCredits: string | null;
  domain: string | null;
  uuid: string | null;
  createdAt: string;
  matchQuality: string;
  mentionCount: number;
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

  const domainLabel = (domain: string | null) => {
    if (!domain) return null;
    const labels: Record<string, string> = {
      expresso: "Expresso",
      publico: "P\u00fablico",
    };
    return labels[domain.toLowerCase()] || domain;
  };

  const domainColor = (domain: string | null) => {
    if (!domain) return "bg-stone-200 text-stone-700";
    const colors: Record<string, string> = {
      expresso: "bg-amber-100 text-amber-800 border-amber-300",
      publico: "bg-blue-100 text-blue-800 border-blue-300",
    };
    return colors[domain.toLowerCase()] || "bg-stone-200 text-stone-700";
  };

  const matchQualityLabel = (quality: string) => {
    if (!quality) return null;
    const labels: Record<string, string> = {
      title_full: "Nome completo no t\u00edtulo",
      title_short: "Nome no t\u00edtulo",
      title_first_last: "Nome no t\u00edtulo",
      title_last: "Apelido no t\u00edtulo",
      lead_full: "Nome completo no texto",
      lead_short: "Nome no texto",
      lead_first_last: "Nome no texto",
      lead_last: "Apelido no texto",
    };
    return labels[quality] || quality;
  };

  const matchQualityColor = (quality: string) => {
    if (!quality) return "";
    if (quality.startsWith("title_")) return "text-amber-600";
    return "text-stone-500";
  };

  const stripHtml = (html: string | null) => {
    if (!html) return null;
    return html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  return (
    <ProfileSection variant="secondary" className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-headline text-2xl font-semibold text-primary-container uppercase tracking-wider">
          Not\u00edcias
        </h2>
        {articles.length > 0 && (
          <span className="font-label text-xs uppercase tracking-wider text-primary-container/60">
            {articles.length} not\u00edcias
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
          Nenhuma not\u00edcia encontrada para este deputado.
        </p>
      ) : (
        <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
          {articles.map((article) => {
            const fullUrl = article.link.startsWith("http")
              ? article.link
              : `https://expresso.pt${article.link}`;

            return (
              <a
                key={article.id}
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block border-2 border-stone-900 bg-surface p-6 glossy-finish hover:bg-surface-container transition-colors group"
              >
                {article.pictureUrl && (
                  <div className="mb-4 rounded overflow-hidden border border-stone-300">
                    <Image
                      src={article.pictureUrl}
                      alt={article.pictureCaption || article.title}
                      className="w-full h-48 object-cover"
                      width={600}
                      height={300}
                      loading="lazy"
                    />
                    {article.pictureCaption && (
                      <p className="text-xs text-stone-500 p-2 bg-stone-50 italic">
                        {article.pictureCaption}
                        {article.pictureCredits && (
                          <span className="ml-1">
                            ({article.pictureCredits})
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {article.exclusive === 1 && (
                        <span className="inline-flex items-center gap-1 font-label text-xs uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 border border-amber-400">
                          <Star size={12} />
                          Exclusivo
                        </span>
                      )}
                      {article.domain && (
                        <span
                          className={`font-label text-sm uppercase tracking-wider px-3 py-1 border ${domainColor(article.domain)}`}
                        >
                          {domainLabel(article.domain)}
                        </span>
                      )}
                      {article.mainCategory && (
                        <span className="font-label text-sm uppercase tracking-wider text-on-surface-variant">
                          {article.mainCategory}
                        </span>
                      )}
                    </div>

                    <h3 className="font-body text-on-surface text-lg font-medium leading-snug mb-3 group-hover:text-primary-container transition-colors">
                      {article.title}
                    </h3>

                    {article.lead && (
                      <p className="font-body text-on-surface-variant text-base leading-relaxed mb-3 line-clamp-2">
                        {stripHtml(article.lead)}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                      {article.authors && (
                        <span className="font-label text-sm text-on-surface-variant">
                          {article.authors}
                        </span>
                      )}
                      {article.publishedDate && (
                        <span className="font-label text-sm text-on-surface-variant">
                          {formatDate(article.publishedDate)}
                        </span>
                      )}
                      {article.matchQuality && (
                        <span
                          className={`font-label text-xs uppercase tracking-wider ${matchQualityColor(article.matchQuality)}`}
                        >
                          {matchQualityLabel(article.matchQuality)}
                          {article.mentionCount > 1 &&
                            ` (\u00d7${article.mentionCount})`}
                        </span>
                      )}
                    </div>
                  </div>

                  <ExternalLink
                    size={18}
                    className="text-stone-400 group-hover:text-primary-container transition-colors shrink-0 mt-1"
                  />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </ProfileSection>
  );
}
