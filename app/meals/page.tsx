"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { storageGet, KEYS, type GeneratedPlan } from "@/lib/storage";
import {
  getRecommendedMeals,
  type LibraryMeal,
  type MealCategory,
} from "@/lib/meal-library";

function calcTotals(meals: LibraryMeal[]) {
  return meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.totalCalories,
      protein:  acc.protein  + m.totalProtein,
      carbs:    acc.carbs    + m.totalCarbs,
      fat:      acc.fat      + m.totalFat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

function MacroBar({
  label, value, goal, color, unit = "g",
}: {
  label: string; value: number; goal: number;
  color: "red" | "green" | "yellow" | "blue"; unit?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-text-secondary">{label}</span>
        <span className="text-xs font-semibold text-text-primary">
          {value}/{goal}{unit}
        </span>
      </div>
      <ProgressBar value={value} max={goal} color={color} />
    </div>
  );
}

// ─── Meal image lookup (by meal ID) ──────────────────────────────────────────
const MEAL_IMAGES: Record<string, string> = {
  // Perda de peso
  b4: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774407200/Gemini_Generated_Image_n1e0t4n1e0t4n1e0_dbbl1f.png",
  l3: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774407202/Gemini_Generated_Image_8iwa0a8iwa0a8iwa_cxhyks.png",
  s6: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774407200/Gemini_Generated_Image_dzoj9ydzoj9ydzoj_1_gyx2pq.png",
  d2: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774407198/Gemini_Generated_Image_r1dtfyr1dtfyr1dt_ovibel.png",
  // Ganho de massa
  b1: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774409449/Gemini_Generated_Image_y4xq92y4xq92y4xq_cwedeb.png",
  l2: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774409449/Gemini_Generated_Image_s4zbmhs4zbmhs4zb_i91hc9.png",
  s1: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774409447/Gemini_Generated_Image_x91pgyx91pgyx91p_1_sjk0ua.png",
  d4: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774409444/Gemini_Generated_Image_5bukdt5bukdt5buk_srjrla.png",
  // Manter forma / Resistência
  b3: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774444237/Gemini_Generated_Image_npddf6npddf6npdd_aypbab.png",
  l1: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774444279/Gemini_Generated_Image_36lh3f36lh3f36lh_q6sak1.png",
  s2: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774444278/Gemini_Generated_Image_c7l7ijc7l7ijc7l7_aepykw.png",
  d1: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774444247/Gemini_Generated_Image_ssceessceesscees_-_Copia_fabwen.png",
};

function MealCard({ meal }: { meal: LibraryMeal }) {
  const [open, setOpen] = useState(false);
  const image = MEAL_IMAGES[meal.id] ?? null;

  return (
    <Card padding="none" className="overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 border-b border-dark-border active:bg-dark-surface/50 transition-colors"
      >
        <div className="text-left">
          <h3 className="text-sm font-bold text-text-primary">{meal.name}</h3>
          <p className="text-xs text-text-muted mt-0.5">{meal.time}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-brand-red">{meal.totalCalories} kcal</p>
            <p className="text-xs text-text-muted">P: {meal.totalProtein}g</p>
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={[
              "w-4 h-4 text-text-muted transition-transform duration-200",
              open ? "rotate-180" : "",
            ].join(" ")}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      {open && (
        <div>
          {image && (
            <div className="px-4 pt-4 pb-2">
              <img
                src={image}
                alt={meal.name}
                className="w-full rounded-2xl object-cover"
                style={{ aspectRatio: "4/5" }}
              />
            </div>
          )}
          <div className="divide-y divide-dark-border/50">
            {meal.foods.map((food) => (
              <div key={food.id} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">{food.name}</p>
                  <p className="text-xs text-text-muted">{food.quantity}</p>
                </div>
                <div className="ml-3 shrink-0 text-right">
                  <p className="text-xs font-semibold text-text-primary">{food.calories} kcal</p>
                  <p className="text-[10px] text-text-muted">
                    P{food.protein} C{food.carbs} G{food.fat}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}


export default function MealsPage() {
  const [plan,    setPlan]    = useState<GeneratedPlan | null>(null);
  const [meals,   setMeals]   = useState<LibraryMeal[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const p = storageGet<GeneratedPlan>(KEYS.PLAN);
    if (p) {
      setPlan(p);
      const cat: MealCategory =
        p.goal === "gain" ? "gain" : p.goal === "loss" ? "loss" : "maintain";
      const dayMeals: LibraryMeal[] = [
        getRecommendedMeals(cat, "breakfast", 1)[0],
        getRecommendedMeals(cat, "lunch", 1)[0],
        getRecommendedMeals(cat, "snack", 1)[0],
        getRecommendedMeals(cat, "dinner", 1)[0],
      ].filter(Boolean);
      setMeals(dayMeals);
    } else {
      // Fallback: show a variety of meals if no plan
      const fallback: LibraryMeal[] = [
        getRecommendedMeals("all", "breakfast", 1)[0],
        getRecommendedMeals("all", "lunch", 1)[0],
        getRecommendedMeals("all", "snack", 1)[0],
        getRecommendedMeals("all", "dinner", 1)[0],
      ].filter(Boolean);
      setMeals(fallback);
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totals      = calcTotals(meals);
  const calorieGoal = plan?.calorieTarget ?? 2500;
  const proteinGoal = plan?.proteinTarget ?? 150;
  const carbGoal    = plan?.carbTarget    ?? 300;
  const fatGoal     = plan?.fatTarget     ?? 80;

  return (
    <AppShell>
      <PageHeader
        title="Refeições"
        subtitle="Plano nutricional do dia"
        action={
          <button className="w-9 h-9 rounded-xl gradient-red flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        }
      />

      {/* Daily Summary */}
      <section className="px-4 mb-5">
        <Card glow className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary">Resumo do Dia</h2>
            <span className="text-xs text-text-muted">Meta: {calorieGoal} kcal</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-end mb-1">
              <span className="text-3xl font-black text-text-primary">{totals.calories}</span>
              <span className="text-sm text-text-secondary mb-1">/{calorieGoal} kcal</span>
            </div>
            <ProgressBar value={totals.calories} max={calorieGoal} color="red" />
          </div>
          <div className="space-y-2.5 pt-1">
            <MacroBar label="Proteína"      value={totals.protein} goal={proteinGoal} color="blue" />
            <MacroBar label="Carboidratos"  value={totals.carbs}   goal={carbGoal}    color="yellow" />
            <MacroBar label="Gorduras"      value={totals.fat}     goal={fatGoal}     color="green" />
          </div>
        </Card>
      </section>

      {/* Macro Chips */}
      <section className="px-4 mb-5">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Proteína", value: totals.protein, unit: "g", color: "text-blue-400" },
            { label: "Carbos",   value: totals.carbs,   unit: "g", color: "text-yellow-400" },
            { label: "Gordura",  value: totals.fat,     unit: "g", color: "text-green-400" },
          ].map((m) => (
            <Card key={m.label} padding="sm" className="text-center">
              <p className={["text-lg font-black", m.color].join(" ")}>
                {m.value}
                <span className="text-xs font-normal text-text-muted">{m.unit}</span>
              </p>
              <p className="text-[10px] text-text-muted mt-0.5">{m.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Meal List */}
      <section className="px-4 mb-4">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
          Refeições Recomendadas
        </h2>
        <div className="space-y-3">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      </section>

      {/* Tip */}
      {plan && (
        <section className="px-4 mb-4">
          <Card className="flex items-start gap-3">
            <span className="text-xl mt-0.5">💡</span>
            <p className="text-xs text-text-secondary leading-relaxed">
              Refeições selecionadas com base no seu objetivo de{" "}
              <span className="text-text-primary font-semibold">
                {plan.goal === "gain" ? "ganho de massa" : plan.goal === "loss" ? "perda de peso" : "manutenção"}
              </span>{" "}
              e meta de <span className="text-brand-red font-semibold">{plan.proteinTarget}g</span> de proteína diária.
            </p>
          </Card>
        </section>
      )}
    </AppShell>
  );
}
