"use client";

import { useState } from "react";
import {
  PREMIUM_BENEFITS,
  PREMIUM_PRICE,
  PREMIUM_PERIOD,
  type PremiumState,
} from "@/lib/premium";
import { getUserRef } from "@/lib/user-ref";

interface PremiumCardProps {
  state: PremiumState;
  onClose: () => void;
}

export default function PremiumCard({ state, onClose }: PremiumCardProps) {
  const { isPremium } = state;
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    try {
      const userRef = getUserRef();
      const res     = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userRef }),
      });
      const data = await res.json();

      if (!res.ok || !data.init_point) {
        const msg = data.details
          ? `${data.error}: ${data.details}`
          : (data.error ?? "Erro ao iniciar pagamento");
        throw new Error(msg);
      }

      // Redirect to Mercado Pago checkout — premium is only unlocked after webhook confirms
      window.location.href = data.init_point;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao conectar com o servidor");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-t-3xl max-h-[90vh] overflow-y-auto">

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-dark-muted" />
        </div>

        {/* Sticky header */}
        <div className="sticky top-0 bg-dark-card border-b border-dark-border px-5 pt-3 pb-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-lg font-black text-text-primary">Protocolo 5% Premium</h3>
            <p className="text-xs text-text-secondary mt-0.5">Plano mensal</p>
          </div>
          <div className="flex items-center gap-2">
            {isPremium && (
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                ✓ Ativo
              </span>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-dark-surface flex items-center justify-center active:opacity-70 transition-opacity"
              aria-label="Fechar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 text-text-secondary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-6 pb-12">

          {/* Price / status block */}
          {isPremium ? (
            <div className="rounded-2xl p-5 text-center bg-gradient-to-br from-yellow-500/15 to-amber-500/10 border border-yellow-500/30">
              <p className="text-3xl font-black text-yellow-400">👑 Premium Ativo</p>
              <p className="text-sm text-text-secondary mt-2">Acesso completo a todos os recursos</p>
            </div>
          ) : (
            <div className="rounded-2xl p-5 text-center bg-brand-red/10 border border-brand-red/25 card-glow">
              <p className="text-xs text-text-muted uppercase tracking-wide mb-2">A partir de</p>
              <div className="flex items-end justify-center gap-1">
                <span className="text-4xl font-black text-text-primary">{PREMIUM_PRICE}</span>
                <span className="text-sm text-text-muted mb-2">{PREMIUM_PERIOD}</span>
              </div>
              <p className="text-xs text-text-muted mt-1">Cancele quando quiser</p>
            </div>
          )}

          {/* Benefits list */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              {isPremium ? "Seus benefícios ativos" : "O que você vai ganhar"}
            </p>
            <div className="space-y-3">
              {PREMIUM_BENEFITS.map((b) => (
                <div key={b.id} className="flex items-start gap-3">
                  <div className={[
                    "w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0",
                    isPremium ? "bg-yellow-500/15 border border-yellow-500/20" : "bg-dark-surface",
                  ].join(" ")}>
                    <span>{isPremium ? b.icon : "🔒"}</span>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className={[
                      "text-sm font-semibold leading-tight",
                      isPremium ? "text-text-primary" : "text-text-secondary",
                    ].join(" ")}>
                      {b.title}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{b.description}</p>
                  </div>
                  {isPremium && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 text-yellow-400 mt-1 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA — only shown in free state */}
          {!isPremium && (
            <div className="space-y-2">
              {error && (
                <p className="text-xs text-brand-red text-center px-2">{error}</p>
              )}
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full py-4 rounded-2xl gradient-red text-white text-base font-black shadow-lg active:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading
                  ? "Redirecionando…"
                  : `Assinar agora — ${PREMIUM_PRICE}/mês`}
              </button>
              <p className="text-center text-xs text-text-muted">
                Você será redirecionado para o Mercado Pago
              </p>
            </div>
          )}

          {/* Management note for premium users */}
          {isPremium && (
            <div className="bg-dark-surface border border-dark-border rounded-2xl p-4 text-center">
              <p className="text-xs text-text-secondary leading-relaxed">
                Gerenciamento de assinatura disponível em breve.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
