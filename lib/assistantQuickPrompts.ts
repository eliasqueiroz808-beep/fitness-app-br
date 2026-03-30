// ─── Quick-prompt chips shown above the input bar ─────────────────────────

export interface QuickPrompt {
  id: string;
  label: string;    // display text on the chip
  message: string;  // sent to the assistant logic
}

export const quickPrompts: QuickPrompt[] = [
  {
    id: "qp1",
    label: "Quero perder barriga",
    message: "Quero perder barriga e emagrecer, o que você recomenda?",
  },
  {
    id: "qp2",
    label: "Quero ganhar massa",
    message: "Quero ganhar massa muscular, o que devo fazer?",
  },
  {
    id: "qp3",
    label: "Estou sem energia",
    message: "Estou me sentindo muito cansado e sem energia, como posso melhorar?",
  },
  {
    id: "qp4",
    label: "Quero dormir melhor",
    message: "Tenho dificuldade para dormir bem, o que você recomenda?",
  },
  {
    id: "qp5",
    label: "Cuidar da pele e cabelo",
    message: "Quero melhorar minha pele, cabelo e unhas, o que me indica?",
  },
];
