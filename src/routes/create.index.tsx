import { createFileRoute } from "@tanstack/react-router";
import { Camera, Images, Info } from "lucide-react";
import { useEffect } from "react";
import { ActionCard } from "@/components/pawprint/ActionCard";
import { Screen } from "@/components/pawprint/Screen";
import { resetDraft } from "@/lib/pawprint/store";

export const Route = createFileRoute("/create/")({
  component: CreateStart,
});

function CreateStart() {
  useEffect(() => {
    resetDraft();
  }, []);

  return (
    <Screen title="Create Digital Identity" back="/" className="pt-6">
      <h2 className="animate-rise text-[26px] font-bold leading-tight tracking-tight">
        How would you like to register this animal?
      </h2>
      <p className="animate-rise mt-2 text-[14px] leading-relaxed text-muted-foreground">
        PawPrint builds a permanent biometric identity from the dog's muzzle, profiles and body
        markings.
      </p>

      <div className="mt-7 space-y-3">
        <ActionCard
          to="/create/capture"
          icon={Camera}
          title="AI Guided Capture"
          description="Capture the animal live using AI guidance."
          badge="Recommended"
          tone="primary"
          delay={60}
        />
        <ActionCard
          to="/create/import"
          icon={Images}
          title="Import Existing Photos"
          description="Upload photographs already available."
          delay={120}
        />
      </div>

      <div className="animate-rise mt-7 flex gap-3 rounded-2xl bg-muted/60 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          AI Guided Capture produces significantly higher identity quality — the system captures
          only when alignment, sharpness and lighting are sufficient.
        </p>
      </div>
    </Screen>
  );
}
