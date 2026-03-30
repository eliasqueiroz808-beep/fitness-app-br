import { KEYS, storageGet, storageSet, getMondayISO } from "./storage";
import type { AdaptationState, GeneratedPlan } from "./storage";

export type { AdaptationState };

const MIN_INTENSITY = 0.7;
const MAX_INTENSITY = 1.3;
const STEP = 0.1;

function defaultState(plan: GeneratedPlan): AdaptationState {
  return {
    intensityLevel: 1.0,
    completedThisWeek: 0,
    weekStart: getMondayISO(),
    label: "Normal",
  };
}

function deriveLabel(level: number): AdaptationState["label"] {
  if (level < 1.0) return "Reduzido";
  if (level > 1.0) return "Intensificado";
  return "Normal";
}

export function loadAdaptation(plan: GeneratedPlan): AdaptationState {
  const stored = storageGet<AdaptationState>(KEYS.ADAPTATION);

  if (!stored) {
    return defaultState(plan);
  }

  const currentMonday = getMondayISO();

  if (stored.weekStart !== currentMonday) {
    const completionRate = stored.completedThisWeek / plan.workoutFrequency;
    let newLevel = stored.intensityLevel;

    if (completionRate < 0.6) {
      newLevel = Math.max(MIN_INTENSITY, newLevel - STEP);
    } else if (completionRate > 0.8) {
      newLevel = Math.min(MAX_INTENSITY, newLevel + STEP);
    }

    const updated: AdaptationState = {
      intensityLevel: parseFloat(newLevel.toFixed(1)),
      completedThisWeek: 0,
      weekStart: currentMonday,
      label: deriveLabel(newLevel),
    };

    storageSet(KEYS.ADAPTATION, updated);
    return updated;
  }

  return stored;
}

export function recordWorkoutCompleted(plan: GeneratedPlan): AdaptationState {
  const state = loadAdaptation(plan);

  const updated: AdaptationState = {
    ...state,
    completedThisWeek: state.completedThisWeek + 1,
  };

  storageSet(KEYS.ADAPTATION, updated);
  return updated;
}

export function adaptedDuration(
  baseDuration: number,
  intensityLevel: number
): number {
  return Math.round(baseDuration * intensityLevel);
}

export const intensityColors: Record<
  AdaptationState["label"],
  { text: string; bg: string }
> = {
  Reduzido: {
    text: "text-blue-400",
    bg: "bg-blue-500/20",
  },
  Normal: {
    text: "text-green-400",
    bg: "bg-green-500/20",
  },
  Intensificado: {
    text: "text-brand-red-light",
    bg: "bg-brand-red/20",
  },
};