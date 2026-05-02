interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <a
      className="font-headline text-sm uppercase tracking-widest text-stone-600 hover:text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary"
      href={href}
    >
      {children}
    </a>
  );
}
