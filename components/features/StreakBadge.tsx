import {
  getCurrentMilestone,
  getNextMilestone,
  milestoneColorClasses,
} from "@/lib/streak";

interface StreakBadgeProps {
  streak: number;
  best: number;
  compact?: boolean;
}

export default function StreakBadge({
  streak,
  best,
  compact = false,
}: StreakBadgeProps) {
  const current = getCurrentMilestone(streak);
  const next = getNextMilestone(streak);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-brand-red font-semibold text-sm">
          🔥 {streak} dias
        </span>
        {current && (
          <span
            className={[
              "text-[10px] px-2 py-0.5 rounded-full font-semibold border",
              milestoneColorClasses[current.color].bg,
              milestoneColorClasses[current.color].text,
              milestoneColorClasses[current.color].border,
            ].join(" ")}
          >
            {current.icon} {current.label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main streak display */}
      <div className="flex items-center gap-3">
        <div className="text-4xl">🔥</div>
        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-text-primary">{streak}</span>
            <span className="text-base text-text-secondary font-medium">dias</span>
          </div>
          <p className="text-xs text-text-secondary">Sequência atual</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted">Melhor</p>
          <p className="text-sm font-bold text-brand-red">{best} dias</p>
        </div>
      </div>

      {/* Milestone badge */}
      {current && (
        <div
          className={[
            "flex items-center gap-2 px-3 py-2 rounded-xl border",
            milestoneColorClasses[current.color].bg,
            milestoneColorClasses[current.color].border,
          ].join(" ")}
        >
          <span className="text-xl">{current.icon}</span>
          <div className="flex-1">
            <p
              className={[
                "text-sm font-bold",
                milestoneColorClasses[current.color].text,
              ].join(" ")}
            >
              {current.label}
            </p>
            <p className="text-xs text-text-muted">
              Marco de {current.days} dias conquistado!
            </p>
          </div>
        </div>
      )}

      {/* Next milestone progress */}
      {next && (
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-text-muted">
              Próximo: {next.icon} {next.label}
            </span>
            <span className="text-xs text-text-secondary">
              {next.days - streak} dias restantes
            </span>
          </div>
          <div className="h-1.5 bg-dark-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-red rounded-full transition-all duration-500"
              style={{
                width: `${(streak / next.days) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {!current && !next && streak > 0 && (
        <p className="text-xs text-brand-red font-semibold">
          Nivel maximo atingido! Voce e Elite!
        </p>
      )}
    </div>
  );
}
