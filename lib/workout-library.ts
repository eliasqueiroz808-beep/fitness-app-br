import type { DifficultyLevel, MuscleGroup } from "./mock-data";

export type WorkoutCategory = "loss" | "gain" | "maintain";

export interface VideoExercise {
  id: string;
  name: string;
  /** "mp4" (Cloudinary) | "youtube" (nocookie iframe) | "gdrive" (Drive preview iframe) */
  videoType?: "mp4" | "youtube" | "gdrive";
  /** Used when videoType is "mp4" (or undefined for backwards-compat) */
  videoUrl?: string;
  /** Used when videoType is "youtube" or "gdrive" — embed/preview URL base */
  embedUrl?: string;
  instructions: string;
  reps: string;   // e.g. "10 reps" | "45s" | "120s"
  rest: string;
}

export interface LibraryWorkout {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: DifficultyLevel;
  muscleGroups: MuscleGroup[];
  exerciseCount: number;
  category: WorkoutCategory;
  exercises: {
    id: string;
    name: string;
    sets: number;
    reps: string;
    rest: number;
    muscleGroup: MuscleGroup;
  }[];
  /** If present, the session page plays these videos instead of the phase-timer flow */
  videoExercises?: VideoExercise[];
}

// ── Loss workouts (12) ────────────────────────────────────────────────────────

const lossWorkouts: LibraryWorkout[] = [
  {
    id: "lw1",
    name: "Circuito HIIT Full Body",
    description: "Circuito intenso de alta frequência cardíaca para queima máxima",
    duration: 35,
    difficulty: "Iniciante",
    muscleGroups: ["Full Body"],
    exerciseCount: 5,
    category: "loss",
    exercises: [
      { id: "lw1e1", name: "Burpee", sets: 4, reps: "10", rest: 30, muscleGroup: "Full Body" },
      { id: "lw1e2", name: "Agachamento Jump", sets: 4, reps: "12", rest: 30, muscleGroup: "Pernas" },
      { id: "lw1e3", name: "Flexão de Braço", sets: 3, reps: "10", rest: 30, muscleGroup: "Peito" },
      { id: "lw1e4", name: "Mountain Climber", sets: 3, reps: "20", rest: 30, muscleGroup: "Abdômen" },
      { id: "lw1e5", name: "Polichinelo", sets: 3, reps: "30", rest: 20, muscleGroup: "Full Body" },
    ],
    videoExercises: [
      {
        id: "lw1-v1",
        name: "Burpee",
        videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1774481914/Burpee_n4tpmd.mp4",
        instructions: "Agache, deite, faça a flexão, levante e salte com os braços acima.",
        reps: "10 reps",
        rest: "30s descanso",
      },
      {
        id: "lw1-v2",
        name: "Agachamento Jump",
        videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1774481903/Agachamento_jump_cwqvdf.mp4",
        instructions: "Agache e salte explosivamente, pousando com controle.",
        reps: "12 reps",
        rest: "30s descanso",
      },
      {
        id: "lw1-v3",
        name: "Flexão de Braço",
        videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1774481852/Flex%C3%A3o_de_bra%C3%A7o_x7mfqw.mp4",
        instructions: "Desça o peito com controle e empurre o corpo de volta.",
        reps: "10 reps",
        rest: "30s descanso",
      },
      {
        id: "lw1-v4",
        name: "Mountain Climber",
        videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1774623331/Mountain_climber_edj1mb.mp4",
        instructions: "Alterne os joelhos em direção ao peito com ritmo e controle.",
        reps: "20 reps",
        rest: "30s descanso",
      },
      {
        id: "lw1-v5",
        name: "Polichinelo",
        videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1774622869/Polichinelo_Certo_1.0_perdex.mp4",
        instructions: "Abra braços e pernas ao mesmo tempo e retorne à posição inicial.",
        reps: "30 reps",
        rest: "20s descanso",
      },
    ],
  },
  {
    id: "lw2",
    name: "Cardio + Abdominal",
    description: "Combinação eficiente de cardio e trabalho abdominal",
    duration: 40,
    difficulty: "Iniciante",
    muscleGroups: ["Abdômen", "Full Body"],
    exerciseCount: 5,
    category: "loss",
    exercises: [
      { id: "lw2e1", name: "Corrida estacionária", sets: 3, reps: "2min", rest: 60, muscleGroup: "Full Body" },
      { id: "lw2e2", name: "Abdominal Crunch", sets: 3, reps: "20", rest: 30, muscleGroup: "Abdômen" },
      { id: "lw2e3", name: "Prancha", sets: 3, reps: "45s", rest: 30, muscleGroup: "Abdômen" },
      { id: "lw2e4", name: "Elevação de Perna", sets: 3, reps: "15", rest: 30, muscleGroup: "Abdômen" },
      { id: "lw2e5", name: "Bicicleta Abdominal", sets: 3, reps: "20", rest: 30, muscleGroup: "Abdômen" },
    ],
    videoExercises: [
      {
        id: "lw2-v1",
        name: "Corrida estacionária",
        videoType: "youtube",
        embedUrl: "https://www.youtube-nocookie.com/embed/UniqB3qVQwQ",
        instructions: "Corra no lugar elevando os joelhos na altura do quadril, mantendo o ritmo constante.",
        reps: "120s",
        rest: "60s descanso",
      },
      {
        id: "lw2-v2",
        name: "Abdominal Crunch",
        videoType: "mp4",
        videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1774659650/Abdominal_grunch_q8fi5m.mp4",
        instructions: "Deite, flexione os joelhos e eleve o tronco contraindo o abdômen. Desça com controle.",
        reps: "20 reps",
        rest: "30s descanso",
      },
      {
        id: "lw2-v3",
        name: "Prancha",
        videoType: "mp4",
        videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1774698214/Prancha_1_s2onan.mp4",
        instructions: "Apoie nos antebraços e nas pontas dos pés. Mantenha o corpo reto e o abdômen contraído.",
        reps: "45s",
        rest: "30s descanso",
      },
      {
        id: "lw2-v4",
        name: "Elevação de Perna",
        videoType: "mp4",
        videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1774659563/Eleva%C3%A7%C3%A3o_de_perna_ce41qy.mp4",
        instructions: "Deite de costas, pernas estendidas. Eleve as pernas até 90° e desça sem tocar o chão.",
        reps: "15 reps",
        rest: "30s descanso",
      },
      {
        id: "lw2-v5",
        name: "Bicicleta Abdominal",
        videoType: "mp4",
        videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1774737190/Bicicleta_Abdominal_1_epue9y.mp4",
        instructions: "Alterne cotovelo e joelho contrários em movimento de pedalada, torcendo o tronco.",
        reps: "20 reps",
        rest: "30s descanso",
      },
    ],
  },
  {
    id: "lw3",
    name: "Queima - Pernas e Glúteos",
    description: "Circuito focado em pernas e glúteos com alta repetição",
    duration: 45,
    difficulty: "Intermediário",
    muscleGroups: ["Pernas", "Glúteos"],
    exerciseCount: 5,
    category: "loss",
    exercises: [
      { id: "lw3e1", name: "Agachamento Sumo", sets: 4, reps: "15", rest: 45, muscleGroup: "Pernas" },
      { id: "lw3e2", name: "Avanço Alternado", sets: 3, reps: "12 cada", rest: 45, muscleGroup: "Pernas" },
      { id: "lw3e3", name: "Elevação Pélvica", sets: 4, reps: "20", rest: 30, muscleGroup: "Glúteos" },
      { id: "lw3e4", name: "Agachamento Jump", sets: 3, reps: "12", rest: 45, muscleGroup: "Pernas" },
      { id: "lw3e5", name: "Cadeira com Haltere", sets: 3, reps: "15", rest: 30, muscleGroup: "Glúteos" },
    ],
    videoExercises: [
      {
        id: "lw3-v1",
        name: "Agachamento Sumo",
        videoType: "youtube",
        embedUrl: "https://www.youtube-nocookie.com/embed/yK_ouRKmy28",
        instructions: "Posicione os pés mais afastados que a largura dos ombros com os pés apontados para fora. Agache mantendo o tronco ereto e os joelhos alinhados com os pés.",
        reps: "15 reps",
        rest: "45s descanso",
      },
      {
        id: "lw3-v2",
        name: "Avanço Alternado",
        videoType: "youtube",
        embedUrl: "https://www.youtube-nocookie.com/embed/kRehd-NYnVk",
        instructions: "Dê um passo à frente e desça o joelho traseiro em direção ao chão. Empurre de volta e alterne as pernas.",
        reps: "72s",
        rest: "45s descanso",
      },
      {
        id: "lw3-v3",
        name: "Elevação Pélvica",
        videoType: "youtube",
        embedUrl: "https://www.youtube-nocookie.com/embed/7g-DQNuBNE4",
        instructions: "Deitado com os pés apoiados no chão, eleve o quadril contraindo os glúteos no topo e desça com controle.",
        reps: "20 reps",
        rest: "30s descanso",
      },
      {
        id: "lw3-v4",
        name: "Agachamento Jump",
        videoType: "youtube",
        embedUrl: "https://www.youtube-nocookie.com/embed/kRehd-NYnVk",
        instructions: "Agache e salte explosivamente, pousando com os joelhos levemente flexionados para absorver o impacto.",
        reps: "12 reps",
        rest: "45s descanso",
      },
      {
        id: "lw3-v5",
        name: "Cadeira com Haltere",
        videoType: "mp4",
        videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1774747627/Cadeira_com_haltere_dxtaes.mp4",
        instructions: "Segure o haltere à frente do peito, agache até as coxas ficarem paralelas ao chão e empurre de volta.",
        reps: "15 reps",
        rest: "30s descanso",
      },
    ],
  },
  {
    id: "lw8",
    name: "Tabata Funcional",
    description: "Protocolo Tabata 20s esforço / 10s repouso, 8 rodadas",
    duration: 25,
    difficulty: "Avançado",
    muscleGroups: ["Full Body"],
    exerciseCount: 4,
    category: "loss",
    exercises: [
      { id: "lw8e1", name: "Agachamento Tabata", sets: 8, reps: "20s", rest: 10, muscleGroup: "Pernas" },
      { id: "lw8e2", name: "Flexão Tabata", sets: 8, reps: "20s", rest: 10, muscleGroup: "Peito" },
      { id: "lw8e3", name: "Mountain Climber Tabata", sets: 8, reps: "20s", rest: 10, muscleGroup: "Abdômen" },
      { id: "lw8e4", name: "Burpee Tabata", sets: 8, reps: "20s", rest: 10, muscleGroup: "Full Body" },
    ],
  },
  {
    id: "lw9",
    name: "Queima Glúteos + Posterior",
    description: "Foco na região glútea e posterior da coxa com exercícios sculpt",
    duration: 45,
    difficulty: "Iniciante",
    muscleGroups: ["Glúteos", "Pernas"],
    exerciseCount: 4,
    category: "loss",
    exercises: [
      { id: "lw9e1", name: "Stiff com Haltere", sets: 4, reps: "15", rest: 45, muscleGroup: "Glúteos" },
      { id: "lw9e2", name: "Agachamento Búlgaro", sets: 3, reps: "12 cada", rest: 45, muscleGroup: "Pernas" },
      { id: "lw9e3", name: "Elevação Pélvica com Peso", sets: 4, reps: "20", rest: 30, muscleGroup: "Glúteos" },
      { id: "lw9e5", name: "Abdução de Quadril Lateral", sets: 3, reps: "20 cada", rest: 30, muscleGroup: "Glúteos" },
    ],
    videoExercises: [
      {
        id: "lw9-v1",
        name: "Stiff com Haltere",
        videoType: "mp4",
        videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1774699502/Stiff_com_halteres_irscxc.mp4",
        instructions: "Em pé com halteres na frente das coxas, incline o tronco mantendo as costas retas até sentir o alongamento no posterior.",
        reps: "15 reps",
        rest: "45s descanso",
      },
      {
        id: "lw9-v2",
        name: "Agachamento Búlgaro",
        videoType: "youtube",
        embedUrl: "https://www.youtube-nocookie.com/embed/05DnQUpEV2M",
        instructions: "Apoie o pé traseiro num banco, agache com o pé da frente até a coxa ficar paralela ao chão. Alterne os lados.",
        reps: "72s",
        rest: "45s descanso",
      },
      {
        id: "lw9-v3",
        name: "Elevação Pélvica com Peso",
        videoType: "youtube",
        embedUrl: "https://www.youtube-nocookie.com/embed/7g-DQNuBNE4",
        instructions: "Deitada com os ombros no banco, eleve o quadril com o peso no colo contraindo os glúteos no topo do movimento.",
        reps: "20 reps",
        rest: "30s descanso",
      },
      {
        id: "lw9-v5",
        name: "Abdução de Quadril Lateral",
        videoType: "gdrive",
        embedUrl: "https://drive.google.com/file/d/1yJPq6lGUrfC-HipuUAZ7YwUM798jzMZL/preview",
        instructions: "De lado no solo ou em pé com resistência, eleve a perna lateralmente contraindo o glúteo médio. Alterne os lados.",
        reps: "120s",
        rest: "30s descanso",
      },
    ],
  },
  {
    id: "lw10",
    name: "Treino Funcional Intenso",
    description: "Movimentos funcionais de alta intensidade para queima total",
    duration: 45,
    difficulty: "Avançado",
    muscleGroups: ["Full Body"],
    exerciseCount: 5,
    category: "loss",
    exercises: [
      { id: "lw10e1", name: "Clean com Haltere", sets: 4, reps: "8", rest: 60, muscleGroup: "Full Body" },
      { id: "lw10e2", name: "Thruster", sets: 4, reps: "8", rest: 60, muscleGroup: "Full Body" },
      { id: "lw10e3", name: "Swing Kettlebell", sets: 3, reps: "15", rest: 45, muscleGroup: "Full Body" },
      { id: "lw10e4", name: "Box Jump", sets: 3, reps: "10", rest: 60, muscleGroup: "Pernas" },
      { id: "lw10e5", name: "Farmer Carry", sets: 3, reps: "30m", rest: 60, muscleGroup: "Full Body" },
    ],
  },
  {
    id: "lw11",
    name: "Circuito de Resistência",
    description: "Circuito com alta repetição para resistência e queima de gordura",
    duration: 50,
    difficulty: "Intermediário",
    muscleGroups: ["Full Body"],
    exerciseCount: 4,
    category: "loss",
    exercises: [
      { id: "lw11e1", name: "Agachamento 20 reps", sets: 3, reps: "20", rest: 30, muscleGroup: "Pernas" },
      { id: "lw11e2", name: "Flexão 20 reps", sets: 3, reps: "20", rest: 30, muscleGroup: "Peito" },
      { id: "lw11e3", name: "Abdominal 25 reps", sets: 3, reps: "25", rest: 30, muscleGroup: "Abdômen" },
      { id: "lw11e4", name: "Avanço 15 reps", sets: 3, reps: "15 cada", rest: 30, muscleGroup: "Pernas" },
    ],
  },
  {
    id: "lw12",
    name: "Cardio + Peito + Costas",
    description: "Treino de superior com intervalos de cardio para queima extra",
    duration: 55,
    difficulty: "Intermediário",
    muscleGroups: ["Peito", "Costas"],
    exerciseCount: 4,
    category: "loss",
    exercises: [
      { id: "lw12e1", name: "Corda de Pular", sets: 3, reps: "2min", rest: 60, muscleGroup: "Full Body" },
      { id: "lw12e2", name: "Supino Haltere", sets: 3, reps: "15", rest: 45, muscleGroup: "Peito" },
      { id: "lw12e3", name: "Puxada no Pulley", sets: 3, reps: "15", rest: 45, muscleGroup: "Costas" },
      { id: "lw12e4", name: "Corda de Pular", sets: 3, reps: "1min", rest: 45, muscleGroup: "Full Body" },
    ],
  },
];

// ── Gain workouts (12) ────────────────────────────────────────────────────────

const gainWorkouts: LibraryWorkout[] = [
  {
    id: "gw1",
    name: "Peito e Tríceps - Força",
    description: "Hipertrofia máxima para peitoral e tríceps com cargas pesadas",
    duration: 65,
    difficulty: "Intermediário",
    muscleGroups: ["Peito", "Tríceps"],
    exerciseCount: 5,
    category: "gain",
    exercises: [
      { id: "gw1e1", name: "Supino Reto com Barra", sets: 5, reps: "5-6", rest: 120, muscleGroup: "Peito" },
      { id: "gw1e2", name: "Supino Inclinado Haltere", sets: 4, reps: "8-10", rest: 90, muscleGroup: "Peito" },
      { id: "gw1e3", name: "Crucifixo Haltere", sets: 3, reps: "10-12", rest: 60, muscleGroup: "Peito" },
      { id: "gw1e4", name: "Tríceps Pulley", sets: 4, reps: "10-12", rest: 60, muscleGroup: "Tríceps" },
      { id: "gw1e5", name: "Mergulho entre Bancos", sets: 3, reps: "12-15", rest: 60, muscleGroup: "Tríceps" },
    ],
  },
  {
    id: "gw2",
    name: "Costas e Bíceps - Massa",
    description: "Construção de costas largas e bíceps volumosos",
    duration: 70,
    difficulty: "Intermediário",
    muscleGroups: ["Costas", "Bíceps"],
    exerciseCount: 5,
    category: "gain",
    exercises: [
      { id: "gw2e1", name: "Barra Fixa", sets: 4, reps: "6-8", rest: 120, muscleGroup: "Costas" },
      { id: "gw2e2", name: "Remada Curvada com Barra", sets: 4, reps: "8-10", rest: 90, muscleGroup: "Costas" },
      { id: "gw2e3", name: "Puxada Frontal", sets: 3, reps: "10-12", rest: 75, muscleGroup: "Costas" },
      { id: "gw2e4", name: "Rosca Direta com Barra", sets: 4, reps: "8-10", rest: 75, muscleGroup: "Bíceps" },
      { id: "gw2e5", name: "Rosca Concentrada", sets: 3, reps: "12", rest: 60, muscleGroup: "Bíceps" },
    ],
  },
  {
    id: "gw3",
    name: "Pernas - Hipertrofia",
    description: "Volume máximo para quadríceps, isquiotibiais e glúteos",
    duration: 80,
    difficulty: "Avançado",
    muscleGroups: ["Pernas", "Glúteos"],
    exerciseCount: 4,
    category: "gain",
    exercises: [
      { id: "gw3e1", name: "Agachamento Livre", sets: 5, reps: "6-8", rest: 120, muscleGroup: "Pernas" },
      { id: "gw3e2", name: "Leg Press 45°", sets: 4, reps: "10-12", rest: 90, muscleGroup: "Pernas" },
      { id: "gw3e3", name: "Cadeira Extensora", sets: 3, reps: "12-15", rest: 60, muscleGroup: "Pernas" },
      { id: "gw3e4", name: "Mesa Flexora", sets: 3, reps: "12-15", rest: 60, muscleGroup: "Pernas" },
    ],
  },
  {
    id: "gw8",
    name: "Braços Completo",
    description: "Volume total para bíceps e tríceps: braços que impressionam",
    duration: 50,
    difficulty: "Intermediário",
    muscleGroups: ["Bíceps", "Tríceps"],
    exerciseCount: 4,
    category: "gain",
    exercises: [
      { id: "gw8e1", name: "Rosca Direta Barra", sets: 4, reps: "8-10", rest: 75, muscleGroup: "Bíceps" },
      { id: "gw8e2", name: "Rosca Martelo", sets: 3, reps: "10-12", rest: 60, muscleGroup: "Bíceps" },
      { id: "gw8e3", name: "Rosca Scott", sets: 3, reps: "10-12", rest: 60, muscleGroup: "Bíceps" },
      { id: "gw8e4", name: "Tríceps Pulley Barra", sets: 4, reps: "10-12", rest: 75, muscleGroup: "Tríceps" },
    ],
  },
  {
    id: "gw9",
    name: "Peito - Volume Máximo",
    description: "Sessão dedicada ao peito com múltiplos ângulos de ataque",
    duration: 60,
    difficulty: "Avançado",
    muscleGroups: ["Peito"],
    exerciseCount: 5,
    category: "gain",
    exercises: [
      { id: "gw9e1", name: "Supino Reto Pesado", sets: 5, reps: "5", rest: 150, muscleGroup: "Peito" },
      { id: "gw9e2", name: "Supino Inclinado", sets: 4, reps: "8-10", rest: 90, muscleGroup: "Peito" },
      { id: "gw9e3", name: "Supino Declinado", sets: 3, reps: "10-12", rest: 75, muscleGroup: "Peito" },
      { id: "gw9e4", name: "Crossover Pulley", sets: 3, reps: "12-15", rest: 60, muscleGroup: "Peito" },
      { id: "gw9e5", name: "Flexão com Carga", sets: 3, reps: "12-15", rest: 60, muscleGroup: "Peito" },
    ],
  },
  {
    id: "gw10",
    name: "Costas - Largura e Espessura",
    description: "Trabalho dual para expandir a largura e espessura das costas",
    duration: 65,
    difficulty: "Avançado",
    muscleGroups: ["Costas"],
    exerciseCount: 5,
    category: "gain",
    exercises: [
      { id: "gw10e1", name: "Barra Fixa Supinada", sets: 4, reps: "6-8", rest: 120, muscleGroup: "Costas" },
      { id: "gw10e2", name: "Remada com Barra T", sets: 4, reps: "8-10", rest: 90, muscleGroup: "Costas" },
      { id: "gw10e3", name: "Puxada Fechada", sets: 3, reps: "10-12", rest: 75, muscleGroup: "Costas" },
      { id: "gw10e4", name: "Remada Unilateral", sets: 3, reps: "10-12 cada", rest: 75, muscleGroup: "Costas" },
      { id: "gw10e5", name: "Pull Over", sets: 3, reps: "12-15", rest: 60, muscleGroup: "Costas" },
    ],
  },
  {
    id: "gw11",
    name: "Pernas + Glúteos - Massa",
    description: "Hipertrofia completa para trem inferior: quadríceps e glúteos",
    duration: 75,
    difficulty: "Intermediário",
    muscleGroups: ["Pernas", "Glúteos"],
    exerciseCount: 5,
    category: "gain",
    exercises: [
      { id: "gw11e1", name: "Agachamento Livre", sets: 4, reps: "8-10", rest: 90, muscleGroup: "Pernas" },
      { id: "gw11e2", name: "Leg Press", sets: 4, reps: "10-12", rest: 75, muscleGroup: "Pernas" },
      { id: "gw11e3", name: "Hip Thrust com Barra", sets: 4, reps: "12-15", rest: 60, muscleGroup: "Glúteos" },
      { id: "gw11e4", name: "Stiff Haltere", sets: 3, reps: "10-12", rest: 75, muscleGroup: "Glúteos" },
      { id: "gw11e5", name: "Avanço com Haltere", sets: 3, reps: "10 cada", rest: 60, muscleGroup: "Pernas" },
    ],
  },
  {
    id: "gw12",
    name: "Full Body Força",
    description: "Treino de força completo para ganho de força total",
    duration: 70,
    difficulty: "Iniciante",
    muscleGroups: ["Full Body"],
    exerciseCount: 5,
    category: "gain",
    exercises: [
      { id: "gw12e1", name: "Agachamento com Barra", sets: 4, reps: "8-10", rest: 90, muscleGroup: "Pernas" },
      { id: "gw12e2", name: "Supino Reto", sets: 4, reps: "8-10", rest: 90, muscleGroup: "Peito" },
      { id: "gw12e3", name: "Barra Fixa", sets: 3, reps: "6-8", rest: 90, muscleGroup: "Costas" },
      { id: "gw12e4", name: "Desenvolvimento Ombros", sets: 3, reps: "8-10", rest: 75, muscleGroup: "Ombros" },
      { id: "gw12e5", name: "Levantamento Terra", sets: 3, reps: "6-8", rest: 120, muscleGroup: "Full Body" },
    ],
  },
  {
    id: "gw-peito-triceps",
    name: "Peito e Tríceps - Força",
    description: "Treino guiado em vídeo focado em peito e tríceps para ganho de força e volume",
    duration: 45,
    difficulty: "Intermediário",
    muscleGroups: ["Peito", "Tríceps"],
    exerciseCount: 5,
    category: "gain",
    exercises: [
      { id: "gw-pt-e1", name: "Supino reto",              sets: 4, reps: "10",    rest: 60, muscleGroup: "Peito" },
      { id: "gw-pt-e2", name: "Crucifixo com halteres",   sets: 3, reps: "12",    rest: 60, muscleGroup: "Peito" },
      { id: "gw-pt-e3", name: "Tríceps no banco",         sets: 3, reps: "12",    rest: 60, muscleGroup: "Tríceps" },
      { id: "gw-pt-e4", name: "Flexão de braço",          sets: 3, reps: "15",    rest: 60, muscleGroup: "Peito" },
      { id: "gw-pt-e5", name: "Cable Crossover",          sets: 3, reps: "12",    rest: 60, muscleGroup: "Peito" },
    ],
    videoExercises: [
      {
        id: "gw-pt-v1",
        name: "Supino reto",
        videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1773011755/supino_reto_ketnio.mp4",
        instructions: "Deite no banco, segure a barra na largura dos ombros e desça com controle até o peito.",
        reps: "4x10",
        rest: "60s descanso",
      },
      {
        id: "gw-pt-v2",
        name: "Crucifixo com halteres",
        videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/Crucifixo_com_halteres_ou_banco_vqgrki.mp4",
        instructions: "Abra os braços em arco, mantendo leve flexão no cotovelo, e feche no centro.",
        reps: "3x12",
        rest: "60s descanso",
      },
      {
        id: "gw-pt-v3",
        name: "Tríceps no banco",
        videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1773011745/Tr%C3%ADceps_no_banco_l4xcvo.mp4",
        instructions: "Apoie as mãos no banco, dobre os cotovelos abaixando o quadril e empurre de volta.",
        reps: "3x12",
        rest: "60s descanso",
      },
      {
        id: "gw-pt-v4",
        name: "Flexão de braço",
        videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1773011820/flex%C3%A3o_de_bra%C3%A7o_n96oyy.mp4",
        instructions: "Desça o peito com controle mantendo o corpo alinhado e empurre o corpo de volta.",
        reps: "3x15",
        rest: "60s descanso",
      },
      {
        id: "gw-pt-v5",
        name: "Cable Crossover",
        videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1773011750/exercicio_com_arco_nlrgae.mp4",
        instructions: "Puxe os cabos em arco à frente do corpo, contraindo o peito no centro do movimento.",
        reps: "3x12",
        rest: "60s descanso",
      },
    ],
  },
];

// ── Maintain workouts (8) ─────────────────────────────────────────────────────

const maintainWorkouts: LibraryWorkout[] = [
  {
    id: "mw2",
    name: "Funcional + Core",
    description: "Exercícios funcionais para mobilidade, força e estabilidade",
    duration: 45,
    difficulty: "Iniciante",
    muscleGroups: ["Full Body", "Abdômen"],
    exerciseCount: 5,
    category: "maintain",
    exercises: [
      { id: "mw2e1", name: "Agachamento Goblet", sets: 3, reps: "12", rest: 45, muscleGroup: "Pernas" },
      { id: "mw2e2", name: "Prancha Dinâmica", sets: 3, reps: "10 cada", rest: 30, muscleGroup: "Abdômen" },
      { id: "mw2e3", name: "Flexão de Braço", sets: 3, reps: "12", rest: 45, muscleGroup: "Peito" },
      { id: "mw2e4", name: "Bird Dog", sets: 3, reps: "10 cada", rest: 30, muscleGroup: "Abdômen" },
      { id: "mw2e5", name: "Avanço com Rotação", sets: 3, reps: "10 cada", rest: 45, muscleGroup: "Full Body" },
    ],
  },
  {
    id: "mw3",
    name: "Resistência Muscular",
    description: "Treino de resistência com altas repetições e curto descanso",
    duration: 45,
    difficulty: "Intermediário",
    muscleGroups: ["Full Body"],
    exerciseCount: 5,
    category: "maintain",
    exercises: [
      { id: "mw3e1", name: "Supino Haltere", sets: 3, reps: "15-20", rest: 45, muscleGroup: "Peito" },
      { id: "mw3e2", name: "Remada com Haltere", sets: 3, reps: "15-20", rest: 45, muscleGroup: "Costas" },
      { id: "mw3e3", name: "Agachamento", sets: 3, reps: "20", rest: 45, muscleGroup: "Pernas" },
      { id: "mw3e4", name: "Elevação Lateral", sets: 3, reps: "15-20", rest: 30, muscleGroup: "Ombros" },
      { id: "mw3e5", name: "Abdominal", sets: 3, reps: "20", rest: 30, muscleGroup: "Abdômen" },
    ],
  },
  {
    id: "mw4",
    name: "Circuito Equilibrado",
    description: "Circuito completo para manutenção da composição corporal",
    duration: 40,
    difficulty: "Iniciante",
    muscleGroups: ["Full Body"],
    exerciseCount: 5,
    category: "maintain",
    exercises: [
      { id: "mw4e1", name: "Polichinelo", sets: 3, reps: "30", rest: 30, muscleGroup: "Full Body" },
      { id: "mw4e2", name: "Flexão de Braço", sets: 3, reps: "10", rest: 30, muscleGroup: "Peito" },
      { id: "mw4e3", name: "Agachamento Livre", sets: 3, reps: "15", rest: 30, muscleGroup: "Pernas" },
      { id: "mw4e4", name: "Mountain Climber", sets: 3, reps: "20", rest: 30, muscleGroup: "Abdômen" },
      { id: "mw4e5", name: "Avanço Alternado", sets: 3, reps: "12 cada", rest: 30, muscleGroup: "Pernas" },
    ],
  },
  {
    id: "mw5",
    name: "Força + Mobilidade",
    description: "Combina exercícios de força com mobilidade articular",
    duration: 55,
    difficulty: "Intermediário",
    muscleGroups: ["Full Body"],
    exerciseCount: 5,
    category: "maintain",
    exercises: [
      { id: "mw5e1", name: "Agachamento Profundo", sets: 3, reps: "10", rest: 60, muscleGroup: "Pernas" },
      { id: "mw5e2", name: "Flexão com Rotação", sets: 3, reps: "8 cada", rest: 45, muscleGroup: "Peito" },
      { id: "mw5e3", name: "Bom Dia com Haltere", sets: 3, reps: "12", rest: 60, muscleGroup: "Costas" },
      { id: "mw5e4", name: "Turco Getup", sets: 3, reps: "5 cada", rest: 60, muscleGroup: "Full Body" },
      { id: "mw5e5", name: "Prancha com Toque", sets: 3, reps: "10 cada", rest: 45, muscleGroup: "Abdômen" },
    ],
  },
  {
    id: "mw6",
    name: "Treino Completo Moderado",
    description: "Volume moderado para cada grupo muscular, sem excessos",
    duration: 60,
    difficulty: "Intermediário",
    muscleGroups: ["Full Body"],
    exerciseCount: 4,
    category: "maintain",
    exercises: [
      { id: "mw6e1", name: "Leg Press", sets: 3, reps: "12", rest: 60, muscleGroup: "Pernas" },
      { id: "mw6e2", name: "Supino Inclinado", sets: 3, reps: "12", rest: 60, muscleGroup: "Peito" },
      { id: "mw6e3", name: "Puxada Frontal", sets: 3, reps: "12", rest: 60, muscleGroup: "Costas" },
      { id: "mw6e4", name: "Desenvolvimento", sets: 3, reps: "12", rest: 60, muscleGroup: "Ombros" },
    ],
  },
  {
    id: "mw8",
    name: "Treino de Manutenção",
    description: "Treino simples e eficiente para manter os resultados conquistados",
    duration: 45,
    difficulty: "Iniciante",
    muscleGroups: ["Full Body"],
    exerciseCount: 5,
    category: "maintain",
    exercises: [
      { id: "mw8e1", name: "Agachamento com Peso Corporal", sets: 3, reps: "15", rest: 45, muscleGroup: "Pernas" },
      { id: "mw8e2", name: "Flexão de Braço", sets: 3, reps: "12", rest: 45, muscleGroup: "Peito" },
      { id: "mw8e3", name: "Prancha", sets: 3, reps: "45s", rest: 30, muscleGroup: "Abdômen" },
      { id: "mw8e4", name: "Avanço Estático", sets: 3, reps: "12 cada", rest: 45, muscleGroup: "Pernas" },
      { id: "mw8e5", name: "Superman", sets: 3, reps: "15", rest: 30, muscleGroup: "Costas" },
    ],
  },
];

// ── Combined library & helpers ─────────────────────────────────────────────────

export const workoutLibrary: LibraryWorkout[] = [
  ...lossWorkouts,
  ...gainWorkouts,
  ...maintainWorkouts,
];

export function getWorkoutsByCategory(category: WorkoutCategory): LibraryWorkout[] {
  return workoutLibrary.filter((w) => w.category === category);
}

export function getWorkoutsByDifficulty(
  difficulty: LibraryWorkout["difficulty"]
): LibraryWorkout[] {
  return workoutLibrary.filter((w) => w.difficulty === difficulty);
}

export function getRecommendedWorkouts(
  category: WorkoutCategory,
  difficulty: LibraryWorkout["difficulty"],
  limit = 6
): LibraryWorkout[] {
  const exact = workoutLibrary.filter(
    (w) => w.category === category && w.difficulty === difficulty
  );
  if (exact.length >= limit) return exact.slice(0, limit);
  // fill remainder from same category with different difficulty
  const rest = workoutLibrary
    .filter((w) => w.category === category && w.difficulty !== difficulty)
    .slice(0, limit - exact.length);
  return [...exact, ...rest];
}
