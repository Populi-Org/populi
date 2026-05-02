interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function FilterChip({
  label,
  active = false,
  onClick,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-2 border-stone-900 px-3 py-1 font-label text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors ${
        active
          ? "bg-primary-container text-on-primary"
          : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
      }`}
    >
      {label}
    </button>
  );
}
