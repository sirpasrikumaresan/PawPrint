import { cn } from "@/lib/utils";

export function ProgressHeader({
  step,
  total,
  label,
  percent,
  dark,
}: {
  step: number;
  total: number;
  label: string;
  percent: number;
  dark?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className={cn("text-[13px] font-medium", dark ? "text-white/70" : "text-muted-foreground")}>
          Step {step} of {total} · {label}
        </p>
        <p className={cn("tabular text-[13px] font-bold", dark ? "text-white" : "text-primary")}>
          {Math.round(percent)}%
        </p>
      </div>
      <div
        className={cn(
          "mt-2 h-1.5 w-full overflow-hidden rounded-full",
          dark ? "bg-white/15" : "bg-muted",
        )}
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-700 ease-out",
            dark ? "bg-white" : "bg-primary",
          )}
          style={{ width: `${Math.max(2, Math.min(100, percent))}%` }}
        />
      </div>
    </div>
  );
}

export function QualityRing({ value, caption }: { value: number; caption?: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-muted)" strokeWidth="9" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.min(100, value)) / 100}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.2,0.8,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tabular text-[26px] font-bold tracking-tight">{Math.round(value)}%</span>
        {caption && (
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}
