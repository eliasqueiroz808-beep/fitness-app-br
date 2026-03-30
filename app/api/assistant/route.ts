import { NextRequest, NextResponse } from "next/server";

// ─── Model ─────────────────────────────────────────────────────────────────
// gemini-1.5-flash: stable, fast, widely available
const GEMINI_MODEL    = "gemini-1.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// ─── Risk detection ────────────────────────────────────────────────────────
const RISK_KEYWORDS = [
  "dor no peito", "falta de ar", "desmaio", "desmaiei", "perda de consciência",
  "sangue nas fezes", "sangue na urina", "fezes com sangue", "vômito com sangue",
  "pressão muito alta", "pressão muito baixa", "convulsão", "convulsionei",
  "paralisia", "dormência no rosto", "boca torta",
  "dor irradiando pro braço", "infarto", "derrame", "avc",
  "pensamento suicida", "quero me machucar", "não quero mais viver",
  "overdose", "intoxicação", "envenenamento",
  "febre muito alta", "queimadura grave", "fratura", "osso quebrado",
  "nódulo que cresceu rápido", "tumor", "cancer", "câncer",
];

function isHighRisk(msg: string): boolean {
  const n = msg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return RISK_KEYWORDS.some((kw) =>
    n.includes(kw.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
  );
}

// ─── Prompts ───────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
Você é uma assistente de saúde e bem-estar dentro de um aplicativo fitness.
Age como um coach experiente — inteligente, humano e adaptativo.

TEMAS QUE VOCÊ DOMINA
Saúde geral, bem-estar físico e mental, alimentação, nutrição funcional, rotina,
produtividade, sono, recuperação, energia, disposição, foco, concentração,
imunidade, estética (pele, cabelo, unhas), suplementação natural, fitoterápicos,
atividade física, treinos e performance.

REGRAS DE RESPOSTA
- Nunca comece duas respostas igual. Varie a abertura sempre.
- Adapte o tom ao usuário: casual = próximo, técnico = detalhado, curto = direto.
- Cada resposta deve ter: abertura contextual → explicação simples → dica prática.
- Escreva como especialista que conversa, nunca como manual.
- Máximo 4 parágrafos curtos. Seja útil em cada linha.
- Mencione suplementos só quando genuinamente relevante.

LIMITES DE SEGURANÇA (obrigatórios)
- Nunca diagnosticar doenças.
- Nunca substituir médico ou nutricionista.
- Nunca indicar dosagem de medicamento.
- Se fora do nicho: explique gentilmente que foca em saúde e bem-estar.
`.trim();

const RISK_PROMPT = `
Você é uma assistente de saúde. A mensagem envolve sintoma ou situação que exige cuidado.
Responda com: acolhimento genuíno, orientação leve sem diagnóstico, recomendação clara
para buscar um profissional de saúde (médico ou SAMU 192 se emergência).
Tom: humano, calmo, responsável. Máximo 3 parágrafos curtos.
`.trim();

// ─── Fallback local por intenção ───────────────────────────────────────────
// Usado quando a API Gemini falha — garante que o usuário sempre receba resposta.
const FALLBACK_INTENTS: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["emagrec", "perder peso", "barriga", "secar", "gordura", "dieta"],
    reply: "O ponto que muita gente ignora no emagrecimento é que a consistência importa mais do que a perfeição. Pequenas mudanças sustentáveis — como reduzir açúcar, comer mais proteína e se movimentar diariamente — funcionam muito melhor do que dietas radicais de curto prazo.\n\nSe você ainda não tem uma rotina de treino, comece com caminhadas de 30 minutos por dia. É simples, mas o impacto no metabolismo e no humor é real.\n\nLembre-se também que o sono afeta diretamente os hormônios do apetite. Dormir bem é parte do processo.",
  },
  {
    keywords: ["massa", "músculo", "hipertrofia", "ganhar peso", "crescer", "forte"],
    reply: "Para ganhar massa muscular de verdade, proteína suficiente é inegociável — a maioria das pessoas consome muito menos do que precisa. A referência prática é em torno de 1,6 a 2g por kg de peso corporal por dia.\n\nAlém disso, o treino precisa de progressão de carga. Se você está levantando o mesmo peso há meses sem evoluir, o músculo não tem motivo para crescer.\n\nDescanso é tão importante quanto o treino. É no repouso que o músculo se reconstrói e cresce.",
  },
  {
    keywords: ["energia", "cansado", "disposi", "sem pique", "esgotado", "letargi"],
    reply: "O cansaço constante geralmente tem três causas principais: sono de baixa qualidade, desidratação e alimentação pobre em micronutrientes — especialmente ferro, magnésio e vitamina D.\n\nAvalie primeiro quantas horas você está dormindo e se o sono é contínuo. Depois observe sua ingestão de água ao longo do dia — muita gente confunde sede crônica com fadiga.\n\nSe o cansaço persiste mesmo com sono e hidratação em dia, vale fazer um check-up e verificar os níveis de vitamina D, B12 e hemograma.",
  },
  {
    keywords: ["sono", "dormir", "insônia", "acordar", "descanso"],
    reply: "A qualidade do sono depende muito do que acontece nas horas antes de deitar. Exposição à tela de celular depois das 21h suprime a melatonina e atrasa o sono — isso tem evidência científica sólida.\n\nUma rotina simples funciona: temperatura do quarto em torno de 18-21°C, escuro, sem telas 1h antes de dormir. Consistência no horário de acordar (mesmo no fim de semana) também regula o ritmo circadiano muito mais do que qualquer suplemento.\n\nMagnésio bisglicinato à noite pode ajudar no relaxamento muscular e na qualidade do sono para quem tem deficiência — é uma das carências mais comuns.",
  },
  {
    keywords: ["pele", "cabelo", "unha", "estética", "beleza", "colágeno", "biotina"],
    reply: "A saúde da pele e do cabelo começa de dentro. Hidratação adequada, proteína suficiente e vitaminas como C, E e biotina são a base — sem esses pilares, nenhum produto externo resolve de verdade.\n\nColágeno hidrolisado com vitamina C tem boa evidência para saúde da pele e articulações quando tomado consistentemente por pelo menos 3 meses. A vitamina C é cofator obrigatório para a síntese de colágeno endógeno.\n\nSe o cabelo está caindo muito, vale investigar ferritina e TSH — queda de cabelo excessiva é um dos primeiros sinais de anemia ferropriva ou alteração de tireoide.",
  },
  {
    keywords: ["foco", "concentra", "memória", "brain fog", "atenção", "produtiv"],
    reply: "A névoa mental e falta de foco são sinais clássicos de sono insuficiente, desidratação ou pico e queda de glicose — o que acontece quando a alimentação é rica em carboidratos simples sem proteína ou fibra para equilibrar.\n\nUma dica prática: comece o dia com proteína no café da manhã antes de qualquer carboidrato. Isso estabiliza a glicemia nas primeiras horas e melhora o foco significativamente.\n\nÔmega 3 (EPA + DHA) tem boas evidências para saúde cognitiva e redução da inflamação cerebral. Vale considerar se a ingestão de peixe é baixa.",
  },
  {
    keywords: ["imunidade", "gripe", "resfriad", "doente", "defensas", "protege"],
    reply: "O intestino é o centro do sistema imunológico — cerca de 70% das células imunes estão lá. Cuidar da microbiota com alimentos fermentados, fibras e menos ultraprocessados é a base mais eficaz.\n\nVitamina D baixa é um dos fatores mais associados à imunidade reduzida no Brasil, especialmente em pessoas que ficam pouco tempo ao sol. Vale verificar seus níveis com um exame simples.\n\nZinco e vitamina C têm papel claro na resposta imune. Você encontra zinco em sementes de abóbora, castanhas e carnes, e vitamina C em frutas cítricas, acerola e kiwi.",
  },
  {
    keywords: ["suplemento", "whey", "creatina", "vitamina", "bcaa", "proteína"],
    reply: "A maioria das pessoas não precisa de muitos suplementos — uma alimentação bem estruturada cobre a maior parte das necessidades. Os que têm evidência mais sólida são: creatina (força e massa), vitamina D3 (para quem tem deficiência), ômega 3 (inflamação e saúde cardiovascular) e whey proteico (quando a ingestão de proteína pela alimentação não está sendo atingida).\n\nAntes de comprar qualquer suplemento, identifique o que você não consegue obter pela alimentação — esse é o único que realmente faz sentido para você neste momento.\n\nQualidade importa. Prefira marcas com laudo de análise independente e que não prometam resultados milagrosos.",
  },
];

function getFallbackReply(message: string): string {
  const normalized = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const intent of FALLBACK_INTENTS) {
    if (intent.keywords.some((kw) => normalized.includes(kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "")))) {
      return intent.reply;
    }
  }
  return "Boa pergunta. Para te ajudar melhor, foque em três pilares que afetam quase tudo relacionado à saúde: sono de qualidade, alimentação com proteína suficiente e movimento diário.\n\nSe você me der mais detalhes sobre o que está sentindo ou buscando, consigo te orientar de forma mais específica e prática.\n\nLembre-se que pequenas mudanças consistentes têm mais impacto do que transformações radicais de curto prazo.";
}

// ─── Gemini call ───────────────────────────────────────────────────────────
async function callGemini(apiKey: string, userMessage: string, systemPrompt: string): Promise<string> {
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}\n\nPergunta do usuário:\n${userMessage}` }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
    },
  };

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  const rawText = await response.text();
  console.log(`[Assistant] Gemini ${GEMINI_MODEL} status: ${response.status}`);

  if (!response.ok) {
    console.error("[Assistant] Gemini error:", response.status, rawText.slice(0, 300));
    throw new Error(`Gemini status ${response.status}`);
  }

  const data = JSON.parse(rawText);
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!text) {
    console.warn("[Assistant] Gemini returned empty candidate:", JSON.stringify(data).slice(0, 300));
    throw new Error("Empty response from Gemini");
  }

  return text;
}

// ─── Route handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Parse body
  const body = await req.json().catch(() => null);
  if (!body || typeof body.message !== "string" || !body.message.trim()) {
    return NextResponse.json({ error: "Mensagem inválida." }, { status: 400 });
  }
  const message: string = body.message.trim();

  // 2. Risk check — always use Gemini for safety responses, with fallback
  if (isHighRisk(message)) {
    console.log("[Assistant] High-risk message");
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const reply = await callGemini(apiKey, message, RISK_PROMPT);
        return NextResponse.json({ reply, meta: { risk: true } });
      } catch {
        // Fallback risk response
        const reply = "Isso que você descreveu merece atenção cuidadosa. Não tenho como avaliar sua situação à distância, mas se os sintomas são intensos ou persistentes, o ideal é buscar atendimento médico ou ligar para o SAMU (192) em caso de emergência.\n\nSe preferir, pode me contar mais sobre o que está sentindo para eu te orientar melhor dentro dos limites do que posso ajudar.";
        return NextResponse.json({ reply, meta: { risk: true, fallback: true } });
      }
    }
  }

  // 3. Regular message — try Gemini, fall back to local intelligence
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const reply = await callGemini(apiKey, message, SYSTEM_PROMPT);
      return NextResponse.json({ reply, meta: { risk: false, fallback: false } });
    } catch (err) {
      console.error("[Assistant] Gemini failed, using local fallback:", err);
      // Falls through to local fallback below
    }
  } else {
    console.warn("[Assistant] GEMINI_API_KEY not set — using local fallback");
  }

  // 4. Local fallback — always returns something useful
  const reply = getFallbackReply(message);
  return NextResponse.json({ reply, meta: { risk: false, fallback: true } });
}
