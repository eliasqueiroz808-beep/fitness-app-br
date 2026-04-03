"use client";

import { useEffect, useRef } from "react";
import type { InstallPlatform } from "@/hooks/useInstallAppFlow";

interface InstallFallbackModalProps {
  platform: InstallPlatform;
  onDismiss: () => void; // "Agora não" — saves cooldown to localStorage
  onClose: () => void;   // "Entendi"
}

const BENEFITS = [
  { icon: "⚡", text: "Acesso rápido — abre com 1 toque" },
  { icon: "📶", text: "Funciona offline, sem depender da rede" },
  { icon: "🔔", text: "Receba lembretes dos seus treinos" },
];

const BROWSER_STEPS: Record<Exclude<InstallPlatform, "ios">, { name: string; instruction: string }[]> = {
  android: [
    { name: "Chrome para Android", instruction: 'Toque no menu ⋮ e selecione "Adicionar à tela inicial"' },
    { name: "Samsung Internet",    instruction: 'Toque em ··· e escolha "Adicionar página a → Tela inicial"' },
  ],
  desktop: [
    { name: "Google Chrome",  instruction: 'Clique no ícone ⊕ na barra de endereço e selecione "Instalar"' },
    { name: "Microsoft Edge", instruction: 'Clique em ··· → Aplicativos → "Instalar este site como aplicativo"' },
  ],
};

const IOS_STEPS = [
  'Toque no ícone Compartilhar na barra do Safari',
  'Role e toque em "Adicionar à Tela de Início"',
  'Toque em "Adicionar" para confirmar',
];

export default function InstallFallbackModal({
  platform,
  onDismiss,
  onClose,
}: InstallFallbackModalProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    el.style.transform = "translateY(100%)";
    el.style.opacity   = "0";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "transform 0.4s cubic-bezier(0.32,0.72,0,1), opacity 0.3s ease";
        el.style.transform  = "translateY(0)";
        el.style.opacity    = "1";
      });
    });
  }, []);

  const browserSteps = platform !== "ios" ? BROWSER_STEPS[platform] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onDismiss} />

      <div
        ref={sheetRef}
        className="relative w-full max-w-md rounded-t-3xl shadow-2xl overflow-y-auto"
        style={{
          background: "linear-gradient(170deg, #1C1C1C 0%, #111111 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "none",
          maxHeight: "88vh",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.14)" }} />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 text-text-secondary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 pt-3 pb-8">
          {/* App icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg, #E63946 0%, #b02030 100%)",
              boxShadow: "0 0 22px rgba(230,57,70,0.35)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </div>

          <h3 className="text-xl font-black text-text-primary leading-tight mb-1.5">
            Instale o app no seu celular
          </h3>
          <p className="text-sm text-text-secondary mb-4 leading-relaxed">
            Adicione o Protocolo 5% à sua tela inicial para ter acesso completo ao seu plano de treino e nutrição.
          </p>

          {/* Benefits */}
          <ul className="space-y-2 mb-5">
            {BENEFITS.map((b) => (
              <li key={b.text} className="flex items-center gap-2.5">
                <span className="text-base w-5 shrink-0 text-center">{b.icon}</span>
                <span className="text-sm text-text-secondary">{b.text}</span>
              </li>
            ))}
          </ul>

          {/* Instructions */}
          <div
            className="rounded-2xl p-4 mb-5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">
              {platform === "ios" ? "Como instalar no iPhone" : "Como instalar"}
            </p>

            {platform === "ios" ? (
              <ol className="space-y-2.5">
                {IOS_STEPS.map((step, i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black"
                      style={{ background: "rgba(230,57,70,0.15)", color: "#E63946" }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-xs text-text-secondary leading-snug pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="space-y-3">
                {browserSteps!.map((s) => (
                  <div key={s.name} className="flex gap-2.5 items-start">
                    <span className="text-base shrink-0">🌐</span>
                    <div>
                      <p className="text-xs font-semibold text-text-primary">{s.name}</p>
                      <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{s.instruction}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl text-white text-sm font-bold mb-2"
            style={{ background: "linear-gradient(135deg, #E63946 0%, #c02535 100%)" }}
          >
            Entendi
          </button>
          <button
            onClick={onDismiss}
            className="w-full py-3 rounded-2xl text-text-muted text-sm font-medium active:opacity-70 transition-opacity"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}
