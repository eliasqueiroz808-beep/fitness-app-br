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
  | "idle"       // still detecting
  | "ready"      // deferredPrompt captured → native install available RIGHT NOW
  | "prompting"  // prompt is open, waiting for user choice
  | "installed"  // standalone / already installed
  | "ios"        // iPhone/iPad — no native prompt, show manual guide
  | "no_prompt"; // Android or Desktop — browser hasn't fired event yet, hide main button

export type InstallPlatform = "ios" | "android" | "desktop";

export interface InstallAppFlow {
  platform: InstallPlatform;
  installState: InstallState;
  /** True only when deferredPrompt is captured and native install is available */
  canInstall: boolean;
  isInstalled: boolean;
  sheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  /** Triggers native prompt (when canInstall) or opens sheet (fallback) */
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

    // iOS can never fire beforeinstallprompt — set immediately
    if (plat === "ios") {
      setInstallState("ios");
    } else {
      setInstallState("no_prompt"); // Android/Desktop: wait for event
    }

    // Inherit prompt captured early in layout.tsx inline script
    if (window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt);
      setInstallState("ready");
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      const evt = e as BeforeInstallPromptEvent;
      window.deferredPrompt = evt;
      setDeferredPrompt(evt);
      setInstallState("ready");
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
      // ── Native install: open browser prompt immediately ────────────────────
      setInstallState("prompting");
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log("[PWA] Install prompt outcome:", outcome);
        if (outcome === "accepted") {
          setInstallState("installed");
          setSheetOpen(false);
          setDeferredPrompt(null);
          window.deferredPrompt = undefined;
          // Persist so FAB never shows again
          try { localStorage.setItem("pwaInstalled", "1"); } catch {}
        } else {
          // User dismissed — go back to ready so they can try again
          setInstallState("ready");
        }
      } catch {
        setInstallState("ready");
      }
      return;
    }

    // No native prompt — open contextual guide sheet
    setSheetOpen(true);
  }, [deferredPrompt, installState]);

  return {
    platform,
    installState,
    canInstall:  installState === "ready" || installState === "prompting",
    isInstalled: installState === "installed",
    sheetOpen,
    openSheet:  () => setSheetOpen(true),
    closeSheet: () => setSheetOpen(false),
    installApp,
  };
}
