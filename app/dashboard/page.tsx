"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import DailyMissions from "@/components/features/DailyMissions";
import StreakBadge from "@/components/features/StreakBadge";
import { storageGet, KEYS, todayISO, type GeneratedPlan, type Mission } from "@/lib/storage";
import { getRecommendedMeals, type MealCategory } from "@/lib/meal-library";
import { loadStreak, recordActivityToday, type StreakData } from "@/lib/streak";
import { loadTodayMissions, toggleMission } from "@/lib/missions";
import { loadAdaptation, type AdaptationState } from "@/lib/adaptation";
import { getRecommendedWorkouts, type LibraryWorkout } from "@/lib/workout-library";
import { getWeekDays, recordWorkoutDate, type WeekDay } from "@/lib/weekly-activity";
import { goalLabels } from "@/lib/plan-generator";
import {
  loadPremium,
  shouldShowPopupToday,
  markPopupShownToday,
  type PremiumState,
} from "@/lib/premium";
import PremiumPopup from "@/components/premium/PremiumPopup";
import PremiumCard  from "@/components/premium/PremiumCard";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardPage() {
  const router = useRouter();
  const [plan,        setPlan]        = useState<GeneratedPlan | null>(null);
  const [streak,      setStreak]      = useState<StreakData>({ current: 0, best: 0, lastActivityDate: "" });
  const [missions,    setMissions]    = useState<Mission[]>([]);
  const [adaptation,  setAdaptation]  = useState<AdaptationState | null>(null);
  const [nextWorkout, setNextWorkout] = useState<LibraryWorkout | null>(null);
  const [weekDays,          setWeekDays]          = useState<WeekDay[]>([]);
  const [justCompletedDate, setJustCompletedDate] = useState<string | null>(null);
  const [mounted,           setMounted]           = useState(false);

  // Premium overlay state
  const [premium,          setPremium]          = useState<PremiumState>({ isPremium: false, activatedAt: null });
  const [showPopup,        setShowPopup]        = useState(false);
  const [showPremiumCard,  setShowPremiumCard]  = useState(false);

  useEffect(() => {
    const p = storageGet<GeneratedPlan>(KEYS.PLAN);
    if (p) {
      setPlan(p);
      setMissions(loadTodayMissions(p));
      setAdaptation(loadAdaptation(p));
      const recommended = getRecommendedWorkouts(p.workoutCategory, p.workoutDifficulty, 6);
      setNextWorkout(recommended[0] ?? null);
    }
    setStreak(loadStreak());
    setWeekDays(getWeekDays());

    // Premium popup — show once per day, after app data is ready
    setPremium(loadPremium());
    if (shouldShowPopupToday()) {
      markPopupShownToday(); // mark immediately so re-navigation doesn't re-trigger
      setShowPopup(true);
    }

    setMounted(true);
  }, []);

  function handleToggleMission(id: string) {
    if (!plan) return;
    const wasWorkoutDone = missions.find((m) => m.id === "workout")?.completed;
    const updated = toggleMission(missions, id);
    setMissions(updated);
    if (id === "workout" && !wasWorkoutDone) {
      setStreak(recordActivityToday());
    }
  }

  function handleDayClick(day: WeekDay) {
    const today = todayISO();
    if (day.date !== today || day.completed) return;
    recordWorkoutDate(today);
    setWeekDays(getWeekDays());
    setJustCompletedDate(today);
    setTimeout(() => setJustCompletedDate(null), 650);
  }

  if (!mounted) return null;

  const calorieGoal  = plan?.calorieTarget ?? 2500;
  const proteinGoal  = plan?.proteinTarget ?? 150;
  const waterGoal    = plan?.waterTarget   ?? 2.5;
  const stepsGoal    = plan?.stepsTarget   ?? 10000;
  const userName     = plan?.userName      ?? "Atleta";

  const mealCat: MealCategory = plan?.goal === "gain" ? "gain" : plan?.goal === "loss" ? "loss" : "maintain";
  const dayMeals = plan
    ? [
        getRecommendedMeals(mealCat, "breakfast", 1)[0],
        getRecommendedMeals(mealCat, "lunch", 1)[0],
        getRecommendedMeals(mealCat, "snack", 1)[0],
        getRecommendedMeals(mealCat, "dinner", 1)[0],
      ].filter(Boolean)
    : [];
  const caloriesBurned = dayMeals.reduce((sum, m) => sum + (m?.totalCalories ?? 0), 0);
  const proteinEaten   = dayMeals.reduce((sum, m) => sum + (m?.totalProtein ?? 0), 0);
  const waterConsumed  = parseFloat((waterGoal * 0.6).toFixed(1));
  const stepsCount     = Math.round(stepsGoal * 0.74);

  const circumference   = 2 * Math.PI * 32;
  const calorieProgress = calorieGoal > 0 && !isNaN(caloriesBurned)
    ? Math.min(1, Math.max(0, caloriesBurned / calorieGoal))
    : 0;

  const weekDone = weekDays.filter((d) => d.completed).length;
  const weekGoal = plan?.workoutFrequency ?? 4;

  return (
    <AppShell>
      {/* Greeting */}
      <section className="px-4 pt-10 pb-4">
        <p className="text-text-secondary text-sm">{greeting()} 👋</p>
        <h1 className="text-2xl font-black text-text-primary tracking-tight mt-0.5">
          {userName.split(" ")[0]}
        </h1>
        <div className="mt-2">
          <StreakBadge streak={streak.current} best={streak.best} compact />
        </div>
        {plan && (
          <p className="text-xs text-text-muted mt-1">
            Plano: {goalLabels[plan.goal]} · {plan.workoutFrequency}x/semana
          </p>
        )}
      </section>

      {/* Activity Ring */}
      <section className="px-4 mb-4">
        <Card glow className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" stroke="#2E2E2E" strokeWidth="8" fill="none" />
              <circle
                cx="40" cy="40" r="32"
                stroke="#E63946" strokeWidth="8" fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - calorieProgress)}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center">
              <p className="text-lg font-black text-text-primary leading-none">{caloriesBurned}</p>
              <p className="text-[9px] text-text-muted">kcal</p>
            </div>
          </div>
          <div className="flex-1 space-y-2.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-secondary">Calorias queimadas</span>
                <span className="text-text-primary font-semibold">
                  {caloriesBurned}/{calorieGoal}
                </span>
              </div>
              <ProgressBar value={caloriesBurned} max={calorieGoal} color="red" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-secondary">Água (L)</span>
                <span className="text-text-primary font-semibold">
                  {waterConsumed}/{waterGoal}
                </span>
              </div>
              <ProgressBar value={waterConsumed} max={waterGoal} color="blue" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-secondary">Passos</span>
                <span className="text-text-primary font-semibold">
                  {stepsCount.toLocaleString("pt-BR")}
                </span>
              </div>
              <ProgressBar value={stepsCount} max={stepsGoal} color="green" />
            </div>
          </div>
        </Card>
      </section>

      {/* Daily Missions */}
      {missions.length > 0 && (
        <section className="px-4 mb-4">
          <h2 className="text-base font-bold text-text-primary mb-3">Missoes do Dia</h2>
          <DailyMissions missions={missions} onToggle={handleToggleMission} />
        </section>
      )}

      {/* Weekly Activity */}
      <section className="px-4 mb-4">
        <h2 className="text-base font-bold text-text-primary mb-3">Atividade da Semana</h2>
        <Card>
          <div className="flex items-end justify-between gap-1">
            {weekDays.map((day) => {
              const isToday = day.date === todayISO();
              const isAnimating = justCompletedDate === day.date;
              return (
                <div
                  key={day.day}
                  onClick={() => handleDayClick(day)}
                  className={[
                    "flex flex-col items-center gap-1.5 flex-1",
                    isToday && !day.completed ? "cursor-pointer" : "cursor-default",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300",
                      day.completed ? "gradient-red text-white" : "bg-dark-muted text-text-muted",
                      isAnimating ? "animate-day-complete" : "",
                    ].join(" ")}
                  >
                    {day.completed ? "✓" : ""}
                  </div>
                  <span className={[
                    "text-[10px]",
                    isToday ? "text-brand-red font-semibold" : "text-text-muted",
                  ].join(" ")}>
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-dark-border flex justify-between items-center">
            <span className="text-xs text-text-secondary">
              {weekDone}/{weekGoal} treinos concluídos
            </span>
            <span className="text-xs font-semibold text-brand-red">
              {Math.round((weekDone / Math.max(weekGoal, 1)) * 100)}%
            </span>
          </div>
        </Card>
      </section>

      {/* Next Workout */}
      {nextWorkout && (
        <section className="px-4 mb-4">
          <h2 className="text-base font-bold text-text-primary mb-3">Próximo Treino</h2>
          <Card glow className="relative overflow-hidden">
            <div className="absolute inset-0 gradient-red opacity-5 pointer-events-none" />
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className="text-xs text-brand-red font-semibold uppercase tracking-wide">
                  {nextWorkout.difficulty}
                </span>
                <h3 className="text-lg font-bold text-text-primary mt-0.5">
                  {nextWorkout.name}
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  {nextWorkout.exerciseCount} exercícios · {nextWorkout.duration} min
                </p>
              </div>
              <button
                onClick={() => router.push(`/workouts/${nextWorkout.id}`)}
                className="w-12 h-12 rounded-xl gradient-red flex items-center justify-center shrink-0 shadow-lg active:scale-95 transition-transform duration-150"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white ml-0.5">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {nextWorkout.muscleGroups.map((group) => (
                <span
                  key={group}
                  className="text-[10px] bg-dark-muted/60 text-text-secondary px-2 py-0.5 rounded-full"
                >
                  {group}
                </span>
              ))}
            </div>
          </Card>
        </section>
      )}

      {/* Nutrition Summary */}
      <section className="px-4 mb-4">
        <h2 className="text-base font-bold text-text-primary mb-3">Nutrição de Hoje</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Calorias",  value: caloriesBurned, goal: calorieGoal, unit: "kcal", color: "red"  as const },
            { label: "Proteína",  value: proteinEaten,                    goal: proteinGoal,  unit: "g",    color: "blue" as const },
          ].map((item) => (
            <Card key={item.label} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-secondary">{item.label}</span>
                <span className="text-xs text-text-muted">
                  {item.value}/{item.goal}{item.unit}
                </span>
              </div>
              <p className="text-xl font-bold text-text-primary">{item.value}</p>
              <ProgressBar value={item.value} max={item.goal} color={item.color} />
            </Card>
          ))}
        </div>
      </section>

      {/* Adaptive notice */}
      {adaptation && adaptation.label !== "Normal" && (
        <section className="px-4 mb-4">
          <Card className="flex items-center gap-3">
            <span className="text-2xl">
              {adaptation.label === "Reduzido" ? "📉" : "📈"}
            </span>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Intensidade {adaptation.label}
              </p>
              <p className="text-xs text-text-secondary">
                {adaptation.label === "Reduzido"
                  ? "Treinos ajustados para recuperação"
                  : "Parabéns! Carga aumentada automaticamente"}
              </p>
            </div>
          </Card>
        </section>
      )}
      {/* ── Premium Popup (auto-shown once per day) ─────────────────────── */}
      {showPopup && (
        <PremiumPopup
          onClose={() => setShowPopup(false)}
          onUpgrade={() => {
            setShowPopup(false);
            setShowPremiumCard(true);
          }}
        />
      )}

      {/* ── Premium Card (full plan sheet, opened from popup CTA) ────────── */}
      {showPremiumCard && (
        <PremiumCard
          state={premium}
          onClose={() => setShowPremiumCard(false)}
        />
      )}

    </AppShell>
  );
}
