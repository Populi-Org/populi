import Image from "next/image";

interface RepresentativeCardProps {
  name: string;
  district: string;
  description: string;
  image: string;
  accentColor: string;
}

export default function RepresentativeCard({
  name,
  district,
  description,
  image,
  accentColor,
}: RepresentativeCardProps) {
  return (
    <article className="border-4 border-stone-900 bg-surface flex flex-col glossy-finish azulejo-crazing solid-shadow group hover:-translate-y-1 transition-transform duration-300">
      <div
        className={`h-4 w-full ${accentColor} geometric-bg border-b-2 border-stone-900`}
      />
      <div className="p-6 flex flex-col items-center flex-grow">
        <div className="w-32 h-32 border-2 border-stone-900 overflow-hidden mb-4 relative glossy-finish">
          <Image
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
        <p className="font-label text-xs font-medium uppercase tracking-wider text-primary mb-4">
          {district}
        </p>
        <p className="font-body text-on-surface-variant text-center mb-6 line-clamp-3">
          {description}
        </p>
        <button
          type="button"
          className="mt-auto border-2 border-stone-900 bg-surface text-primary w-full py-2 font-label text-xs font-medium uppercase tracking-wider glossy-finish hover:bg-primary-container hover:text-on-primary transition-colors"
        >
          VER PERFIL
        </button>
      </div>
    </article>
  );
}
