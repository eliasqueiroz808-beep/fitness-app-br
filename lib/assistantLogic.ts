// ─── Local intent detection + response generation ─────────────────────────
// Replace getAssistantResponse() with a real API call when ready.

import type { AssistantProduct } from "./assistantProducts";
import { assistantProducts } from "./assistantProducts";

// ─── Intent types ──────────────────────────────────────────────────────────
export type AssistantIntent =
  | "emagrecimento"
  | "massa"
  | "energia"
  | "sono"
  | "estetica"
  | "fallback";

// ─── Response type ─────────────────────────────────────────────────────────
export interface AssistantResponse {
  intent: AssistantIntent;
  text: string;
  suggestion: string;
  product: AssistantProduct | null;
}

// ─── Keyword map ───────────────────────────────────────────────────────────
const INTENT_KEYWORDS: Record<AssistantIntent, string[]> = {
  emagrecimento: [
    "emagrec", "perder peso", "perder barriga", "barriga", "gordura",
    "queimar", "deficit", "dieta", "slim", "secar", "cortar", "definir",
  ],
  massa: [
    "ganhar massa", "massa muscular", "hipertrofia", "musculo", "bulking",
    "aumentar", "crescer", "força", "treino pesado", "proteina", "whey",
  ],
  energia: [
    "energia", "cansado", "cansaço", "disposição", "disposto", "foco",
    "concentra", "produtiv", "animado", "animo", "fatiga", "fadiga",
  ],
  sono: [
    "sono", "dormir", "insonia", "insônia", "descanso", "descansar",
    "recupera", "acordar", "qualidade do sono", "relaxar", "relaxamento",
  ],
  estetica: [
    "pele", "cabelo", "unha", "estética", "beleza", "colágeno", "colageno",
    "biotina", "hidrat", "brilho", "aparencia", "aparência",
  ],
  fallback: [],
};

// ─── Canned responses ──────────────────────────────────────────────────────
const RESPONSES: Record<AssistantIntent, Omit<AssistantResponse, "product">> = {
  emagrecimento: {
    intent: "emagrecimento",
    text:
      "Para emagrecer com saúde, o mais importante é manter um déficit calórico consistente com alimentação equilibrada e treinos regulares. Evite cortes bruscos — sustentabilidade é a chave.",
    suggestion:
      "Inclua ao menos 30 minutos de cardio 3x por semana e priorize proteínas em todas as refeições para preservar massa muscular.",
  },
  massa: {
    intent: "massa",
    text:
      "Ganhar massa exige superávit calórico, proteína suficiente (1,6–2g por kg de peso) e progressão de carga nos treinos. Consistência e descanso são tão importantes quanto o treino.",
    suggestion:
      "Foque em exercícios compostos como agachamento, supino e levantamento terra. Garanta pelo menos 8h de sono para maximizar a síntese proteica.",
  },
  energia: {
    intent: "energia",
    text:
      "Cansaço persistente pode estar ligado à falta de micronutrientes, hidratação insuficiente ou qualidade do sono. Revise sua dieta e rotina antes de buscar suplementos.",
    suggestion:
      "Beba pelo menos 2L de água por dia, evite cafeína após as 15h e inclua um multivitamínico de qualidade na sua rotina matinal.",
  },
  sono: {
    intent: "sono",
    text:
      "A qualidade do sono é fundamental para recuperação muscular, equilíbrio hormonal e saúde mental. Pequenos ajustes de rotina fazem grande diferença.",
    suggestion:
      "Desligue telas 30 minutos antes de dormir, mantenha o quarto fresco e escuro, e evite refeições pesadas à noite. Melatonina natural pode ajudar.",
  },
  estetica: {
    intent: "estetica",
    text:
      "Pele, cabelo e unhas refletem diretamente a nutrição interna. Hidratação, vitaminas do complexo B, vitamina C e colágeno são os pilares de uma boa estética.",
    suggestion:
      "Inclua alimentos ricos em biotina (ovos, nozes, salmão) e vitamina C (acerola, kiwi) na dieta. Suplementação pode acelerar os resultados.",
  },
  fallback: {
    intent: "fallback",
    text:
      "Boa pergunta! Para te ajudar melhor, pode me contar mais sobre seu objetivo atual? Posso sugerir dicas de emagrecimento, ganho de massa, energia, sono ou cuidados estéticos.",
    suggestion:
      "Use as sugestões rápidas abaixo para explorar os temas que mais te interessam.",
  },
};

// ─── Product map (intent → product ID) ────────────────────────────────────
const INTENT_PRODUCT: Record<AssistantIntent, string | null> = {
  emagrecimento: "ap1",
  massa:         "ap2",
  energia:       "ap3",
  sono:          "ap4",
  estetica:      "ap5",
  fallback:      null,
};

// ─── Public function ───────────────────────────────────────────────────────
export function getAssistantResponse(message: string): AssistantResponse {
  const lower = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let detectedIntent: AssistantIntent = "fallback";

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS) as [AssistantIntent, string[]][]) {
    if (intent === "fallback") continue;
    const hit = keywords.some((kw) =>
      lower.includes(kw.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
    );
    if (hit) {
      detectedIntent = intent;
      break;
    }
  }

  const base = RESPONSES[detectedIntent];
  const productId = INTENT_PRODUCT[detectedIntent];
  const product = productId ? (assistantProducts.find((p) => p.id === productId) ?? null) : null;

  return { ...base, product };
}
