import { Check, CircleAlert, Sparkles, VideoOff } from "lucide-react";
import { useEffect, useRef } from "react";
import { CaptureOverlay } from "./CaptureOverlay";
import { ProgressHeader } from "./Progress";
import { Button } from "./Button";
import { useGuidedCapture } from "@/lib/pawprint/useGuidedCapture";
import { useCamera } from "@/lib/pawprint/useCamera";
import { useHaptics } from "@/lib/pawprint/haptics";
import type { CaptureStage, CapturedShot } from "@/lib/pawprint/types";
import { cn } from "@/lib/utils";

export function CaptureSession({
  stages,
  label,
  onComplete,
}: {
  stages: CaptureStage[];
  label: string;
  onComplete: (shots: CapturedShot[]) => void;
}) {
  const camera = useCamera(true);
  const failed = camera.status === "denied" || camera.status === "error" || camera.status === "unsupported";

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col pb-8 pt-4">
      <div className="relative overflow-hidden rounded-[2rem] bg-black">
        <video
          ref={camera.attach}
          playsInline
          muted
          autoPlay
          className="pointer-events-none absolute h-px w-px opacity-0"
        />
      </div>
      {failed ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <VideoOff className="h-10 w-10 text-white/60" strokeWidth={1.5} />
          <h2 className="mt-5 text-[20px] font-bold tracking-tight text-white">Camera unavailable</h2>
          <p className="mt-2 max-w-[32ch] text-[14px] leading-relaxed text-white/60">{camera.message}</p>
        </div>
      ) : camera.status !== "ready" ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="animate-breathe h-24 w-24 rounded-full border-2 border-dashed border-white/25" />
          <p className="mt-6 text-[14px] text-white/60">Requesting camera access…</p>
        </div>
      ) : (
        <LiveSession
          stages={stages}
          label={label}
          onComplete={onComplete}
          attach={camera.attach}
          captureFrame={camera.captureFrame}
        />
      )}
    </div>
  );
}

function LiveSession({
  stages,
  label,
  onComplete,
  attach,
  captureFrame,
}: {
  stages: CaptureStage[];
  label: string;
  onComplete: (shots: CapturedShot[]) => void;
  attach: (el: HTMLVideoElement | null) => void;
  captureFrame: () => string;
}) {
  const haptic = useHaptics();
  const doneRef = useRef(false);
  const state = useGuidedCapture(stages, captureFrame, (shots) => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete(shots);
  });

  useEffect(() => {
    if (state.phase === "accepted") haptic(14);
    if (state.phase === "rejected") haptic([8, 40, 8]);
    if (state.phase === "stage-complete") haptic([10, 30, 18]);
  }, [state.phase, state.flashKey, haptic]);

  const totalShots = stages.reduce((a, s) => a + s.shots, 0);
  const percent = (state.shots.length / totalShots) * 100;
  const bad = state.phase === "rejected";
  const good = state.phase === "accepted" || state.phase === "stage-complete";
  const locked = state.phase === "locking" || state.phase === "capturing";

  return (
    <>
      <ProgressHeader
        step={state.stageIndex + 1}
        total={stages.length}
        label={label}
        percent={percent}
        dark
      />

      <div className="relative mt-5 overflow-hidden rounded-[2rem] bg-black shadow-[var(--shadow-lift)]">
        <div className="relative aspect-[3/4] w-full">
          <video
            ref={attach}
            playsInline
            muted
            autoPlay
            aria-label="Live camera preview"
            className={cn(
              "h-full w-full object-cover transition-all duration-700 ease-out",
              locked ? "blur-0" : "blur-[0.5px]",
            )}
          />
          <CaptureOverlay
            kind={state.stage.overlay}
            state={bad ? "bad" : good ? "good" : locked ? "locked" : "idle"}
          />

          {/* scanning sweep */}
          {(state.phase === "guiding" || state.phase === "locking") && (
            <div className="pointer-events-none absolute inset-x-8 inset-y-0 overflow-hidden">
              <div className="animate-scan h-full w-full bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--color-scanner)_40%,transparent),transparent)]" />
            </div>
          )}

          {/* capture flash */}
          <div
            key={state.flashKey}
            className={cn(
              "pointer-events-none absolute inset-0 bg-white",
              state.flashKey > 0 ? "animate-flash" : "opacity-0",
            )}
          />

          {/* top-left stage label */}
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-white/80" />
            <span className="text-[12px] font-semibold text-white">{state.stage.title}</span>
            {state.stage.optional && <span className="text-[11px] text-white/60">· optional</span>}
          </div>

          {/* shot dots */}
          <div className="absolute right-4 top-4 flex gap-1.5">
            {Array.from({ length: state.stage.shots }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all duration-300",
                  i < state.shotsInStage ? "scale-125 bg-success" : "bg-white/35",
                )}
              />
            ))}
          </div>

          {/* guidance chip */}
          <div className="absolute inset-x-4 bottom-4 flex justify-center">
            <div
              key={state.message}
              className={cn(
                "animate-pop flex max-w-full items-center gap-2 rounded-full px-4 py-2.5 backdrop-blur-xl",
                bad
                  ? "bg-destructive text-destructive-foreground"
                  : good
                    ? "bg-success text-success-foreground"
                    : "bg-white/92 text-ink",
              )}
            >
              {bad ? (
                <CircleAlert className="h-4 w-4 shrink-0" />
              ) : good ? (
                <Check className="h-4 w-4 shrink-0" strokeWidth={3} />
              ) : (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
              )}
              <span className="truncate text-[14px] font-semibold tracking-tight">
                {state.message}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 min-h-[2.5rem] text-center text-[13px] leading-snug text-white/60">
        {state.detail}
      </p>

      <div className="mt-2 flex flex-wrap justify-center gap-1.5">
        {stages.map((s, i) => (
          <span
            key={s.id}
            className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-300",
              i < state.stageIndex
                ? "bg-success/20 text-success"
                : i === state.stageIndex
                  ? "bg-white text-ink"
                  : "bg-white/10 text-white/50",
            )}
          >
            {i < state.stageIndex && <Check className="h-3 w-3" strokeWidth={3} />}
            {s.short}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <p className="mb-3 text-center text-[12px] leading-relaxed text-white/50">
          AI automatically captures when alignment and image quality are sufficient.
        </p>
        {state.stage.optional && state.phase !== "complete" && (
          <Button
            variant="glass"
            size="md"
            onClick={() => {
              if (doneRef.current) return;
              doneRef.current = true;
              onComplete(state.shots);
            }}
          >
            Skip distinguishing marks
          </Button>
        )}
      </div>
    </>
  );
}
