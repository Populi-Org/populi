import Image from "next/image";

const partyColors: Record<string, string> = {
  PS: "#dc2626",
  PSD: "#f97316",
  CH: "#1d4ed8",
  IL: "#06b6d4",
  BE: "#be123c",
  PCP: "#991b1b",
  L: "#16a34a",
  PAN: "#14b8a6",
};

function getPartyColor(party: string | null): string | null {
  if (!party) return null;
  return partyColors[party] || null;
}

interface ProfileHeroProps {
  name: string;
  fullName: string;
  party: string | null;
  constituency: string | null;
  legislature: string;
  image: string;
  committees: { name: string | null; role: string | null }[];
}

export default function ProfileHero({
  name,
  fullName,
  party,
  constituency,
  legislature,
  image,
  committees,
}: ProfileHeroProps) {
  const partyColor = getPartyColor(party);

  return (
    <div className="relative p-6 border-2 border-[#2F2F2F] bg-surface-container tile-bevel crazing-overlay flex flex-col md:flex-row gap-8 overflow-hidden">
      <div className="absolute inset-0 azulejo-border opacity-20 pointer-events-none" />

      <div className="relative w-full md:w-1/2 aspect-[4/5] flex-shrink-0">
        <div className="absolute inset-0 bg-primary translate-x-2 translate-y-2" />
        <div
          className="relative z-10 w-full h-full border-4 border-[#2F2F2F] shadow-lg overflow-hidden"
          style={{ backgroundColor: partyColor || "var(--secondary)" }}
        >
          <img
            alt={`Retrato de ${name}`}
            className="w-full h-full object-cover grayscale brightness-90 contrast-110"
            src={image}
            width={600}
            height={750}
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-col justify-center gap-6">
        <div className="relative self-start">
          <div className="absolute inset-0 bg-primary translate-x-1 translate-y-1" />
          <span className="relative z-10 block font-label text-xs font-bold uppercase tracking-wider text-on-secondary-fixed-variant bg-secondary-fixed px-3 py-1 border border-secondary shadow-sm">
            PERFIL DO DEPUTADO
          </span>
        </div>

        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary-container leading-none">
          {fullName}
        </h1>

        <div className="space-y-2">
          {party && (
            <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
              <span className="font-semibold">Partido:</span> {party}
            </p>
          )}
          {constituency && (
            <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
              <span className="font-semibold">Circunscrição:</span>{" "}
              {constituency}
            </p>
          )}
          <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
            <span className="font-semibold">Legislatura:</span> {legislature}
          </p>
          {committees.length > 0 && (
            <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
              <span className="font-semibold">Comissões:</span>{" "}
              {committees
                .map((c) => `${c.name}${c.role ? ` (${c.role})` : ""}`)
                .join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
