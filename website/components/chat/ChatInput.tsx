"use client";

import { Send } from "lucide-react";
import { forwardRef } from "react";

interface ChatInputProps {
  input: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  function ChatInput({ input, onChange, onSubmit, isLoading }, ref) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex gap-2 border-2 border-stone-900 bg-surface p-2 tile-bevel"
      >
        <input
          ref={ref}
          type="text"
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Pergunte sobre um deputado..."
          className="flex-1 bg-transparent outline-none font-body text-sm px-2"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-primary-container text-on-primary px-4 py-2 font-label text-xs font-medium uppercase tracking-wider border-2 border-stone-900 glossy-finish disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </form>
    );
  },
);

export default ChatInput;
