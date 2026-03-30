"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

// ── Shared imports ──────────────────────────────────────────────────────────
import { workoutLibrary, type LibraryWorkout } from "@/lib/workout-library";
import { storageGet, storageSet, KEYS, type GeneratedPlan } from "@/lib/storage";
import { recordWorkoutCompleted } from "@/lib/adaptation";
import { recordActivityToday }    from "@/lib/streak";
import { recordWorkoutDate }      from "@/lib/weekly-activity";
import { loadTodayMissions, toggleMission } from "@/lib/missions";
import type { Mission } from "@/lib/storage";

// ── Phase-timer-only imports (never used by VideoSession) ───────────────────
import ExerciseMedia from "@/components/session/ExerciseMedia";
import PhaseTimer    from "@/components/session/PhaseTimer";
import { getGuidedExercises } from "@/lib/guided-exercises";
import { speak, speakCue, speakExercise, unlockSpeech, stopSpeech } from "@/lib/audio";
import { type Phase, PHASE_CONFIG, formatTime, estimateTotalSec } from "@/lib/session";

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO SESSION
// Used exclusively for workouts that declare `videoExercises`.
// Zero dependency on the phase-timer system, TTS, or auto-generated media.
// ═══════════════════════════════════════════════════════════════════════════════

function VideoSession({ workout }: { workout: LibraryWorkout }) {
  const router    = useRouter();
  const exercises = workout.videoExercises!;
  const total     = exercises.length;

  const [exIdx,     setExIdx]     = useState(0);
  const [paused,    setPaused]    = useState(false);
  const [completed, setCompleted] = useState(false);

  const videoRef  = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // progress reflects the current exercise (20 % → 40 % → … → 100 %)
  const progress = Math.round(((exIdx + 1) / total) * 100);

  // Derived: what type is the current exercise?
  const currentType = exercises[exIdx]?.videoType ?? "mp4";

  // Helper: send a postMessage command to the YouTube iframe
  function ytCommand(func: string, args: unknown = "") {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "https://www.youtube-nocookie.com"
    );
  }

  // ── On exercise change: reset pause state and start the new video ─────────
  useEffect(() => {
    setPaused(false);

    if (currentType === "mp4") {
      const v = videoRef.current;
      if (!v) return;
      v.load();
      v.play().catch(() => {});
    }

    if (currentType === "youtube") {
      // Give the iframe ~1 s to initialise, then play + unmute + full volume
      const t = setTimeout(() => {
        ytCommand("playVideo");
        ytCommand("unMute");
        ytCommand("setVolume", [100]);
      }, 1000);
      return () => clearTimeout(t);
    }
    // gdrive: iframe reloads automatically via key={ex.id}; no API available
  }, [exIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync pause/resume with the active player ──────────────────────────────
  useEffect(() => {
    if (currentType === "mp4") {
      const v = videoRef.current;
      if (!v) return;
      if (paused) v.pause();
      else        v.play().catch(() => {});
    }

    if (currentType === "youtube") {
      ytCommand(paused ? "pauseVideo" : "playVideo");
      if (!paused) ytCommand("unMute");
    }

    // gdrive: no JS API — pause state is reflected in the button label only
  }, [paused]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleEnded() {
    if (exIdx < total - 1) {
      setExIdx((i) => i + 1);
    } else {
      // ── Record workout completion ──────────────────────────────────────────
      const done    = storageGet<string[]>(KEYS.COMPLETED_WORKOUTS) ?? [];
      const updated = done.includes(workout.id) ? done : [...done, workout.id];
      storageSet(KEYS.COMPLETED_WORKOUTS, updated);

      const plan = storageGet<GeneratedPlan>(KEYS.PLAN);
      if (plan) recordWorkoutCompleted(plan);
      recordActivityToday();
      recordWorkoutDate();
      if (plan) {
        const missions: Mission[] = loadTodayMissions(plan);
        const missionDone = missions.find((m) => m.id === "workout")?.completed;
        if (!missionDone) toggleMission(missions, "workout");
      }

      setCompleted(true);
    }
  }

  // ── Completion screen ─────────────────────────────────────────────────────
  if (completed) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-6 text-center gap-8">
        <div className="w-28 h-28 rounded-full bg-yellow-500/20 border-2 border-yellow-500/40 flex items-center justify-center">
          <span className="text-5xl">🏆</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-text-primary">Treino concluído</h1>
          <p className="text-text-secondary text-base">Excelente trabalho! Continue assim.</p>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3 w-full">
          <span className="text-xl">✅</span>
          <p className="text-sm text-green-400 font-medium">
            Treino registrado · Sequência atualizada
          </p>
        </div>

        <button
          onClick={() => router.push("/workouts")}
          className="w-full gradient-red text-white font-bold text-base py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          Voltar para treinos
        </button>
      </div>
    );
  }

  // ── Active video player ───────────────────────────────────────────────────
  const ex = exercises[exIdx];

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-3">
        <button
          onClick={() => router.push("/workouts")}
          className="w-9 h-9 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 text-text-secondary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-muted truncate">{workout.name}</p>
          <p className="text-xs text-text-secondary font-semibold">
            Exercício {exIdx + 1}/{total}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-4 space-y-1.5">
        <div className="h-2 bg-dark-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-red rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-[10px] text-text-muted">Progresso</span>
          <span className="text-[10px] text-text-secondary font-semibold">{progress}%</span>
        </div>
      </div>

      {/* Exercise name */}
      <div className="px-4 mb-3">
        <h2 className="text-xl font-black text-text-primary">{ex.name}</h2>
      </div>

      {/* Video player */}
      <div className="px-4 flex-1 flex flex-col gap-4">
        <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-video">
          {ex.videoType === "youtube" ? (
            /*
             * YouTube nocookie IFrame Player — autoplay, no preview card.
             *
             * Key params:
             *   autoplay=1        → starts playing immediately (no red button)
             *   mute=0            → audio on (user already unlocked via first tap)
             *   controls=0        → hides YouTube control bar (we use our own)
             *   rel=0             → no related videos at end
             *   playsinline=1     → inline on iOS, no fullscreen takeover
             *   enablejsapi=1     → enables postMessage API
             *   origin=...        → required for postMessage security
             *   iv_load_policy=3  → hides video annotations
             *   fs=0              → disables fullscreen button
             *   disablekb=1       → disables YouTube keyboard shortcuts
             *
             * Overlay div sits on top with pointer-events:none so clicks
             * reach our own pause/skip buttons but not any YouTube anchor.
             */
            <div className="relative w-full h-full">
              <iframe
                ref={iframeRef}
                key={ex.id}
                src={`${ex.embedUrl}?autoplay=1&mute=0&controls=0&rel=0&playsinline=1&enablejsapi=1&iv_load_policy=3&fs=0&disablekb=1&modestbranding=1`}
                title={ex.name}
                allow="autoplay; encrypted-media"
                allowFullScreen={false}
                className="absolute inset-0 w-full h-full border-0"
                style={{ pointerEvents: "none" }}
              />
              {/* Transparent overlay — absorbs taps so they hit our UI buttons, not YouTube links */}
              <div className="absolute inset-0" style={{ pointerEvents: "auto" }} />
            </div>
          ) : ex.videoType === "gdrive" ? (
            /*
             * Google Drive /preview embed.
             *
             * Rules that make it work:
             *   - src must use /preview (not /view, not sharing URL)
             *   - allowFullScreen must be TRUE — Drive's player JS checks for this
             *     capability and shows "Você precisa ter acesso" when it is absent
             *   - allow="autoplay" enables playback without user gesture
             *   - NO sandbox attribute — Drive needs top-level cookie access
             *   - pointerEvents on the iframe must NOT be "none" while loading;
             *     Drive's auth handshake requires the iframe to receive events.
             *     We set it to "none" only AFTER load via onLoad.
             */
            <div className="relative w-full h-full">
              <iframe
                key={ex.id}
                src={ex.embedUrl}
                title={ex.name}
                allow="autoplay"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              key={ex.id}
              src={ex.videoUrl}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              onEnded={handleEnded}
            />
          )}
        </div>

        {/* Reps + Rest badges */}
        <div className="flex gap-2">
          <div className="flex-1 bg-dark-card border border-dark-border rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] text-text-muted uppercase tracking-wide mb-0.5">Repetições</p>
            <p className="text-sm font-black text-brand-red">{ex.reps}</p>
          </div>
          <div className="flex-1 bg-dark-card border border-dark-border rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] text-text-muted uppercase tracking-wide mb-0.5">Descanso</p>
            <p className="text-sm font-black text-text-primary">{ex.rest}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-dark-card border border-dark-border rounded-2xl px-4 py-3">
          <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">Como executar</p>
          <p className="text-sm text-text-secondary leading-relaxed">{ex.instructions}</p>
        </div>

        {/* Pause / Resume + Skip */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPaused((p) => !p)}
            className="flex-1 flex items-center justify-center gap-2 bg-dark-card border border-dark-border rounded-2xl py-3 text-sm font-semibold text-text-primary active:scale-95 transition-all"
          >
            {paused ? (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-brand-red">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
                Retomar
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                </svg>
                Pausar
              </>
            )}
          </button>

          {/* Skip to next exercise (or finish if last) */}
          <button
            onClick={handleEnded}
            className="flex items-center justify-center gap-2 bg-dark-card border border-dark-border rounded-2xl px-4 py-3 text-sm font-semibold text-text-secondary active:scale-95 transition-all"
          >
            Pular
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v6.62c0 1.44 1.555 2.343 2.805 1.628L12 12.995v2.315c0 1.44 1.555 2.343 2.805 1.628l7.108-3.95c1.26-.7 1.26-2.544 0-3.244l-7.108-3.95C13.555 4.082 12 4.985 12 6.425v2.314L5.055 7.06z" />
            </svg>
          </button>
        </div>

        {/* Exercise dot indicator */}
        <div className="flex justify-center gap-2">
          {exercises.map((_, i) => (
            <div
              key={i}
              className={[
                "h-2 rounded-full transition-all duration-300",
                i < exIdx   ? "w-4 bg-brand-red" :
                i === exIdx ? "w-6 bg-brand-red" :
                              "w-2 bg-dark-muted",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE SESSION
// Used for workouts WITHOUT videoExercises.
// Contains all old system logic: prepare/active/rest phases, TTS, phase timer.
// ═══════════════════════════════════════════════════════════════════════════════

function PhaseSession({ workout }: { workout: LibraryWorkout }) {
  const router    = useRouter();
  const exercises = useMemo(() => getGuidedExercises(workout), [workout]);
  const totalSec  = useMemo(() => estimateTotalSec(exercises), [exercises]);

  const [phase,       setPhase]       = useState<Phase>("overview");
  const [exIdx,       setExIdx]       = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [paused,      setPaused]      = useState(false);
  const [elapsed,     setElapsed]     = useState(0);

  const phaseRef  = useRef<Phase>("overview");
  const exIdxRef  = useRef(0);
  const pausedRef = useRef(false);

  phaseRef.current  = phase;
  exIdxRef.current  = exIdx;
  pausedRef.current = paused;

  // Timer countdown
  useEffect(() => {
    if (paused || phase === "overview" || phase === "complete") return;
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => {
      setSecondsLeft((s) => s - 1);
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearTimeout(id);
  }, [secondsLeft, paused, phase]);

  const enterPhase = useCallback(
    (newPhase: Phase, idx: number) => {
      const ex = exercises[idx];
      setExIdx(idx);
      setPhase(newPhase);
      if (newPhase === "prepare") {
        setSecondsLeft(ex.prepSec);
        setTimeout(() => speakCue("prepare"), 100);
        setTimeout(() => speak(ex.name), 700);
      } else if (newPhase === "active") {
        setSecondsLeft(ex.durationSec);
        setTimeout(() => speakExercise(ex.name, ex.instruction), 200);
      } else if (newPhase === "rest") {
        setSecondsLeft(ex.restSec);
        setTimeout(() => speakCue("rest"), 100);
      } else if (newPhase === "complete") {
        setSecondsLeft(0);
        setTimeout(() => speakCue("complete"), 300);
      }
    },
    [exercises]
  );

  const advance = useCallback(() => {
    const p   = phaseRef.current;
    const idx = exIdxRef.current;
    if (p === "prepare") {
      enterPhase("active", idx);
    } else if (p === "active") {
      if (idx < exercises.length - 1) enterPhase("rest", idx);
      else enterPhase("complete", idx);
    } else if (p === "rest") {
      enterPhase("prepare", idx + 1);
    }
  }, [exercises.length, enterPhase]);

  // Auto-advance when timer hits 0
  useEffect(() => {
    if (secondsLeft === 0 && (phase === "prepare" || phase === "active" || phase === "rest")) {
      const id = setTimeout(advance, 400);
      return () => clearTimeout(id);
    }
  }, [secondsLeft, phase, advance]);

  // Countdown beeps
  useEffect(() => {
    if (phase === "active" && secondsLeft === 3) speakCue("three");
    if (phase === "active" && secondsLeft === 2) speakCue("two");
    if (phase === "active" && secondsLeft === 1) speakCue("one");
  }, [secondsLeft, phase]);

  // Completion side-effects
  useEffect(() => {
    if (phase !== "complete") return;
    const done    = storageGet<string[]>(KEYS.COMPLETED_WORKOUTS) ?? [];
    const updated = done.includes(workout.id) ? done : [...done, workout.id];
    storageSet(KEYS.COMPLETED_WORKOUTS, updated);
    const plan = storageGet<GeneratedPlan>(KEYS.PLAN);
    if (plan) recordWorkoutCompleted(plan);
    recordActivityToday();
    recordWorkoutDate();
    if (plan) {
      const missions: Mission[] = loadTodayMissions(plan);
      const missionDone = missions.find((m) => m.id === "workout")?.completed;
      if (!missionDone) toggleMission(missions, "workout");
    }
  }, [phase, workout]);

  // ── Overview ────────────────────────────────────────────────────────────────
  if (phase === "overview") {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col">
        <div className="flex items-center gap-3 px-4 pt-12 pb-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5 text-text-secondary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-text-primary flex-1 truncate">{workout.name}</h1>
        </div>

        <div className="flex justify-center py-8">
          <div className="w-44 h-44 rounded-full gradient-red flex items-center justify-center shadow-[0_0_60px_rgba(230,57,70,0.4)]">
            <svg viewBox="0 0 24 24" fill="white" className="w-20 h-20 ml-1">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          </div>
        </div>

        <div className="flex-1 px-4 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-text-primary">{workout.name}</h2>
            <p className="text-text-secondary text-sm leading-relaxed">{workout.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Exercícios",  value: exercises.length },
              { label: "Duração",     value: `~${Math.round(totalSec / 60)}min` },
              { label: "Dificuldade", value: workout.difficulty },
            ].map((s) => (
              <div key={s.label} className="bg-dark-card border border-dark-border rounded-2xl p-3 text-center">
                <p className="text-base font-black text-text-primary">{s.value}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Exercise list — ready for future video slot per exercise */}
          <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-dark-border flex items-center justify-between">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Sequência de Exercícios
              </p>
              <span className="text-xs text-brand-red font-semibold">{exercises.length} exercícios</span>
            </div>
            <div className="divide-y divide-dark-border/50">
              {exercises.map((ex, i) => (
                <div key={ex.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="w-6 h-6 rounded-full bg-dark-muted flex items-center justify-center text-[10px] font-bold text-text-muted shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{ex.name}</p>
                    <p className="text-xs text-text-muted">
                      {ex.reps > 0 ? `${ex.reps} reps` : `${ex.durationSec}s`}
                      {" · "}
                      {ex.restSec}s descanso
                    </p>
                  </div>
                  {/* VIDEO_SLOT: ex.videoUrl will go here in future integration */}
                  <span className="text-xs text-dark-muted">▶</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-4 flex items-start gap-3">
            <span className="text-xl mt-0.5">🔊</span>
            <p className="text-xs text-text-secondary leading-relaxed">
              O treino avança automaticamente com instruções de voz. Ative o volume do seu dispositivo antes de começar.
            </p>
          </div>

          <button
            onClick={() => {
              unlockSpeech();
              enterPhase("prepare", 0);
            }}
            className="w-full gradient-red text-white font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition-all duration-200"
          >
            Começar Treino
          </button>
        </div>

        <div className="h-8" />
      </div>
    );
  }

  // ── Completion ──────────────────────────────────────────────────────────────
  if (phase === "complete") {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-4 text-center gap-6">
        <div className="w-28 h-28 rounded-full bg-yellow-500/20 border-2 border-yellow-500/40 flex items-center justify-center">
          <span className="text-5xl">🏆</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-text-primary">Treino Concluído!</h1>
          <p className="text-text-secondary text-sm">{workout.name}</p>
        </div>
        <div className="w-full grid grid-cols-2 gap-3">
          {[
            { label: "Exercícios", value: exercises.length, icon: "🔄" },
            { label: "Duração",    value: formatTime(elapsed), icon: "⏱" },
          ].map((s) => (
            <div key={s.label} className="bg-dark-card border border-dark-border rounded-2xl p-4 text-center">
              <span className="text-2xl">{s.icon}</span>
              <p className="text-xl font-black text-text-primary mt-1">{s.value}</p>
              <p className="text-xs text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="w-full space-y-3">
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-3 flex items-center gap-3">
            <span className="text-xl">✅</span>
            <p className="text-sm text-green-400 font-medium">Treino registrado · Sequência atualizada</p>
          </div>
          <button
            onClick={() => { stopSpeech(); router.push("/dashboard"); }}
            className="w-full gradient-red text-white font-bold text-base py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
          >
            Ver Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Active phase-timer session ──────────────────────────────────────────────
  const currentEx      = exercises[exIdx];
  const cfg            = PHASE_CONFIG[phase as "prepare" | "active" | "rest"];
  const totalPhase     = phase === "prepare" ? currentEx.prepSec :
                         phase === "active"  ? currentEx.durationSec :
                         currentEx.restSec;
  const overallProgress = (exIdx + (phase === "rest" ? 1 : 0)) / exercises.length;
  const nextEx          = exercises[exIdx + 1] ?? null;

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col max-w-md mx-auto">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-2">
        <button
          onClick={() => { stopSpeech(); router.back(); }}
          className="w-9 h-9 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 text-text-secondary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-muted truncate">{workout.name}</p>
          <p className="text-xs text-text-secondary font-semibold">
            Exercício {exIdx + 1}/{exercises.length}
          </p>
        </div>
        <span className="text-xs text-text-muted tabular-nums">{formatTime(elapsed)}</span>
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-4">
        <div className="h-1.5 bg-dark-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-red rounded-full transition-all duration-700"
            style={{ width: `${overallProgress * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {exercises.map((_, i) => (
            <div
              key={i}
              className={[
                "h-1 flex-1 mx-0.5 rounded-full transition-all duration-300",
                i < exIdx   ? "bg-brand-red" :
                i === exIdx ? "bg-brand-red/60" :
                              "bg-dark-muted",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      {/* Phase badge */}
      <div className="flex justify-center mb-4">
        <span className={["text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest", cfg.badgeBg, cfg.badgeText].join(" ")}>
          {cfg.label}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 gap-6">
        {phase !== "rest" ? (
          <ExerciseMedia
            muscleGroup={currentEx.muscleGroup}
            phase={phase}
            exerciseName={currentEx.name}
          />
        ) : (
          <div className="w-44 h-44 rounded-full bg-dark-surface border-4 border-blue-500/40 flex flex-col items-center justify-center text-center px-4">
            <p className="text-xs text-blue-400 font-semibold uppercase tracking-wide mb-1">Próximo</p>
            {nextEx ? (
              <>
                <p className="text-sm font-bold text-text-primary leading-tight">{nextEx.name}</p>
                <p className="text-[10px] text-text-muted mt-1">{nextEx.muscleGroup}</p>
              </>
            ) : (
              <p className="text-sm font-bold text-green-400">Último!</p>
            )}
          </div>
        )}

        <PhaseTimer
          secondsLeft={secondsLeft}
          totalSeconds={totalPhase}
          color={cfg.ringColor}
          label={cfg.sublabel}
          size={160}
        />

        <div className="w-full bg-dark-card border border-dark-border rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary">{currentEx.name}</h2>
            {currentEx.reps > 0 && (
              <span className="text-xs bg-dark-muted text-text-secondary px-2 py-1 rounded-lg">
                {currentEx.reps} reps
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{currentEx.instruction}</p>
        </div>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => setPaused((p) => !p)}
            className="flex-1 flex items-center justify-center gap-2 bg-dark-card border border-dark-border rounded-2xl py-3 text-sm font-semibold text-text-primary active:scale-95 transition-all"
          >
            {paused ? (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-brand-red">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
                Retomar
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                </svg>
                Pausar
              </>
            )}
          </button>
          <button
            onClick={() => advance()}
            className="flex-1 flex items-center justify-center gap-2 bg-dark-card border border-dark-border rounded-2xl py-3 text-sm font-semibold text-text-secondary active:scale-95 transition-all"
          >
            Pular
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M5 5l14 7-14 7V5zm14 7V5h2v14h-2V12z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION PAGE — top-level router
// Dispatches to VideoSession or PhaseSession based on workout type.
// No shared state. Each renderer is fully self-contained.
// ═══════════════════════════════════════════════════════════════════════════════

export default function SessionPage({
  params,
}: {
  params: { id: string };
}) {
  const router   = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const workout = useMemo(
    () => workoutLibrary.find((w) => w.id === params.id) ?? null,
    [params.id]
  );

  if (!mounted) return null;

  if (!workout) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="text-5xl">🔍</span>
        <p className="text-text-primary font-bold text-lg">Treino não encontrado</p>
        <button
          onClick={() => router.push("/workouts")}
          className="gradient-red text-white px-6 py-3 rounded-2xl font-semibold"
        >
          Ver Treinos
        </button>
      </div>
    );
  }

  // ── Video workout → VideoSession (no phase timer, no TTS, no overview) ─────
  if (workout.videoExercises?.length) {
    return <VideoSession workout={workout} />;
  }

  // ── Phase-timer workout → PhaseSession (existing guided session flow) ──────
  return <PhaseSession workout={workout} />;
}
