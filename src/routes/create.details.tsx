import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Fingerprint } from "lucide-react";
import { Button } from "@/components/pawprint/Button";
import { Screen } from "@/components/pawprint/Screen";
import { SectionTitle } from "@/components/pawprint/Info";
import { emptyDetails, getDraft, nextAnimalId, updateDraft } from "@/lib/pawprint/store";
import type { AgeBand, Gender, PassportDetails } from "@/lib/pawprint/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/create/details")({
  component: DetailsPage,
});

function Field({
  label,
  optional,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline,
}: {
  label: string;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
}) {
  const cls =
    "mt-1.5 w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-[15px] outline-none transition-shadow placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/12";
  return (
    <label className="block">
      <span className="flex items-baseline gap-1.5 text-[13px] font-semibold">
        {label}
        {optional && <span className="text-[11px] font-medium text-muted-foreground">Optional</span>}
      </span>
      {multiline ? (
        <textarea
          className={cn(cls, "min-h-[92px] resize-none")}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={cls}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <span className="text-[13px] font-semibold">{label}</span>
      <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "press h-11 rounded-xl border text-[13px] font-semibold",
              value === opt
                ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                : "border-border bg-card text-foreground hover:bg-muted",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function DetailsPage() {
  const navigate = useNavigate();
  const [details, setDetails] = useState<PassportDetails>(emptyDetails);
  const [animalId, setAnimalId] = useState("DOG-2026-000127");
  const [shotCount, setShotCount] = useState(0);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const draft = getDraft();
    if (!draft.shots.length) {
      navigate({ to: "/create", replace: true });
      return;
    }
    setShotCount(draft.shots.length);
    setAnimalId(nextAnimalId());
  }, [navigate]);

  const set = <K extends keyof PassportDetails>(key: K, value: PassportDetails[K]) =>
    setDetails((d) => ({ ...d, [key]: value }));

  return (
    <Screen title="Passport Details" back="/create" className="pt-6">
      <div className="animate-rise surface flex items-center gap-3 p-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success-soft text-success">
          <Fingerprint className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[14px] font-semibold">Biometrics secured</p>
          <p className="text-[12px] text-muted-foreground">
            {shotCount} validated frames · ready for identity generation
          </p>
        </div>
      </div>

      <div className="animate-rise mt-6 space-y-5">
        <SectionTitle>Animal</SectionTitle>
        <Field
          label="Animal Name"
          optional
          value={details.name}
          onChange={(v) => set("name", v)}
          placeholder="e.g. Nova"
        />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Species" value={details.species} onChange={() => {}} />
          <Field
            label="Breed"
            optional
            value={details.breed}
            onChange={(v) => set("breed", v)}
            placeholder="e.g. Indie"
          />
        </div>
        <Segmented<Gender>
          label="Gender"
          options={["Male", "Female", "Don't Know"] as const}
          value={details.gender}
          onChange={(v) => set("gender", v)}
        />
        <Segmented<AgeBand>
          label="Approximate Age"
          options={["Puppy", "Adult", "Senior", "Don't Know"] as const}
          value={details.age}
          onChange={(v) => set("age", v)}
        />
        <Field
          label="Color"
          optional
          value={details.color}
          onChange={(v) => set("color", v)}
          placeholder="e.g. Black & Tan"
        />

        <SectionTitle className="pt-2">Custodian</SectionTitle>
        <Field
          label="Owner Name"
          optional
          value={details.ownerName}
          onChange={(v) => set("ownerName", v)}
        />
        <Field
          label="Phone Number"
          optional
          type="tel"
          value={details.phone}
          onChange={(v) => set("phone", v)}
        />
        <Field
          label="Location"
          optional
          value={details.location}
          onChange={(v) => set("location", v)}
          placeholder="City or area"
        />
        <Field
          label="Notes"
          optional
          multiline
          value={details.notes}
          onChange={(v) => set("notes", v)}
          placeholder="Temperament, feeding spot, distinguishing behaviour…"
        />

        <SectionTitle className="pt-2">System generated</SectionTitle>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border">
          <div className="bg-muted/50 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Animal ID
            </p>
            <p className="tabular mt-0.5 font-mono text-[13px] font-semibold">{animalId}</p>
          </div>
          <div className="bg-muted/50 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Registration date
            </p>
            <p className="tabular mt-0.5 text-[13px] font-semibold">{today}</p>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-5 mt-8 bg-gradient-to-t from-background via-background to-transparent px-5 pb-6 pt-4">
        <Button
          onClick={() => {
            updateDraft({ details, animalId });
            navigate({ to: "/create/processing" });
          }}
        >
          Create Digital Identity
        </Button>
      </div>
    </Screen>
  );
}
