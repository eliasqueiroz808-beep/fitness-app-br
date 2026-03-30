// ── Typed localStorage helpers ────────────────────────────────────────────────

export const KEYS = {
  ONBOARDING: "fitbr_onboarding",
  PLAN: "fitbr_plan",
  STREAK: "fitbr_streak",
  ADAPTATION: "fitbr_adaptation",
  MISSIONS: "fitbr_missions",
  COMPLETED_WORKOUTS: "fitbr_completed_workouts",
  WEEKLY_ACTIVITY: "fitbr_weekly_activity",
  // Profile settings
  THEME: "fitbr_theme",           // plain string "dark"|"light" — NOT JSON-encoded
  NOTIFICATIONS: "fitbr_notifications",
  PROFILE_PHOTO: "fitbr_profile_photo",
} as const;

export function storageGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function storageSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded – fail silently
  }
}

export function storageRemove(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

// ── Domain types stored in localStorage ───────────────────────────────────────

export type GoalType = "loss" | "gain" | "maintain" | "endurance";
export type LevelType = "beginner" | "intermediate" | "advanced";
export type SexType = "male" | "female";

export interface OnboardingData {
  name: string;
  goal: GoalType;
  level: LevelType;
  weight: number;
  height: number;
  age: number;
  sex: SexType;
}

export interface GeneratedPlan {
  goal: GoalType;
  level: LevelType;
  userName: string;
  calorieTarget: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
  waterTarget: number;     // litres
  stepsTarget: number;
  workoutFrequency: number; // days/week
  workoutCategory: "loss" | "gain" | "maintain";
  workoutDifficulty: "Iniciante" | "Intermediário" | "Avançado";
  createdAt: string;
}

export interface StreakData {
  current: number;
  best: number;
  lastActivityDate: string; // "YYYY-MM-DD"
}

export interface AdaptationState {
  intensityLevel: number;   // 0.7 – 1.3
  completedThisWeek: number;
  weekStart: string;        // "YYYY-MM-DD" of Monday
  label: "Reduzido" | "Normal" | "Intensificado";
}

export interface Mission {
  id: string;
  label: string;
  icon: string;
  completed: boolean;
}

export interface DailyMissionsData {
  date: string; // "YYYY-MM-DD"
  missions: Mission[];
}

export interface CompletedWorkouts {
  weekStart: string;        // Monday "YYYY-MM-DD"
  ids: string[];
}

export interface WeeklyActivityData {
  weekStart: string;        // Monday "YYYY-MM-DD" (UTC)
  completedDates: string[]; // ISO dates of workout completions this week
}

// ── Date helpers ──────────────────────────────────────────────────────────────

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getMondayISO(date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}
