import { Check, Loader2, Plus, RotateCcw, X } from "lucide-react";
import { useRef } from "react";
import type { CaptureStage } from "@/lib/pawprint/types";
import { cn } from "@/lib/utils";

export type UploadStatus = "empty" | "validating" | "accepted" | "rejected";

export interface UploadSlot {
  status: UploadStatus;
  url?: string;
  reason?: string;
  quality?: number;
}

export function UploadCard({
  stage,
  slot,
  onFile,
  delay = 0,
}: {
  stage: CaptureStage;
  slot: UploadSlot;
  onFile: (file: File) => void;
  delay?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "animate-rise surface flex items-center gap-3.5 p-3",
        slot.status === "accepted" && "border-success/35",
        slot.status === "rejected" && "border-destructive/40",
      )}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label={`Upload ${stage.title} photo`}
        className="press relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-muted"
      >
        {slot.url ? (
          <img src={slot.url} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Plus className="h-5 w-5" />
          </span>
        )}
        {slot.status === "validating" && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/55 text-white">
            <Loader2 className="h-5 w-5 animate-spin" />
          </span>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[15px] font-semibold tracking-tight">{stage.title}</p>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              stage.optional ? "bg-muted text-muted-foreground" : "bg-primary-soft text-primary",
            )}
          >
            {stage.optional ? "Optional" : "Mandatory"}
          </span>
        </div>
        <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
          {slot.status === "empty" && stage.hint}
          {slot.status === "validating" && "Validating image quality…"}
          {slot.status === "accepted" && `Accepted · quality ${slot.quality}%`}
          {slot.status === "rejected" && slot.reason}
        </p>
      </div>

      {slot.status === "accepted" && (
        <span className="animate-pop flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground">
          <Check className="h-4 w-4" strokeWidth={3} />
        </span>
      )}
      {slot.status === "rejected" && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="press flex h-8 items-center gap-1 rounded-full bg-destructive/10 px-3 text-[12px] font-semibold text-destructive"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Retry
        </button>
      )}
      {slot.status === "empty" && (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <X className="h-4 w-4" />
        </span>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
