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

export type InstallPlatform = "ios" | "android" | "desktop";

export interface FallbackModal {
  open: boolean;
  platform: InstallPlatform;
}

export interface InstallPromptResult {
  /** True when not yet installed — show install UI */
  canInstall: boolean;
  /** Running as installed standalone app */
  isInstalled: boolean;
  /** Native prompt is actively being shown */
  installing: boolean;
  /** Show iOS inline guide inside the popup */
  showIOSGuide: boolean;
  /** Fallback modal for Android/Desktop (no alert) */
  fallbackModal: FallbackModal;
  dismissIOSGuide: () => void;
  closeFallbackModal: () => void;
  triggerInstall: () => Promise<void>;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function detectPlatform(): InstallPlatform {
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
  const [fallbackModal,  setFallbackModal]  = useState<FallbackModal>({
    open: false,
    platform: "desktop",
  });

  useEffect(() => {
    // Detect installed state on mount
    setIsInstalled(isStandaloneMode());

    // Pick up a prompt that was captured before React mounted
    if (window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt);
    }

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const evt = e as BeforeInstallPromptEvent;
      window.deferredPrompt = evt;     // persist globally for early capture
      setDeferredPrompt(evt);
    };

    const onAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      window.deferredPrompt = undefined;
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    if (installing) return;
    setInstalling(true);

    try {
      if (deferredPrompt) {
        // ── Real native PWA install prompt ────────────────────────────────────
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setIsInstalled(true);
          setDeferredPrompt(null);
          window.deferredPrompt = undefined;
        }
        return;
      }

      // ── beforeinstallprompt not available — use contextual modal ──────────
      const platform = detectPlatform();

      if (platform === "ios") {
        // Show step-by-step guide inside the popup (no extra modal needed)
        setShowIOSGuide(true);
      } else {
        // Android without prompt OR desktop — show elegant fallback modal
        setFallbackModal({ open: true, platform });
      }
    } finally {
      setInstalling(false);
    }
  }, [deferredPrompt, installing]);

  return {
    canInstall:         !isInstalled,
    isInstalled,
    installing,
    showIOSGuide,
    fallbackModal,
    dismissIOSGuide:    () => setShowIOSGuide(false),
    closeFallbackModal: () => setFallbackModal((prev) => ({ ...prev, open: false })),
    triggerInstall,
  };
}
