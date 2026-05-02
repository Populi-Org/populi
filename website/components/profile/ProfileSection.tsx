import type { ReactNode } from "react";

interface ProfileSectionProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

export default function ProfileSection({
  children,
  className = "",
  variant = "primary",
}: ProfileSectionProps) {
  const bgColor =
    variant === "secondary" ? "bg-secondary" : "bg-primary-container";

  return (
    <section
      className={`border-2 border-stone-900 ${bgColor} glossy-finish ${className}`}
    >
      {children}
    </section>
  );
}
