import type { OverlayKind } from "@/lib/pawprint/types";
import { cn } from "@/lib/utils";

function shapeFor(kind: OverlayKind) {
  switch (kind) {
    case "oval":
      return <ellipse cx="150" cy="205" rx="82" ry="112" />;
    case "left":
    case "right":
      return <rect x="46" y="90" width="208" height="240" rx="28" />;
    case "front":
      return <rect x="38" y="104" width="224" height="212" rx="28" />;
    case "back":
      return <rect x="42" y="96" width="216" height="228" rx="28" />;
    case "square":
    default:
      return <rect x="62" y="128" width="176" height="164" rx="24" />;
  }
}

export function CaptureOverlay({
  kind,
  state,
}: {
  kind: OverlayKind;
  state: "idle" | "locked" | "good" | "bad";
}) {
  const stroke =
    state === "good"
      ? "var(--color-success)"
      : state === "bad"
        ? "var(--color-destructive)"
        : state === "locked"
          ? "var(--color-primary)"
          : "rgba(255,255,255,0.85)";

  return (
    <svg
      viewBox="0 0 300 420"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <mask id={`pp-mask-${kind}`}>
          <rect width="300" height="420" fill="white" />
          <g key={kind} fill="black" className="animate-pop">
            {shapeFor(kind)}
          </g>
        </mask>
      </defs>
      <rect
        width="300"
        height="420"
        fill="oklch(0.14 0.02 262)"
        opacity="0.62"
        mask={`url(#pp-mask-${kind})`}
      />
      <g
        key={`${kind}-outline`}
        className={cn("animate-pop", state === "idle" && "animate-breathe")}
        fill="none"
        stroke={stroke}
        strokeWidth={state === "idle" ? 2 : 3}
        strokeDasharray={state === "idle" ? "14 12" : undefined}
        strokeLinecap="round"
        style={{ transition: "stroke 0.3s ease" }}
      >
        {shapeFor(kind)}
      </g>
    </svg>
  );
}
