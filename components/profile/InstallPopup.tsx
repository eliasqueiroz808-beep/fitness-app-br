"use client";

import { useEffect, useRef } from "react";

interface InstallPopupProps {
  installing: boolean;
  showIOSGuide: boolean;
  onInstall: () => void;
  onClose: () => void;
}

export default function InstallPopup({ installing, showIOSGuide, onInstall, onClose }: InstallPopupProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Slide-up animation on mount
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    el.style.transform = "translateY(100%)";
    el.style.opacity   = "0";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "transform 0.38s cubic-bezier(0.32,0.72,0,1), opacity 0.28s ease";
        el.style.transform  = "translateY(0)";
        el.style.opacity    = "1";
      });
    });
  }, []);

  const BENEFITS = [
    "Acesso rápido pelo celular",
    "Lembretes e notificações",
    "Mais praticidade no dia a dia",
  ];

  const IOS_STEPS = [
    { icon: "⬆️", text: 'Toque no botão "Compartilhar" na barra do Safari' },
    { icon: "➕", text: 'Role e toque em "Adicionar à Tela de Início"' },
    { icon: "✅", text: 'Toque em "Adicionar" no canto superior direito' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative w-full max-w-md rounded-t-3xl p-6 shadow-2xl"
        style={{
          background: "linear-gradient(160deg, #1A1A1A 0%, #111111 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
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
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{
            background: "linear-gradient(135deg, #E63946 0%, #b02030 100%)",
            boxShadow: "0 0 20px rgba(230,57,70,0.35)",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3.75h3" />
          </svg>
        </div>

        {showIOSGuide ? (
          /* ── iOS manual guide ── */
          <>
            <h3 className="text-lg font-black text-text-primary leading-tight">
              Instalar no iPhone
            </h3>
            <p className="text-sm text-text-secondary mt-1 mb-4">
              Siga os passos abaixo no Safari:
            </p>
            <ol className="space-y-3">
              {IOS_STEPS.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-black"
                    style={{ background: "rgba(230,57,70,0.15)", color: "#E63946" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm text-text-secondary leading-snug pt-1">
                    {step.icon} {step.text}
                  </span>
                </li>
              ))}
            </ol>
            <button
              onClick={onClose}
              className="w-full mt-5 py-3 rounded-2xl text-text-muted text-sm font-medium active:opacity-70 transition-opacity"
            >
              Entendido
            </button>
          </>
        ) : (
          /* ── Default install view ── */
          <>
            <h3 className="text-lg font-black text-text-primary leading-tight">
              Leve seu plano para o celular
            </h3>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              Instale o app e tenha acesso mais rápido ao seu plano, notificações, desafios e acompanhamento completo.
            </p>

            <ul className="mt-4 space-y-2">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-2.5">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(230,57,70,0.15)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="#E63946" strokeWidth={2.5} className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <span className="text-sm text-text-secondary">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2">
              <button
                onClick={onInstall}
                disabled={installing}
                className="w-full py-3.5 rounded-2xl text-white text-sm font-bold shadow-lg active:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #E63946 0%, #c02535 100%)" }}
              >
                {installing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Instalando…
                  </>
                ) : (
                  "Instalar app"
                )}
              </button>
              <button
                onClick={onClose}
                disabled={installing}
                className="w-full py-3 rounded-2xl text-text-muted text-sm font-medium active:opacity-70 transition-opacity disabled:opacity-40"
              >
                Continuar no navegador
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
