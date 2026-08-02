import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PawPrint, Search, SearchX } from "lucide-react";
import { Screen } from "@/components/pawprint/Screen";
import { PassportCard } from "@/components/pawprint/PassportCard";
import { EmptyState } from "@/components/pawprint/EmptyState";
import { usePassports } from "@/lib/pawprint/store";

export const Route = createFileRoute("/vault")({
  head: () => ({
    meta: [
      { title: "Identity Vault — PawPrint" },
      {
        name: "description",
        content:
          "Browse every registered animal passport. Search by animal ID, animal name or owner name.",
      },
      { property: "og:title", content: "Identity Vault — PawPrint" },
      {
        property: "og:description",
        content: "Every verified animal passport, searchable in one secure vault.",
      },
    ],
  }),
  component: VaultPage,
});

function VaultPage() {
  const passports = usePassports();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return passports;
    return passports.filter((p) =>
      [p.animalId, p.name, p.ownerName].some((v) => v.toLowerCase().includes(q)),
    );
  }, [passports, query]);

  return (
    <Screen title="Identity Vault" back="/" className="pt-6">
      <div className="animate-rise flex items-baseline justify-between">
        <h2 className="text-[24px] font-bold tracking-tight">Animal Passports</h2>
        <span className="tabular text-[13px] font-semibold text-muted-foreground">
          {passports.length}
        </span>
      </div>

      <div className="animate-rise sticky top-14 z-20 -mx-5 bg-background/90 px-5 py-3 backdrop-blur-xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search animal ID, name or owner"
            aria-label="Search animal passports"
            className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-[15px] outline-none transition-shadow placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/12"
          />
        </div>
      </div>

      <div className="mt-2 space-y-2.5">
        {passports.length === 0 ? (
          <EmptyState
            icon={PawPrint}
            title="No animals registered yet."
            hint="Create a digital identity to populate the vault."
          />
        ) : results.length === 0 ? (
          <EmptyState icon={SearchX} title="No matching animal found." hint="Try a different term." />
        ) : (
          results.map((p, i) => <PassportCard key={p.animalId} passport={p} delay={i * 50} />)
        )}
      </div>
    </Screen>
  );
}
