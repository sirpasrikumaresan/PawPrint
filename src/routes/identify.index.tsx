import { createFileRoute } from "@tanstack/react-router";
import { Images, ScanLine, Info } from "lucide-react";
import { ActionCard } from "@/components/pawprint/ActionCard";
import { Screen } from "@/components/pawprint/Screen";

export const Route = createFileRoute("/identify/")({
  component: IdentifyStart,
});

function IdentifyStart() {
  return (
    <Screen title="Identify Animal" back="/" className="pt-6">
      <h2 className="animate-rise text-[26px] font-bold leading-tight tracking-tight">
        How would you like to identify this animal?
      </h2>
      <p className="animate-rise mt-2 text-[14px] leading-relaxed text-muted-foreground">
        A muzzle scan plus at least one additional angle is required for a confident match.
      </p>

      <div className="mt-7 space-y-3">
        <ActionCard
          to="/identify/scan"
          icon={ScanLine}
          title="AI Guided Scan"
          description="Scan the animal live using AI guidance."
          badge="Recommended"
          tone="primary"
          delay={60}
        />
        <ActionCard
          to="/identify/import"
          icon={Images}
          title="Import Existing Photos"
          description="Use photographs already available."
          delay={120}
        />
      </div>

      <div className="animate-rise mt-7 flex gap-3 rounded-2xl bg-muted/60 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Muzzle patterns are unique to every dog — PawPrint matches them against every registered
          passport in the vault.
        </p>
      </div>
    </Screen>
  );
}
