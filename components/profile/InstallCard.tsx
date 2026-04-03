"use client";

import type { InstallState, InstallPlatform } from "@/hooks/useInstallAppFlow";

interface InstallCardProps {
  installState: InstallState;
  platform: InstallPlatform;
  onInstall: () => void;   // calls deferredPrompt.prompt() when ready
  onOpenSheet: () => void; // opens contextual guide when prompt not available
}

export default function InstallCard({
  installState,
  platform,
  onInstall,
  onOpenSheet,
}: InstallCardProps) {
  // Hide when already installed or still determining state
  if (installState === "installed" || installState === "idle") return null;

  const isLoading  = installState === "prompting";
  const hasPrompt  = installState === "ready" || isLoading; // deferredPrompt captured
  const isIOS      = installState === "ios";

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #181010 0%, #121212 100%)",
        border: "1px solid rgba(230,57,70,0.18)",
        boxShadow: "0 0 28px rgba(230,57,70,0.05)",
      }}
    >
      {/* Top accent */}
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, #E63946 50%, transparent)" }}
      />

      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #E63946 0%, #b02030 100%)",
              boxShadow: "0 0 14px rgba(230,57,70,0.28)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </div>

          {/* Copy */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-text-primary leading-tight">
              {hasPrompt
                ? "Instale o app no seu dispositivo"
                : isIOS
                ? "Adicionar à tela inicial"
                : "Instalar o app"}
            </p>
            <p className="text-xs text-text-secondary mt-0.5 leading-snug">
              {hasPrompt
                ? "Acesse seu plano com um toque, offline e sem o navegador"
                : isIOS
                ? "Leva menos de 10 segundos, sem baixar pela loja"
                : "Siga as instruções para adicionar à tela inicial"}
            </p>
          </div>

          {/* CTA */}
          {hasPrompt ? (
            /* ── Real native install button — only shown when deferredPrompt exists ── */
            <button
              onClick={onInstall}
              disabled={isLoading}
              className="shrink-0 px-3 py-2 rounded-xl text-white text-xs font-bold active:scale-95 transition-all disabled:opacity-70 flex items-center gap-1.5 min-w-[80px] justify-center"
              style={{ background: "linear-gradient(135deg, #E63946 0%, #c02535 100%)" }}
            >
              {isLoading ? (
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                "Instalar app"
              )}
            </button>
          ) : (
            /* ── Fallback button — opens contextual guide sheet ── */
            <button
              onClick={onOpenSheet}
              className="shrink-0 px-3 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#ccc",
              }}
            >
              {isIOS ? "Como instalar" : "Ver instruções"}
            </button>
          )}
        </div>

        {/* Sub-copy */}
        <p className="text-[10px] text-text-muted mt-2.5 flex items-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {hasPrompt
            ? "Sem precisar baixar pela App Store ou Play Store"
            : isIOS
            ? "Disponível no Safari · sem baixar pela App Store"
            : "Disponível no Chrome e Edge"}
        </p>
      </div>
    </div>
  );
}
