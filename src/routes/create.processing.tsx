import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Screen } from "@/components/pawprint/Screen";
import { QualityRing } from "@/components/pawprint/Progress";
import { PROCESSING_STEPS } from "@/lib/pawprint/mock";
import { addPassport, getDraft } from "@/lib/pawprint/store";
import { useHaptics } from "@/lib/pawprint/haptics";
import type { Passport } from "@/lib/pawprint/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/create/processing")({
  component: ProcessingPage,
});

function ProcessingPage() {
  const navigate = useNavigate();
  const haptic = useHaptics();
  const [index, setIndex] = useState(0);
  const [quality, setQuality] = useState(38);
  const savedRef = useRef(false);

  useEffect(() => {
    const draft = getDraft();
    if (!draft.shots.length || !draft.animalId) {
      navigate({ to: "/create", replace: true });
      return;
    }

    let cancelled = false;
    const targets = [46, 58, 67, 74, 83, 91, 97];
    const timers: number[] = [];

    PROCESSING_STEPS.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          setIndex(i + 1);
          setQuality(targets[i] ?? 97);
        }, 900 * (i + 1)),
      );
    });

    timers.push(
      window.setTimeout(
        () => {
          if (cancelled || savedRef.current) return;
          savedRef.current = true;
          const finalQuality = Math.max(90, Math.min(99, draft.quality || 95));
          const passport: Passport = {
            ...draft.details,
            name: draft.details.name.trim(),
            animalId: draft.animalId,
            registeredAt: new Date().toISOString().slice(0, 10),
            quality: finalQuality,
            lastConfidence: null,
            photo: draft.photo ?? "",
            shots: draft.shots,
            vaccinations: [],
            medical: [],
            insurance: null,
          };
          addPassport(passport);
          haptic([12, 40, 12, 40, 22]);
          navigate({ to: "/create/success", replace: true });
        },
        900 * (PROCESSING_STEPS.length + 1),
      ),
    );

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [navigate, haptic]);

  return (
    <Screen bare className="pt-0">
      <div className="flex min-h-screen flex-col items-center justify-center py-12">
        <div className="animate-pop rounded-full bg-white/5 p-6">
          <div className="rounded-full bg-white/5 p-5">
            <QualityRingDark value={quality} />
          </div>
        </div>

        <h2 className="animate-rise mt-8 text-[22px] font-bold tracking-tight text-white">
          Creating Digital Identity
        </h2>
        <p className="mt-1.5 text-[13px] text-white/50">Registration quality</p>

        <ul className="mt-8 w-full space-y-2.5">
          {PROCESSING_STEPS.map((step, i) => {
            const done = i < index;
            const active = i === index;
            return (
              <li
                key={step}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-500",
                  done
                    ? "bg-white/[0.04] text-white/55"
                    : active
                      ? "shimmer bg-white/10 text-white"
                      : "text-white/25",
                )}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {done ? (
                    <Check className="h-4 w-4 text-success" strokeWidth={3} />
                  ) : active ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span className="text-[14px] font-medium">{step}</span>
              </li>
            );
          })}
        </ul>

        {quality >= 91 && (
          <p className="animate-pop mt-8 rounded-full bg-success/15 px-4 py-2 text-[13px] font-semibold text-success">
            Excellent Identity Profile
          </p>
        )}
      </div>
    </Screen>
  );
}

function QualityRingDark({ value }: { value: number }) {
  return (
    <div className="text-white [&_*]:[--color-muted:rgba(255,255,255,0.12)]">
      <QualityRing value={value} caption="Quality" />
    </div>
  );
}
