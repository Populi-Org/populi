import Image from "next/image";
import HeaderLink from "./HeaderLink";

export default function Header() {
  return (
    <header className="bg-[#F9F6F0] font-headline text-lg tracking-tight sticky top-0 w-full z-50 border-b-4 border-stone-900 glossy-finish flex justify-between items-center px-8 py-4">
      <a href="/" className="flex items-center">
        <Image src="/logo.svg" alt="Populi" width={120} height={40} priority />
      </a>
      <nav className="hidden md:flex items-center gap-6">
        <HeaderLink href="/">Página Inicial</HeaderLink>
        <HeaderLink href="/assembly">Assembleia</HeaderLink>
        <HeaderLink href="/debate">Debate</HeaderLink>
        <HeaderLink href="/arquivo">Arquivo</HeaderLink>
      </nav>
    </header>
  );
}
