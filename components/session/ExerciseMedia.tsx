import type { Phase } from "@/lib/session";
import type { MuscleGroup } from "@/lib/mock-data";

interface ExerciseMediaProps {
  muscleGroup: MuscleGroup;
  phase: Phase;
  exerciseName: string;
}

// ── Muscle group → visual theme ───────────────────────────────────────────────

interface VisualTheme {
  primary: string;
  secondary: string;
  icon: string;
  shape: "circle" | "diamond" | "horizontal" | "vertical" | "star";
}

const THEMES: Record<MuscleGroup, VisualTheme> = {
  "Peito":      { primary: "#E63946", secondary: "#FF6B6B", icon: "💪", shape: "horizontal" },
  "Costas":     { primary: "#3B82F6", secondary: "#60A5FA", icon: "🔵", shape: "horizontal" },
  "Pernas":     { primary: "#22C55E", secondary: "#4ADE80", icon: "🦵", shape: "vertical"   },
  "Glúteos":    { primary: "#A855F7", secondary: "#C084FC", icon: "🍑", shape: "vertical"   },
  "Ombros":     { primary: "#F59E0B", secondary: "#FCD34D", icon: "🔱", shape: "star"       },
  "Bíceps":     { primary: "#EC4899", secondary: "#F9A8D4", icon: "💪", shape: "circle"     },
  "Tríceps":    { primary: "#EF4444", secondary: "#FCA5A5", icon: "🔥", shape: "circle"     },
  "Abdômen":    { primary: "#06B6D4", secondary: "#67E8F9", icon: "⚡", shape: "horizontal" },
  "Full Body":  { primary: "#E63946", secondary: "#FF6B6B", icon: "⚡", shape: "star"       },
};

// ── SVG animated shapes ───────────────────────────────────────────────────────

function CircleShape({ color, active }: { color: string; active: boolean }) {
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <circle
        cx="80" cy="80" r="60"
        fill="none"
        stroke={color}
        strokeWidth="6"
        opacity="0.3"
      />
      <circle
        cx="80" cy="80" r="40"
        fill={color}
        opacity="0.15"
      />
      <circle
        cx="80" cy="80" r="20"
        fill={color}
        opacity={active ? "0.9" : "0.5"}
        className={active ? "animate-ping" : ""}
      />
    </svg>
  );
}

function HorizontalShape({ color, active }: { color: string; active: boolean }) {
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      {/* Left arm */}
      <rect
        x="10" y="72" width="55" height="16" rx="8"
        fill={color}
        opacity="0.7"
        className={active ? "animate-pulse" : ""}
        style={{ transformOrigin: "65px 80px" }}
      />
      {/* Right arm */}
      <rect
        x="95" y="72" width="55" height="16" rx="8"
        fill={color}
        opacity="0.7"
        className={active ? "animate-pulse" : ""}
        style={{ transformOrigin: "95px 80px" }}
      />
      {/* Center body */}
      <circle cx="80" cy="80" r="22" fill={color} opacity="0.9" />
      <circle cx="80" cy="80" r="12" fill="#0D0D0D" opacity="0.6" />
    </svg>
  );
}

function VerticalShape({ color, active }: { color: string; active: boolean }) {
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      {/* Legs */}
      <rect
        x="52" y="90" width="22" height="55" rx="11"
        fill={color}
        opacity="0.8"
        className={active ? "animate-bounce" : ""}
      />
      <rect
        x="86" y="90" width="22" height="55" rx="11"
        fill={color}
        opacity="0.6"
        className={active ? "animate-bounce" : ""}
        style={{ animationDelay: "0.15s" }}
      />
      {/* Body */}
      <rect x="52" y="40" width="56" height="54" rx="12" fill={color} opacity="0.85" />
      {/* Head */}
      <circle cx="80" cy="28" r="18" fill={color} opacity="0.9" />
    </svg>
  );
}

function StarShape({ color, active }: { color: string; active: boolean }) {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 8 - Math.PI / 2;
    const r = i % 2 === 0 ? 60 : 30;
    return `${80 + r * Math.cos(angle)},${80 + r * Math.sin(angle)}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <polygon
        points={pts}
        fill={color}
        opacity="0.8"
        className={active ? "animate-spin" : ""}
        style={{ transformOrigin: "80px 80px", animationDuration: "3s" }}
      />
      <circle cx="80" cy="80" r="22" fill="#0D0D0D" opacity="0.8" />
      <circle cx="80" cy="80" r="12" fill={color} opacity="0.9" />
    </svg>
  );
}

function DiamondShape({ color, active }: { color: string; active: boolean }) {
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <rect
        x="50" y="50" width="60" height="60" rx="4"
        fill={color}
        opacity="0.8"
        transform="rotate(45 80 80)"
        className={active ? "animate-pulse" : ""}
      />
      <circle cx="80" cy="80" r="18" fill="#0D0D0D" opacity="0.8" />
    </svg>
  );
}

function ShapeRenderer({
  shape, color, active,
}: {
  shape: VisualTheme["shape"];
  color: string;
  active: boolean;
}) {
  switch (shape) {
    case "horizontal": return <HorizontalShape color={color} active={active} />;
    case "vertical":   return <VerticalShape   color={color} active={active} />;
    case "star":       return <StarShape       color={color} active={active} />;
    case "diamond":    return <DiamondShape    color={color} active={active} />;
    case "circle":
    default:           return <CircleShape     color={color} active={active} />;
  }
}

// ── Phase-based outer ring ─────────────────────────────────────────────────────

const PHASE_RING: Record<string, string> = {
  overview: "border-dark-border",
  prepare:  "border-yellow-500/60",
  active:   "border-brand-red",
  rest:     "border-blue-500/60",
  complete: "border-green-500/60",
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function ExerciseMedia({
  muscleGroup,
  phase,
  exerciseName,
}: ExerciseMediaProps) {
  const theme    = THEMES[muscleGroup] ?? THEMES["Full Body"];
  const isActive = phase === "active";
  const ringCls  = PHASE_RING[phase] ?? "border-dark-border";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Animated shape container */}
      <div
        className={[
          "relative w-44 h-44 rounded-full border-4 flex items-center justify-center",
          "bg-dark-surface transition-all duration-500",
          ringCls,
          isActive ? "shadow-[0_0_40px_rgba(230,57,70,0.3)]" : "",
        ].join(" ")}
      >
        {/* Outer glow pulse when active */}
        {isActive && (
          <div className="absolute inset-0 rounded-full border-2 border-brand-red/30 animate-ping" />
        )}

        <div className="w-32 h-32">
          <ShapeRenderer
            shape={theme.shape}
            color={isActive ? theme.primary : theme.secondary}
            active={isActive}
          />
        </div>
      </div>

      {/* Muscle group label */}
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-medium px-3 py-1 rounded-full"
          style={{
            background: `${theme.primary}22`,
            color: theme.primary,
          }}
        >
          {muscleGroup}
        </span>
      </div>
    </div>
  );
}
