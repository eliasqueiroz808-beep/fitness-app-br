"use client";

import type { InstallPlatform } from "@/hooks/useInstallPrompt";

interface InstallFallbackModalProps {
  platform: InstallPlatform;
  onClose: () => void;
}

const CONTENT: Record<Exclude<InstallPlatform, "ios">, {
  icon: string;
  title: string;
  body: string;
  tip: string;
  // Optional: set to a URL string to show an external store button
  storeUrl?: string;
  storeLabel?: string;
}> = {
  android: {
    icon: "📱",
    title: "Instalar no Android",
    body:  "O botão de instalação será liberado automaticamente após alguns segundos de uso. Tente novamente em breve.",
    tip:   "Você também pode tocar no menu ⋮ do Chrome e selecionar \"Adicionar à tela inicial\".",
    // TODO: Adicione seu link da Play Store quando publicar o app:
    // storeUrl:   "https://play.google.com/store/apps/details?id=com.protocolo5",
    // storeLabel: "Abrir na Play Store",
  },
  desktop: {
    icon: "💻",
    title: "Instalar no computador",
    body:  "Use o Google Chrome ou Microsoft Edge para instalar este app diretamente pelo navegador.",
    tip:   "Procure pelo ícone de instalação (⊕) na barra de endereço do Chrome ou Edge e clique nele.",
  },
};

export default function InstallFallbackModal({ platform, onClose }: InstallFallbackModalProps) {
  if (platform === "ios") return null; // iOS uses inline guide inside InstallPopup

  const c = CONTENT[platform];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative w-full max-w-md rounded-t-3xl p-6 pb-8 shadow-2xl animate-slide-up"
        style={{
          background: "linear-gradient(160deg, #1C1C1C 0%, #111111 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "none",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 text-text-secondary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4"
          style={{
            background: "linear-gradient(135deg, #1E1E1E 0%, #161616 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {c.icon}
        </div>

        <h3 className="text-lg font-black text-text-primary leading-tight">{c.title}</h3>
        <p className="text-sm text-text-secondary mt-2 leading-relaxed">{c.body}</p>

        {/* Tip box */}
        <div
          className="mt-4 rounded-2xl px-4 py-3 flex gap-3 items-start"
          style={{ background: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.15)" }}
        >
          <span className="text-base shrink-0 mt-px">💡</span>
          <p className="text-xs text-text-secondary leading-relaxed">{c.tip}</p>
        </div>

        {/* Optional store button */}
        {c.storeUrl && (
          <a
            href={c.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full py-3.5 rounded-2xl text-white text-sm font-bold shadow-lg flex items-center justify-center active:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #E63946 0%, #c02535 100%)" }}
          >
            {c.storeLabel}
          </a>
        )}

        <button
          onClick={onClose}
          className="mt-3 w-full py-3 rounded-2xl text-text-muted text-sm font-medium active:opacity-70 transition-opacity"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
