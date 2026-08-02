import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  hint,
  compact,
}: {
  icon: LucideIcon;
  title: string;
  hint?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "flex items-center gap-3 rounded-2xl bg-muted/60 px-4 py-4"
          : "flex flex-col items-center rounded-3xl bg-muted/50 px-6 py-14 text-center"
      }
    >
      <span
        className={
          compact
            ? "flex h-9 w-9 items-center justify-center rounded-xl bg-background text-muted-foreground"
            : "flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-muted-foreground shadow-[var(--shadow-soft)]"
        }
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className={compact ? "" : "mt-4"}>
        <p className="text-sm font-semibold">{title}</p>
        {hint && <p className="mt-1 text-[13px] text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}
