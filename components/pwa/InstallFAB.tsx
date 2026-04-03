"use client";

interface InstallFABProps {
  installing: boolean;
  onClick: () => void;
}

export default function InstallFAB({ installing, onClick }: InstallFABProps) {
  return (
    <button
      onClick={onClick}
      disabled={installing}
      aria-label="Instalar app"
      className="fab-enter fixed z-40 flex items-center gap-2.5 px-5 py-3.5 rounded-full text-white text-sm font-black disabled:opacity-70 active:scale-95 transition-transform"
      style={{
        bottom: "88px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "linear-gradient(135deg, #E63946 0%, #bf1f2e 100%)",
        boxShadow: "0 8px 28px rgba(230,57,70,0.45), 0 2px 8px rgba(0,0,0,0.4)",
        whiteSpace: "nowrap",
      }}
    >
      {installing ? (
        <>
          <svg className="w-4 h-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Instalando…
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} className="w-4 h-4 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Instalar App
        </>
      )}
    </button>
  );
}
