import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ScanLine } from "lucide-react";
import { Button } from "@/components/pawprint/Button";
import { CaptureSession } from "@/components/pawprint/CaptureSession";
import { Screen } from "@/components/pawprint/Screen";
import { STAGE_MAP } from "@/lib/pawprint/stages";
import { setIdentifySession } from "@/lib/pawprint/identify";
import { usePassports } from "@/lib/pawprint/store";
import type { CaptureStage } from "@/lib/pawprint/types";

export const Route = createFileRoute("/identify/scan")({
  component: GuidedScan,
});

const SCAN_STAGES: CaptureStage[] = [
  { ...(STAGE_MAP.muzzle as CaptureStage), shots: 3 },
  { ...(STAGE_MAP.front as CaptureStage), shots: 2, hint: "One additional angle raises confidence." },
];

function GuidedScan() {
  const navigate = useNavigate();
  const passports = usePassports();
  const [started, setStarted] = useState(false);
  const target = passports[0];

  return (
    <Screen title="AI Guided Scan" back="/identify" bare className="pt-0">
      {!started ? (
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-10 text-center">
          <div className="animate-pop relative flex h-40 w-40 items-center justify-center">
            <span className="animate-breathe absolute inset-0 rounded-full border-2 border-dashed border-white/25" />
            <span className="absolute inset-6 rounded-full bg-scanner/25 blur-2xl" />
            <ScanLine className="relative h-14 w-14 text-white" strokeWidth={1.4} />
          </div>
          <h2 className="animate-rise mt-8 text-[26px] font-bold tracking-tight text-white">
            Biometric scan
          </h2>
          <p className="animate-rise mt-3 max-w-[32ch] text-[14px] leading-relaxed text-white/60">
            Minimum requirement: the muzzle plus at least one additional angle. The AI captures
            automatically.
          </p>
          <div className="mt-10 w-full">
            <Button variant="light" onClick={() => setStarted(true)}>
              Start AI Scan
            </Button>
            <p className="mt-3 text-[12px] text-white/45">
              Capture another angle to improve identification accuracy.
            </p>
          </div>
        </div>
      ) : (
        <CaptureSession
          stages={SCAN_STAGES}
          label="Identity Scan"
          onComplete={() => {
            setIdentifySession({
              outcome: target ? "match" : "none",
              confidence: 98.4,
              passport: target ?? null,
              angles: 2,
            });
            navigate({ to: "/identify/result" });
          }}
        />
      )}
    </Screen>
  );
}
