// ── Premium state & data ───────────────────────────────────────────────────────
//
// All premium logic is isolated here. The rest of the app only imports from
// this module — making future billing/API integration a single-file swap.

import { storageGet, storageSet, todayISO } from "./storage";

const PREMIUM_KEY      = "fitbr_premium";
const POPUP_SHOWN_KEY  = "fitbr_premium_popup_date";

// ── Brand asset ───────────────────────────────────────────────────────────────
/** Single source for the premium icon URL — update here to change everywhere. */
export const PREMIUM_ICON =
  "https://res.cloudinary.com/dsetxj6at/image/upload/v1774231043/%C3%ADcone_De_Bloco_Para_Seu_Projeto_PNG_%C3%ADcones_De_Projeto_Bloquear_%C3%ADcones_Bloquear_Imagem_PNG_e_Vetor_Para_Download_Gratuito_1_4_bwm1ce.png";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PremiumState {
  isPremium: boolean;
  activatedAt: string | null; // ISO timestamp (null = free tier)
}

// ── Pricing (illustrative — no real charge at this stage) ─────────────────────

export const PREMIUM_PRICE  = "R$ 29,90";
export const PREMIUM_PERIOD = "/mês";

// ── Benefits catalogue ────────────────────────────────────────────────────────

export interface PremiumBenefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const PREMIUM_BENEFITS: PremiumBenefit[] = [
  {
    id: "tools",
    icon: "⚡",
    title: "Ferramentas avançadas",
    description: "Análises e métricas detalhadas do seu progresso",
  },
  {
    id: "early",
    icon: "🚀",
    title: "Acesso antecipado",
    description: "Novos recursos antes de todos os usuários",
  },
  {
    id: "shop",
    icon: "🛒",
    title: "Vantagens na loja",
    description: "Descontos e acesso exclusivo a produtos",
  },
  {
    id: "special",
    icon: "👑",
    title: "Funções especiais",
    description: "Personalização avançada e extras únicos",
  },
  {
    id: "support",
    icon: "💬",
    title: "Suporte prioritário",
    description: "Atendimento dedicado e resposta rápida",
  },
];

// ── Storage helpers ───────────────────────────────────────────────────────────

function defaultState(): PremiumState {
  return { isPremium: false, activatedAt: null };
}

export function loadPremium(): PremiumState {
  return storageGet<PremiumState>(PREMIUM_KEY) ?? defaultState();
}

/**
 * Mock activation — simulates a successful subscription locally.
 * Replace the body of this function with a real billing call when ready.
 */
export function activatePremiumMock(): PremiumState {
  const state: PremiumState = {
    isPremium: true,
    activatedAt: new Date().toISOString(),
  };
  storageSet(PREMIUM_KEY, state);
  return state;
}

export function deactivatePremium(): PremiumState {
  const state = defaultState();
  storageSet(PREMIUM_KEY, state);
  return state;
}

// ── Daily popup tracking ──────────────────────────────────────────────────────

/**
 * Returns true if the premium popup should be shown today.
 * Rule: show once per calendar day (or on first ever open).
 */
export function shouldShowPopupToday(): boolean {
  if (typeof window === "undefined") return false;
  const last = localStorage.getItem(POPUP_SHOWN_KEY);
  return last !== todayISO();
}

/** Call this as soon as the popup is displayed to prevent re-showing today. */
export function markPopupShownToday(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(POPUP_SHOWN_KEY, todayISO());
}
