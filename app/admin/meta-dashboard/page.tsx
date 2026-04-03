"use client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Classification = "scale" | "monitor" | "kill";

interface RawAd {
  id: string;
  name: string;
  cpa: number;          // BRL
  ctr: number;          // percentage, e.g. 4.21
  cpm: number;          // BRL
  spend: number;        // BRL
  impressions: number;
  conversions: number;
  frequency: number;
  ctrLastWeek: number;  // previous period CTR for trend detection
}

interface ClassifiedAd extends RawAd {
  classification: Classification;
  reasons: string[];
}

// ---------------------------------------------------------------------------
// Mock data — structured like a real API response
// ---------------------------------------------------------------------------

function getAdPerformanceData(): RawAd[] {
  return [
    {
      id: "AD-001",
      name: "Video Treino — Prova Social",
      cpa: 9.8,
      ctr: 4.21,
      cpm: 16.5,
      spend: 1200,
      impressions: 63400,
      conversions: 122,
      frequency: 1.4,
      ctrLastWeek: 3.9,
    },
    {
      id: "AD-002",
      name: "Carrossel — Resultados Reais",
      cpa: 10.5,
      ctr: 3.95,
      cpm: 17.2,
      spend: 980,
      impressions: 49800,
      conversions: 93,
      frequency: 1.6,
      ctrLastWeek: 3.7,
    },
    {
      id: "AD-003",
      name: "Static — CTA Direto",
      cpa: 11.2,
      ctr: 3.6,
      cpm: 18.0,
      spend: 760,
      impressions: 42100,
      conversions: 68,
      frequency: 1.8,
      ctrLastWeek: 3.4,
    },
    {
      id: "AD-007",
      name: "Imagem — Benefícios do App",
      cpa: 22.4,
      ctr: 1.8,
      cpm: 19.5,
      spend: 540,
      impressions: 27700,
      conversions: 24,
      frequency: 2.9,
      ctrLastWeek: 2.3,
    },
    {
      id: "AD-009",
      name: "Video — Depoimento Cliente",
      cpa: 25.0,
      ctr: 1.5,
      cpm: 20.1,
      spend: 390,
      impressions: 19400,
      conversions: 15,
      frequency: 3.2,
      ctrLastWeek: 2.1,
    },
    {
      id: "AD-011",
      name: "Banner — Oferta Genérica",
      cpa: 48.0,
      ctr: 0.62,
      cpm: 22.4,
      spend: 280,
      impressions: 12500,
      conversions: 0,
      frequency: 3.8,
      ctrLastWeek: 0.8,
    },
    {
      id: "AD-014",
      name: "Static — Fundo Branco",
      cpa: 55.1,
      ctr: 0.41,
      cpm: 23.0,
      spend: 210,
      impressions: 9100,
      conversions: 0,
      frequency: 4.1,
      ctrLastWeek: 0.6,
    },
  ];
}

// ---------------------------------------------------------------------------
// Decision engine — thresholds
// ---------------------------------------------------------------------------

const THRESHOLDS = {
  cpaTarget: 15,       // BRL — campaign target CPA
  cpaKill: 35,         // BRL — CPA so bad it's not worth fixing
  ctrGood: 3.0,        // % — healthy CTR floor
  ctrKill: 0.8,        // % — critically low CTR
  frequencyRisk: 2.5,  // exposure risk threshold
  ctrDropRisk: 0.5,    // % drop week-over-week that flags decline
  spendKillFloor: 150, // BRL — minimum spend to consider kill (avoid noise)
};

function classifyAd(ad: RawAd): ClassifiedAd {
  const reasons: string[] = [];
  let classification: Classification = "scale";

  const ctrDrop = ad.ctrLastWeek - ad.ctr;

  // Kill conditions — any one is sufficient
  if (ad.conversions === 0 && ad.spend >= THRESHOLDS.spendKillFloor) {
    reasons.push("Zero conversões com gasto relevante");
    classification = "kill";
  }
  if (ad.cpa >= THRESHOLDS.cpaKill) {
    reasons.push(`CPA ${fmtCurrency(ad.cpa)} — muito acima da meta`);
    classification = "kill";
  }
  if (ad.ctr <= THRESHOLDS.ctrKill) {
    reasons.push(`CTR crítico (${ad.ctr.toFixed(2)}%)`);
    classification = "kill";
  }

  // Monitor conditions — only if not already kill
  if (classification !== "kill") {
    if (ad.frequency >= THRESHOLDS.frequencyRisk) {
      reasons.push(`Frequência alta (${ad.frequency.toFixed(1)})`);
      classification = "monitor";
    }
    if (ctrDrop >= THRESHOLDS.ctrDropRisk) {
      reasons.push(`CTR caindo (−${ctrDrop.toFixed(2)}% vs semana anterior)`);
      classification = "monitor";
    }
    if (ad.cpa > THRESHOLDS.cpaTarget && ad.cpa < THRESHOLDS.cpaKill) {
      reasons.push(`CPA ${fmtCurrency(ad.cpa)} acima da meta de ${fmtCurrency(THRESHOLDS.cpaTarget)}`);
      classification = "monitor";
    }
  }

  if (reasons.length === 0) {
    reasons.push("Dentro das metas — escalar budget");
  }

  return { ...ad, classification, reasons };
}

// ---------------------------------------------------------------------------
// Filter helpers
// ---------------------------------------------------------------------------

function getTopAds(data: ClassifiedAd[]): ClassifiedAd[] {
  return data
    .filter((ad) => ad.classification === "scale")
    .sort((a, b) => a.cpa - b.cpa || b.ctr - a.ctr)
    .slice(0, 3);
}

function getRiskAds(data: ClassifiedAd[]): ClassifiedAd[] {
  return data.filter((ad) => ad.classification === "monitor");
}

function getKillAds(data: ClassifiedAd[]): ClassifiedAd[] {
  return data.filter((ad) => ad.classification === "kill");
}

// ---------------------------------------------------------------------------
// Overview aggregation
// ---------------------------------------------------------------------------

function buildOverviewMetrics(data: RawAd[]) {
  const totalSpend = data.reduce((s, a) => s + a.spend, 0);
  const totalConversions = data.reduce((s, a) => s + a.conversions, 0);
  const totalImpressions = data.reduce((s, a) => s + a.impressions, 0);
  const totalClicks = data.reduce((s, a) => s + (a.impressions * a.ctr) / 100, 0);

  const cpa = totalConversions > 0 ? totalSpend / totalConversions : 0;
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const cpm = totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0;
  const avgFrequency =
    data.reduce((s, a) => s + a.frequency, 0) / data.length;

  return [
    {
      label: "CPA",
      value: fmtCurrency(cpa),
      change: cpa <= THRESHOLDS.cpaTarget ? "Dentro da meta" : "Acima da meta",
      status: cpa <= THRESHOLDS.cpaTarget ? "good" : cpa < THRESHOLDS.cpaKill ? "warning" : "bad",
    },
    {
      label: "CTR",
      value: `${ctr.toFixed(2)}%`,
      change: ctr >= THRESHOLDS.ctrGood ? "CTR saudável" : "CTR abaixo da meta",
      status: ctr >= THRESHOLDS.ctrGood ? "good" : "warning",
    },
    {
      label: "CPM",
      value: fmtCurrency(cpm),
      change: "Custo por mil impressões",
      status: "neutral",
    },
    {
      label: "Spend",
      value: fmtCurrency(totalSpend),
      change: `${data.length} ads ativos`,
      status: "neutral",
    },
    {
      label: "Frequência",
      value: avgFrequency.toFixed(1),
      change:
        avgFrequency >= THRESHOLDS.frequencyRisk
          ? "Risco de fadiga"
          : "Frequência ok",
      status: avgFrequency >= THRESHOLDS.frequencyRisk ? "warning" : "good",
    },
  ];
}

// ---------------------------------------------------------------------------
// Creative insights — derived from classified data
// ---------------------------------------------------------------------------

function buildCreativeInsights(data: ClassifiedAd[]) {
  const insights = [
    {
      icon: "🎥",
      title: "Testar vídeo UGC curto (15s)",
      description:
        "Criativos estilo usuário real com prova social têm CPA 30% menor no segmento fitness.",
    },
    {
      icon: "📸",
      title: "Carrossel antes/depois com métricas",
      description:
        "Mostrar números reais (kg perdidos, séries completadas) aumenta CTR em audiências frias.",
    },
    {
      icon: "✍️",
      title: "Headline com dor + urgência",
      description:
        '"Cansado de treinar sem resultado?" + CTA com prazo tende a reduzir CPA em campanhas de conversão.',
    },
    {
      icon: "🎨",
      title: "Testar fundo escuro nos statics",
      description:
        "Anúncios com fundo escuro se destacam mais no feed e têm thumb-stop rate superior.",
    },
  ];

  // Dynamically add insight if many ads are being killed
  const killCount = data.filter((a) => a.classification === "kill").length;
  if (killCount >= 2) {
    insights.push({
      icon: "🔁",
      title: `${killCount} ads para pausar — renovar criativos`,
      description:
        "Alta taxa de ads com baixo desempenho indica necessidade de batch de novos criativos.",
    });
  }

  return insights;
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function fmtCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

function fmtNumber(value: number) {
  return value.toLocaleString("pt-BR");
}

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

const classificationStyles: Record<
  Classification | "neutral",
  { text: string; border: string; badge: string; value: string }
> = {
  scale: {
    text: "text-green-400",
    border: "border-green-500/20",
    badge: "bg-green-500/10 text-green-400 border border-green-500/20",
    value: "text-green-400",
  },
  monitor: {
    text: "text-yellow-400",
    border: "border-yellow-500/20",
    badge: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    value: "text-yellow-400",
  },
  kill: {
    text: "text-red-400",
    border: "border-red-500/20",
    badge: "bg-red-500/10 text-red-400 border border-red-500/20",
    value: "text-red-400",
  },
  neutral: {
    text: "text-slate-300",
    border: "border-slate-600",
    badge: "bg-slate-700 text-slate-300 border border-slate-600",
    value: "text-slate-300",
  },
};

const overviewStatusStyle: Record<string, { text: string; border: string }> = {
  good:    { text: "text-green-400",  border: "border-green-500/30" },
  warning: { text: "text-yellow-400", border: "border-yellow-500/30" },
  bad:     { text: "text-red-400",    border: "border-red-500/30" },
  neutral: { text: "text-slate-400",  border: "border-slate-700" },
};

const classificationLabel: Record<Classification, string> = {
  scale: "Escalar",
  monitor: "Monitorar",
  kill: "Desativar",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MetaDashboardPage() {
  const rawData = getAdPerformanceData();
  const classifiedData = rawData.map(classifyAd);

  const overviewMetrics = buildOverviewMetrics(rawData);
  const topAds = getTopAds(classifiedData);
  const riskAds = getRiskAds(classifiedData);
  const killAds = getKillAds(classifiedData);
  const creativeInsights = buildCreativeInsights(classifiedData);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-semibold tracking-widest uppercase text-slate-500">
          Admin — Interno
        </span>
        <h1 className="text-2xl font-bold text-white mt-1">Meta Ads Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Performance consolidada · Atualizado em{" "}
          {new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          {" "}· {rawData.length} ads processados pelo motor de decisão
        </p>
      </div>

      {/* 1. Overview */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">
          Visão Geral
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {overviewMetrics.map((m) => {
            const s = overviewStatusStyle[m.status] ?? overviewStatusStyle.neutral;
            return (
              <div
                key={m.label}
                className={`bg-slate-900 border ${s.border} rounded-xl p-4`}
              >
                <p className="text-xs text-slate-500 mb-1">{m.label}</p>
                <p className="text-xl font-bold text-white">{m.value}</p>
                <p className={`text-xs mt-1 font-medium ${s.text}`}>{m.change}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Top Performing Ads */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">
          Top Ads{" "}
          <span className="text-green-500/60 normal-case tracking-normal font-normal">
            — classificação: escalar
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topAds.map((ad) => {
            const s = classificationStyles.scale;
            return (
              <div key={ad.id} className={`bg-slate-900 border ${s.border} rounded-xl p-5`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-slate-500">{ad.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.badge}`}>
                    {classificationLabel[ad.classification]}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white mb-4 leading-snug">{ad.name}</p>
                <div className="grid grid-cols-2 gap-y-2 text-xs mb-3">
                  <div>
                    <p className="text-slate-500">CPA</p>
                    <p className={`${s.value} font-semibold`}>{fmtCurrency(ad.cpa)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">CTR</p>
                    <p className={`${s.value} font-semibold`}>{ad.ctr.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Spend</p>
                    <p className="text-slate-300">{fmtCurrency(ad.spend)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Impressões</p>
                    <p className="text-slate-300">{fmtNumber(ad.impressions)}</p>
                  </div>
                </div>
                <p className="text-xs text-green-400/70 border-t border-slate-800 pt-2">
                  {ad.reasons[0]}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Ads at Risk */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">
          Ads em Risco{" "}
          <span className="text-yellow-500/60 normal-case tracking-normal font-normal">
            — classificação: monitorar
          </span>
        </h2>
        <div className="flex flex-col gap-3">
          {riskAds.map((ad) => {
            const s = classificationStyles.monitor;
            return (
              <div
                key={ad.id}
                className={`bg-slate-900 border ${s.border} rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-500">{ad.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.badge}`}>
                      {classificationLabel[ad.classification]}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">{ad.name}</p>
                  <p className={`text-xs mt-1 ${s.text}`}>{ad.reasons.join(" · ")}</p>
                </div>
                <div className="flex gap-4 text-xs shrink-0">
                  <div>
                    <p className="text-slate-500">CPA</p>
                    <p className={`${s.value} font-semibold`}>{fmtCurrency(ad.cpa)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">CTR</p>
                    <p className={`${s.value} font-semibold`}>{ad.ctr.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Freq.</p>
                    <p className={`${s.value} font-semibold`}>{ad.frequency.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Spend</p>
                    <p className="text-slate-300">{fmtCurrency(ad.spend)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Ads to Kill */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">
          Ads para Desativar{" "}
          <span className="text-red-500/60 normal-case tracking-normal font-normal">
            — classificação: kill
          </span>
        </h2>
        <div className="flex flex-col gap-3">
          {killAds.map((ad) => {
            const s = classificationStyles.kill;
            return (
              <div
                key={ad.id}
                className={`bg-slate-900 border ${s.border} rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-500">{ad.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.badge}`}>
                      {classificationLabel[ad.classification]}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">{ad.name}</p>
                  <p className={`text-xs mt-1 ${s.text}`}>{ad.reasons.join(" · ")}</p>
                </div>
                <div className="flex gap-4 text-xs shrink-0">
                  <div>
                    <p className="text-slate-500">CPA</p>
                    <p className={`${s.value} font-semibold`}>{fmtCurrency(ad.cpa)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">CTR</p>
                    <p className={`${s.value} font-semibold`}>{ad.ctr.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Conv.</p>
                    <p className={`${s.value} font-semibold`}>{ad.conversions}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Spend</p>
                    <p className="text-slate-300">{fmtCurrency(ad.spend)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Creative Insights */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">
          Insights de Criativos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {creativeInsights.map((insight, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-700/50 rounded-xl p-5 flex gap-4"
            >
              <span className="text-2xl shrink-0">{insight.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white mb-1">{insight.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="text-center text-xs text-slate-700 mt-8">
        Uso interno · Dados simulados · Motor de decisão v1 · Metas: CPA alvo{" "}
        {fmtCurrency(THRESHOLDS.cpaTarget)} · CTR mín {THRESHOLDS.ctrGood}% · Freq. máx{" "}
        {THRESHOLDS.frequencyRisk}
      </div>
    </div>
  );
}
