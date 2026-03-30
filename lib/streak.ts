import { KEYS, storageGet, storageSet, todayISO } from "./storage";
import type { StreakData } from "./storage";

export type { StreakData };

export interface StreakMilestone {
  days: number;
  label: string;
  color: "yellow" | "blue" | "red" | "orange";
  icon: string;
}

export const MILESTONES: StreakMilestone[] = [
  { days: 7, label: "Consistente", color: "yellow", icon: "⭐" },
  { days: 21, label: "Focado", color: "blue", icon: "💎" },
  { days: 60, label: "Imparável", color: "red", icon: "🔥" },
  { days: 100, label: "Elite", color: "orange", icon: "👑" },
];

export function getCurrentMilestone(streak: number): StreakMilestone | null {
  return [...MILESTONES].reverse().find((m) => streak >= m.days) ?? null;
}

export function getNextMilestone(streak: number): StreakMilestone | null {
  return MILESTONES.find((m) => streak < m.days) ?? null;
}

export function loadStreak(): StreakData {
  return (
    storageGet<StreakData>(KEYS.STREAK) ?? {
      current: 0,
      best: 0,
      lastActivityDate: "",
    }
  );
}

export function saveStreak(data: StreakData): void {
  storageSet(KEYS.STREAK, data);
}

export function recordActivityToday(): StreakData {
  const today = todayISO();
  const streak = loadStreak();

  if (streak.lastActivityDate === today) {
    return streak;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString().slice(0, 10);

  const newCurrent = streak.lastActivityDate === yesterdayISO ? streak.current + 1 : 1;

  const updated: StreakData = {
    current: newCurrent,
    best: Math.max(streak.best, newCurrent),
    lastActivityDate: today,
  };

  saveStreak(updated);
  return updated;
}

export const milestoneColorClasses: Record<
  StreakMilestone["color"],
  { bg: string; text: string; border: string }
> = {
  yellow: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
  },
  blue: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  red: {
    bg: "bg-brand-red/20",
    text: "text-brand-red-light",
    border: "border-brand-red/30",
  },
  orange: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/30",
  },
};