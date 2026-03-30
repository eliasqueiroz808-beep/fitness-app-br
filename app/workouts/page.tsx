"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useRouter } from "next/navigation";
import { storageGet, storageSet, KEYS, type GeneratedPlan } from "@/lib/storage";
import {
  workoutLibrary,
  getRecommendedWorkouts,
  type LibraryWorkout,
} from "@/lib/workout-library";
import { adaptedDuration } from "@/lib/adaptation";

const difficultyVariant: Record<
  LibraryWorkout["difficulty"],
  "green" | "yellow" | "red"
> = {
  Iniciante: "green",
  Intermediário: "yellow",
  Avançado: "red",
};

function WorkoutCard({
  workout,
  completed,
  onUndo,
  onStart,
  adaptedMin,
}: {
  workout: LibraryWorkout;
  completed: boolean;
  onUndo: () => void;
  onStart: () => void;
  adaptedMin: number;
}) {
  return (
    <Card className={["relative overflow-hidden", completed ? "opacity-70" : ""].join(" ")}>
      {completed && (
        <div className="absolute top-3 right-3">
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">
            ✓ Concluído
          </span>
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl gradient-red flex items-center justify-center shrink-0 shadow-md">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-text-primary truncate pr-20">
            {workout.name}
          </h3>
          <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
            {workout.description}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-text-muted">⏱ {adaptedMin} min</span>
            <span className="text-xs text-text-muted">🔄 {workout.exerciseCount} exercícios</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-border">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={difficultyVariant[workout.difficulty]}>{workout.difficulty}</Badge>
          {workout.muscleGroups.slice(0, 2).map((g) => (
            <Badge key={g} variant="gray">{g}</Badge>
          ))}
        </div>
        {completed ? (
          <button
            onClick={onUndo}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-dark-muted text-text-muted transition-all duration-200 active:scale-95"
          >
            Desfazer
          </button>
        ) : (
          <button
            onClick={onStart}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl gradient-red text-white shadow-md active:scale-95 transition-all duration-200"
          >
            Iniciar
          </button>
        )}
      </div>
    </Card>
  );
}

export default function WorkoutsPage() {
  const [plan,           setPlan]           = useState<GeneratedPlan | null>(null);
  const [completedIds,   setCompletedIds]   = useState<string[]>([]);
  const [recommended,    setRecommended]    = useState<LibraryWorkout[]>([]);
  const [other,          setOther]          = useState<LibraryWorkout[]>([]);
  const [intensityLevel, setIntensityLevel] = useState(1.0);
  const [mounted,        setMounted]        = useState(false);

  useEffect(() => {
    const p    = storageGet<GeneratedPlan>(KEYS.PLAN);
    const done = storageGet<string[]>(KEYS.COMPLETED_WORKOUTS) ?? [];
    setCompletedIds(done);

    if (p) {
      setPlan(p);
      const rec    = getRecommendedWorkouts(p.workoutCategory, p.workoutDifficulty, 6);
      const recIds = new Set(rec.map((w) => w.id));
      setRecommended(rec);
      setOther(workoutLibrary.filter((w) => !recIds.has(w.id)).slice(0, 6));
      const adapt = storageGet<{ intensityLevel: number }>(KEYS.ADAPTATION);
      setIntensityLevel(adapt?.intensityLevel ?? 1.0);
    } else {
      setRecommended(workoutLibrary.slice(0, 8));
    }
    setMounted(true);
  }, []);

  const router = useRouter();

  function handleUndo(workout: LibraryWorkout) {
    const updated = completedIds.filter((id) => id !== workout.id);
    setCompletedIds(updated);
    storageSet(KEYS.COMPLETED_WORKOUTS, updated);
  }

  function handleStart(workout: LibraryWorkout) {
    router.push(`/workouts/${workout.id}`);
  }

  if (!mounted) return null;

  return (
    <AppShell>
      <PageHeader
        title="Treinos"
        subtitle={`${completedIds.length} concluídos · ${recommended.length} recomendados`}
        action={
          <button className="w-9 h-9 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-text-secondary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
          </button>
        }
      />

      {/* Stats Strip */}
      <div className="px-4 mb-5">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Recomendados", value: recommended.length },
            { label: "Concluídos",   value: completedIds.length },
            { label: "Intensidade",  value: `${Math.round(intensityLevel * 100)}%` },
          ].map((stat) => (
            <Card key={stat.label} padding="sm" className="text-center">
              <p className="text-xl font-black text-text-primary">{stat.value}</p>
              <p className="text-[10px] text-text-muted mt-0.5">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommended */}
      {recommended.length > 0 && (
        <section className="px-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
              Recomendados para Você
            </h2>
            <span className="text-[10px] bg-brand-red/20 text-brand-red px-2 py-0.5 rounded-full font-semibold">
              Seu plano
            </span>
          </div>
          <div className="space-y-3">
            {recommended.map((w) => (
              <WorkoutCard
                key={w.id}
                workout={w}
                completed={completedIds.includes(w.id)}
                onUndo={() => handleUndo(w)}
                onStart={() => handleStart(w)}
                adaptedMin={adaptedDuration(w.duration, intensityLevel)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Others */}
      {other.length > 0 && (
        <section className="px-4 mb-5">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
            Explorar Outros Treinos
          </h2>
          <div className="space-y-3">
            {other.map((w) => (
              <WorkoutCard
                key={w.id}
                workout={w}
                completed={completedIds.includes(w.id)}
                onUndo={() => handleUndo(w)}
                onStart={() => handleStart(w)}
                adaptedMin={adaptedDuration(w.duration, intensityLevel)}
              />
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}
