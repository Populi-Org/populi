interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="inline-flex items-center cursor-pointer gap-3 select-none">
      <span className="font-label text-xs font-medium uppercase tracking-wider text-on-surface">
        {label}
      </span>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-surface-dim border-2 border-stone-900 peer-checked:bg-primary transition-colors" />
        <div className="absolute top-1 left-1 w-4 h-4 bg-surface border border-stone-900 transition-transform peer-checked:translate-x-5" />
      </div>
    </label>
  );
}
