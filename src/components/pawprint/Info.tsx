import { cn } from "@/lib/utils";

export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        "text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function InfoGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border">
      {items.map(([label, value]) => (
        <div key={label} className="bg-card px-4 py-3">
          <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </dt>
          <dd className="mt-0.5 truncate text-[14px] font-semibold">{value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
