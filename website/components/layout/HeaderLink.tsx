"use client";

import { usePathname } from "next/navigation";

interface HeaderLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function HeaderLink({
  href,
  children,
  onClick,
}: HeaderLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const baseClasses =
    "font-medium hover:text-primary hover:bg-primary/5 transition-all duration-200 active:scale-[0.97] px-2 py-1 cursor-pointer";
  const activeClasses =
    "text-primary border-b-2 border-primary pb-1 font-bold hover:bg-primary/5 transition-all duration-200 active:scale-[0.97] cursor-pointer";
  const inactiveClasses = "text-stone-700";

  return (
    <a
      className={isActive ? activeClasses : `${baseClasses} ${inactiveClasses}`}
      href={href}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
