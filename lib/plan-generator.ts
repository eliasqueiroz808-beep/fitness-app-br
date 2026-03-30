import type {
  OnboardingData,
  GeneratedPlan,
  GoalType,
  LevelType,
} from "./storage";

// ── BMR + TDEE ────────────────────────────────────────────────────────────────

function calcBMR(
  weight: number,
  height: number,
  age: number,
  sex: "male" | "female"
): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

const activityMultiplier: Record<LevelType, number> = {
  beginner: 1.375,
  intermediate: 1.55,
  advanced: 1.725,
};

function calcCalorieTarget(tdee: number, goal: GoalType): number {
  switch (goal) {
    case "loss":
      return Math.round(tdee - 500);
    case "gain":
      return Math.round(tdee + 300);
    case "endurance":
      return Math.round(tdee + 100);
    case "maintain":
    default:
      return Math.round(tdee);
  }
}

// ── Macros ────────────────────────────────────────────────────────────────────

function calcMacros(
  calories: number,
  weight: number,
  goal: GoalType
): { protein: number; carbs: number; fat: number } {
  switch (goal) {
    case "gain":
      return {
        protein: Math.round(weight * 2.2),
        carbs: Math.round((calories * 0.45) / 4),
        fat: Math.round((calories * 0.25) / 9),
      };
    case "loss":
      return {
        protein: Math.round(weight * 2.4),
        carbs: Math.round((calories * 0.35) / 4),
        fat: Math.round((calories * 0.30) / 9),
      };
    case "endurance":
      return {
        protein: Math.round(weight * 1.6),
        carbs: Math.round((calories * 0.55) / 4),
        fat: Math.round((calories * 0.25) / 9),
      };
    case "maintain":
    default:
      return {
        protein: Math.round(weight * 1.8),
        carbs: Math.round((calories * 0.40) / 4),
        fat: Math.round((calories * 0.30) / 9),
      };
  }
}

// ── Plan mappings ─────────────────────────────────────────────────────────────

const workoutFrequency: Record<LevelType, number> = {
  beginner: 3,
  intermediate: 4,
  advanced: 5,
};

const difficultyMap: Record<LevelType, GeneratedPlan["workoutDifficulty"]> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

const workoutCategoryMap: Record<GoalType, GeneratedPlan["workoutCategory"]> = {
  loss: "loss",
  gain: "gain",
  maintain: "maintain",
  endurance: "maintain",
};

const stepsTarget: Record<GoalType, number> = {
  loss: 10000,
  gain: 8000,
  maintain: 9000,
  endurance: 12000,
};

// ── Main generator ────────────────────────────────────────────────────────────

export function generatePlan(data: OnboardingData): GeneratedPlan {
  const bmr = calcBMR(data.weight, data.height, data.age, data.sex);
  const tdee = bmr * activityMultiplier[data.level];
  const calorieTarget = calcCalorieTarget(tdee, data.goal);
  const { protein, carbs, fat } = calcMacros(calorieTarget, data.weight, data.goal);
  const waterTarget = parseFloat((data.weight * 0.035).toFixed(1));

  return {
    goal: data.goal,
    level: data.level,
    userName: data.name,
    calorieTarget,
    proteinTarget: protein,
    carbTarget: carbs,
    fatTarget: fat,
    waterTarget,
    stepsTarget: stepsTarget[data.goal],
    workoutFrequency: workoutFrequency[data.level],
    workoutCategory: workoutCategoryMap[data.goal],
    workoutDifficulty: difficultyMap[data.level],
    createdAt: new Date().toISOString(),
  };
}

// ── Display helpers ───────────────────────────────────────────────────────────

export const goalLabels: Record<GoalType, string> = {
  loss: "Perda de Peso",
  gain: "Ganho de Massa",
  maintain: "Manutenção",
  endurance: "Resistência",
};

export const levelLabels: Record<LevelType, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};
