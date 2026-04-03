"use client";

import { useState, useEffect, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    deferredPrompt?: BeforeInstallPromptEvent;
  }
}

type Platform = "ios" | "android" | "desktop";

export interface InstallPromptResult {
  /** Show the install UI (not yet installed) */
  canInstall: boolean;
  /** Currently in standalone / installed mode */
  isInstalled: boolean;
  /** Install flow in progress — disable button, show spinner */
  installing: boolean;
  /** iOS manual guide should be visible */
  showIOSGuide: boolean;
  dismissIOSGuide: () => void;
  triggerInstall: () => Promise<void>;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function detectPlatform(): Platform {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
}

function isStandaloneMode(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useInstallPrompt(): InstallPromptResult {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled,    setIsInstalled]    = useState(false);
  const [installing,     setInstalling]     = useState(false);
  const [showIOSGuide,   setShowIOSGuide]   = useState(false);

  useEffect(() => {
    // Check standalone immediately
    setIsInstalled(isStandaloneMode());

    // Pick up a prompt captured before this component mounted
    if (window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt);
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      const evt = e as BeforeInstallPromptEvent;
      window.deferredPrompt = evt;
      setDeferredPrompt(evt);
    };

    const onInstalled = () => {
      setIsInstalled(true);
      window.deferredPrompt = undefined;
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    if (installing) return;
    setInstalling(true);

    try {
      if (deferredPrompt) {
        // ── Native browser install prompt (Android Chrome / Edge) ──────────────
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setIsInstalled(true);
          setDeferredPrompt(null);
          window.deferredPrompt = undefined;
        }
        return;
      }

      const platform = detectPlatform();

      if (platform === "ios") {
        // ── iOS Safari: show step-by-step guide inside popup ──────────────────
        setShowIOSGuide(true);
        return;
      }

      if (platform === "android") {
        // ── Android without native prompt → Play Store ────────────────────────
        // TODO: Replace the URL below with your published Play Store link:
        // window.open("https://play.google.com/store/apps/details?id=com.protocolo5", "_blank");
        //
        // Until the app is published, show manual instruction:
        alert(
          "Abra o Protocolo 5% no Chrome para Android,\ntoque no menu ⋮ e selecione 'Adicionar à tela inicial'."
        );
        return;
      }

      // ── Desktop (Chrome / Edge) ───────────────────────────────────────────
      alert(
        "Para instalar, abra este site no Chrome ou Edge e clique no ícone de instalação na barra de endereço."
      );
    } finally {
      setInstalling(false);
    }
  }, [deferredPrompt, installing]);

  return {
    canInstall:      !isInstalled,
    isInstalled,
    installing,
    showIOSGuide,
    dismissIOSGuide: () => setShowIOSGuide(false),
    triggerInstall,
  };
}
