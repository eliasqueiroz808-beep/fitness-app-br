interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: "red" | "green" | "yellow" | "blue";
}

const colorClasses = {
  red: "bg-brand-red",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
};

export default function ProgressBar({
  value,
  max = 100,
  className = "",
  color = "red",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      className={["h-2 w-full rounded-full bg-dark-muted overflow-hidden", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={["h-full rounded-full transition-all duration-500", colorClasses[color]]
          .filter(Boolean)
          .join(" ")}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
