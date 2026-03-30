"use client";

import { useState, useEffect } from "react";
import { PREMIUM_ICON } from "@/lib/premium";

interface PremiumPopupProps {
  /** Called after the exit animation finishes — use to unmount the popup. */
  onClose: () => void;
  /** Called when the user taps the primary CTA. */
  onUpgrade: () => void;
}

const POPUP_BENEFITS = [
  { icon: "🔥", label: "Treinos personalizados" },
  { icon: "🍽️", label: "Plano alimentar completo" },
  { icon: "📊", label: "Acompanhamento avançado" },
  { icon: "⚡", label: "Resultados mais rápidos" },
];

/**
 * Auto-shown daily conversion popup.
 *
 * Animation flow:
 *   mount   → `.animate-popup-enter`  (spring scale + fade in)
 *   dismiss → `.animate-popup-exit`   (scale + fade out, then onClose fires)
 */
export default function PremiumPopup({ onClose, onUpgrade }: PremiumPopupProps) {
  const [closing, setClosing] = useState(false);

  // Trigger enter animation on the next frame so it always plays.
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  function dismiss() {
    setClosing(true);
    setTimeout(onClose, 240); // matches popup-exit duration
  }

  function handleUpgrade() {
    setClosing(true);
    setTimeout(onUpgrade, 240);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-5">
      {/* Backdrop — fades with the card */}
      <div
        className={[
          "absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300",
          visible && !closing ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={dismiss}
      />

      {/* Card */}
      <div
        className={[
          "relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl",
          visible && !closing ? "animate-popup-enter" : closing ? "animate-popup-exit" : "opacity-0",
        ].join(" ")}
        style={{
          background: "linear-gradient(160deg, #1A1A1A 0%, #111111 60%, #1A0A08 100%)",
          border: "1px solid rgba(230,57,70,0.25)",
          boxShadow: "0 0 40px rgba(230,57,70,0.18), 0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Top glow stripe */}
        <div
          className="h-0.5 w-full"
          style={{ background: "linear-gradient(90deg, transparent 0%, #E63946 40%, #FF8C42 60%, transparent 100%)" }}
        />

        <div className="px-6 pt-6 pb-7 flex flex-col items-center text-center gap-5">

          {/* Premium icon with warm glow */}
          <div
            className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #2A1A10 0%, #1E1208 100%)",
              boxShadow: "0 0 24px rgba(255,150,50,0.4), 0 0 6px rgba(255,150,50,0.2)",
              border: "1px solid rgba(255,150,50,0.25)",
            }}
          >
            <img
              src={PREMIUM_ICON}
              alt="Premium"
              className="w-[88%] h-[88%] object-contain"
              draggable={false}
            />
          </div>

          {/* Headline */}
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-text-primary leading-tight">
              Libere o Premium 🚀
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Desbloqueie todas as funcionalidades e evolua mais rápido
            </p>
          </div>

          {/* Benefits list */}
          <div className="w-full space-y-2.5">
            {POPUP_BENEFITS.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                  style={{ background: "rgba(230,57,70,0.12)", border: "1px solid rgba(230,57,70,0.2)" }}
                >
                  {icon}
                </div>
                <span className="text-sm font-medium text-text-secondary text-left">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="w-full space-y-2.5 pt-1">
            <button
              onClick={handleUpgrade}
              className="w-full py-4 rounded-2xl text-white text-sm font-black tracking-wide active:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(135deg, #E63946 0%, #FF6B35 100%)",
                boxShadow: "0 0 20px rgba(230,57,70,0.35), 0 4px 16px rgba(0,0,0,0.3)",
              }}
            >
              Quero desbloquear agora
            </button>
            <button
              onClick={dismiss}
              className="w-full py-2.5 text-xs text-text-muted font-medium active:opacity-60 transition-opacity"
            >
              Agora não
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
