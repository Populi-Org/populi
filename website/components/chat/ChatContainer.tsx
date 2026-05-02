"use client";

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { Trash2 } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ClearChatDialog from "./ClearChatDialog";

const STORAGE_KEY = "populi-chat-messages";
const MAX_MESSAGES = 50;

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as UIMessage[];
    }
  } catch {
    // ignore
  }
  return [];
}

function saveMessages(messages: UIMessage[]) {
  if (typeof window === "undefined") return;
  try {
    const toSave = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore
  }
}

export default function ChatContainer() {
  const [input, setInput] = useState("");
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const transport = useRef(
    new DefaultChatTransport({ api: "/api/chat" }),
  ).current;

  const {
    messages,
    status,
    error,
    setMessages,
    sendMessage,
    stop,
  } = useChat({
    transport,
    onError: (err) => {
      console.error("Chat error:", err);
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Load messages from localStorage on mount
  useEffect(() => {
    if (!initialMessagesLoaded) {
      const saved = loadMessages();
      console.log("[Chat] Loaded", saved.length, "messages from localStorage");
      if (saved.length > 0) {
        setMessages(saved);
      }
      setInitialMessagesLoaded(true);
    }
  }, [initialMessagesLoaded, setMessages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (initialMessagesLoaded && messages.length > 0) {
      console.log("[Chat] Saving", messages.length, "messages to localStorage");
      saveMessages(messages);
    }
  }, [messages, initialMessagesLoaded]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Debug status changes
  useEffect(() => {
    console.log("[Chat] Status changed:", status);
  }, [status]);

  // Debug errors
  useEffect(() => {
    if (error) {
      console.error("[Chat] Error:", error);
    }
  }, [error]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      console.log("[Chat] Sending message:", input);
      sendMessage({ text: input });
      setInput("");
    },
    [input, isLoading, sendMessage],
  );

  const handleClear = useCallback(() => {
    console.log("[Chat] Clearing chat");
    setMessages([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    setShowClearDialog(false);
  }, [setMessages]);

  const errorMessage = error
    ? "O serviço de chat está temporariamente indisponível. Por favor, tente mais tarde."
    : null;

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[400px] border-2 border-stone-900 bg-surface tile-bevel crazing-overlay">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-stone-900 p-3 bg-surface-container">
        <div>
          <h2 className="font-headline text-lg font-bold text-primary">
            Assistente Populi
          </h2>
          <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant">
            Pergunte sobre deputados e atividade parlamentar
          </p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setShowClearDialog(true)}
            className="flex items-center gap-1 border-2 border-stone-900 bg-surface px-3 py-1.5 font-label text-[10px] uppercase tracking-wider hover:bg-error-container hover:text-on-error transition-colors"
            title="Limpar conversa"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Limpar</span>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="font-body text-on-surface-variant text-sm">
              Bem-vindo ao Assistente Populi.
            </p>
            <p className="font-body text-on-surface-variant/70 text-sm mt-1">
              Pergunte-me sobre qualquer deputado ou atividade parlamentar.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {[
                "Quantos deputados existem em Lisboa?",
              ].map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => {
                    console.log("[Chat] Example clicked:", example);
                    setInput(example);
                  }}
                  className="border-2 border-stone-900 bg-surface px-3 py-1.5 font-label text-[10px] uppercase tracking-wider hover:bg-primary-container hover:text-on-primary transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLoading={isLoading}
            isLast={index === messages.length - 1}
          />
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-surface-container border-2 border-stone-900 p-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary-container animate-bounce" />
                <span className="w-2 h-2 bg-primary-container animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-primary-container animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="flex justify-center">
            <div className="bg-error-container border-2 border-stone-900 p-3 max-w-md">
              <p className="font-body text-sm text-on-error">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t-2 border-stone-900 p-3 bg-surface-container">
        <ChatInput
          input={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>

      <ClearChatDialog
        isOpen={showClearDialog}
        onConfirm={handleClear}
        onCancel={() => setShowClearDialog(false)}
      />
    </div>
  );
}
