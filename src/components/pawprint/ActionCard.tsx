import { Link } from "@tanstack/react-router";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  tone?: "default" | "primary";
  delay?: number;
}

export function ActionCard({
  to,
  icon: Icon,
  title,
  description,
  badge,
  tone = "default",
  delay = 0,
}: ActionCardProps) {
  return (
    <Link
      to={to}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "lift animate-rise surface group flex items-center gap-4 p-4 pr-3",
        tone === "primary" && "border-primary/25 bg-primary-soft/60",
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
          tone === "primary"
            ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
            : "bg-primary-soft text-primary",
        )}
      >
        <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-[15px] font-semibold tracking-tight">{title}</span>
          {badge && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              {badge}
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">
          {description}
        </span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5" />
    </Link>
  );
}
