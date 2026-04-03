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

export type InstallState =
  | "idle"              // determining state
  | "prompt_available"  // beforeinstallprompt captured — can install natively
  | "prompting"         // native prompt is open
  | "installed"         // already installed / standalone
  | "fallback_ios"      // iPhone/iPad — manual guide
  | "fallback_android"  // Android but no prompt yet
  | "fallback_desktop"; // Desktop, no prompt

export type InstallPlatform = "ios" | "android" | "desktop";

export interface InstallAppFlow {
  platform: InstallPlatform;
  installState: InstallState;
  /** Show install UI — false when already installed */
  canInstall: boolean;
  isInstalled: boolean;
  sheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  /** Primary action: tries native prompt, falls back to sheet */
  installApp: () => Promise<void>;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function detectPlatform(): InstallPlatform {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
}

function checkStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useInstallAppFlow(): InstallAppFlow {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installState,   setInstallState]   = useState<InstallState>("idle");
  const [platform,       setPlatform]       = useState<InstallPlatform>("desktop");
  const [sheetOpen,      setSheetOpen]      = useState(false);

  useEffect(() => {
    const plat = detectPlatform();
    setPlatform(plat);

    if (checkStandalone()) {
      setInstallState("installed");
      return;
    }

    // Set initial fallback state based on platform (no prompt yet)
    const fallback: InstallState =
      plat === "ios" ? "fallback_ios" :
      plat === "android" ? "fallback_android" :
      "fallback_desktop";
    setInstallState(fallback);

    // Inherit a prompt captured before React mounted (in layout.tsx inline script)
    if (window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt);
      setInstallState("prompt_available");
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      const evt = e as BeforeInstallPromptEvent;
      window.deferredPrompt = evt;
      setDeferredPrompt(evt);
      setInstallState("prompt_available");
    };

    const onInstalled = () => {
      setInstallState("installed");
      setSheetOpen(false);
      setDeferredPrompt(null);
      window.deferredPrompt = undefined;
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const installApp = useCallback(async () => {
    if (installState === "prompting" || installState === "installed") return;

    if (deferredPrompt) {
      setInstallState("prompting");
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setInstallState("installed");
          setSheetOpen(false);
          setDeferredPrompt(null);
          window.deferredPrompt = undefined;
        } else {
          setInstallState("prompt_available");
        }
      } catch {
        setInstallState("prompt_available");
      }
    } else {
      // No native prompt — open the contextual sheet
      setSheetOpen(true);
    }
  }, [deferredPrompt, installState]);

  const isInstalled = installState === "installed";

  return {
    platform,
    installState,
    canInstall:  !isInstalled,
    isInstalled,
    sheetOpen,
    openSheet:  () => setSheetOpen(true),
    closeSheet: () => setSheetOpen(false),
    installApp,
  };
}
