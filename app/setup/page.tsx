"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { generatePlan, goalLabels, levelLabels } from "@/lib/plan-generator";
import {
  storageSet,
  storageGet,
  KEYS,
  type GoalType,
  type LevelType,
  type SexType,
  type OnboardingData,
} from "@/lib/storage";
import { saveStreak } from "@/lib/streak";

const APP_ICON =
  "https://res.cloudinary.com/dsetxj6at/image/upload/v1774228199/ChatGPT_Image_22_de_mar._de_2026_22_06_41_u94ltt.png";

const goals: { id: GoalType; label: string; icon: string; description: string }[] = [
  { id: "loss",      label: "Perda de Peso",  icon: "🔥", description: "Emagrecer e definir" },
  { id: "gain",      label: "Ganho de Massa",  icon: "💪", description: "Aumentar músculo" },
  { id: "maintain",  label: "Manter Forma",    icon: "⚡", description: "Manter e melhorar" },
  { id: "endurance", label: "Resistência",     icon: "🏃", description: "Cardio e stamina" },
];

const levels: { id: LevelType; label: string; description: string }[] = [
  { id: "beginner",     label: "Iniciante",    description: "Menos de 1 ano" },
  { id: "intermediate", label: "Intermediário", description: "1 a 3 anos" },
  { id: "advanced",     label: "Avançado",      description: "Mais de 3 anos" },
];

const freqByLevel: Record<LevelType, number> = {
  beginner: 3,
  intermediate: 4,
  advanced: 5,
};

export default function SetupPage() {
  const router = useRouter();

  const [goal,        setGoal]        = useState<GoalType>("gain");
  const [level,       setLevel]       = useState<LevelType>("intermediate");
  const [sex,         setSex]         = useState<SexType>("male");
  const [name,        setName]        = useState("Carlos");
  const [weight,      setWeight]      = useState(82);
  const [height,      setHeight]      = useState(178);
  const [age,         setAge]         = useState(28);
  const [loading,     setLoading]     = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  // Pre-populate with existing onboarding data when the user comes back
  // to change their objective (via "Alterar Objetivo" in Profile).
  useEffect(() => {
    const o = storageGet<OnboardingData>(KEYS.ONBOARDING);
    if (o) {
      setGoal(o.goal);
      setLevel(o.level);
      setSex(o.sex);
      setName(o.name);
      setWeight(o.weight);
      setHeight(o.height);
      setAge(o.age);
      setIsReturning(true);
    }
  }, []);

  function handleStart() {
    setLoading(true);
    const onboarding: OnboardingData = { name, goal, level, weight, height, age, sex };
    const plan = generatePlan(onboarding);
    storageSet(KEYS.ONBOARDING, onboarding);
    storageSet(KEYS.PLAN, plan);
    if (!storageGet(KEYS.STREAK)) {
      saveStreak({ current: 0, best: 0, lastActivityDate: "" });
    }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg">

      {/* Header */}
      <div className="px-6 pt-16 pb-8 text-center">
        {/* App icon — Cloudinary hosted, fills ~88% of the container */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-xl overflow-hidden bg-gradient-to-br from-dark-surface to-dark-card border border-dark-border/60">
          <img
            src={APP_ICON}
            alt="Protocolo 5%"
            className="w-[88%] h-[88%] object-contain"
            draggable={false}
          />
        </div>
        <h1 className="text-3xl font-black text-text-primary tracking-tight">
          {isReturning ? (
            <>Atualizar seu <span className="text-gradient-red">Objetivo</span></>
          ) : (
            <>Bem-vindo ao <span className="text-gradient-red">Protocolo 5%</span></>
          )}
        </h1>
        <p className="mt-2 text-text-secondary text-base">
          {isReturning
            ? "Ajuste os dados e gere um novo plano"
            : "Vamos personalizar seu plano"}
        </p>
      </div>

      <div className="flex-1 px-4 space-y-8 pb-10">

        {/* Name */}
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3 px-1">
            Como podemos te chamar?
          </h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-red transition-colors"
          />
        </section>

        {/* Goal Selection */}
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3 px-1">
            Qual é seu objetivo?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {goals.map((g) => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id)}
                className={[
                  "relative flex flex-col gap-1 p-4 rounded-2xl border cursor-pointer transition-all duration-200 text-left",
                  goal === g.id
                    ? "bg-brand-red/10 border-brand-red card-glow"
                    : "bg-dark-card border-dark-border hover:border-dark-muted",
                ].join(" ")}
              >
                {goal === g.id && (
                  <span className="absolute top-2 right-2 text-[10px] bg-brand-red text-white px-1.5 py-0.5 rounded-full font-semibold">
                    Selecionado
                  </span>
                )}
                <span
                  className="text-2xl"
                  style={{
                    filter: goal === g.id
                      ? "drop-shadow(0 0 8px rgba(230,57,70,0.65))"
                      : "drop-shadow(0 0 4px rgba(230,57,70,0.18))",
                    transition: "filter 0.25s ease",
                  }}
                >
                  {g.icon}
                </span>
                <span className="text-sm font-semibold text-text-primary leading-tight">
                  {g.label}
                </span>
                <span className="text-xs text-text-muted">{g.description}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Experience Level */}
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3 px-1">
            Nível de experiência
          </h2>
          <div className="space-y-2">
            {levels.map((l) => (
              <button
                key={l.id}
                onClick={() => setLevel(l.id)}
                className={[
                  "w-full flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200",
                  level === l.id
                    ? "bg-brand-red/10 border-brand-red"
                    : "bg-dark-card border-dark-border hover:border-dark-muted",
                ].join(" ")}
              >
                <div className="text-left">
                  <p className="text-sm font-semibold text-text-primary">{l.label}</p>
                  <p className="text-xs text-text-muted">{l.description}</p>
                </div>
                <div
                  className={[
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    level === l.id
                      ? "border-brand-red bg-brand-red"
                      : "border-dark-muted",
                  ].join(" ")}
                >
                  {level === l.id && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Basic Info */}
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3 px-1">
            Dados básicos
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { label: "Peso (kg)",   val: weight, set: setWeight },
                { label: "Altura (cm)", val: height, set: setHeight },
                { label: "Idade",       val: age,    set: setAge },
              ] as const
            ).map((field) => (
              <div key={field.label} className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary font-medium px-1">
                  {field.label}
                </label>
                <input
                  type="number"
                  value={field.val}
                  onChange={(e) => (field.set as (v: number) => void)(Number(e.target.value))}
                  className="bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-brand-red transition-colors"
                />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-secondary font-medium px-1">Sexo</label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as SexType)}
                className="bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-brand-red transition-colors"
              >
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
              </select>
            </div>
          </div>
        </section>

        {/* Plan Preview */}
        <section className="bg-dark-card border border-dark-border rounded-2xl p-4 space-y-2">
          <p className="text-xs text-text-muted uppercase tracking-wide font-semibold">
            Preview do seu plano
          </p>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div>
              <span className="text-text-muted">Objetivo: </span>
              <span className="text-text-primary font-semibold">{goalLabels[goal]}</span>
            </div>
            <div>
              <span className="text-text-muted">Nivel: </span>
              <span className="text-text-primary font-semibold">{levelLabels[level]}</span>
            </div>
            <div>
              <span className="text-text-muted">Treinos/sem: </span>
              <span className="text-brand-red font-bold">{freqByLevel[level]}x</span>
            </div>
            <div>
              <span className="text-text-muted">Agua/dia: </span>
              <span className="text-brand-red font-bold">
                {(weight * 0.035).toFixed(1)}L
              </span>
            </div>
          </div>
        </section>

        {/* CTA — wrapped in pulse ring */}
        <div className="pt-2">
          <div className="animate-cta-pulse">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onClick={handleStart}
            >
              {isReturning ? "Atualizar Meu Plano" : "Gerar Meu Plano"}
            </Button>
          </div>
          <p className="text-center text-xs text-text-muted mt-3">
            {isReturning
              ? "O dashboard será atualizado com o novo plano"
              : "Você pode ajustar tudo isso depois no seu perfil"}
          </p>
        </div>

      </div>
    </div>
  );
}
