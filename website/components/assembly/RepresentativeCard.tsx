import Image from "next/image";
import Link from "next/link";

interface RepresentativeCardProps {
  id: number;
  name: string;
  constituency: string | null;
  party: string | null;
  partyColor: string | null;
  image: string;
  description: string;
}

const partyColors: Record<string, string> = {
  PS: "bg-red-600",
  PSD: "bg-orange-500",
  CH: "bg-blue-700",
  IL: "bg-cyan-500",
  BE: "bg-rose-700",
  PCP: "bg-red-800",
  L: "bg-green-600",
  PAN: "bg-teal-500",
};

function getPartyColor(party: string | null): string {
  if (!party) return "bg-stone-400";
  return partyColors[party] || "bg-stone-400";
}

export default function RepresentativeCard({
  id,
  name,
  constituency,
  party,
  partyColor,
  image,
  description,
}: RepresentativeCardProps) {
  return (
    <Link href={`/deputy/${id}`} className="block">
      <article
        className="border-4 flex flex-col glossy-finish azulejo-crazing solid-shadow group hover:-translate-y-1 transition-transform duration-300"
      >
        <div
          className={`h-4 w-full ${getPartyColor(party)} geometric-bg border-b-2 border-stone-900`}
        />
        <div className="p-6 flex flex-col items-center flex-grow">
          <div className="w-32 h-32 border-2 border-stone-900 overflow-hidden mb-4 relative glossy-finish">
            <img
              alt={`Retrato de ${name}`}
              className="w-full h-full object-cover"
              src={image}
              width={128}
              height={128}
            />
          </div>
          <h2 className="font-headline text-xl font-semibold text-on-surface text-center mb-1">
            {name}
          </h2>
          {party && (
            <p className="font-label text-xs font-medium uppercase tracking-wider text-secondary mb-1">
              {party}
            </p>
          )}
          {constituency && (
            <p className="font-label text-xs font-medium uppercase tracking-wider text-primary mb-4">
              {constituency}
            </p>
          )}
          <p className="font-body text-on-surface-variant text-center mb-6 line-clamp-3">
            {description}
          </p>
          <span className="mt-auto inline-flex items-center justify-center border-2 border-stone-900 bg-surface text-primary w-full py-2 font-label text-xs font-medium uppercase tracking-wider glossy-finish group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
            Ver Perfil
          </span>
        </div>
      </article>
    </Link>
  );
}
