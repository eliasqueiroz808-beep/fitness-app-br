"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import AssistantScreen from "@/components/assistant/AssistantScreen";
import AssistantLockScreen from "@/components/assistant/AssistantLockScreen";
import PremiumCard from "@/components/premium/PremiumCard";
import { loadPremium, activatePremiumMock, type PremiumState } from "@/lib/premium";
import { useRouter } from "next/navigation";

export default function AssistantPage() {
  const [premium,         setPremium]         = useState<PremiumState>({ isPremium: false, activatedAt: null });
  const [showPremiumCard, setShowPremiumCard] = useState(false);
  const [mounted,         setMounted]         = useState(false);
  const router = useRouter();

  useEffect(() => {
    setPremium(loadPremium());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AppShell>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section
        className="px-4 pt-10 pb-4 flex items-center gap-3 border-b border-dark-border"
        style={{ background: "linear-gradient(180deg, rgba(230,57,70,0.04) 0%, transparent 100%)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{
            background: "linear-gradient(135deg, #1A0A08 0%, #2A1010 100%)",
            border: "1px solid rgba(230,57,70,0.35)",
          }}
        >
          🤖
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-black text-text-primary tracking-tight">Assistente IA</h1>
          <p className="text-[11px] text-text-muted">Bem-estar, rotina e sugestões de produtos</p>
        </div>
        {premium.isPremium && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(230,57,70,0.15)", color: "#E63946" }}
          >
            PREMIUM
          </span>
        )}
      </section>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col" style={{ height: "calc(100vh - 180px)" }}>
        {premium.isPremium ? (
          <AssistantScreen />
        ) : (
          <AssistantLockScreen
            onUnlock={() => setShowPremiumCard(true)}
            onDismiss={() => router.back()}
          />
        )}
      </div>

      {/* ── Premium Card modal ──────────────────────────────────────────── */}
      {showPremiumCard && (
        <PremiumCard
          state={premium}
          onActivate={() => {
            setPremium(activatePremiumMock());
            setShowPremiumCard(false);
          }}
          onClose={() => setShowPremiumCard(false)}
        />
      )}
    </AppShell>
  );
}
