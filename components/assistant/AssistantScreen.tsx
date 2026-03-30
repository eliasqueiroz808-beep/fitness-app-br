"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import AssistantMessage, { type ChatMessage } from "./AssistantMessage";
import AssistantProductCard from "./AssistantProductCard";
import { quickPrompts } from "@/lib/assistantQuickPrompts";
import type { AssistantResponse } from "@/lib/assistantLogic";

let _msgCounter = 0;
function uid() {
  return `msg_${++_msgCounter}_${Date.now()}`;
}

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Olá! Sou sua Assistente IA de bem-estar. Posso te ajudar com dicas de emagrecimento, ganho de massa, energia, sono e cuidados estéticos. Como posso te ajudar hoje?",
  suggestion: "Use as sugestões abaixo ou escreva sua pergunta.",
};

export default function AssistantScreen() {
  const [messages,  setMessages]  = useState<ChatMessage[]>([WELCOME]);
  const [responses, setResponses] = useState<AssistantResponse[]>([]);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, responses]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { id: uid(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
        cache: "no-store",
      });

      const json = await res.json();

      const replyText: string =
        res.ok && json.reply
          ? json.reply
          : "Não consegui responder agora. Tente novamente em instantes.";

      const groundingUsed: boolean = json.meta?.groundingUsed === true;

      const assistantMsg: ChatMessage = {
        id: uid(),
        role: "assistant",
        text: replyText,
        groundingUsed,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errMsg: ChatMessage = {
        id: uid(),
        role: "assistant",
        text: "Não consegui me conectar agora. Verifique sua conexão e tente novamente.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Product cards are appended after the last assistant message that has one
  // We track per-message whether a product card was shown
  const productByMsgId = responses.reduce<Record<string, AssistantResponse>>((acc, r, i) => {
    // Messages: [welcome, user1, assistant1, user2, assistant2, ...]
    // Each response aligns with assistant messages index = 1 + i*2
    const assistantMsgIndex = 1 + i * 2;
    const msg = messages[assistantMsgIndex];
    if (msg) acc[msg.id] = r;
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id}>
            <AssistantMessage message={msg} />
            {productByMsgId[msg.id]?.product && (
              <div className="mt-3 ml-10">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2 ml-1">
                  Produto Recomendado
                </p>
                <AssistantProductCard product={productByMsgId[msg.id].product!} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start gap-2.5">
            <div
              className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-base"
              style={{
                background: "linear-gradient(135deg, #1A0A08 0%, #2A1010 100%)",
                border: "1px solid rgba(230,57,70,0.3)",
              }}
            >
              🤖
            </div>
            <div className="bg-dark-card border border-dark-border rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-5">
                <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-4 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickPrompts.map((qp) => (
            <button
              key={qp.id}
              onClick={() => sendMessage(qp.message)}
              disabled={loading}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold bg-dark-card border border-dark-border text-text-secondary active:opacity-70 transition-opacity disabled:opacity-40"
              type="button"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="px-4 pb-4 pt-2 flex items-center gap-3"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte algo..."
          disabled={loading}
          className="flex-1 bg-dark-card border border-dark-border rounded-2xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-red/50 disabled:opacity-50 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 active:opacity-80 transition-all disabled:opacity-30"
          style={{
            background: "linear-gradient(135deg, #E63946 0%, #c0303c 100%)",
          }}
          aria-label="Enviar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </form>
    </div>
  );
}
