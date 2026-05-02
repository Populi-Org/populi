import Link from "next/link";

export default function TownHallBanner() {
  return (
    <div className="bg-primary-container text-on-primary p-6 border-2 border-[#2F2F2F] tile-bevel crazing-overlay flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
          <span className="text-2xl">&#9832;</span>
        </div>
        <div>
          <h4 className="font-headline font-bold text-lg uppercase tracking-tight">
            Sessão da Assembleia Ativa
          </h4>
          <p className="text-sm opacity-80">
            Junte-se ao debate ao vivo e faça ouvir a sua voz.
          </p>
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-0 bg-primary translate-x-1.5 translate-y-1.5 opacity-40" />
        <Link
          href="/assembly"
          className="relative z-10 bg-surface-container-low text-primary font-headline font-bold uppercase px-8 py-3 border-2 border-primary-container shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all active:translate-y-px"
        >
          Entrar na Assembleia
        </Link>
      </div>
    </div>
  );
}
