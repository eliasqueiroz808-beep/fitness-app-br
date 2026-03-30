import type { LibraryWorkout } from "./workout-library";
import type { MuscleGroup } from "./mock-data";

// ── Types ─────────────────────────────────────────────────────────────────────
//
// NOTE: Fields mediaType / mediaUrl / audioNameUrl / audioInstructionUrl have
// been removed. Workouts that supply explicit `videoExercises` use those URLs
// directly and never reach this layer. The phase-timer path (non-video) only
// needs timing + instruction data — no auto-generated media keys.

export interface GuidedExercise {
  id: string;
  name: string;
  prepSec: number;
  durationSec: number;  // total active time (derived from reps or explicit seconds)
  reps: number;         // display only; 0 = purely timed
  restSec: number;
  instruction: string;
  muscleGroup: MuscleGroup;
}

// ── Curated coaching instructions ─────────────────────────────────────────────

const INSTRUCTIONS: Record<string, string> = {
  // HIIT / cardio
  "Burpee":                     "Agache, deite, faça a flexão, levante e salte com os braços acima.",
  "Agachamento Jump":            "Agache a noventa graus e salte explosivamente, aterrisse suave.",
  "Flexão de Braço":             "Core rígido, desça até o peito quase tocar o chão, empurre.",
  "Mountain Climber":            "Traga o joelho ao peito alternando em ritmo constante.",
  "Polichinelo":                 "Braços e pernas abrem e fecham simultaneamente, mantenha o ritmo.",
  "Corrida estacionária":        "Eleve os joelhos até o quadril, braços em movimento sincronizado.",
  "Abdominal Crunch":            "Contraia o abdômen, eleve os ombros sem puxar o pescoço.",
  "Prancha":                     "Core contraído, quadril alinhado, respire de forma controlada.",
  "Elevação de Perna":           "Pernas juntas, suba até noventa graus, desça sem tocar o chão.",
  "Bicicleta Abdominal":         "Cotovelo toca o joelho oposto, mantenha a lombar pressionada.",
  "Prancha Lateral":             "Quadril elevado, corpo em linha reta, olhe para frente.",
  "Russian Twist":               "Gire o tronco de lado a lado, pés elevados para mais dificuldade.",
  "Dead Bug":                    "Braço e perna opostos descem juntos, lombar sempre no chão.",
  "Polichinelo Sprint":          "Máxima velocidade nos braços e pernas, explosivo!",
  "Burpee com Salto":            "Adicione o salto máximo no topo, terra com joelhos semiflexos.",
  "Sprint Estacionário":         "Pernas rápidas como possível, braços bombeando forte.",
  "Mountain Climber Rápido":     "Máxima velocidade, core estabilizado, não deixe o quadril subir.",
  "Flexão Explosiva":            "Empurre com força suficiente para as mãos saírem do chão.",
  // legs / glutes
  "Agachamento Sumo":            "Pés afastados, pontas para fora, desça mantendo joelhos alinhados.",
  "Avanço Alternado":            "Joelho traseiro quase toca o chão, tronco ereto durante todo o movimento.",
  "Elevação Pélvica":            "Quadril sobe até ficar alinhado com o tronco, contraia no topo.",
  "Cadeira com Haltere":         "Joelhos em noventa graus, glúteos firmes, desça controlando.",
  "Stiff com Haltere":           "Coluna neutra, descida sentindo o posterior da coxa, suba.",
  "Agachamento Búlgaro":         "Pé traseiro elevado, desça verticalmente, joelho frontal no alinhamento.",
  "Elevação Pélvica com Peso":   "Barra sobre o quadril, empurre para cima contraindo os glúteos no topo.",
  "Mesa Flexora Unilateral":     "Curve um joelho por vez, desça devagar em três segundos.",
  "Abdução de Quadril Lateral":  "Eleve a perna lateralmente mantendo o quadril estável.",
  // push
  "Supino Reto com Barra":       "Barra desce ao esterno controlada, empurre em linha reta.",
  "Supino Inclinado Haltere":    "Halteres na altura do peito, empurre convergindo ao centro.",
  "Crucifixo Haltere":           "Abra como asas sentindo o peitoral, cotovelos levemente flexionados.",
  "Tríceps Pulley":              "Cotovelos fixos ao lado do tronco, extenda completamente.",
  "Mergulho entre Bancos":       "Desça até noventa graus nos cotovelos, empurre o corpo para cima.",
  "Supino Reto":                 "Barra desce ao peito, empurre expirando, não trave os cotovelos.",
  "Supino Inclinado":            "Banco a quarenta e cinco graus, foco na parte superior do peitoral.",
  "Crucifixo":                   "Abra os braços amplamente, sinta o alongamento no peito.",
  "Tríceps Testa":               "Barras descem até a testa, cotovelos apontando para cima.",
  "Tríceps Corda":               "Divida a corda no final da extensão, cotovelos fixos.",
  "Desenvolvimento Militar":     "Barra sobe acima da cabeça, core rígido, sem arquear a lombar.",
  "Tríceps Testa Haltere":       "Haltere desce ao lado da cabeça, cotovelos apontados para cima.",
  "Supino Fechado":              "Pegada na largura dos ombros, foco máximo no tríceps.",
  "Flexão Diamante":             "Polegares se tocam formando losango, cotovelos junto ao corpo.",
  // pull
  "Barra Fixa":                  "Puxe o peito à barra, desça controlado até extensão completa.",
  "Remada Curvada com Barra":    "Tronco paralelo, puxe a barra até o umbigo, escápulas se aproximam.",
  "Puxada Frontal":              "Puxe à clavícula, cotovelos apontam para baixo e para trás.",
  "Rosca Direta com Barra":      "Cotovelos fixos, suba sem balançar o tronco, contraia no topo.",
  "Rosca Concentrada":           "Cotovelo no joelho, contração máxima, desça totalmente.",
  "Barra Fixa com Carga":        "Peso adicional aumenta a tensão, desça com controle total.",
  "Remada Curvada":              "Costas paralelas, puxe forte até o umbigo, sem balançar.",
  "Remada Cavalinho":            "Cotovelos saem para os lados, puxe até o peito.",
  "Puxada Aberta":               "Pegada larga, puxe amplo para trabalhar a largura das costas.",
  "Rosca Direta":                "Cotovelos fixos, concentre-se na contração do bíceps.",
  "Rosca Martelo":               "Pulso neutro, suba e desça controlando o movimento.",
  "Rosca Scott":                 "Apoie o tríceps no banco, isole completamente o bíceps.",
  "Rosca Alternada":             "Alterne os braços, mantenha o cotovelo do lado sem trabalhar fixo.",
  // legs advanced
  "Agachamento Livre":           "Desça além de noventa graus, joelhos no alinhamento dos pés.",
  "Leg Press 45°":               "Pés na largura dos ombros, desça até noventa graus nos joelhos.",
  "Cadeira Extensora":           "Extenda completamente e desça em três segundos.",
  "Mesa Flexora":                "Curve os joelhos até noventa graus, desça sem deixar cair.",
  "Stiff com Barra":             "Coluna neutra, descida sentindo o posterior da coxa.",
  "Panturrilha em Pé":           "Suba na ponta dos pés completamente, desça controlando.",
  "Agachamento Frontal":         "Barra nos deltoides, tronco ereto, cotovelos elevados.",
  "Hack Squat":                  "Pés baixos para focar no quadríceps, desça fundo.",
  "Leg Curl":                    "Curve até noventa graus, desça controlando a negativa.",
  "Hip Thrust com Barra":        "Barra sobre o quadril, empurre alto e contraia os glúteos.",
  "Panturrilha Sentado":         "Peso sobre os joelhos, amplitude máxima de movimento.",
  "Avanço com Haltere":          "Passo longo, tronco ereto, joelho traseiro quase no chão.",
  // shoulders
  "Desenvolvimento":             "Empurre acima da cabeça, cotovelos levemente à frente.",
  "Elevação Lateral":            "Cotovelos levemente flexionados, suba até a altura dos ombros.",
  "Elevação Frontal":            "Braços à frente, suba até noventa graus, desça controlando.",
  "Remada Alta":                 "Puxe a barra ao queixo, cotovelos sobem acima dos ombros.",
  "Encolhimento Haltere":        "Ombros sobem em direção às orelhas, segure e desça.",
  "Desenvolvimento com Barra":   "Barra sobe à extensão, core firme, não arquear a lombar.",
  "Desenvolvimento Haltere":     "Alternado ou simultâneo, controle a descida.",
  // core
  "Prancha com Alternância":     "Toque o ombro oposto alternando sem rotacionar o quadril.",
  "Prancha Dinâmica":            "Deça ao cotovelo e suba alternando, quadril estável.",
  "Bird Dog":                    "Braço e perna opostos em linha reta, 2 segundos de pausa no topo.",
  "Avanço com Rotação":          "Avance e gire o tronco para o lado da perna da frente.",
  "Superman":                    "Eleve braços e pernas ao mesmo tempo, segure 2 segundos.",
  "Kettlebell Swing":            "Quadril empurra para frente explosivamente, não é agachamento.",
  "Clean com Haltere":           "Puxe o haltere do chão em um movimento contínuo até o ombro.",
  "Thruster":                    "Agachamento + desenvolvimento em um único movimento fluido.",
  "Box Jump":                    "Salto explosivo sobre a caixa, aterrisse com joelhos semiflexos.",
  "Farmer Carry":                "Pesos pesados, tronco ereto, passos controlados.",
  "Turco Getup":                 "Sequência lenta e controlada, olhos no kettlebell o tempo todo.",
  "Prancha com Toque":           "Toque o ombro oposto mantendo o quadril completamente estável.",
  "Agachamento com Peso Corporal": "Pés na largura dos ombros, desça fundo, joelhos atrás dos pés.",
  "Avanço Estático":             "Joelhos em noventa graus, descida vertical sem joelho tocar o chão.",
  "Agachamento com Barra":       "Barra na armadilha superior, desça fundo com joelhos alinhados.",
  "Levantamento Terra":          "Coluna neutra, empurre o chão, quadril sobe na mesma velocidade.",
  "Caminhada Inclinada":         "Passadas firmes, core ativo, velocidade moderada e constante.",
  "Remada com Haltere":          "Um joelho no banco, puxe o cotovelo acima da linha do tronco.",
  "Agachamento Goblet":          "Peso ao peito, desça fundo, cotovelos dentro dos joelhos.",
  "Flexão com Rotação":          "Desce em flexão, sobe e gira abrindo um braço ao teto.",
  "Bom Dia com Haltere":         "Incline o tronco à frente com coluna reta, sinta o posterior.",
  "Pull Over":                   "Haltere parte do peito, desce atrás da cabeça sentindo o dorsal.",
  "Remada com Barra T":          "Puxe o peso junto ao abdômen, cotovelos para trás.",
  "Puxada Fechada":              "Pegada neutra, puxe o peito à barra focando no centro do dorsal.",
  "Remada Unilateral":           "Um braço por vez, isole o dorsal, cotovelo sobe alto.",
  "Crossover Pulley":            "Mãos cruzam à frente do peito, peitoral contraído no centro.",
  "Flexão com Carga":            "Peso nas costas aumenta o desafio, mesma técnica da flexão padrão.",
  "Supino Declinado":            "Banco inclinado para baixo, foco na parte inferior do peitoral.",
  "Corda de Pular":              "Pernas levemente flexionadas, pulsos giram, não os braços.",
};

function defaultInstruction(name: string): string {
  return (
    INSTRUCTIONS[name] ??
    "Mantenha a postura correta, respire de forma controlada e execute com qualidade."
  );
}

// ── Reps string → total active seconds ────────────────────────────────────────

export function parseRepsToSeconds(reps: string): number {
  const r = reps.trim().toLowerCase();
  if (r.includes("min")) return parseInt(r) * 60;
  if (r.endsWith("s"))   return parseInt(r);
  if (r.includes("-")) {
    const [lo, hi] = r.split("-").map(Number);
    return Math.round(((lo + hi) / 2) * 3);
  }
  if (r.includes("cada")) return parseInt(r) * 3 * 2;
  if (r.includes("m") && !r.includes("ma")) return parseInt(r) * 60;
  const n = parseInt(r);
  return isNaN(n) ? 30 : n * 3;
}

// ── Main converter ─────────────────────────────────────────────────────────────
//
// Returns an empty array for workouts that declare `videoExercises`.
// Those workouts are handled entirely by VideoSession using the explicit
// Cloudinary URLs — no auto-generated timing, instructions, or media needed.

export function getGuidedExercises(workout: LibraryWorkout): GuidedExercise[] {
  // Video workouts: session is driven by explicit videoUrl per exercise.
  // Do not generate placeholder animation data for them.
  if (workout.videoExercises?.length) return [];

  return workout.exercises.map((ex) => {
    const durationSec = parseRepsToSeconds(ex.reps);
    const repsNum     = /^\d+$/.test(ex.reps.trim()) ? parseInt(ex.reps) : 0;

    return {
      id:          ex.id,
      name:        ex.name,
      prepSec:     5,
      durationSec: Math.max(durationSec, 10),
      reps:        repsNum,
      restSec:     ex.rest,
      instruction: defaultInstruction(ex.name),
      muscleGroup: ex.muscleGroup,
    };
  });
}
