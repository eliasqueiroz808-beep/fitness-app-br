"use client";

/**
 * DEDICATED SESSION PAGE — Peito e Tríceps - Força
 *
 * Static route: /workouts/gw-peito-triceps
 * Takes priority over the dynamic /workouts/[id] route.
 *
 * This file is completely self-contained.
 * It has ZERO dependency on:
 *   - guided-exercises.ts  (no auto-generated exercise data)
 *   - audio.ts             (no TTS / speech synthesis)
 *   - session.ts           (no phase machine)
 *   - ExerciseMedia        (no SVG placeholder visuals)
 *   - PhaseTimer           (no circular countdown)
 *
 * Session flow:
 *   video autoplay → onEnded → next video → … → completion screen
 */

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { storageGet, storageSet, KEYS, type GeneratedPlan } from "@/lib/storage";
import { recordWorkoutCompleted } from "@/lib/adaptation";
import { recordActivityToday }    from "@/lib/streak";
import { loadTodayMissions, toggleMission } from "@/lib/missions";
import type { Mission } from "@/lib/storage";

// ── Exercise list ─────────────────────────────────────────────────────────────
// Manually provided Cloudinary URLs — the ONLY source of media for this workout.

const EXERCISES = [
  {
    id:       "gw-pt-v1",
    name:     "Supino reto",
    videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1773011755/supino_reto_ketnio.mp4",
  },
  {
    id:       "gw-pt-v2",
    name:     "Crucifixo com halteres",
    videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/Crucifixo_com_halteres_ou_banco_vqgrki.mp4",
  },
  {
    id:       "gw-pt-v3",
    name:     "Tríceps no banco",
    videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1773011745/Tr%C3%ADceps_no_banco_l4xcvo.mp4",
  },
  {
    id:       "gw-pt-v4",
    name:     "Flexão de braço",
    videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1773011820/flex%C3%A3o_de_bra%C3%A7o_n96oyy.mp4",
  },
  {
    id:       "gw-pt-v5",
    name:     "Cable Crossover",
    videoUrl: "https://res.cloudinary.com/dsetxj6at/video/upload/v1773011750/exercicio_com_arco_nlrgae.mp4",
  },
] as const;

const WORKOUT_ID   = "gw-peito-triceps";
const WORKOUT_NAME = "Peito e Tríceps - Força";
const TOTAL        = EXERCISES.length;

// ── Page component ────────────────────────────────────────────────────────────

export default function PeitoTricepsPage() {
  const router = useRouter();

  const [exIdx,     setExIdx]     = useState(0);
  const [paused,    setPaused]    = useState(false);
  const [completed, setCompleted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // progress: 20 % per exercise, based on current index (1-indexed)
  const progress = Math.round(((exIdx + 1) / TOTAL) * 100);

  // ── Load + autoplay when the exercise index changes ────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    v.play().catch(() => {});
    setPaused(false);
  }, [exIdx]);

  // ── Sync pause / resume with the <video> element ───────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (paused) {
      v.pause();
    } else {
      v.play().catch(() => {});
    }
  }, [paused]);

  // ── Advance to next exercise or trigger completion ─────────────────────────
  function handleEnded() {
    if (exIdx < TOTAL - 1) {
      setExIdx((i) => i + 1);
    } else {
      recordCompletion();
      setCompleted(true);
    }
  }

  function recordCompletion() {
    // Mark workout as completed
    const done    = storageGet<string[]>(KEYS.COMPLETED_WORKOUTS) ?? [];
    const updated = done.includes(WORKOUT_ID) ? done : [...done, WORKOUT_ID];
    storageSet(KEYS.COMPLETED_WORKOUTS, updated);

    // Update adaptation + streak
    const plan = storageGet<GeneratedPlan>(KEYS.PLAN);
    if (plan) recordWorkoutCompleted(plan);
    recordActivityToday();

    // Complete workout mission if not already done
    if (plan) {
      const missions: Mission[] = loadTodayMissions(plan);
      const missionDone = missions.find((m) => m.id === "workout")?.completed;
      if (!missionDone) toggleMission(missions, "workout");
    }
  }

  // ── Completion screen ──────────────────────────────────────────────────────
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

  // ── Active session ─────────────────────────────────────────────────────────
  const ex = EXERCISES[exIdx];

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col max-w-md mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-3">
        <button
          onClick={() => router.push("/workouts")}
          className="w-9 h-9 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center shrink-0"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="w-4 h-4 text-text-secondary"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-muted truncate">{WORKOUT_NAME}</p>
          <p className="text-xs text-text-secondary font-semibold">
            Exercício {exIdx + 1}/{TOTAL}
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

      {/* Video */}
      <div className="px-4 flex-1 flex flex-col gap-4">
        <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-video">
          <video
            ref={videoRef}
            key={ex.id}
            src={ex.videoUrl}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            onEnded={handleEnded}
          />
        </div>

        {/* Pause / Resume */}
        <button
          onClick={() => setPaused((p) => !p)}
          className="w-full flex items-center justify-center gap-2 bg-dark-card border border-dark-border rounded-2xl py-3 text-sm font-semibold text-text-primary active:scale-95 transition-all"
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

        {/* Dot indicator */}
        <div className="flex justify-center gap-2">
          {EXERCISES.map((_, i) => (
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
