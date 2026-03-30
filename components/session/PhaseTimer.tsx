import { formatTime } from "@/lib/session";

interface PhaseTimerProps {
  secondsLeft: number;
  totalSeconds: number;
  color: string;      // hex stroke color e.g. "#E63946"
  label: string;      // phase label e.g. "Ativo"
  size?: number;      // SVG size in px
}

export default function PhaseTimer({
  secondsLeft,
  totalSeconds,
  color,
  label,
  size = 180,
}: PhaseTimerProps) {
  const r           = (size / 2) * 0.82;
  const circumference = 2 * Math.PI * r;
  const progress    = totalSeconds > 0 ? secondsLeft / totalSeconds : 1;
  const dashoffset  = circumference * (1 - progress);
  const center      = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* SVG ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          style={{ display: "block" }}
        >
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke="#2E2E2E"
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            style={{ transition: "stroke-dashoffset 0.9s linear" }}
          />
        </svg>

        {/* Center content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ top: 0, left: 0 }}
        >
          <span
            className="font-black text-text-primary tabular-nums leading-none"
            style={{ fontSize: size * 0.22 }}
          >
            {formatTime(secondsLeft)}
          </span>
          <span
            className="text-text-muted font-medium mt-1"
            style={{ fontSize: size * 0.075 }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
