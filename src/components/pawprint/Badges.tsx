import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success",
        className,
      )}
    >
      <BadgeCheck className="h-3.5 w-3.5" />
      Identity Verified
    </span>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "good" | "bad" | "info" | "neutral";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold",
        tone === "good" && "bg-success-soft text-success",
        tone === "bad" && "bg-destructive/10 text-destructive",
        tone === "info" && "bg-primary-soft text-primary",
        tone === "neutral" && "bg-muted text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}
