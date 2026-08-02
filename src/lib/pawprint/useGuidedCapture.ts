import { useEffect, useRef, useState } from "react";
import type { CaptureStage, CapturedShot } from "./types";
import { STAGE_CROP } from "./stages";

export type CapturePhase =
  | "booting"
  | "guiding"
  | "locking"
  | "capturing"
  | "accepted"
  | "rejected"
  | "stage-complete"
  | "complete";

export interface GuidedCaptureState {
  stageIndex: number;
  stage: CaptureStage;
  shotsInStage: number;
  phase: CapturePhase;
  message: string;
  detail: string;
  lock: number;
  shots: CapturedShot[];
  flashKey: number;
}

const GUIDANCE = [
  ["Move closer", "Bring the subject into the guide"],
  ["Hold steady", "Keeping the frame stable"],
  ["Increase lighting", "Boosting exposure"],
  ["Perfect", "Alignment and quality confirmed"],
];

const pick = <T,>(arr: T[], i: number): T => arr[((i % arr.length) + arr.length) % arr.length] as T;

const REJECTIONS = [
  ["Too blurry", "Motion detected — recapturing"],
  ["Dog not detected", "Repositioning guide — recapturing"],
  ["Wrong angle", "Rotate slightly — recapturing"],
  ["Too dark", "Increase lighting — recapturing"],
];

/**
 * Scripted AI capture engine (mock). Emits Face-ID style guidance, auto-fires
 * captures when "alignment" is sufficient and validates each frame instantly.
 */
export function useGuidedCapture(
  stages: CaptureStage[],
  image: string,
  onComplete: (shots: CapturedShot[]) => void,
  onEvent?: (phase: CapturePhase) => void,
) {
  const [state, setState] = useState<GuidedCaptureState>({
    stageIndex: 0,
    stage: stages[0] as CaptureStage,
    shotsInStage: 0,
    phase: "booting",
    message: "Initializing camera",
    detail: "Preparing biometric sensor",
    lock: 0,
    shots: [],
    flashKey: 0,
  });
  const skipRef = useRef<() => void>(() => {});
  const eventRef = useRef(onEvent);
  eventRef.current = onEvent;

  useEffect(() => {
    let cancelled = false;
    let skipResolve: (() => void) | null = null;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(() => {
          skipResolve = null;
          resolve();
        }, ms);
        skipResolve = () => {
          clearTimeout(t);
          skipResolve = null;
          resolve();
        };
      });
    skipRef.current = () => skipResolve?.();

    const push = (patch: Partial<GuidedCaptureState>) => {
      if (cancelled) return;
      if (patch.phase) eventRef.current?.(patch.phase);
      setState((prev) => ({ ...prev, ...patch }));
    };

    (async () => {
      const collected: CapturedShot[] = [];
      await wait(900);

      for (let s = 0; s < stages.length; s++) {
        const stage = stages[s] as CaptureStage;
        push({
          stageIndex: s,
          stage,
          shotsInStage: 0,
          phase: "guiding",
          message: "Move closer",
          detail: stage.hint,
          lock: 8,
        });
        await wait(700);
        if (cancelled) return;

        let taken = 0;
        let attempt = 0;
        while (taken < stage.shots) {
          const g = pick(GUIDANCE, taken === 0 && attempt === 0 ? 1 : taken + attempt);
          push({ phase: "guiding", message: g[0] as string, detail: g[1] as string, lock: 34 + taken * 6 });
          await wait(620);
          if (cancelled) return;

          push({ phase: "locking", message: "Perfect", detail: "Alignment locked", lock: 92 });
          await wait(420);
          if (cancelled) return;

          push({ phase: "capturing", message: "Capturing…", detail: "Hold still", lock: 100 });
          await wait(480);
          if (cancelled) return;

          const reject = s === 1 && taken === 1 && attempt === 0;
          if (reject) {
            const r = pick(REJECTIONS, s + taken);
            push({ phase: "rejected", message: r[0] as string, detail: r[1] as string, lock: 20 });
            await wait(1000);
            attempt++;
            continue;
          }

          const quality = 91 + ((s * 3 + taken * 5) % 9);
          collected.push({
            stage: stage.id,
            quality,
            image,
            crop: STAGE_CROP[stage.id],
          });
          taken++;
          push({
            phase: "accepted",
            message: quality > 95 ? "Excellent" : "Accepted",
            detail: `Frame ${taken} of ${stage.shots} · quality ${quality}%`,
            shotsInStage: taken,
            shots: [...collected],
            flashKey: collected.length,
            lock: 100,
          });
          await wait(680);
          if (cancelled) return;
        }

        push({
          phase: "stage-complete",
          message: "Captured successfully",
          detail: `${stage.title} biometrics secured`,
          lock: 100,
        });
        await wait(820);
        if (cancelled) return;
      }

      push({ phase: "complete", message: "Identity capture complete", detail: "", lock: 100 });
      await wait(600);
      if (!cancelled) onComplete(collected);
    })();

    return () => {
      cancelled = true;
      skipResolve?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
