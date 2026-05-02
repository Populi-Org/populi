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
    variant === "secondary" ? "bg-secondary-fixed" : "bg-surface";

  return (
    <div
      className={`border-2 border-[#2F2F2F] tile-bevel crazing-overlay ${bgColor} ${className}`}
    >
      {children}
    </div>
  );
}
