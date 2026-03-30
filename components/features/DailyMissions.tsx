"use client";

import Card from "@/components/ui/Card";
import type { Mission } from "@/lib/storage";

interface DailyMissionsProps {
  missions: Mission[];
  onToggle: (id: string) => void;
}

export default function DailyMissions({ missions, onToggle }: DailyMissionsProps) {
  const completed = missions.filter((m) => m.completed).length;

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border">
        <h2 className="text-sm font-bold text-text-primary">Missoes do Dia</h2>
        <span className="text-xs text-text-muted">
          {completed}/{missions.length}
        </span>
      </div>

      <div className="divide-y divide-dark-border/50">
        {missions.map((mission) => (
          <button
            key={mission.id}
            onClick={() => onToggle(mission.id)}
            className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-dark-surface/50 transition-colors text-left"
          >
            {/* Checkbox */}
            <div
              className={[
                "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                mission.completed
                  ? "border-brand-red bg-brand-red"
                  : "border-dark-muted",
              ].join(" ")}
            >
              {mission.completed && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={3}
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              )}
            </div>

            <span className="text-xl shrink-0">{mission.icon}</span>

            <span
              className={[
                "text-sm font-medium flex-1",
                mission.completed
                  ? "line-through text-text-muted"
                  : "text-text-primary",
              ].join(" ")}
            >
              {mission.label}
            </span>
          </button>
        ))}
      </div>

      {/* Progress strip */}
      <div className="h-1 bg-dark-muted">
        <div
          className="h-full gradient-red transition-all duration-500"
          style={{ width: `${(completed / Math.max(missions.length, 1)) * 100}%` }}
        />
      </div>
    </Card>
  );
}
