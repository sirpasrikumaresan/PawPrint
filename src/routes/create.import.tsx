import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/pawprint/Button";
import { Screen } from "@/components/pawprint/Screen";
import { UploadCard } from "@/components/pawprint/UploadCard";
import { CAPTURE_STAGES, MANDATORY_STAGES, STAGE_CROP } from "@/lib/pawprint/stages";
import { useUploadSlots } from "@/lib/pawprint/useUploadSlots";
import { updateDraft } from "@/lib/pawprint/store";
import type { CapturedShot } from "@/lib/pawprint/types";

export const Route = createFileRoute("/create/import")({
  component: ImportPhotos,
});

function ImportPhotos() {
  const navigate = useNavigate();
  const { slots, handleFile } = useUploadSlots(CAPTURE_STAGES);
  const ready = MANDATORY_STAGES.every((s) => slots[s.id]?.status === "accepted");
  const accepted = CAPTURE_STAGES.filter((s) => slots[s.id]?.status === "accepted");

  return (
    <Screen title="Import Existing Photos" back="/create" className="pt-6">
      <h2 className="animate-rise text-[24px] font-bold leading-tight tracking-tight">
        Upload biometric photographs
      </h2>
      <p className="animate-rise mt-2 text-[13px] leading-relaxed text-muted-foreground">
        Every image is validated instantly. Continue unlocks once all mandatory angles are accepted.
      </p>

      <div className="mt-6 space-y-2.5">
        {CAPTURE_STAGES.map((stage, i) => (
          <UploadCard
            key={stage.id}
            stage={stage}
            slot={slots[stage.id] ?? { status: "empty" }}
            onFile={(file) => handleFile(stage.id, file)}
            delay={i * 50}
          />
        ))}
      </div>

      <div className="mt-6 flex gap-3 rounded-2xl bg-muted/60 p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Imported photographs typically produce lower identity quality than AI Guided Capture.
        </p>
      </div>

      <div className="sticky bottom-0 -mx-5 mt-6 bg-gradient-to-t from-background via-background to-transparent px-5 pb-6 pt-4">
        <Button
          disabled={!ready}
          onClick={() => {
            const shots: CapturedShot[] = accepted.map((s) => ({
              stage: s.id,
              quality: slots[s.id]?.quality ?? 90,
              image: slots[s.id]?.url ?? "",
              crop: STAGE_CROP[s.id],
            }));
            const quality = Math.round(
              shots.reduce((a, s) => a + s.quality, 0) / Math.max(1, shots.length),
            );
            updateDraft({
              method: "import",
              shots,
              photo: shots[0]?.image ?? null,
              quality,
            });
            navigate({ to: "/create/details" });
          }}
        >
          {ready ? "Continue" : "Upload mandatory images to continue"}
        </Button>
      </div>
    </Screen>
  );
}
