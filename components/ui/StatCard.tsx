import Card from "./Card";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export default function StatCard({
  label,
  value,
  unit,
  icon,
  trend,
  trendValue,
}: StatCardProps) {
  const trendColor =
    trend === "up"
      ? "text-green-400"
      : trend === "down"
      ? "text-brand-red-light"
      : "text-text-muted";

  const trendArrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "—";

  return (
    <Card className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary uppercase tracking-wide">
          {label}
        </span>
        {icon && <span className="text-text-muted">{icon}</span>}
      </div>
      <div className="flex items-end gap-1 mt-1">
        <span className="text-2xl font-bold text-text-primary">{value}</span>
        {unit && (
          <span className="text-sm text-text-secondary mb-0.5">{unit}</span>
        )}
      </div>
      {trend && trendValue && (
        <span className={["text-xs font-medium", trendColor].join(" ")}>
          {trendArrow} {trendValue}
        </span>
      )}
    </Card>
  );
}
