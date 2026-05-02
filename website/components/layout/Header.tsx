"use client";

import Image from "next/image";
import { useState } from "react";
import HeaderLink from "./HeaderLink";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { href: "/", label: "Página Inicial" },
    { href: "/deputados", label: "Deputados" },
    { href: "/assembleia", label: "Assembleia" },
    { href: "/chat", label: "Chat" },
  ];

  return (
    <header className="bg-[#F9F6F0] font-headline text-lg tracking-tight sticky top-0 w-full z-50 border-b-4 border-stone-900 glossy-finish flex justify-between items-center px-8 py-4 relative">
      <a href="/" className="flex items-center w-[120px] h-[40px] relative">
        <Image
          src="/logo.svg"
          alt="Populi"
          fill
          priority
          className="object-contain"
          sizes="120px"
        />
      </a>
      <nav className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <HeaderLink key={item.href} href={item.href}>
            {item.label}
          </HeaderLink>
        ))}
      </nav>
      <button
        type="button"
        className="md:hidden flex items-center justify-center w-10 h-10 border-2 border-stone-900 solid-shadow bg-white"
        aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <span className="sr-only">
          {isMenuOpen ? "Fechar menu" : "Abrir menu"}
        </span>
        <span className="flex flex-col gap-1">
          <span className="block w-5 h-[2px] bg-stone-900" />
          <span className="block w-5 h-[2px] bg-stone-900" />
          <span className="block w-5 h-[2px] bg-stone-900" />
        </span>
      </button>
      <div
        className={`absolute left-0 top-full w-full md:hidden bg-[#F9F6F0] border-b-4 border-stone-900 glossy-finish overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-2 px-8 py-4">
          {navItems.map((item) => (
            <HeaderLink
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </HeaderLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
