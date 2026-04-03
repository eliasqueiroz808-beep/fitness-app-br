"use client";

import { useEffect, useRef } from "react";
import type { InstallState, InstallPlatform } from "@/hooks/useInstallAppFlow";

interface InstallSheetProps {
  installState: InstallState;
  platform: InstallPlatform;
  onInstall: () => Promise<void>;
  onClose: () => void;
}

// ── iOS Guide ──────────────────────────────────────────────────────────────────

function IOSGuide({ onClose }: { onClose: () => void }) {
  const steps = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#E63946" strokeWidth={2} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      ),
      title: "Toque em Compartilhar",
      desc: "Ícone de seta na barra inferior do Safari",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#E63946" strokeWidth={2} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
      title: 'Selecione "Adicionar à Tela de Início"',
      desc: "Role para baixo no menu de compartilhamento",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#E63946" strokeWidth={2} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ),
      title: 'Toque em "Adicionar" para confirmar',
      desc: "O app aparece na tela inicial como um app nativo",
    },
  ];

  return (
    <>
      <div className="mb-3">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: "rgba(230,57,70,0.12)", color: "#E63946" }}
        >
          Leva menos de 10 segundos
        </span>
      </div>
      <h3 className="text-xl font-black text-text-primary leading-tight mb-1.5">
        Como instalar no iPhone
      </h3>
      <p className="text-sm text-text-secondary mb-5 leading-relaxed">
        Siga os passos abaixo no Safari:
      </p>

      <ol className="space-y-2.5">
        {steps.map((step, i) => (
          <li
            key={i}
            className="flex gap-3.5 items-center px-4 py-3.5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(230,57,70,0.10)" }}
            >
              {step.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary leading-snug">{step.title}</p>
              <p className="text-xs text-text-muted mt-0.5">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <button
        onClick={onClose}
        className="mt-5 w-full py-4 rounded-2xl text-white text-sm font-bold"
        style={{ background: "linear-gradient(135deg, #E63946 0%, #c02535 100%)" }}
      >
        Entendido
      </button>
    </>
  );
}

// ── Desktop/Android help ───────────────────────────────────────────────────────

function ManualGuide({ platform, onClose }: { platform: InstallPlatform; onClose: () => void }) {
  const isDesktop = platform === "desktop";
  const isAndroid = platform === "android";

  return (
    <>
      <h3 className="text-xl font-black text-text-primary leading-tight mb-2">
        {isDesktop ? "Instalar no computador" : isAndroid ? "Instalação quase pronta" : "Adicionar à tela inicial"}
      </h3>
      <p className="text-sm text-text-secondary mb-5 leading-relaxed">
        {isDesktop
          ? "Use o Google Chrome ou Edge para instalar este app direto pelo navegador."
          : isAndroid
          ? "Continue usando o app por alguns segundos e o botão de instalação será liberado automaticamente. Ou instale agora pelo menu do Chrome:"
          : "Abra este site no Chrome para Android e siga os passos abaixo."}
      </p>

      <div
        className="rounded-2xl p-4 space-y-4"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {isDesktop ? (
          <>
            <div className="flex gap-3 items-start">
              <span className="text-lg shrink-0">🌐</span>
              <div>
                <p className="text-xs font-semibold text-text-primary">Google Chrome</p>
                <p className="text-xs text-text-muted mt-0.5">Clique no ícone <strong className="text-text-secondary">⊕</strong> na barra de endereço e selecione "Instalar"</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-lg shrink-0">🌐</span>
              <div>
                <p className="text-xs font-semibold text-text-primary">Microsoft Edge</p>
                <p className="text-xs text-text-muted mt-0.5">Clique nos três pontos <strong className="text-text-secondary">…</strong> e vá em <strong className="text-text-secondary">Aplicativos → Instalar este site</strong></p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-3 items-start">
              <span className="text-lg shrink-0">⋮</span>
              <div>
                <p className="text-xs font-semibold text-text-primary">Menu do Chrome</p>
                <p className="text-xs text-text-muted mt-0.5">Toque nos três pontos no canto superior direito do Chrome</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-lg shrink-0">➕</span>
              <div>
                <p className="text-xs font-semibold text-text-primary">Adicionar à tela inicial</p>
                <p className="text-xs text-text-muted mt-0.5">Toque nessa opção para instalar o app na sua tela inicial</p>
              </div>
            </div>
          </>
        )}
      </div>

      <button
        onClick={onClose}
        className="mt-5 w-full py-4 rounded-2xl text-white text-sm font-bold"
        style={{ background: "linear-gradient(135deg, #E63946 0%, #c02535 100%)" }}
      >
        Entendido
      </button>
    </>
  );
}

// ── Native install confirmation (ready state, opened via sheet) ───────────────

function NativeInstallContent({
  platform,
  onInstall,
  isLoading,
  onClose,
}: {
  platform: InstallPlatform;
  onInstall: () => void;
  isLoading: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <h3 className="text-xl font-black text-text-primary leading-tight mb-2">
        Instale o app e acesse seu plano mais rápido
      </h3>
      <p className="text-sm text-text-secondary mb-5 leading-relaxed">
        Adicione à {platform === "desktop" ? "área de trabalho" : "tela inicial"} para abrir com um toque, receber notificações e ter acesso completo mesmo offline.
      </p>

      <button
        onClick={onInstall}
        disabled={isLoading}
        className="w-full py-4 rounded-2xl text-white text-sm font-black tracking-wide flex items-center justify-center gap-2 disabled:opacity-60 active:opacity-90 transition-opacity"
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
        ) : "Instalar app"}
      </button>

      <button
        onClick={onClose}
        disabled={isLoading}
        className="mt-2 w-full py-3 rounded-2xl text-text-muted text-sm font-medium active:opacity-70 transition-opacity"
      >
        Continuar no navegador
      </button>
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function InstallSheet({ installState, platform, onInstall, onClose }: InstallSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const isLoading = installState === "prompting";

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

  function renderContent() {
    if (installState === "ios") return <IOSGuide onClose={onClose} />;
    if (installState === "no_prompt") return <ManualGuide platform={platform} onClose={onClose} />;
    // ready or prompting
    return (
      <NativeInstallContent
        platform={platform}
        onInstall={onInstall}
        isLoading={isLoading}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={sheetRef}
        className="relative w-full max-w-md rounded-t-3xl shadow-2xl overflow-y-auto"
        style={{
          background: "linear-gradient(170deg, #1C1C1C 0%, #111111 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "none",
          maxHeight: "90vh",
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

        <div className="px-6 pt-2 pb-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
