import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  HeartPulse,
  QrCode,
  ShieldCheck,
  Syringe,
  Umbrella,
  User,
  StickyNote,
  Fingerprint,
} from "lucide-react";
import { Screen } from "@/components/pawprint/Screen";
import { VerifiedBadge } from "@/components/pawprint/Badges";
import { EmptyState } from "@/components/pawprint/EmptyState";
import { InfoGrid, SectionTitle } from "@/components/pawprint/Info";
import { STAGE_MAP } from "@/lib/pawprint/stages";
import { getPassport, hydrateRegistry, usePassports } from "@/lib/pawprint/store";

export const Route = createFileRoute("/passport/$animalId")({
  head: ({ params }) => ({
    meta: [
      { title: `Animal Passport ${params.animalId} — PawPrint` },
      {
        name: "description",
        content:
          "Official PawPrint digital animal passport: verified biometric identity, medical history and custodian details.",
      },
      { property: "og:title", content: `Animal Passport ${params.animalId} — PawPrint` },
      {
        property: "og:description",
        content: "A verified biometric identity record for a registered dog.",
      },
    ],
  }),
  component: PassportPage,
  notFoundComponent: () => (
    <Screen title="Animal Passport" back="/vault" className="pt-20">
      <EmptyState icon={Fingerprint} title="Passport not found." hint="It may have been removed." />
    </Screen>
  ),
});

function PassportPage() {
  const { animalId } = Route.useParams();
  usePassports();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrateRegistry();
    setReady(true);
  }, []);

  const p = getPassport(animalId);
  if (!p) {
    if (!ready) return <Screen title="Animal Passport" back="/vault" />;
    throw notFound();
  }

  return (
    <Screen title="Animal Passport" back="/vault" className="pt-5">
      {/* Identity header */}
      <section className="animate-rise overflow-hidden rounded-[1.75rem] border border-primary/20 bg-primary-soft/50 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between border-b border-primary/15 px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> PawPrint Digital Identity
          </span>
          <span className="tabular font-mono text-[10px] text-primary/70">IND · DOG</span>
        </div>
        <div className="flex gap-4 p-4">
          <img
            src={p.photo}
            alt={`${p.name || "Unnamed dog"} identity portrait`}
            width={768}
            height={768}
            className="h-28 w-24 shrink-0 rounded-2xl border border-primary/20 object-cover"
            style={{ objectPosition: "center 28%" }}
          />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[22px] font-bold tracking-tight">{p.name || "Unnamed"}</h2>
            <p className="tabular mt-0.5 font-mono text-[12px] font-medium text-muted-foreground">
              {p.animalId}
            </p>
            <VerifiedBadge className="mt-2" />
            <div className="mt-3 flex gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Reg. quality
                </p>
                <p className="tabular text-[15px] font-bold text-primary">{p.quality}%</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Last match
                </p>
                <p className="tabular text-[15px] font-bold text-success">
                  {p.lastConfidence ? `${p.lastConfidence.toFixed(1)}%` : "—"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-card text-primary/70">
            <QrCode className="h-12 w-12" strokeWidth={1.2} />
          </div>
        </div>
      </section>

      {/* Information */}
      <section className="mt-7">
        <SectionTitle className="mb-2.5">Information</SectionTitle>
        <InfoGrid
          items={[
            ["Species", p.species],
            ["Breed", p.breed],
            ["Gender", p.gender],
            ["Approx. age", p.age],
            ["Color", p.color],
            ["Registered", p.registeredAt],
            ["Location", p.location],
            ["Phone", p.phone],
          ]}
        />
      </section>

      {/* Records */}
      <section className="mt-7 space-y-3">
        <SectionTitle>Records</SectionTitle>

        <RecordCard icon={Syringe} title="Vaccination History">
          {p.vaccinations.length ? (
            <ul className="space-y-2">
              {p.vaccinations.map((v) => (
                <li key={v.label} className="flex items-baseline justify-between gap-3">
                  <span className="text-[14px] font-medium">{v.label}</span>
                  <span className="tabular shrink-0 text-[12px] text-muted-foreground">{v.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={Syringe} title="No vaccinations recorded." compact />
          )}
        </RecordCard>

        <RecordCard icon={HeartPulse} title="Medical Records">
          {p.medical.length ? (
            <ul className="space-y-2">
              {p.medical.map((m) => (
                <li key={m.label}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[14px] font-medium">{m.label}</span>
                    <span className="tabular shrink-0 text-[12px] text-muted-foreground">
                      {m.date}
                    </span>
                  </div>
                  <p className="text-[12px] text-muted-foreground">{m.detail}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={HeartPulse} title="No records available." compact />
          )}
        </RecordCard>

        <RecordCard icon={Umbrella} title="Insurance">
          {p.insurance ? (
            <div className="space-y-1">
              <p className="text-[14px] font-medium">{p.insurance.provider}</p>
              <p className="tabular font-mono text-[12px] text-muted-foreground">
                {p.insurance.policyId} · valid until {p.insurance.validUntil}
              </p>
            </div>
          ) : (
            <EmptyState icon={Umbrella} title="No insurance linked." compact />
          )}
        </RecordCard>

        <RecordCard icon={User} title="Owner Details">
          <p className="text-[14px] font-medium">{p.ownerName || "Not provided"}</p>
          <p className="text-[12px] text-muted-foreground">
            {[p.phone, p.location].filter(Boolean).join(" · ") || "No contact on record"}
          </p>
        </RecordCard>

        <RecordCard icon={StickyNote} title="Notes">
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {p.notes || "No notes added."}
          </p>
        </RecordCard>
      </section>

      {/* Biometrics */}
      <section className="mt-7">
        <SectionTitle className="mb-2.5">Biometric images</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {p.shots.map((shot, i) => (
            <figure
              key={`${shot.stage}-${i}`}
              className="animate-rise overflow-hidden rounded-2xl border border-border bg-muted"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <img
                src={shot.image}
                alt={`${STAGE_MAP[shot.stage].title} biometric frame`}
                loading="lazy"
                className="aspect-square w-full object-cover"
                style={{ objectPosition: shot.crop }}
              />
              <figcaption className="flex items-center justify-between px-2 py-1.5">
                <span className="truncate text-[10px] font-semibold">
                  {STAGE_MAP[shot.stage].short}
                </span>
                <span className="tabular text-[10px] text-muted-foreground">{shot.quality}%</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Link
        to="/identify"
        className="press mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-secondary text-[15px] font-semibold text-secondary-foreground"
      >
        Verify this identity again
      </Link>
    </Screen>
  );
}

function RecordCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-rise surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-[14px] font-semibold tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}
