import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BadgeCheck, Check, Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/pawprint/Button";
import { Screen } from "@/components/pawprint/Screen";
import { VerifiedBadge } from "@/components/pawprint/Badges";
import { MATCH_STEPS } from "@/lib/pawprint/mock";
import { getIdentifySession } from "@/lib/pawprint/identify";
import { recordIdentification } from "@/lib/pawprint/store";
import { useHaptics } from "@/lib/pawprint/haptics";
import type { IdentifySession } from "@/lib/pawprint/identify";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/identify/result")({
  component: ResultPage,
});

function ResultPage() {
  const navigate = useNavigate();
  const haptic = useHaptics();
  const [step, setStep] = useState(0);
  const [session, setSession] = useState<IdentifySession | null>(null);

  useEffect(() => {
    const s = getIdentifySession();
    if (!s.passport && s.outcome === "none" && s.angles === 0) {
      navigate({ to: "/identify", replace: true });
      return;
    }
    const timers = MATCH_STEPS.map((_, i) =>
      window.setTimeout(() => setStep(i + 1), 850 * (i + 1)),
    );
    timers.push(
      window.setTimeout(
        () => {
          setSession(s);
          haptic(s.outcome === "match" ? [12, 40, 20] : [30]);
          if (s.outcome === "match" && s.passport) {
            recordIdentification(s.passport.animalId, s.confidence);
          }
        },
        850 * (MATCH_STEPS.length + 1),
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [navigate, haptic]);

  if (!session) {
    return (
      <Screen title="Searching identities" back="/identify" className="pt-0">
        <div className="flex min-h-[70vh] flex-col items-center justify-center">
          <div className="animate-pop relative flex h-24 w-24 items-center justify-center">
            <span className="animate-breathe absolute inset-0 rounded-full border-2 border-primary/25" />
            <span className="absolute inset-4 rounded-full bg-primary/10 blur-xl" />
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <h2 className="mt-8 text-[20px] font-bold tracking-tight">Searching…</h2>
          <ul className="mt-6 w-full space-y-2.5">
            {MATCH_STEPS.map((s, i) => (
              <li
                key={s}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-[14px] font-medium transition-all duration-500",
                  i < step
                    ? "bg-muted/60 text-muted-foreground"
                    : i === step
                      ? "shimmer bg-primary-soft text-accent-foreground"
                      : "text-muted-foreground/40",
                )}
              >
                <span className="flex h-5 w-5 items-center justify-center">
                  {i < step ? (
                    <Check className="h-4 w-4 text-success" strokeWidth={3} />
                  ) : i === step ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </Screen>
    );
  }

  if (session.outcome === "none" || !session.passport) {
    return (
      <Screen title="Identification" back="/identify" className="pt-0">
        <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
          <span className="animate-pop flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchX className="h-8 w-8" />
          </span>
          <h2 className="animate-rise mt-7 text-[24px] font-bold leading-tight tracking-tight">
            No Existing Digital
            <br />
            Identity Found
          </h2>
          <p className="animate-rise mt-3 max-w-[30ch] text-[14px] leading-relaxed text-muted-foreground">
            This dog is not present in the Identity Vault. Register it to create a permanent
            biometric passport.
          </p>
          <div className="mt-9 w-full space-y-2.5">
            <Button onClick={() => navigate({ to: "/create" })}>Register Animal</Button>
            <Button variant="secondary" onClick={() => navigate({ to: "/identify" })}>
              Try Again
            </Button>
          </div>
        </div>
      </Screen>
    );
  }

  const p = session.passport;
  return (
    <Screen title="Identification" back="/identify" className="pt-0">
      <div className="flex min-h-[85vh] flex-col items-center justify-center py-10 text-center">
        <span className="animate-pop flex h-20 w-20 items-center justify-center rounded-full bg-success text-success-foreground shadow-[0_16px_40px_-14px_var(--color-success)]">
          <BadgeCheck className="h-9 w-9" strokeWidth={2.2} />
        </span>
        <h2 className="animate-rise mt-6 text-[26px] font-bold tracking-tight">Identity Found</h2>

        <div className="animate-rise surface mt-7 w-full overflow-hidden">
          <div className="flex items-center gap-3.5 p-4">
            <img
              src={p.photo}
              alt={`${p.name} portrait`}
              loading="lazy"
              width={768}
              height={768}
              className="h-16 w-16 rounded-2xl object-cover"
              style={{ objectPosition: "center 30%" }}
            />
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-[16px] font-semibold tracking-tight">{p.name}</p>
              <p className="tabular font-mono text-[11px] text-muted-foreground">{p.animalId}</p>
              <VerifiedBadge className="mt-1.5" />
            </div>
          </div>
          <div className="border-t border-border bg-success-soft/60 px-4 py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-success">
              Confidence
            </p>
            <p className="tabular mt-1 text-[32px] font-extrabold leading-none text-success">
              {session.confidence.toFixed(1)}%
            </p>
            <p className="mt-1 text-[13px] font-semibold text-success">High Confidence</p>
          </div>
        </div>

        <div className="mt-8 w-full space-y-2.5">
          <Button
            onClick={() => navigate({ to: "/passport/$animalId", params: { animalId: p.animalId } })}
          >
            View Passport
          </Button>
          <Button variant="secondary" onClick={() => navigate({ to: "/identify" })}>
            Identify Another Animal
          </Button>
        </div>
      </div>
    </Screen>
  );
}
