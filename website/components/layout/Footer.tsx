import FooterLink from "./FooterLink";

export default function Footer() {
  return (
    <footer className="bg-[#F9F6F2] text-stone-900 border-t-4 border-stone-900 w-full py-8 md:py-12 px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
      <div className="flex flex-col items-center md:items-start gap-2">
        <p className="font-headline text-sm uppercase tracking-widest text-stone-600">
          © 2026 Populi.
        </p>
      </div>
      <nav className="flex flex-wrap justify-center gap-4 md:gap-8">
        <FooterLink href="/privacy">Termos de Privacidade</FooterLink>
        <FooterLink href="/faq">FAQ</FooterLink>
        <FooterLink href="/team">Equipa</FooterLink>
        <FooterLink href="/contact">Contacto</FooterLink>
      </nav>
    </footer>
  );
}
