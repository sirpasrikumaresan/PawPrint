import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/pawprint/Button";
import { Screen } from "@/components/pawprint/Screen";
import { UploadCard } from "@/components/pawprint/UploadCard";
import { CAPTURE_STAGES } from "@/lib/pawprint/stages";
import { useUploadSlots } from "@/lib/pawprint/useUploadSlots";
import { setIdentifySession } from "@/lib/pawprint/identify";
import { usePassports } from "@/lib/pawprint/store";

export const Route = createFileRoute("/identify/import")({
  component: IdentifyImport,
});

const STAGES = CAPTURE_STAGES.map((s) =>
  s.id === "muzzle" ? s : { ...s, optional: true, hint: "Optional — improves confidence." },
);

function IdentifyImport() {
  const navigate = useNavigate();
  const passports = usePassports();
  const { slots, handleFile } = useUploadSlots(STAGES);
  const accepted = STAGES.filter((s) => slots[s.id]?.status === "accepted");
  const muzzleReady = slots.muzzle?.status === "accepted";
  const extras = accepted.length - 1;

  return (
    <Screen title="Import Photos" back="/identify" className="pt-6">
      <h2 className="animate-rise text-[24px] font-bold leading-tight tracking-tight">
        Upload photographs to identify
      </h2>
      <p className="animate-rise mt-2 text-[13px] leading-relaxed text-muted-foreground">
        The muzzle is mandatory. Additional images improve confidence.
      </p>

      <div className="mt-6 space-y-2.5">
        {STAGES.map((stage, i) => (
          <UploadCard
            key={stage.id}
            stage={stage}
            slot={slots[stage.id] ?? { status: "empty" }}
            onFile={(file) => handleFile(stage.id, file)}
            delay={i * 50}
          />
        ))}
      </div>

      <div className="mt-6 flex gap-3 rounded-2xl bg-primary-soft/70 p-4">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-[13px] leading-relaxed text-accent-foreground">
          {extras > 0
            ? `${extras} additional angle${extras > 1 ? "s" : ""} added — expected confidence is high.`
            : "Additional images improve confidence."}
        </p>
      </div>

      <div className="sticky bottom-0 -mx-5 mt-6 bg-gradient-to-t from-background via-background to-transparent px-5 pb-6 pt-4">
        <Button
          disabled={!muzzleReady}
          onClick={() => {
            const matched = extras > 0 ? (passports[1] ?? passports[0] ?? null) : null;
            setIdentifySession({
              outcome: matched ? "match" : "none",
              confidence: matched ? 96.2 : 0,
              passport: matched,
              angles: accepted.length,
            });
            navigate({ to: "/identify/result" });
          }}
        >
          {muzzleReady ? "Search Identities" : "Upload muzzle photo to continue"}
        </Button>
      </div>
    </Screen>
  );
}
