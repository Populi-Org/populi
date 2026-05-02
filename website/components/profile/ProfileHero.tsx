import Image from "next/image";
import Link from "next/link";

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
    <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-2 border-stone-900">
      <div className="md:col-span-5 relative border-b-2 md:border-b-0 md:border-r-2 border-stone-900">
        <img
          alt={`Retrato de ${name}`}
          className="w-full h-64 md:h-full object-cover"
          src={image}
          width={600}
          height={800}
        />
        {partyColor && (
          <div
            className="absolute top-0 left-0 w-full h-2 geometric-bg"
            style={{ backgroundColor: partyColor }}
          />
        )}
      </div>

      <div className="md:col-span-7 bg-primary-container p-6 md:p-10 flex flex-col justify-between">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-primary-container mb-2">
            {name}
          </h1>
          <p className="font-label text-sm uppercase tracking-wider text-on-primary-container/80 mb-4">
            {fullName}
          </p>

          <div className="space-y-2 mb-6">
            {party && (
              <p className="font-label text-xs uppercase tracking-wider text-on-primary-container/70">
                <span className="font-semibold">Partido:</span> {party}
              </p>
            )}
            {constituency && (
              <p className="font-label text-xs uppercase tracking-wider text-on-primary-container/70">
                <span className="font-semibold">Circunscrição:</span>{" "}
                {constituency}
              </p>
            )}
            <p className="font-label text-xs uppercase tracking-wider text-on-primary-container/70">
              <span className="font-semibold">Legislatura:</span> {legislature}
            </p>
            {committees.length > 0 && (
              <p className="font-label text-xs uppercase tracking-wider text-on-primary-container/70">
                <span className="font-semibold">Comissões:</span>{" "}
                {committees
                  .map((c) => `${c.name}${c.role ? ` (${c.role})` : ""}`)
                  .join(", ")}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`https://www.parlamento.pt/DeputadoGP/Paginas/Biografia.aspx?BID=${fullName.replace(/\s+/g, "+")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border-2 border-stone-900 bg-surface text-primary px-6 py-3 font-label text-xs font-medium uppercase tracking-wider glossy-finish hover:bg-primary hover:text-on-primary transition-colors"
          >
            Ver Perfil Completo
          </Link>
          <Link
            href="/assembly"
            className="inline-flex items-center justify-center border-2 border-stone-900 bg-surface text-primary px-6 py-3 font-label text-xs font-medium uppercase tracking-wider glossy-finish hover:bg-primary hover:text-on-primary transition-colors"
          >
            Entrar na Assembleia
          </Link>
        </div>
      </div>
    </div>
  );
}
