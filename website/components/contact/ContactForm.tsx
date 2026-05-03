"use client";

import { useState, FormEvent } from "react";
import { Loader2 } from "lucide-react";

export default function ContactForm() {
  const [subject, setSubject] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;

    setStatus("sending");

    setTimeout(() => {
      setSubject("");
      setFrom("");
      setMessage("");
      setStatus("sent");

      setTimeout(() => {
        setStatus("idle");
      }, 3500);
    }, 1500);
  };

  const isBusy = status === "sending" || status === "sent";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="flex flex-col gap-2 text-sm font-medium">
        Título da mensagem
        <input
          name="subject"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={isBusy}
          className="bg-white text-stone-900 border-2 border-stone-900 px-4 py-3 glossy-finish focus:outline-none focus:ring-2 focus:ring-white/70 disabled:opacity-50"
          placeholder="Ex: Sugestão de melhoria"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium">
        O seu email
        <input
          type="email"
          name="from"
          required
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          disabled={isBusy}
          className="bg-white text-stone-900 border-2 border-stone-900 px-4 py-3 glossy-finish focus:outline-none focus:ring-2 focus:ring-white/70 disabled:opacity-50"
          placeholder="nome@exemplo.com"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium">
        Mensagem
        <textarea
          name="message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isBusy}
          rows={5}
          className="bg-white text-stone-900 border-2 border-stone-900 px-4 py-3 glossy-finish focus:outline-none focus:ring-2 focus:ring-white/70 disabled:opacity-50"
          placeholder="Descreva a sua mensagem"
        />
      </label>
      <button
        type="submit"
        disabled={isBusy}
        className="bg-white text-primary font-headline font-bold px-6 py-3 border-2 border-stone-900 glossy-finish active:translate-y-[2px] disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2"
      >
        {status === "sending" && <Loader2 className="w-4 h-4 animate-spin" />}
        {status === "idle" && "Enviar email"}
        {status === "sending" && "A enviar..."}
        {status === "sent" && "Enviado"}
      </button>
    </form>
  );
}
