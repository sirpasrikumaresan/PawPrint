import { createFileRoute, Link } from "@tanstack/react-router";
import { Fingerprint, ScanLine, Vault, ShieldCheck, Sparkles, ChevronRight } from "lucide-react";
import { ActionCard } from "@/components/pawprint/ActionCard";
import { Screen } from "@/components/pawprint/Screen";
import { PassportCard } from "@/components/pawprint/PassportCard";
import { SectionTitle } from "@/components/pawprint/Info";
import { usePassports } from "@/lib/pawprint/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PawPrint — AI Digital Identity Platform for Animals" },
      {
        name: "description",
        content:
          "Create, verify and retrieve trusted digital identities for animals using AI-powered biometrics. No collars, chips or tags.",
      },
      { property: "og:title", content: "PawPrint — AI Digital Identity for Animals" },
      {
        property: "og:description",
        content: "Biometric animal passports powered by AI. Enrol, identify and verify in seconds.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const passports = usePassports();
  const recent = passports.slice(0, 3);

  return (
    <Screen className="pt-8">
      <div className="animate-rise">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
            <Fingerprint className="h-[22px] w-[22px]" strokeWidth={2.2} />
          </span>
          <span className="text-[15px] font-bold tracking-tight">PawPrint</span>
        </div>

        <h1 className="mt-7 text-[34px] font-extrabold leading-[1.06] tracking-[-0.03em]">
          AI-powered Digital
          <br />
          Identity Platform
          <br />
          <span className="text-primary">for Animals</span>
        </h1>
        <p className="mt-4 max-w-[30ch] text-[15px] leading-relaxed text-muted-foreground">
          Create, verify and retrieve trusted digital identities for animals using AI-powered
          biometrics.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[12px] font-medium text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> No collars or chips
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[12px] font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Muzzle biometrics
          </span>
        </div>
      </div>

      <div className="mt-9 space-y-3">
        <ActionCard
          to="/create"
          icon={Fingerprint}
          title="Create Digital Identity"
          description="Register a new animal."
          tone="primary"
          delay={60}
        />
        <ActionCard
          to="/identify"
          icon={ScanLine}
          title="Identify Animal"
          description="Identify an existing animal."
          delay={120}
        />
        <ActionCard
          to="/vault"
          icon={Vault}
          title="Identity Vault"
          description="Browse all registered Animal Passports."
          delay={180}
        />
      </div>

      {recent.length > 0 && (
        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <SectionTitle>Recent registrations</SectionTitle>
            <Link
              to="/vault"
              className="inline-flex items-center text-[13px] font-semibold text-primary"
            >
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-2.5">
            {recent.map((p, i) => (
              <PassportCard key={p.animalId} passport={p} delay={220 + i * 60} />
            ))}
          </div>
        </section>
      )}

      <p className="mt-12 text-center text-[11px] text-muted-foreground">
        PawPrint · Identity infrastructure for animals
      </p>
    </Screen>
  );
}
