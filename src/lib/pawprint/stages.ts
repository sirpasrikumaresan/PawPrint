import type { CaptureStage, StageId } from "./types";

export const CAPTURE_STAGES: CaptureStage[] = [
  {
    id: "muzzle",
    title: "Muzzle",
    short: "Muzzle",
    hint: "Align only the muzzle inside the guide. This is the primary biometric.",
    shots: 4,
    optional: false,
    overlay: "oval",
  },
  {
    id: "left",
    title: "Left Profile",
    short: "Left",
    hint: "Frame the head and upper body from the left side.",
    shots: 3,
    optional: false,
    overlay: "left",
  },
  {
    id: "right",
    title: "Right Profile",
    short: "Right",
    hint: "Frame the head and upper body from the right side.",
    shots: 3,
    optional: false,
    overlay: "right",
  },
  {
    id: "front",
    title: "Front View",
    short: "Front",
    hint: "Fit the full body facing the camera inside the outline.",
    shots: 3,
    optional: false,
    overlay: "front",
  },
  {
    id: "back",
    title: "Back View",
    short: "Back",
    hint: "Fit the full body from behind inside the outline.",
    shots: 3,
    optional: false,
    overlay: "back",
  },
  {
    id: "mark",
    title: "Distinguishing Marks",
    short: "Marks",
    hint: "Optional. Capture scars, birthmarks or collar marks.",
    shots: 2,
    optional: true,
    overlay: "square",
  },
];

export const MANDATORY_STAGES = CAPTURE_STAGES.filter((s) => !s.optional);

export const STAGE_MAP: Record<StageId, CaptureStage> = CAPTURE_STAGES.reduce(
  (acc, stage) => {
    acc[stage.id] = stage;
    return acc;
  },
  {} as Record<StageId, CaptureStage>,
);

export const STAGE_CROP: Record<StageId, string> = {
  muzzle: "center 32%",
  left: "38% center",
  right: "62% center",
  front: "center 45%",
  back: "center 58%",
  mark: "48% 60%",
};
