"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import StreakBadge from "@/components/features/StreakBadge";
import {
  storageGet,
  storageSet,
  KEYS,
  type GeneratedPlan,
  type OnboardingData,
} from "@/lib/storage";
import { loadStreak, type StreakData } from "@/lib/streak";
import { loadAdaptation, intensityColors, type AdaptationState } from "@/lib/adaptation";
import { goalLabels, levelLabels } from "@/lib/plan-generator";
import {
  loadPremium,
  PREMIUM_BENEFITS,
  type PremiumState,
} from "@/lib/premium";
import PremiumBanner from "@/components/premium/PremiumBanner";
import PremiumModal  from "@/components/premium/PremiumModal";
import PremiumCard   from "@/components/premium/PremiumCard";
import InstallCard            from "@/components/profile/InstallCard";
import InstallSheet           from "@/components/profile/InstallSheet";
import InstallFAB             from "@/components/pwa/InstallFAB";
import InstallFallbackModal   from "@/components/pwa/InstallFallbackModal";
import { useInstallAppFlow }  from "@/hooks/useInstallAppFlow";

// ── Theme helpers (plain localStorage — NOT JSON-encoded, to match init script) ─

type Theme = "dark" | "light";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem(KEYS.THEME) as Theme) ?? "dark";
}

function persistTheme(theme: Theme): void {
  // Store as plain string so the synchronous init script in layout.tsx can read it
  localStorage.setItem(KEYS.THEME, theme);
}

// ── Image compression ──────────────────────────────────────────────────────────
// Resizes the selected image to maxSize×maxSize (center-crop) and returns a
// JPEG data-URL. Keeps the stored base64 small enough for localStorage.

function compressImage(file: File, maxSize = 150): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("canvas ctx")); return; }
        const side = Math.min(img.width, img.height);
        const sx   = (img.width  - side) / 2;
        const sy   = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, maxSize, maxSize);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const [plan,       setPlan]       = useState<GeneratedPlan | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);
  const [streak,     setStreak]     = useState<StreakData>({ current: 0, best: 0, lastActivityDate: "" });
  const [adaptation, setAdaptation] = useState<AdaptationState | null>(null);
  const [mounted,    setMounted]    = useState(false);

  // Settings state
  const [profilePhoto,   setProfilePhoto]   = useState<string | null>(null);
  const [theme,          setTheme]          = useState<Theme>("dark");
  const [notifEnabled,   setNotifEnabled]   = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showHelpModal,  setShowHelpModal]  = useState(false);

  // Premium state
  const [premium,          setPremium]          = useState<PremiumState>({ isPremium: false, activatedAt: null });
  const [showPremiumCard,  setShowPremiumCard]  = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Install flow
  const {
    platform,
    installState,
    isInstalled,
    sheetOpen,
    openSheet,
    closeSheet,
    installApp,
  } = useInstallAppFlow();

  // FAB visibility + fallback modal
  const [fabVisible,    setFabVisible]    = useState(false);
  const [fallbackOpen,  setFallbackOpen]  = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const p = storageGet<GeneratedPlan>(KEYS.PLAN);
    const o = storageGet<OnboardingData>(KEYS.ONBOARDING);
    setPlan(p);
    setOnboarding(o);
    setStreak(loadStreak());
    if (p) setAdaptation(loadAdaptation(p));

    // Load persisted settings
    setTheme(getStoredTheme());
    setNotifEnabled(storageGet<boolean>(KEYS.NOTIFICATIONS) ?? false);
    setProfilePhoto(storageGet<string>(KEYS.PROFILE_PHOTO));

    // Load premium state
    setPremium(loadPremium());

    // ── FAB smart trigger ─────────────────────────────────────────────────────
    // Rules: not installed, not dismissed in last 24h, not accepted before
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (!isStandalone && !localStorage.getItem("pwaInstalled")) {
      const dismissed = localStorage.getItem("pwaFABDismissedAt");
      const cooldownOk = !dismissed || Date.now() - Number(dismissed) > 86_400_000;

      if (cooldownOk) {
        const showFAB = () => {
          setFabVisible(true);
          // Clean up interaction listeners once FAB is shown
          document.removeEventListener("scroll",     showFAB);
          document.removeEventListener("touchstart", showFAB);
          clearTimeout(timer);
        };

        // Show after 10 seconds OR on first scroll/touch — whichever comes first
        const timer = setTimeout(showFAB, 10_000);
        document.addEventListener("scroll",     showFAB, { once: true, passive: true });
        document.addEventListener("touchstart", showFAB, { once: true, passive: true });
      }
    }

    setMounted(true);
  }, []);

  if (!mounted) return null;

  const name     = onboarding?.name   ?? "Atleta";
  const weight   = onboarding?.weight ?? 80;
  const height   = onboarding?.height ?? 175;
  const age      = onboarding?.age    ?? 25;
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const bmi      = (weight / Math.pow(height / 100, 2)).toFixed(1);
  const adaptColors = adaptation ? intensityColors[adaptation.label] : null;

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setProfilePhoto(compressed);
      storageSet(KEYS.PROFILE_PHOTO, compressed);
    } catch {
      // fail silently — keep current photo
    }
    e.target.value = ""; // allow re-selecting the same file
  }

  async function handleFABClick() {
    if (installState === "ready") {
      await installApp(); // triggers deferredPrompt.prompt() directly
      // If accepted, hide FAB permanently
      if (installState === "installed") {
        localStorage.setItem("pwaInstalled", "1");
        setFabVisible(false);
      }
    } else {
      // No native prompt — show contextual fallback modal
      setFallbackOpen(true);
    }
  }

  function handleFABDismiss() {
    setFallbackOpen(false);
    setFabVisible(false);
    localStorage.setItem("pwaFABDismissedAt", String(Date.now()));
  }

  function handleThemeToggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    persistTheme(next);
    if (next === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }

  function handleNotificationsClick() {
    // Browser doesn't support Notifications API
    if (typeof Notification === "undefined") return;

    if (Notification.permission === "granted") {
      // Permission already given — just toggle the user's preference
      const next = !notifEnabled;
      setNotifEnabled(next);
      storageSet(KEYS.NOTIFICATIONS, next);
    } else if (Notification.permission === "denied") {
      // Already denied — nothing we can do without browser settings
      return;
    } else {
      // Not yet asked — show retention modal first
      setShowNotifModal(true);
    }
  }

  async function handleRequestNotifications() {
    setShowNotifModal(false);
    if (typeof Notification === "undefined") return;
    const result  = await Notification.requestPermission();
    const granted = result === "granted";
    setNotifEnabled(granted);
    storageSet(KEYS.NOTIFICATIONS, granted);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <AppShell>

      {/* Profile Hero */}
      <section className="px-4 pt-10 pb-4">
        <div className="flex items-center gap-4">

          {/* Avatar — photo or initials fallback */}
          <div className="relative">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Foto de perfil"
                className="w-[72px] h-[72px] rounded-2xl object-cover shadow-lg"
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-2xl gradient-red flex items-center justify-center shadow-lg card-glow">
                <span className="text-2xl font-black text-white">{initials}</span>
              </div>
            )}

            {/* Edit button — triggers hidden file input */}
            <button
              onClick={() => fileInputRef.current?.click()}
              aria-label="Trocar foto de perfil"
              className="absolute -bottom-1.5 -right-1.5 w-6 h-6 gradient-red rounded-full flex items-center justify-center shadow-md border-2 border-dark-bg"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />

          <div className="flex-1">
            <h1 className="text-xl font-black text-text-primary">{name}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {plan && (
                <>
                  <Badge variant="red">{goalLabels[plan.goal]}</Badge>
                  <Badge variant="gray">{levelLabels[plan.level]}</Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Premium Banner */}
      <PremiumBanner
        state={premium}
        onOpen={() => setShowPremiumCard(true)}
      />

      {/* Streak */}
      <section className="px-4 mb-4">
        <Card glow>
          <StreakBadge streak={streak.current} best={streak.best} />
        </Card>
      </section>

      {/* Plan Summary */}
      {plan && (
        <section className="px-4 mb-4">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">
            Meu Plano
          </h2>
          <Card className="space-y-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { label: "Calorias/dia",   value: `${plan.calorieTarget} kcal` },
                { label: "Proteína/dia",   value: `${plan.proteinTarget}g` },
                { label: "Carbos/dia",     value: `${plan.carbTarget}g` },
                { label: "Gordura/dia",    value: `${plan.fatTarget}g` },
                { label: "Água/dia",       value: `${plan.waterTarget}L` },
                { label: "Treinos/semana", value: `${plan.workoutFrequency}x` },
                { label: "Passos/dia",     value: plan.stepsTarget.toLocaleString("pt-BR") },
                { label: "Dificuldade",    value: plan.workoutDifficulty },
              ].map((row) => (
                <div key={row.label}>
                  <p className="text-xs text-text-muted">{row.label}</p>
                  <p className="text-sm font-bold text-text-primary mt-0.5">{row.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      {/* Adaptive Status */}
      {adaptation && adaptColors && (
        <section className="px-4 mb-4">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">
            Sistema Adaptativo
          </h2>
          <Card>
            <div className="flex items-center gap-3">
              <div className={["w-10 h-10 rounded-xl flex items-center justify-center", adaptColors.bg].join(" ")}>
                <span className="text-xl">
                  {adaptation.label === "Reduzido" ? "📉" : adaptation.label === "Intensificado" ? "📈" : "⚖️"}
                </span>
              </div>
              <div className="flex-1">
                <p className={["text-sm font-bold", adaptColors.text].join(" ")}>{adaptation.label}</p>
                <p className="text-xs text-text-secondary">
                  {adaptation.completedThisWeek}/{plan?.workoutFrequency ?? 4} treinos esta semana
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted">Nível</p>
                <p className={["text-sm font-black", adaptColors.text].join(" ")}>
                  {Math.round(adaptation.intensityLevel * 100)}%
                </p>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-3 leading-relaxed">
              {adaptation.label === "Reduzido"
                ? "Complete mais treinos para aumentar a intensidade automaticamente."
                : adaptation.label === "Intensificado"
                ? "Excelente consistência! Treinos com carga extra ativados."
                : "Mantenha a consistencia para evoluir de nivel."}
            </p>
          </Card>
        </section>
      )}

      {/* Install App Card — renders nothing when installed or idle */}
      {!isInstalled && (
        <section className="px-4 mb-4">
          <InstallCard
            installState={installState}
            platform={platform}
            onInstall={installApp}
            onOpenSheet={openSheet}
          />
        </section>
      )}

      {/* Personal Data */}
      <section className="px-4 mb-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">
          Dados Pessoais
        </h2>
        <Card padding="none" className="divide-y divide-dark-border/50">
          {[
            { icon: "⚖️", label: "Peso atual", value: `${weight} kg` },
            { icon: "📏", label: "Altura",      value: `${height} cm` },
            { icon: "🎂", label: "Idade",       value: `${age} anos` },
            { icon: "📊", label: "IMC",         value: bmi },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="text-lg w-6 text-center">{item.icon}</span>
                <span className="text-sm text-text-primary font-medium">{item.label}</span>
              </div>
              <span className="text-sm text-text-secondary">{item.value}</span>
            </div>
          ))}
        </Card>
      </section>

      {/* Recursos Exclusivos / Benefits */}
      <section className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Recursos Exclusivos
          </h2>
          {!premium.isPremium && (
            <span className="text-[10px] font-bold text-brand-red bg-brand-red/10 px-2 py-0.5 rounded-full">
              Premium
            </span>
          )}
        </div>
        <Card padding="none" className="divide-y divide-dark-border/50">
          {PREMIUM_BENEFITS.map((b) => (
            <button
              key={b.id}
              onClick={() => { if (!premium.isPremium) setShowUpgradeModal(true); }}
              className="w-full flex items-center justify-between px-4 py-3 active:bg-dark-surface/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className={[
                  "w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0",
                  premium.isPremium ? "bg-yellow-500/15" : "bg-dark-surface",
                ].join(" ")}>
                  <span>{premium.isPremium ? b.icon : "🔒"}</span>
                </div>
                <p className={[
                  "text-sm font-medium",
                  premium.isPremium ? "text-text-primary" : "text-text-secondary",
                ].join(" ")}>
                  {b.title}
                </p>
              </div>
              {premium.isPremium ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 text-yellow-400 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-text-muted shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              )}
            </button>
          ))}
        </Card>
      </section>

      {/* Change Objective */}
      <section className="px-4 mb-4">
        <button
          onClick={() => router.push("/setup")}
          className="w-full flex items-center gap-4 px-4 py-4 bg-dark-card border border-brand-red/25 rounded-2xl active:bg-dark-surface/50 transition-colors card-glow"
        >
          <div className="w-11 h-11 rounded-xl bg-brand-red/15 border border-brand-red/30 flex items-center justify-center shrink-0">
            <span className="text-xl">🎯</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-text-primary">Alterar Objetivo</p>
            <p className="text-xs text-text-muted mt-0.5">
              {plan ? `Atual: ${goalLabels[plan.goal]}` : "Recalcular plano com novo objetivo"}
            </p>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-brand-red shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </section>

      {/* App Settings */}
      <section className="px-4 mb-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">
          App
        </h2>
        <Card padding="none" className="divide-y divide-dark-border/50">

          {/* Meu Plano / Premium */}
          <button
            onClick={() => setShowPremiumCard(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 active:bg-dark-surface/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-md overflow-hidden flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #2A1A10 0%, #1E1208 100%)",
                  boxShadow: "0 0 6px rgba(255,150,50,0.3)",
                  border: "1px solid rgba(255,150,50,0.2)",
                }}
              >
                <img
                  src="https://res.cloudinary.com/dsetxj6at/image/upload/v1774231043/%C3%ADcone_De_Bloco_Para_Seu_Projeto_PNG_%C3%ADcones_De_Projeto_Bloquear_%C3%ADcones_Bloquear_Imagem_PNG_e_Vetor_Para_Download_Gratuito_1_4_bwm1ce.png"
                  alt="Premium"
                  className="w-[88%] h-[88%] object-contain"
                  draggable={false}
                />
              </div>
              <span className="text-sm text-text-primary font-medium">Meu Plano</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={[
                "text-xs font-semibold",
                premium.isPremium ? "text-yellow-400" : "text-text-muted",
              ].join(" ")}>
                {premium.isPremium ? "Premium" : "Free"}
              </span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-text-muted">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </button>

          {/* Notifications */}
          <button
            onClick={handleNotificationsClick}
            className="w-full flex items-center justify-between px-4 py-3.5 active:bg-dark-surface/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg w-6 text-center">🔔</span>
              <span className="text-sm text-text-primary font-medium">Notificações</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={[
                "text-xs font-medium",
                notifEnabled ? "text-green-400" : "text-text-muted",
              ].join(" ")}>
                {notifEnabled ? "Ativado" : "Desativado"}
              </span>
              <div className={[
                "w-2 h-2 rounded-full shrink-0",
                notifEnabled ? "bg-green-400" : "bg-dark-muted",
              ].join(" ")} />
            </div>
          </button>

          {/* Theme */}
          <button
            onClick={handleThemeToggle}
            className="w-full flex items-center justify-between px-4 py-3.5 active:bg-dark-surface/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg w-6 text-center">{theme === "dark" ? "🌙" : "☀️"}</span>
              <span className="text-sm text-text-primary font-medium">Tema</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">{theme === "dark" ? "Escuro" : "Claro"}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-text-muted">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </button>

          {/* Help */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 active:bg-dark-surface/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg w-6 text-center">❓</span>
              <span className="text-sm text-text-primary font-medium">Ajuda</span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-text-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

        </Card>
      </section>

      {/* Shop placeholder — future integration */}
      <section className="px-4 mb-4">
        <div className="flex items-center gap-3 px-4 py-4 bg-dark-card border border-dark-border/60 rounded-2xl opacity-60">
          <div className="w-10 h-10 rounded-xl bg-dark-surface flex items-center justify-center shrink-0">
            <span className="text-xl">🛒</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-secondary">Loja</p>
            <p className="text-xs text-text-muted">Em breve: loja integrada ao app</p>
          </div>
          <span className="text-[10px] font-bold text-text-muted bg-dark-surface px-2 py-1 rounded-full">
            Em breve
          </span>
        </div>
      </section>

      <div className="px-4 pb-4 text-center">
        <p className="text-xs text-text-muted">Protocolo 5% v0.2.0 · Plano gerado em{" "}
          {plan ? new Date(plan.createdAt).toLocaleDateString("pt-BR") : "—"}
        </p>
      </div>

      {/* ── Floating install button ──────────────────────────────────────────── */}
      {fabVisible && !isInstalled && (
        <InstallFAB
          installing={installState === "prompting"}
          onClick={handleFABClick}
        />
      )}

      {/* ── FAB fallback modal (no native prompt) ────────────────────────────── */}
      {fallbackOpen && !isInstalled && (
        <InstallFallbackModal
          platform={platform}
          onDismiss={handleFABDismiss}
          onClose={() => setFallbackOpen(false)}
        />
      )}

      {/* ── Install Sheet (from card / auto-show) ────────────────────────────── */}
      {sheetOpen && !isInstalled && (
        <InstallSheet
          installState={installState}
          platform={platform}
          onInstall={installApp}
          onClose={closeSheet}
        />
      )}

      {/* ── Premium Card (full plan bottom sheet) ───────────────────────────── */}
      {showPremiumCard && (
        <PremiumCard
          state={premium}
          onClose={() => setShowPremiumCard(false)}
        />
      )}

      {/* ── Upgrade Modal (shown when tapping a locked feature) ──────────────── */}
      {showUpgradeModal && (
        <PremiumModal
          onUpgrade={() => { setShowUpgradeModal(false); setShowPremiumCard(true); }}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}

      {/* ── Notifications Modal ──────────────────────────────────────────────── */}
      {showNotifModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNotifModal(false)}
          />
          {/* Sheet */}
          <div className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-red/15 border border-brand-red/30 flex items-center justify-center">
                <span className="text-3xl">🔔</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-text-primary">Ative as notificações</h3>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                  Receba lembretes diários dos seus treinos e não perca nenhum dia da sua rotina.
                  Consistência é o fator mais importante para resultados reais — deixe o app te ajudar com isso.
                </p>
              </div>
              <div className="w-full space-y-2 mt-1">
                <button
                  onClick={handleRequestNotifications}
                  className="w-full py-3.5 rounded-2xl gradient-red text-white text-sm font-bold shadow-lg active:opacity-90 transition-opacity"
                >
                  Ativar notificações
                </button>
                <button
                  onClick={() => setShowNotifModal(false)}
                  className="w-full py-3 rounded-2xl text-text-muted text-sm font-medium active:opacity-70 transition-opacity"
                >
                  Agora não
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Help Bottom Sheet ────────────────────────────────────────────────── */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowHelpModal(false)}
          />
          {/* Sheet */}
          <div className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-t-3xl max-h-[82vh] overflow-y-auto">
            {/* Sticky header */}
            <div className="sticky top-0 bg-dark-card border-b border-dark-border px-5 py-4 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-base font-black text-text-primary">Como usar o Protocolo 5%</h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-8 h-8 rounded-full bg-dark-surface flex items-center justify-center active:opacity-70 transition-opacity"
                aria-label="Fechar ajuda"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 text-text-secondary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Help content */}
            <div className="px-5 py-5 space-y-5 pb-12">
              {[
                {
                  icon: "🏠",
                  title: "Início (Dashboard)",
                  text: "Acompanhe seu progresso diário de calorias, água e passos. Confira suas missões do dia e veja a atividade da semana. Use o card de próximo treino para ir direto ao exercício.",
                },
                {
                  icon: "💪",
                  title: "Treinos",
                  text: "Acesse treinos personalizados para seu objetivo e nível. Ao concluir um treino, sua sequência (streak) e a atividade semanal são atualizados automaticamente.",
                },
                {
                  icon: "🥗",
                  title: "Refeições",
                  text: "Veja o plano nutricional do dia com macronutrientes calculados para seu objetivo. As refeições são selecionadas de acordo com sua meta — ganho, perda ou manutenção.",
                },
                {
                  icon: "🔔",
                  title: "Notificações",
                  text: "Ative para receber lembretes diários dos seus treinos. Ajuda a manter a consistência — o fator mais importante para resultados. Você pode desativar a qualquer momento aqui.",
                },
                {
                  icon: "🌙",
                  title: "Tema",
                  text: "Alterne entre o modo escuro e o modo claro conforme sua preferência. A escolha é salva automaticamente e aplicada em todo o app na próxima abertura.",
                },
                {
                  icon: "👤",
                  title: "Perfil",
                  text: "Gerencie sua foto de perfil, preferências e visualize os dados do seu plano. Acompanhe sua sequência de treinos e o nível de intensidade adaptativo.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3.5">
                  <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{item.title}</p>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </AppShell>
  );
}
