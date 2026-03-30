// ── User Profile ─────────────────────────────────────────────────────────────

export const mockUser = {
  name: "Carlos Silva",
  age: 28,
  weight: 82,
  height: 178,
  goal: "Ganho de Massa",
  level: "Intermediário",
  streak: 12,
  avatarInitials: "CS",
};

// ── Dashboard Stats ───────────────────────────────────────────────────────────

export const mockDashboardStats = {
  calories: { burned: 480, goal: 600 },
  water: { consumed: 1.8, goal: 3.0 },
  steps: { count: 7430, goal: 10000 },
  workoutsThisWeek: 3,
  workoutGoalThisWeek: 5,
};

// ── Workouts ──────────────────────────────────────────────────────────────────

export type DifficultyLevel = "Iniciante" | "Intermediário" | "Avançado";
export type MuscleGroup =
  | "Peito"
  | "Costas"
  | "Pernas"
  | "Ombros"
  | "Bíceps"
  | "Tríceps"
  | "Abdômen"
  | "Glúteos"
  | "Full Body";

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: number;
  muscleGroup: MuscleGroup;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: DifficultyLevel;
  muscleGroups: MuscleGroup[];
  exercises: Exercise[];
  completed?: boolean;
}

export const mockWorkouts: Workout[] = [
  {
    id: "w1",
    name: "Peito e Tríceps",
    description: "Treino focado no desenvolvimento do peitoral e tríceps",
    duration: 60,
    difficulty: "Intermediário",
    muscleGroups: ["Peito", "Tríceps"],
    exercises: [
      { id: "e1", name: "Supino Reto", sets: 4, reps: "8-10", rest: 90, muscleGroup: "Peito" },
      { id: "e2", name: "Supino Inclinado", sets: 3, reps: "10-12", rest: 75, muscleGroup: "Peito" },
      { id: "e3", name: "Crucifixo", sets: 3, reps: "12-15", rest: 60, muscleGroup: "Peito" },
      { id: "e4", name: "Tríceps Pulley", sets: 3, reps: "12-15", rest: 60, muscleGroup: "Tríceps" },
      { id: "e5", name: "Mergulho", sets: 3, reps: "10-12", rest: 75, muscleGroup: "Tríceps" },
    ],
    completed: true,
  },
  {
    id: "w2",
    name: "Costas e Bíceps",
    description: "Treino completo para costas largas e bíceps definidos",
    duration: 65,
    difficulty: "Intermediário",
    muscleGroups: ["Costas", "Bíceps"],
    exercises: [
      { id: "e6", name: "Puxada Frontal", sets: 4, reps: "8-10", rest: 90, muscleGroup: "Costas" },
      { id: "e7", name: "Remada Curvada", sets: 4, reps: "8-10", rest: 90, muscleGroup: "Costas" },
      { id: "e8", name: "Remada Unilateral", sets: 3, reps: "10-12", rest: 75, muscleGroup: "Costas" },
      { id: "e9", name: "Rosca Direta", sets: 3, reps: "10-12", rest: 60, muscleGroup: "Bíceps" },
      { id: "e10", name: "Rosca Martelo", sets: 3, reps: "12", rest: 60, muscleGroup: "Bíceps" },
    ],
    completed: false,
  },
  {
    id: "w3",
    name: "Pernas Completo",
    description: "Treino de hipertrofia para quadríceps, posterior e glúteos",
    duration: 75,
    difficulty: "Avançado",
    muscleGroups: ["Pernas", "Glúteos"],
    exercises: [
      { id: "e11", name: "Agachamento Livre", sets: 5, reps: "5-8", rest: 120, muscleGroup: "Pernas" },
      { id: "e12", name: "Leg Press 45°", sets: 4, reps: "10-12", rest: 90, muscleGroup: "Pernas" },
      { id: "e13", name: "Cadeira Extensora", sets: 3, reps: "12-15", rest: 60, muscleGroup: "Pernas" },
      { id: "e14", name: "Mesa Flexora", sets: 3, reps: "12-15", rest: 60, muscleGroup: "Pernas" },
      { id: "e15", name: "Stiff", sets: 3, reps: "10-12", rest: 75, muscleGroup: "Glúteos" },
    ],
    completed: false,
  },
  {
    id: "w4",
    name: "Ombros e Abdômen",
    description: "Ombros tridimensionais e core de ferro",
    duration: 50,
    difficulty: "Intermediário",
    muscleGroups: ["Ombros", "Abdômen"],
    exercises: [
      { id: "e16", name: "Desenvolvimento", sets: 4, reps: "8-10", rest: 90, muscleGroup: "Ombros" },
      { id: "e17", name: "Elevação Lateral", sets: 3, reps: "12-15", rest: 60, muscleGroup: "Ombros" },
      { id: "e18", name: "Elevação Frontal", sets: 3, reps: "12-15", rest: 60, muscleGroup: "Ombros" },
      { id: "e19", name: "Prancha", sets: 3, reps: "60s", rest: 45, muscleGroup: "Abdômen" },
      { id: "e20", name: "Abdominal Crunch", sets: 3, reps: "20", rest: 45, muscleGroup: "Abdômen" },
    ],
    completed: false,
  },
  {
    id: "w5",
    name: "Full Body Iniciante",
    description: "Treino completo para quem está começando",
    duration: 45,
    difficulty: "Iniciante",
    muscleGroups: ["Full Body"],
    exercises: [
      { id: "e21", name: "Agachamento Goblet", sets: 3, reps: "12-15", rest: 60, muscleGroup: "Pernas" },
      { id: "e22", name: "Flexão de Braço", sets: 3, reps: "10-12", rest: 60, muscleGroup: "Peito" },
      { id: "e23", name: "Remada com Haltere", sets: 3, reps: "12", rest: 60, muscleGroup: "Costas" },
      { id: "e24", name: "Desenvolvimento Haltere", sets: 3, reps: "12", rest: 60, muscleGroup: "Ombros" },
      { id: "e25", name: "Prancha", sets: 3, reps: "30s", rest: 45, muscleGroup: "Abdômen" },
    ],
    completed: false,
  },
];

// ── Meals ─────────────────────────────────────────────────────────────────────

export interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: FoodItem[];
}

export const mockMeals: Meal[] = [
  {
    id: "m1",
    name: "Café da Manhã",
    time: "07:30",
    foods: [
      { id: "f1", name: "Ovos mexidos", quantity: "3 un", calories: 210, protein: 18, carbs: 2, fat: 15 },
      { id: "f2", name: "Pão integral", quantity: "2 fatias", calories: 140, protein: 6, carbs: 26, fat: 2 },
      { id: "f3", name: "Banana", quantity: "1 un", calories: 90, protein: 1, carbs: 23, fat: 0 },
    ],
  },
  {
    id: "m2",
    name: "Almoço",
    time: "12:00",
    foods: [
      { id: "f4", name: "Frango grelhado", quantity: "200g", calories: 330, protein: 62, carbs: 0, fat: 7 },
      { id: "f5", name: "Arroz integral", quantity: "150g", calories: 195, protein: 4, carbs: 40, fat: 1 },
      { id: "f6", name: "Brócolis", quantity: "100g", calories: 34, protein: 3, carbs: 7, fat: 0 },
      { id: "f7", name: "Azeite de oliva", quantity: "1 col", calories: 90, protein: 0, carbs: 0, fat: 10 },
    ],
  },
  {
    id: "m3",
    name: "Pré-Treino",
    time: "16:00",
    foods: [
      { id: "f8", name: "Whey Protein", quantity: "1 scoop", calories: 130, protein: 25, carbs: 5, fat: 2 },
      { id: "f9", name: "Batata doce", quantity: "100g", calories: 86, protein: 2, carbs: 20, fat: 0 },
    ],
  },
  {
    id: "m4",
    name: "Jantar",
    time: "20:00",
    foods: [
      { id: "f10", name: "Salmão grelhado", quantity: "180g", calories: 350, protein: 36, carbs: 0, fat: 22 },
      { id: "f11", name: "Batata doce", quantity: "150g", calories: 129, protein: 3, carbs: 30, fat: 0 },
      { id: "f12", name: "Salada verde", quantity: "100g", calories: 20, protein: 1, carbs: 3, fat: 0 },
    ],
  },
];

export const mockNutritionGoal = {
  calories: 2800,
  protein: 180,
  carbs: 300,
  fat: 80,
};

// ── Weekly Activity ───────────────────────────────────────────────────────────

export const mockWeeklyActivity = [
  { day: "Seg", completed: true, calories: 520 },
  { day: "Ter", completed: true, calories: 480 },
  { day: "Qua", completed: false, calories: 0 },
  { day: "Qui", completed: true, calories: 610 },
  { day: "Sex", completed: false, calories: 0 },
  { day: "Sáb", completed: false, calories: 0 },
  { day: "Dom", completed: false, calories: 0 },
];
