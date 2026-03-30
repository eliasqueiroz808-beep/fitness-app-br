"use client";

import { PREMIUM_ICON, type PremiumState } from "@/lib/premium";

interface PremiumBannerProps {
  state: PremiumState;
  onOpen: () => void;
}

/**
 * Horizontal banner shown in the profile page just below the hero.
 * Free  → red gradient CTA to open the plan card.
 * Premium → gold acknowledgement with a "Ver plano" link.
 */
export default function PremiumBanner({ state, onOpen }: PremiumBannerProps) {
  if (state.isPremium) {
    return (
      <button
        onClick={onOpen}
        className="mx-4 mb-4 w-[calc(100%-2rem)] flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-500/15 to-amber-500/10 border border-yellow-500/30 active:opacity-80 transition-opacity text-left"
      >
        <div className="w-9 h-9 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center shrink-0">
          <span className="text-lg">👑</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-yellow-400 leading-tight">Premium Ativo</p>
          <p className="text-xs text-text-muted truncate">Todos os recursos estão liberados</p>
        </div>
        <span className="text-xs text-yellow-400 font-semibold shrink-0 px-2.5 py-1.5 rounded-xl bg-yellow-500/15 whitespace-nowrap">
          Ver plano
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onOpen}
      className="mx-4 mb-4 w-[calc(100%-2rem)] flex items-center gap-3 px-4 py-4 rounded-2xl bg-gradient-to-r from-brand-red/15 via-dark-card to-dark-card border border-brand-red/20 active:opacity-80 transition-opacity text-left"
    >
      <div
        className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
        style={{
          background: "linear-gradient(135deg, #2A1A10 0%, #1E1208 100%)",
          boxShadow: "0 0 10px rgba(255,150,50,0.3)",
          border: "1px solid rgba(255,150,50,0.2)",
        }}
      >
        <img src={PREMIUM_ICON} alt="Premium" className="w-[88%] h-[88%] object-contain" draggable={false} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text-primary leading-tight">Libere o Premium</p>
        <p className="text-xs text-text-secondary mt-0.5 leading-snug">
          Tenha acesso a funções extras e recursos exclusivos
        </p>
      </div>
      <span className="text-xs font-bold text-brand-red shrink-0 px-2.5 py-1.5 rounded-xl bg-brand-red/15 whitespace-nowrap">
        Conhecer →
      </span>
    </button>
  );
}
