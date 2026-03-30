import { HTMLAttributes } from "react";

type BadgeVariant = "red" | "green" | "yellow" | "gray" | "blue";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  red: "bg-brand-red/20 text-brand-red-light",
  green: "bg-green-500/20 text-green-400",
  yellow: "bg-yellow-500/20 text-yellow-400",
  gray: "bg-dark-muted/40 text-text-secondary",
  blue: "bg-blue-500/20 text-blue-400",
};

export default function Badge({
  variant = "gray",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}
