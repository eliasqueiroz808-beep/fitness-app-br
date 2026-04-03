"use client";

import { useEffect, useRef } from "react";
import type { InstallState, InstallPlatform } from "@/hooks/useInstallAppFlow";

interface InstallSheetProps {
  installState: InstallState;
  platform: InstallPlatform;
  onInstall: () => Promise<void>;
  onClose: () => void;
}

// ── iOS step guide ─────────────────────────────────────────────────────────────

function IOSGuide() {
  const steps = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      ),
      text: 'Toque no botão Compartilhar na barra do Safari',
      note: 'É o ícone de seta apontando para cima, na parte inferior',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
      text: 'Selecione "Adicionar à Tela de Início"',
      note: 'Role para baixo no menu de compartilhamento para encontrar a opção',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ),
      text: 'Toque em "Adicionar" para confirmar',
      note: 'O app aparecerá na sua tela inicial como um app nativo',
    },
  ];

  return (
    <div>
      <div className="mb-1">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: "rgba(230,57,70,0.12)", color: "#E63946" }}
        >
          Leva menos de 10 segundos
        </span>
      </div>
      <h3 className="text-xl font-black text-text-primary mt-3 leading-tight">
        Como instalar no iPhone
      </h3>
      <p className="text-sm text-text-secondary mt-1.5 mb-5">
        Siga os passos abaixo no Safari para adicionar à sua tela inicial:
      </p>

      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li
            key={i}
            className="flex gap-3.5 items-start p-3.5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(230,57,70,0.12)", color: "#E63946" }}
            >
              {step.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary leading-snug">{step.text}</p>
              <p className="text-xs text-text-muted mt-0.5 leading-snug">{step.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ── Android fallback ───────────────────────────────────────────────────────────

function AndroidFallback() {
  return (
    <div>
      <span
        className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
        style={{ background: "rgba(255,200,50,0.12)", color: "#F5C543" }}
      >
        Quase pronto
      </span>
      <h3 className="text-xl font-black text-text-primary mt-3 leading-tight">
        Instalação disponível em instantes
      </h3>
      <p className="text-sm text-text-secondary mt-2 leading-relaxed">
        Continue navegando por alguns segundos e o botão de instalação será liberado automaticamente pelo Chrome.
      </p>

      <div
        className="mt-4 rounded-2xl p-4 flex gap-3 items-start"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <span className="text-lg shrink-0">💡</span>
        <div>
          <p className="text-xs font-semibold text-text-primary">Alternativa manual</p>
          <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
            Toque no menu <strong className="text-text-secondary">⋮</strong> do Chrome e selecione <strong className="text-text-secondary">"Adicionar à tela inicial"</strong>
          </p>
        </div>
      </div>

      {/* TODO: Descomente abaixo quando o app for publicado na Play Store:
      <a
        href="https://play.google.com/store/apps/details?id=com.protocolo5"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-full py-3 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #01875F 0%, #016145 100%)" }}
      >
        Abrir na Play Store
      </a>
      */}
    </div>
  );
}

// ── Desktop fallback ───────────────────────────────────────────────────────────

function DesktopFallback() {
  return (
    <div>
      <span
        className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
        style={{ background: "rgba(230,57,70,0.12)", color: "#E63946" }}
      >
        Computador
      </span>
      <h3 className="text-xl font-black text-text-primary mt-3 leading-tight">
        Instalar no computador
      </h3>
      <p className="text-sm text-text-secondary mt-2 leading-relaxed">
        Você pode instalar este app direto pelo navegador, sem precisar da loja de apps.
      </p>

      <div
        className="mt-4 rounded-2xl p-4 space-y-3"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {[
          { browser: "Google Chrome", instruction: 'Procure o ícone ⊕ na barra de endereço e clique em "Instalar"' },
          { browser: "Microsoft Edge", instruction: 'Clique nos três pontos … e selecione "Aplicativos → Instalar este site"' },
        ].map(({ browser, instruction }) => (
          <div key={browser} className="flex gap-3">
            <span className="text-base shrink-0">🌐</span>
            <div>
              <p className="text-xs font-semibold text-text-primary">{browser}</p>
              <p className="text-xs text-text-muted mt-0.5">{instruction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Native install view ────────────────────────────────────────────────────────

function NativeInstall({
  platform,
  onInstall,
  isLoading,
}: {
  platform: InstallPlatform;
  onInstall: () => void;
  isLoading: boolean;
}) {
  const copy = {
    android: {
      tag: "Android · Chrome",
      title: "Instale o app e acesse seu plano mais rápido",
      body: "Adicione este app à tela inicial para abrir com um toque, receber notificações e acompanhar seu plano com mais praticidade.",
      sub: "Sem precisar baixar pela loja.",
      btn: "Instalar app",
    },
    desktop: {
      tag: "Computador",
      title: "Instale o app e acesse seu plano mais rápido",
      body: "Adicione este app à sua área de trabalho para abrir com um clique e ter acesso completo ao seu plano de treino e nutrição.",
      sub: "Instalação rápida, direto pelo navegador.",
      btn: "Instalar no computador",
    },
    ios: {
      tag: "iPhone · Safari",
      title: "Instale o app e acesse seu plano mais rápido",
      body: "Adicione à sua tela inicial para abrir com um toque e ter a experiência completa do app.",
      sub: "Leva menos de 10 segundos.",
      btn: "Ver como instalar",
    },
  }[platform];

  return (
    <div>
      <span
        className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
        style={{ background: "rgba(230,57,70,0.12)", color: "#E63946" }}
      >
        {copy.tag}
      </span>

      <h3 className="text-xl font-black text-text-primary mt-3 leading-tight">
        {copy.title}
      </h3>
      <p className="text-sm text-text-secondary mt-2 leading-relaxed">{copy.body}</p>

      <ul className="mt-4 space-y-2">
        {["Acesso com um toque, sem abrir o navegador", "Notificações e lembretes de treino", "Experiência de app nativo"].map((b) => (
          <li key={b} className="flex items-center gap-2.5">
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(230,57,70,0.15)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#E63946" strokeWidth={3} className="w-2.5 h-2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </span>
            <span className="text-xs text-text-secondary">{b}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onInstall}
        disabled={isLoading}
        className="mt-5 w-full py-4 rounded-2xl text-white text-sm font-black tracking-wide shadow-lg active:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #E63946 0%, #c02535 100%)" }}
      >
        {isLoading ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Instalando…
          </>
        ) : copy.btn}
      </button>
      <p className="text-center text-xs text-text-muted mt-2">{copy.sub}</p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function InstallSheet({ installState, platform, onInstall, onClose }: InstallSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const isLoading = installState === "prompting";

  // Slide-up on mount
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

  const showContent = () => {
    switch (installState) {
      case "fallback_ios":     return <IOSGuide />;
      case "fallback_android": return <AndroidFallback />;
      case "fallback_desktop": return <DesktopFallback />;
      default:
        return (
          <NativeInstall
            platform={platform}
            onInstall={onInstall}
            isLoading={isLoading}
          />
        );
    }
  };

  const isFallback = installState.startsWith("fallback_");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative w-full max-w-md rounded-t-3xl shadow-2xl"
        style={{
          background: "linear-gradient(170deg, #1C1C1C 0%, #111111 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "none",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
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

        {/* Content */}
        <div className="px-6 pt-2 pb-8">
          {showContent()}

          {/* Secondary close button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="mt-3 w-full py-3 rounded-2xl text-text-muted text-sm font-medium active:opacity-70 transition-opacity disabled:opacity-40"
          >
            {isFallback ? "Entendido" : "Continuar no navegador"}
          </button>
        </div>
      </div>
    </div>
  );
}
