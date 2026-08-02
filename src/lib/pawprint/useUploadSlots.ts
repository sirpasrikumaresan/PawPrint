import { useCallback, useState } from "react";
import type { CaptureStage, StageId } from "@/lib/pawprint/types";
import type { UploadSlot } from "@/components/pawprint/UploadCard";

const REASONS = [
  "Rejected · too blurry",
  "Rejected · poor lighting",
  "Rejected · wrong angle",
  "Rejected · dog not detected",
];

export function useUploadSlots(stages: CaptureStage[]) {
  const [slots, setSlots] = useState<Record<string, UploadSlot>>(() =>
    Object.fromEntries(stages.map((s) => [s.id, { status: "empty" } as UploadSlot])),
  );

  const handleFile = useCallback((stageId: StageId, file: File) => {
    const url = URL.createObjectURL(file);
    setSlots((prev) => ({ ...prev, [stageId]: { status: "validating", url } }));
    window.setTimeout(() => {
      const rejected = file.size % 7 === 0;
      setSlots((prev) => ({
        ...prev,
        [stageId]: rejected
          ? {
              status: "rejected",
              url,
              reason: REASONS[file.size % REASONS.length] as string,
            }
          : { status: "accepted", url, quality: 90 + (file.size % 10) },
      }));
    }, 1100);
  }, []);

  return { slots, handleFile };
}
