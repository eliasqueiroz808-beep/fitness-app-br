import {
  KEYS,
  storageGet,
  storageSet,
  getMondayISO,
  todayISO,
  type WeeklyActivityData,
} from "./storage";

export interface WeekDay {
  day: string;       // "Seg" | "Ter" | "Qua" | "Qui" | "Sex" | "Sáb" | "Dom"
  date: string;      // "YYYY-MM-DD"
  completed: boolean;
}

const PT_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const;

/** Parse an ISO date string as UTC midnight to avoid local-timezone shifts. */
function isoToUTCMidnight(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function defaultData(): WeeklyActivityData {
  return { weekStart: getMondayISO(), completedDates: [] };
}

/** Load weekly activity from storage. Auto-resets when a new week begins. */
export function loadWeeklyActivity(): WeeklyActivityData {
  const stored = storageGet<WeeklyActivityData>(KEYS.WEEKLY_ACTIVITY);
  if (!stored) return defaultData();

  if (stored.weekStart !== getMondayISO()) {
    const fresh = defaultData();
    storageSet(KEYS.WEEKLY_ACTIVITY, fresh);
    return fresh;
  }

  return stored;
}

/**
 * Record that a workout was completed on the given date (defaults to today).
 * Idempotent — calling it multiple times for the same date has no effect.
 */
export function recordWorkoutDate(date: string = todayISO()): void {
  const data = loadWeeklyActivity();
  if (data.completedDates.includes(date)) return;
  storageSet(KEYS.WEEKLY_ACTIVITY, {
    ...data,
    completedDates: [...data.completedDates, date],
  });
}

/**
 * Returns the 7 days of the current week (Mon–Sun) with real completion status.
 * Safe to call on every render — reads from localStorage once per call.
 */
export function getWeekDays(): WeekDay[] {
  const data = loadWeeklyActivity();
  const monday = isoToUTCMidnight(data.weekStart);

  return PT_DAYS.map((label, i) => {
    const date = new Date(monday.getTime() + i * 86_400_000);
    const iso = date.toISOString().slice(0, 10);
    return {
      day: label,
      date: iso,
      completed: data.completedDates.includes(iso),
    };
  });
}
