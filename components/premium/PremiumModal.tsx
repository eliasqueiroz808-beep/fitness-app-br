"use client";

import { PREMIUM_ICON } from "@/lib/premium";

interface PremiumModalProps {
  /** Called when the user taps the primary CTA — opens the full plan card. */
  onUpgrade: () => void;
  onClose: () => void;
}

const QUICK_BENEFITS = [
  "Recursos extras e ferramentas avançadas",
  "Vantagens na loja integrada",
  "Acesso a funções especiais do app",
];

/**
 * Light-weight upgrade prompt.
 * Shown when a free user taps a locked feature.
 * Intentionally simpler than PremiumCard — just enough to motivate the click.
 */
export default function PremiumModal({ onUpgrade, onClose }: PremiumModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col items-center text-center gap-5">

          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #2A1A10 0%, #1E1208 100%)",
              boxShadow: "0 0 18px rgba(255,150,50,0.35)",
              border: "1px solid rgba(255,150,50,0.22)",
            }}
          >
            <img src={PREMIUM_ICON} alt="Premium" className="w-[88%] h-[88%] object-contain" draggable={false} />
          </div>

          {/* Copy */}
          <div>
            <h3 className="text-xl font-black text-text-primary">
              Desbloqueie funções exclusivas
            </h3>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              Assine o plano mensal e tenha acesso a recursos premium dentro do aplicativo
            </p>
          </div>

          {/* Quick benefit list */}
          <div className="w-full space-y-2.5">
            {QUICK_BENEFITS.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2.5 text-left">
                <div className="w-5 h-5 rounded-full bg-brand-red/20 flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    className="w-3 h-3 text-brand-red"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-sm text-text-secondary">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="w-full space-y-2 mt-1">
            <button
              onClick={onUpgrade}
              className="w-full py-3.5 rounded-2xl gradient-red text-white text-sm font-bold shadow-lg active:opacity-90 transition-opacity"
            >
              Quero liberar
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl text-text-muted text-sm font-medium active:opacity-70 transition-opacity"
            >
              Agora não
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
