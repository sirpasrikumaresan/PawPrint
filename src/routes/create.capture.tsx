import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/pawprint/Button";
import { CaptureSession } from "@/components/pawprint/CaptureSession";
import { Screen } from "@/components/pawprint/Screen";
import { CAPTURE_STAGES } from "@/lib/pawprint/stages";
import { MOCK_PHOTOS } from "@/lib/pawprint/mock";
import { updateDraft, usePassports } from "@/lib/pawprint/store";

export const Route = createFileRoute("/create/capture")({
  component: GuidedCapture,
});

function GuidedCapture() {
  const navigate = useNavigate();
  const passports = usePassports();
  const [started, setStarted] = useState(false);
  const photo = MOCK_PHOTOS[passports.length % MOCK_PHOTOS.length] as string;

  return (
    <Screen title="AI Guided Capture" back="/create" bare className="pt-0">
      {!started ? (
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-10 text-center">
          <div className="animate-pop relative flex h-40 w-40 items-center justify-center">
            <span className="animate-breathe absolute inset-0 rounded-full border-2 border-dashed border-white/25" />
            <span className="absolute inset-5 rounded-full bg-primary/20 blur-2xl" />
            <Camera className="relative h-14 w-14 text-white" strokeWidth={1.4} />
          </div>
          <h2 className="animate-rise mt-8 text-[26px] font-bold tracking-tight text-white">
            Biometric enrolment
          </h2>
          <p className="animate-rise mt-3 max-w-[32ch] text-[14px] leading-relaxed text-white/60">
            Press once. PawPrint's AI guides framing, checks quality and captures automatically
            across five biometric angles.
          </p>
          <ul className="animate-rise mt-6 flex flex-wrap justify-center gap-1.5">
            {CAPTURE_STAGES.map((s) => (
              <li
                key={s.id}
                className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white/70"
              >
                {s.title}
              </li>
            ))}
          </ul>
          <div className="mt-10 w-full">
            <Button variant="light" onClick={() => setStarted(true)}>
              Start AI Capture
            </Button>
            <p className="mt-3 text-[12px] text-white/45">
              AI automatically captures when alignment and image quality are sufficient.
            </p>
          </div>
        </div>
      ) : (
        <CaptureSession
          stages={CAPTURE_STAGES}
          label="Identity Capture"
          onComplete={(shots) => {
            const quality = Math.round(
              shots.reduce((a, s) => a + s.quality, 0) / Math.max(1, shots.length),
            );
            const photo = shots[0]?.image ?? "";
            updateDraft({ method: "guided", shots, photo, quality });
            navigate({ to: "/create/details" });
          }}
        />
      )}
    </Screen>
  );
}
