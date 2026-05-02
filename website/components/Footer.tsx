export default function Footer() {
  return (
    <footer className="bg-[#F9F6F2] text-stone-900 border-t-4 border-stone-900 w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex flex-col items-center md:items-start gap-2">
        <div className="font-headline font-bold text-lg text-stone-900">
          Azulejo Político
        </div>
        <p className="font-headline text-sm uppercase tracking-widest text-stone-600">
          © 2026 Azulejo Político. Construindo o Mosaico Cívico peça por peça.
        </p>
      </div>
      <nav className="flex gap-8">
        <a
          className="font-headline text-sm uppercase tracking-widest text-stone-600 hover:text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          href="/tradition"
        >
          A Tradição
        </a>
        <a
          className="font-headline text-sm uppercase tracking-widest text-stone-600 hover:text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          href="/grout-rules"
        >
          Regras do Reboco
        </a>
        <a
          className="font-headline text-sm uppercase tracking-widest text-stone-600 hover:text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          href="/privacy"
        >
          Azulejo de Privacidade
        </a>
        <a
          className="font-headline text-sm uppercase tracking-widest text-stone-600 hover:text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          href="/contact"
        >
          Contacto
        </a>
      </nav>
    </footer>
  );
}
