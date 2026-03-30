// ── Web Speech API (TTS) wrapper ──────────────────────────────────────────────
// All voice output uses the browser's built-in speech synthesis.
// No audio files required.

function isSpeechAvailable(): boolean {
  return (
    typeof window !== "undefined" && "speechSynthesis" in window
  );
}

let utteranceQueue: SpeechSynthesisUtterance[] = [];

export function speak(text: string, rateMod = 0): void {
  if (!isSpeechAvailable()) return;

  window.speechSynthesis.cancel();
  utteranceQueue = [];

  const u = new SpeechSynthesisUtterance(text);
  u.lang   = "pt-BR";
  u.rate   = 0.9 + rateMod;
  u.pitch  = 1.0;
  u.volume = 1.0;

  // Prefer a Portuguese voice when available
  const voices = window.speechSynthesis.getVoices();
  const ptVoice = voices.find(
    (v) => v.lang.startsWith("pt") && !v.name.includes("Google")
  ) ?? voices.find((v) => v.lang.startsWith("pt"));
  if (ptVoice) u.voice = ptVoice;

  window.speechSynthesis.speak(u);
}

/** Speak two sentences sequentially: name then instruction */
export function speakExercise(name: string, instruction: string): void {
  if (!isSpeechAvailable()) return;

  window.speechSynthesis.cancel();

  const u1 = new SpeechSynthesisUtterance(name);
  u1.lang  = "pt-BR";
  u1.rate  = 0.85;
  u1.pitch = 1.05;

  const pause = new SpeechSynthesisUtterance("…");
  pause.lang   = "pt-BR";
  pause.volume = 0;
  pause.rate   = 2.0;

  const u2 = new SpeechSynthesisUtterance(instruction);
  u2.lang  = "pt-BR";
  u2.rate  = 0.9;

  const voices = window.speechSynthesis.getVoices();
  const ptVoice = voices.find((v) => v.lang.startsWith("pt"));
  [u1, pause, u2].forEach((u) => {
    if (ptVoice) u.voice = ptVoice;
  });

  window.speechSynthesis.speak(u1);
  window.speechSynthesis.speak(pause);
  window.speechSynthesis.speak(u2);
}

export type AudioCue =
  | "prepare"
  | "start"
  | "rest"
  | "complete"
  | "halfway"
  | "three"
  | "two"
  | "one";

const CUE_TEXT: Record<AudioCue, string> = {
  prepare:  "Prepare-se!",
  start:    "Começar!",
  rest:     "Descanse agora.",
  complete: "Treino concluído! Excelente trabalho!",
  halfway:  "Metade feita, continue!",
  three:    "3",
  two:      "2",
  one:      "1",
};

export function speakCue(cue: AudioCue): void {
  speak(CUE_TEXT[cue]);
}

export function stopSpeech(): void {
  if (!isSpeechAvailable()) return;
  window.speechSynthesis.cancel();
}

/** Must be called once on user gesture to unlock speech on iOS */
export function unlockSpeech(): void {
  if (!isSpeechAvailable()) return;
  const u = new SpeechSynthesisUtterance(" ");
  u.volume = 0;
  window.speechSynthesis.speak(u);
}
