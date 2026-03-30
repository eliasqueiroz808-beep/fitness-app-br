import {
  KEYS,
  storageGet,
  storageSet,
  todayISO,
  type Mission,
  type DailyMissionsData,
  type GeneratedPlan,
} from "./storage";

// ── Mission pool ──────────────────────────────────────────────────────────────
//
// Missions are split into two buckets:
//   FIXED   — always appears (core pillars: workout, water, protein)
//   ROTATED — a pool of extras; 2 are chosen per day via a deterministic
//             day-based seed so the same date always yields the same pair,
//             but different dates yield different combinations.
//
// This gives: 3 fixed + 2 rotating = 5 missions / day, with 36 possible
// pairings from the 9-item extras pool — enough variety to avoid repetition
// for weeks.

interface MissionTemplate {
  id: string;
  label: (plan: GeneratedPlan) => string;
  icon: string;
}

const FIXED_MISSIONS: MissionTemplate[] = [
  {
    id: "workout",
    label: () => "Complete o treino de hoje",
    icon: "💪",
  },
  {
    id: "water",
    label: (p) => `Beba ${p.waterTarget}L de água`,
    icon: "💧",
  },
  {
    id: "protein",
    label: (p) => `Atinja ${p.proteinTarget}g de proteína`,
    icon: "🥩",
  },
];

const ROTATING_POOL: MissionTemplate[] = [
  {
    id: "steps",
    label: (p) => `Alcance ${p.stepsTarget.toLocaleString("pt-BR")} passos`,
    icon: "👟",
  },
  {
    id: "stretch",
    label: () => "Faça 10 minutos de alongamento",
    icon: "🧘",
  },
  {
    id: "cardio",
    label: () => "Realize 20 minutos de cardio",
    icon: "🏃",
  },
  {
    id: "mobility",
    label: () => "Complete uma sessão de mobilidade",
    icon: "🔄",
  },
  {
    id: "walk",
    label: () => "Caminhe por pelo menos 30 minutos",
    icon: "🚶",
  },
  {
    id: "recovery",
    label: () => "Faça uma atividade de recuperação",
    icon: "🛁",
  },
  {
    id: "log_meals",
    label: () => "Registre todas as refeições do dia",
    icon: "📋",
  },
  {
    id: "sleep",
    label: () => "Durma pelo menos 7 horas esta noite",
    icon: "😴",
  },
  {
    id: "mindset",
    label: () => "5 minutos de respiração ou meditação",
    icon: "🧠",
  },
];

// ── Deterministic daily seed ──────────────────────────────────────────────────
//
// Converts "YYYY-MM-DD" → a stable integer so the same date always picks
// the same two extras from the pool. Uses a simple hash to ensure good
// distribution without any external dependency.

function dateSeed(iso: string): number {
  return iso.split("-").reduce((acc, part) => acc * 31 + parseInt(part, 10), 0);
}

function pickRotating(date: string): MissionTemplate[] {
  const pool = [...ROTATING_POOL];
  const seed = dateSeed(date);
  const n = pool.length;

  // Fisher-Yates partial shuffle seeded by date — take first 2 items
  for (let i = 0; i < 2; i++) {
    const j = i + ((seed + i * 7) % (n - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, 2);
}

// ── Public API ─────────────────────────────────────────────────────────────────

export function generateMissions(plan: GeneratedPlan, date: string = todayISO()): Mission[] {
  const rotating = pickRotating(date);

  return [...FIXED_MISSIONS, ...rotating].map((t) => ({
    id: t.id,
    label: t.label(plan),
    icon: t.icon,
    completed: false,
  }));
}

export function loadTodayMissions(plan: GeneratedPlan): Mission[] {
  const today = todayISO();
  const stored = storageGet<DailyMissionsData>(KEYS.MISSIONS);

  if (stored?.date === today) return stored.missions;

  // New day — generate fresh missions for today's date
  const missions = generateMissions(plan, today);
  saveMissions({ date: today, missions });
  return missions;
}

export function saveMissions(data: DailyMissionsData): void {
  storageSet(KEYS.MISSIONS, data);
}

export function toggleMission(missions: Mission[], id: string): Mission[] {
  const today = todayISO();
  const updated = missions.map((m) =>
    m.id === id ? { ...m, completed: !m.completed } : m
  );
  saveMissions({ date: today, missions: updated });
  return updated;
}

export function missionsCompletionRate(missions: Mission[]): number {
  if (!missions.length) return 0;
  return missions.filter((m) => m.completed).length / missions.length;
}
