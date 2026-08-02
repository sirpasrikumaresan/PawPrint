import type { OverlayKind } from "@/lib/pawprint/types";
import { cn } from "@/lib/utils";

function shapeFor(kind: OverlayKind) {
  switch (kind) {
    case "oval":
      return <ellipse cx="150" cy="205" rx="82" ry="112" />;
    case "left":
      return (
        <path d="M78 96 C78 72 96 62 122 62 L188 62 C214 62 232 78 232 106 L232 300 C232 330 210 348 178 348 L118 348 C92 348 78 330 78 302 Z" />
      );
    case "right":
      return (
        <path
          d="M78 96 C78 72 96 62 122 62 L188 62 C214 62 232 78 232 106 L232 300 C232 330 210 348 178 348 L118 348 C92 348 78 330 78 302 Z"
          transform="translate(300,0) scale(-1,1)"
        />
      );
    case "front":
      return <rect x="38" y="112" width="224" height="206" rx="56" />;
    case "back":
      return <rect x="42" y="100" width="216" height="232" rx="60" />;
    case "square":
    default:
      return <rect x="72" y="136" width="156" height="156" rx="30" />;
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
