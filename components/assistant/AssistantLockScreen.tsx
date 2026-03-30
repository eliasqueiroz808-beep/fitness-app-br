"use client";

interface AssistantLockScreenProps {
  onUnlock: () => void;
  onDismiss: () => void;
}

const BENEFITS = [
  { icon: "⚡", text: "Respostas rápidas no app" },
  { icon: "🎯", text: "Apoio para emagrecimento, energia e estética" },
  { icon: "🛍️", text: "Sugestões de produtos da loja" },
  { icon: "👑", text: "Acesso exclusivo no plano Premium" },
];

export default function AssistantLockScreen({ onUnlock, onDismiss }: AssistantLockScreenProps) {
  return (
    <div className="flex flex-col items-center px-6 pt-12 pb-8 min-h-[70vh]">
      {/* Icon */}
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-lg"
        style={{
          background: "linear-gradient(135deg, #1A0A08 0%, #2A1010 100%)",
          border: "1px solid rgba(230,57,70,0.4)",
          boxShadow: "0 0 30px rgba(230,57,70,0.15)",
        }}
      >
        🤖
      </div>

      {/* Title */}
      <h1 className="text-2xl font-black text-text-primary text-center tracking-tight leading-tight mb-3">
        Desbloqueie sua{"\n"}Assistente IA
      </h1>

      {/* Subtitle */}
      <p className="text-sm text-text-secondary text-center leading-relaxed max-w-xs mb-8">
        Receba orientações personalizadas de bem-estar, sugestões práticas para sua rotina e
        recomendações de produtos com base no seu objetivo.
      </p>

      {/* Benefits */}
      <div className="w-full space-y-3 mb-8">
        {BENEFITS.map((b) => (
          <div
            key={b.text}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <span className="text-xl shrink-0">{b.icon}</span>
            <p className="text-sm text-text-secondary">{b.text}</p>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="w-full space-y-3">
        <button
          onClick={onUnlock}
          className="w-full py-4 rounded-2xl text-sm font-black text-white active:opacity-80 transition-opacity shadow-lg"
          style={{
            background: "linear-gradient(135deg, #E63946 0%, #c0303c 100%)",
            boxShadow: "0 4px 20px rgba(230,57,70,0.35)",
          }}
          type="button"
        >
          Quero desbloquear o Premium
        </button>

        <button
          onClick={onDismiss}
          className="w-full py-3 rounded-2xl text-sm font-semibold text-text-muted active:opacity-70 transition-opacity"
          type="button"
        >
          Talvez depois
        </button>
      </div>
    </div>
  );
}
