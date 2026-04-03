"use client";

import type { InstallState, InstallPlatform } from "@/hooks/useInstallAppFlow";

interface InstallCardProps {
  installState: InstallState;
  platform: InstallPlatform;
  onInstall: () => void;
  onOpenSheet: () => void;
}

const PLATFORM_COPY: Record<InstallPlatform, { btn: string; sub: string }> = {
  android: { btn: "Instalar app",           sub: "Sem precisar baixar pela loja" },
  ios:     { btn: "Ver como instalar",       sub: "Leva menos de 10 segundos" },
  desktop: { btn: "Instalar no computador", sub: "Direto pelo navegador" },
};

export default function InstallCard({ installState, platform, onInstall, onOpenSheet }: InstallCardProps) {
  const copy = PLATFORM_COPY[platform];

  // If prompt is available, primary action = direct install. Otherwise open sheet.
  const handleClick = () => {
    if (installState === "prompt_available") {
      onInstall();
    } else {
      onOpenSheet();
    }
  };

  const isLoading     = installState === "prompting";
  const isUnavailable = installState === "fallback_android";

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #181010 0%, #121212 100%)",
        border: "1px solid rgba(230,57,70,0.18)",
        boxShadow: "0 0 28px rgba(230,57,70,0.05)",
      }}
    >
      {/* Accent line */}
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent 0%, #E63946 50%, transparent 100%)" }}
      />

      <div className="px-4 py-4 flex items-center gap-4">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #E63946 0%, #b02030 100%)", boxShadow: "0 0 14px rgba(230,57,70,0.28)" }}
        >
          {platform === "ios" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          )}
        </div>

        {/* Copy */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-text-primary leading-tight">
            {isUnavailable ? "Quase pronto para instalar" : "Baixe o app no seu celular"}
          </p>
          <p className="text-xs text-text-secondary mt-0.5 leading-snug">
            {isUnavailable ? "Continue navegando e tente novamente em breve" : "Acesse seu plano com um toque, offline"}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="shrink-0 px-3 py-2 rounded-xl text-white text-xs font-bold active:scale-95 transition-all disabled:opacity-60 flex items-center gap-1.5 min-w-[76px] justify-center"
          style={{ background: "linear-gradient(135deg, #E63946 0%, #c02535 100%)" }}
        >
          {isLoading ? (
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : copy.btn}
        </button>
      </div>

      {/* Sub-copy */}
      <div className="px-4 pb-3 flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3 text-text-muted shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-[10px] text-text-muted">{copy.sub}</p>
      </div>
    </div>
  );
}
