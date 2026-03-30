// ── Session phase machine ─────────────────────────────────────────────────────

export type Phase =
  | "overview"   // before workout starts
  | "prepare"    // countdown before each exercise
  | "active"     // exercise is running
  | "rest"       // rest between exercises
  | "complete";  // all exercises done

export interface PhaseConfig {
  label: string;
  sublabel: string;
  ringColor: string;   // Tailwind stroke color class
  badgeBg: string;
  badgeText: string;
}

export const PHASE_CONFIG: Record<Exclude<Phase, "overview" | "complete">, PhaseConfig> = {
  prepare: {
    label:      "Preparar",
    sublabel:   "Próximo exercício",
    ringColor:  "#EAB308",   // yellow-500
    badgeBg:    "bg-yellow-500/20",
    badgeText:  "text-yellow-400",
  },
  active: {
    label:      "Ativo",
    sublabel:   "Execute o exercício",
    ringColor:  "#E63946",   // brand-red
    badgeBg:    "bg-brand-red/20",
    badgeText:  "text-brand-red-light",
  },
  rest: {
    label:      "Descanso",
    sublabel:   "Recupere o fôlego",
    ringColor:  "#3B82F6",   // blue-500
    badgeBg:    "bg-blue-500/20",
    badgeText:  "text-blue-400",
  },
};

export interface SessionSummary {
  workoutId: string;
  workoutName: string;
  exerciseCount: number;
  totalDurationSec: number;
  completedAt: string;  // ISO string
}

export function buildSummary(
  workoutId: string,
  workoutName: string,
  exerciseCount: number,
  totalDurationSec: number
): SessionSummary {
  return {
    workoutId,
    workoutName,
    exerciseCount,
    totalDurationSec,
    completedAt: new Date().toISOString(),
  };
}

/** Format seconds as mm:ss */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Estimate total workout duration from guided exercises */
export function estimateTotalSec(
  exercises: { prepSec: number; durationSec: number; restSec: number }[]
): number {
  return exercises.reduce(
    (acc, ex) => acc + ex.prepSec + ex.durationSec + ex.restSec,
    0
  );
}
