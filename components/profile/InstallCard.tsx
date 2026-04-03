"use client";

interface InstallCardProps {
  installing: boolean;
  onInstall: () => void;
}

export default function InstallCard({ installing, onInstall }: InstallCardProps) {
  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1C0F10 0%, #150C0D 60%, #1A1A1A 100%)",
        border: "1px solid rgba(230,57,70,0.20)",
        boxShadow: "0 0 24px rgba(230,57,70,0.06)",
      }}
    >
      <div
        className="h-0.5 w-full"
        style={{
          background: "linear-gradient(90deg, transparent 0%, #E63946 50%, transparent 100%)",
        }}
      />

      <div className="px-4 py-4 flex items-center gap-4">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #E63946 0%, #b02030 100%)",
            boxShadow: "0 0 14px rgba(230,57,70,0.30)",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3.75h3" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-text-primary leading-tight">
            Baixe o app no seu celular
          </p>
          <p className="text-xs text-text-secondary mt-0.5 leading-snug">
            Tenha acesso rápido ao seu plano, notificações e acompanhamento sempre à mão.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={onInstall}
          disabled={installing}
          className="shrink-0 px-3 py-2 rounded-xl text-white text-xs font-bold active:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-1.5 min-w-[72px] justify-center"
          style={{ background: "linear-gradient(135deg, #E63946 0%, #c02535 100%)" }}
        >
          {installing ? (
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : (
            "Instalar"
          )}
        </button>
      </div>
    </div>
  );
}
