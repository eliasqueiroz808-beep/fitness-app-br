"use client";

// ─── Single chat bubble ────────────────────────────────────────────────────

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  suggestion?: string;
  groundingUsed?: boolean;  // true when Gemini used Google Search
}

interface AssistantMessageProps {
  message: ChatMessage;
}

export default function AssistantMessage({ message }: AssistantMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[78%] rounded-2xl rounded-tr-sm px-4 py-2.5"
          style={{
            background: "linear-gradient(135deg, #E63946 0%, #c0303c 100%)",
          }}
        >
          <p className="text-sm text-white leading-relaxed">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-2.5">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-base mt-0.5"
        style={{
          background: "linear-gradient(135deg, #1A0A08 0%, #2A1010 100%)",
          border: "1px solid rgba(230,57,70,0.3)",
        }}
      >
        🤖
      </div>

      {/* Bubble */}
      <div className="max-w-[78%] space-y-2">
        <div className="bg-dark-card border border-dark-border rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="text-sm text-text-primary leading-relaxed">{message.text}</p>
          {message.groundingUsed && (
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-dark-border/50">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3 h-3 text-text-muted shrink-0">
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
              <span className="text-[10px] text-text-muted">Resposta com pesquisa na web</span>
            </div>
          )}
        </div>

        {message.suggestion && (
          <div
            className="rounded-xl px-4 py-2.5 flex gap-2"
            style={{
              background: "rgba(230,57,70,0.06)",
              border: "1px solid rgba(230,57,70,0.2)",
            }}
          >
            <span className="text-brand-red text-sm shrink-0 mt-0.5">💡</span>
            <p className="text-xs text-text-secondary leading-relaxed">{message.suggestion}</p>
          </div>
        )}
      </div>
    </div>
  );
}
