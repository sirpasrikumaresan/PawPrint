import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/pawprint/Button";
import { Screen } from "@/components/pawprint/Screen";
import { getDraft, getPassport } from "@/lib/pawprint/store";
import type { Passport } from "@/lib/pawprint/types";

export const Route = createFileRoute("/create/success")({
  component: SuccessPage,
});

function SuccessPage() {
  const navigate = useNavigate();
  const [passport, setPassport] = useState<Passport | null>(null);

  useEffect(() => {
    const draft = getDraft();
    const found = draft.animalId ? getPassport(draft.animalId) : undefined;
    if (!found) {
      navigate({ to: "/", replace: true });
      return;
    }
    setPassport(found);
  }, [navigate]);

  if (!passport) return <Screen className="pt-24" />;

  const stars = Math.max(1, Math.round(passport.quality / 20));

  return (
    <Screen className="pt-0">
      <div className="flex min-h-screen flex-col items-center justify-center py-12 text-center">
        <div className="animate-pop relative flex h-28 w-28 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-success/12" />
          <span className="animate-breathe absolute inset-3 rounded-full bg-success/18" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-success text-success-foreground shadow-[0_16px_40px_-12px_var(--color-success)]">
            <Check className="h-8 w-8" strokeWidth={3} />
          </span>
        </div>

        <h2 className="animate-rise mt-8 text-[26px] font-bold leading-tight tracking-tight">
          Digital Identity
          <br />
          Created Successfully
        </h2>

        <div className="animate-rise surface mt-8 w-full p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Animal ID
          </p>
          <p className="tabular mt-1 font-mono text-[19px] font-bold tracking-tight">
            {passport.animalId}
          </p>
          <div className="mt-4 h-px bg-border" />
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[13px] font-medium text-muted-foreground">
              Registration quality
            </span>
            <span className="tabular text-[19px] font-bold text-primary">{passport.quality}%</span>
          </div>
          <div className="mt-2 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={
                  i < stars ? "h-5 w-5 fill-warning text-warning" : "h-5 w-5 text-muted-foreground/35"
                }
              />
            ))}
          </div>
        </div>

        <div className="mt-8 w-full space-y-2.5">
          <Button
            onClick={() =>
              navigate({ to: "/passport/$animalId", params: { animalId: passport.animalId } })
            }
          >
            View Passport
          </Button>
          <Button variant="secondary" onClick={() => navigate({ to: "/" })}>
            Back Home
          </Button>
        </div>
      </div>
    </Screen>
  );
}
