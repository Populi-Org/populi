"use client";

interface ClearChatDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ClearChatDialog({
  isOpen,
  onConfirm,
  onCancel,
}: ClearChatDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface border-4 border-stone-900 p-6 max-w-sm w-full mx-4 tile-bevel crazing-overlay">
        <h3 className="font-headline text-xl font-bold text-primary mb-4">
          Limpar Conversa
        </h3>
        <p className="font-body text-on-surface-variant mb-6">
          Tem a certeza que pretende apagar toda a conversa? Esta ação não pode
          ser desfeita.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border-2 border-stone-900 bg-surface font-label text-xs font-medium uppercase tracking-wider hover:bg-surface-container transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 border-2 border-stone-900 bg-primary-container text-on-primary font-label text-xs font-medium uppercase tracking-wider hover:bg-primary transition-colors"
          >
            Sim, Apagar
          </button>
        </div>
      </div>
    </div>
  );
}
