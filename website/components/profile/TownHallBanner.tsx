import Link from "next/link";
import ProfileSection from "./ProfileSection";

export default function TownHallBanner() {
  return (
    <ProfileSection variant="primary" className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-headline text-lg font-semibold text-on-primary-container mb-1">
            Sessão da Assembleia Ativa
          </h3>
          <p className="font-body text-sm text-on-primary-container/80">
            Junte-se ao debate ao vivo e faça ouvir a sua voz.
          </p>
        </div>
        <Link
          href="/assembly"
          className="inline-flex items-center justify-center border-2 border-stone-900 bg-surface text-primary px-6 py-3 font-label text-xs font-medium uppercase tracking-wider glossy-finish hover:bg-primary hover:text-on-primary transition-colors whitespace-nowrap"
        >
          Entrar na Assembleia
        </Link>
      </div>
    </ProfileSection>
  );
}
