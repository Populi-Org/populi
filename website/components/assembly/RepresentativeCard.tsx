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
  isSuplente?: boolean;
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
  image,
  description,
  isSuplente = false,
}: RepresentativeCardProps) {
  return (
    <Link href={`/deputy/${id}`} className="block">
      <article className="border-4 flex flex-col glossy-finish azulejo-crazing solid-shadow group hover:-translate-y-1 transition-transform duration-300">
        <div
          className={`h-4 w-full ${getPartyColor(party)} geometric-bg border-b-2 border-stone-900`}
        />
        <div className="p-6 flex flex-col items-center flex-grow">
          <div className="w-32 h-32 border-2 border-stone-900 overflow-hidden mb-4 relative glossy-finish">
            <Image
              alt={`Retrato de ${name}`}
              className="object-cover"
              src={image}
              fill
              sizes="128px"
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
          {isSuplente && (
            <span className="inline-block border-2 border-stone-900 bg-error text-white px-2 py-0.5 font-label text-[10px] font-medium uppercase tracking-wider mb-1">
              Suplente
            </span>
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
