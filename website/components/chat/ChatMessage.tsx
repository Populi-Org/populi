"use client";

import type { UIMessage } from "ai";

interface ChatMessageProps {
  message: UIMessage;
  isLoading?: boolean;
  isLast?: boolean;
}

function getMessageText(message: UIMessage): string {
  if (!message.parts) return "";
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function isToolCallPart(part: UIMessage["parts"][number]): boolean {
  return typeof part.type === "string" && part.type.startsWith("tool-");
}

function getToolCallNames(message: UIMessage): string[] {
  if (!message.parts) return [];
  return message.parts
    .filter(isToolCallPart)
    .map((part) => part.type.replace("tool-", ""));
}

export default function ChatMessage({ message, isLoading, isLast }: ChatMessageProps) {
  const isUser = message.role === "user";
  const text = getMessageText(message);
  const toolNames = getToolCallNames(message);

  // Only show thinking badges on the last assistant message while loading
  const showThinking =
    !isUser &&
    isLast &&
    isLoading &&
    toolNames.length > 0 &&
    text.length === 0;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[80%] space-y-1">
        {showThinking && toolNames.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {toolNames.map((name, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-primary-container text-on-primary px-2 py-0.5 font-label text-[10px] uppercase tracking-wider animate-pulse"
              >
                <span className="w-1.5 h-1.5 bg-on-primary rounded-full" />
                A chamar: {name}
              </span>
            ))}
          </div>
        )}

        <div
          className={`border-2 border-stone-900 p-3 ${
            isUser
              ? "bg-secondary-fixed text-on-secondary-fixed"
              : "bg-surface-container text-on-surface"
          }`}
        >
          <p className="font-body text-sm whitespace-pre-wrap leading-relaxed">
            {text || (isUser ? "" : isLoading && isLast ? "A pensar..." : "")}
          </p>
        </div>
      </div>
    </div>
  );
}
