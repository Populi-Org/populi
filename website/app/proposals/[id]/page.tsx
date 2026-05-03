import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getPrismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getProposal(id: number) {
  const prisma = getPrismaClient();
  return prisma.legislativeInitiative.findUnique({
    where: { id },
    include: {
      authors: { orderBy: { id: "asc" } },
      events: {
        include: { votes: { orderBy: { data: "desc" } } },
        orderBy: { dataFase: "asc" },
      },
    },
  });
}

interface VoteBlock {
  label: string;
  parties: string[];
}

function parseVoteDetail(detalhe: string | null): VoteBlock[] | null {
  if (!detalhe) return null;
  const text = detalhe.replace(/<\/?I>/gi, "").replace(/<BR\s*\/?>/gi, "\n");
  const blocks: VoteBlock[] = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^(.+?):\s*(.+)$/);
    if (match) {
      const parties = match[2]
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      blocks.push({ label: match[1].trim(), parties });
    } else {
      blocks.push({ label: "Voto", parties: [trimmed] });
    }
  }
  return blocks.length > 0 ? blocks : null;
}

function statusStyle(status: string | null) {
  if (!status) return "bg-gray-100 text-gray-800";
  if (status.includes("Aprovad")) return "bg-green-100 text-green-800";
  if (status.includes("Rejeitad")) return "bg-red-100 text-red-800";
  if (status.includes("Prejudicad")) return "bg-orange-100 text-orange-800";
  return "bg-gray-100 text-gray-800";
}

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const iniId = Number.parseInt(id, 10);
  if (Number.isNaN(iniId)) notFound();

  const initiative = await getProposal(iniId);
  if (!initiative) notFound();

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const finalVote = initiative.events
    .flatMap((e) => e.votes)
    .sort((a, b) => {
      const da = a.data ? new Date(a.data).getTime() : 0;
      const db = b.data ? new Date(b.data).getTime() : 0;
      return db - da;
    })[0];

  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-6 md:p-8 max-w-4xl mx-auto w-full">
        <Link
          href="/proposals"
          className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary mb-4 font-label text-sm uppercase tracking-wider transition-colors"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Propostas
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
              {initiative.iniDescTipo || "Proposta"}
              {initiative.iniNr ? ` ${initiative.iniNr}` : ""}
            </span>
            {finalVote?.resultado && (
              <span
                className={`text-xs font-label uppercase tracking-wide px-2 py-0.5 ${statusStyle(finalVote.resultado)}`}
              >
                {finalVote.resultado}
              </span>
            )}
          </div>
          <h1 className="font-headline text-xl md:text-2xl font-bold mb-3">
            {initiative.iniTitulo}
          </h1>

          {/* Authors */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {initiative.authors.map((a) => (
              <span
                key={a.id}
                className="font-label text-xs font-bold uppercase px-2 py-0.5 border border-stone-900 bg-surface-container-high"
              >
                {a.authorSigla || a.authorName}
              </span>
            ))}
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-on-surface-variant font-label">
            {initiative.iniLeg && <span>{initiative.iniLeg}</span>}
            {initiative.dataInicioLeg && (
              <span>{formatDate(initiative.dataInicioLeg)}</span>
            )}
            {initiative.dataFimLeg && (
              <span>→ {formatDate(initiative.dataFimLeg)}</span>
            )}
          </div>

          {initiative.iniLinkTexto && (
            <div className="mt-3">
              <a
                href={initiative.iniLinkTexto}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border-2 border-stone-900 bg-primary-container text-on-primary px-3 py-1.5 font-label text-xs uppercase tracking-wider glossy-finish hover:bg-primary transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  description
                </span>
                Ver Texto
              </a>
            </div>
          )}
        </div>

        {/* Epigrafe */}
        {initiative.iniEpigrafe && (
          <div className="mb-6 p-3 border border-stone-900 bg-surface-container-high text-sm text-on-surface-variant">
            {initiative.iniEpigrafe}
          </div>
        )}

        {/* Final vote summary */}
        {finalVote && (
          <div className="mb-6 p-4 border-2 border-stone-900 bg-surface-container glossy-finish">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`text-xs font-label uppercase tracking-wide px-2 py-0.5 ${statusStyle(finalVote.resultado)}`}
              >
                {finalVote.resultado}
              </span>
              {finalVote.data && (
                <span className="text-xs text-on-surface-variant font-label">
                  {formatDate(finalVote.data)}
                </span>
              )}
              {finalVote.unanime === "V" && (
                <span className="text-xs font-label uppercase tracking-wide text-green-700">
                  Unânime
                </span>
              )}
            </div>
            {finalVote.descricao && (
              <p className="text-sm text-on-surface-variant mb-2">
                {finalVote.descricao}
              </p>
            )}
            {(() => {
              const blocks = parseVoteDetail(finalVote.detalhe);
              if (!blocks) return null;
              return (
                <div className="space-y-2 mt-2">
                  {blocks.map((block) => (
                    <div
                      key={block.label}
                      className="flex flex-wrap items-center gap-x-2 gap-y-1"
                    >
                      <span className="text-xs font-label uppercase tracking-wide text-on-surface-variant shrink-0">
                        {block.label}:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {block.parties.map((party) => (
                          <span
                            key={party}
                            className="text-xs font-label font-semibold px-1.5 py-0.5 border border-stone-900 bg-white"
                          >
                            {party}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* Timeline */}
        <h2 className="font-headline text-lg font-bold mb-3">Cronologia</h2>
        {initiative.events.length === 0 ? (
          <p className="text-on-surface-variant text-sm">
            Sem eventos registados.
          </p>
        ) : (
          <div className="space-y-2">
            {initiative.events.map((evt) => (
              <div
                key={evt.id}
                className="flex items-start gap-3 p-3 border border-stone-900 bg-surface-container"
              >
                <div className="shrink-0 text-xs text-on-surface-variant font-label w-20 text-right pt-0.5">
                  {formatDate(evt.dataFase) || "—"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{evt.fase}</p>
                  {evt.comissao && (
                    <p className="text-xs text-on-surface-variant font-label">
                      {evt.comissao}
                    </p>
                  )}
                  {evt.votes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {evt.votes.map((vote) => (
                        <span
                          key={vote.id}
                          className={`text-xs font-label uppercase tracking-wide px-1.5 py-0.5 ${statusStyle(vote.resultado)}`}
                        >
                          {vote.resultado}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {initiative.iniObs && (
          <div className="mt-6 p-3 border border-stone-900 bg-surface-container-high">
            <p className="text-xs font-label uppercase tracking-wide text-on-surface-variant mb-1">
              Observações
            </p>
            <p className="text-sm text-on-surface-variant">
              {initiative.iniObs}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
