// ─── Mock product catalog for the AI Assistant ────────────────────────────
// Replace with real Shopify data when integrating the Store.

export interface AssistantProduct {
  id: string;
  name: string;
  description: string;
  tag: string;       // short badge (e.g. "Queima de gordura")
  price: string;     // formatted BRL
  image: string;     // placeholder or real URL
  handle: string;    // future Shopify handle for deep-link
}

export const assistantProducts: AssistantProduct[] = [
  {
    id: "ap1",
    name: "Termogênico Natural",
    description: "Acelera o metabolismo e aumenta a queima calórica com ingredientes naturais.",
    tag: "Emagrecimento",
    price: "R$ 89,90",
    image: "",
    handle: "termogenico-natural",
  },
  {
    id: "ap2",
    name: "Whey Protein 900g",
    description: "Proteína de alta absorção para suporte ao ganho de massa muscular.",
    tag: "Massa Muscular",
    price: "R$ 149,90",
    image: "",
    handle: "whey-protein-900g",
  },
  {
    id: "ap3",
    name: "Multivitamínico Completo",
    description: "Vitaminas e minerais essenciais para disposição e rendimento no dia a dia.",
    tag: "Energia",
    price: "R$ 59,90",
    image: "",
    handle: "multivitaminico-completo",
  },
  {
    id: "ap4",
    name: "Melatonina + Magnésio",
    description: "Combinação natural para relaxamento, qualidade do sono e recuperação muscular.",
    tag: "Sono",
    price: "R$ 49,90",
    image: "",
    handle: "melatonina-magnesio",
  },
  {
    id: "ap5",
    name: "Colágeno Hidrolisado + Vitamina C",
    description: "Suporte à saúde da pele, cabelos e unhas com colágeno de alta qualidade.",
    tag: "Estética",
    price: "R$ 79,90",
    image: "",
    handle: "colageno-vitamina-c",
  },
  {
    id: "ap6",
    name: "Creatina Monohidratada 300g",
    description: "Aumenta força, resistência e recuperação para treinos de alta intensidade.",
    tag: "Massa Muscular",
    price: "R$ 69,90",
    image: "",
    handle: "creatina-300g",
  },
  {
    id: "ap7",
    name: "L-Carnitina Líquida",
    description: "Facilita o transporte de gordura para ser usada como energia durante os treinos.",
    tag: "Emagrecimento",
    price: "R$ 65,90",
    image: "",
    handle: "l-carnitina-liquida",
  },
  {
    id: "ap8",
    name: "Cápsulas de Biotina",
    description: "Biotina de alta concentração para fortalecer cabelos, unhas e saúde da pele.",
    tag: "Estética",
    price: "R$ 44,90",
    image: "",
    handle: "biotina-capsulas",
  },
];

export function getProductById(id: string): AssistantProduct | null {
  return assistantProducts.find((p) => p.id === id) ?? null;
}
