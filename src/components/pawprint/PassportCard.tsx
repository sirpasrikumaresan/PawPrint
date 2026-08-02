import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { VerifiedBadge } from "./Badges";
import type { Passport } from "@/lib/pawprint/types";

export function PassportCard({ passport, delay = 0 }: { passport: Passport; delay?: number }) {
  return (
    <Link
      to="/passport/$animalId"
      params={{ animalId: passport.animalId }}
      style={{ animationDelay: `${delay}ms` }}
      className="lift animate-rise surface flex items-center gap-3.5 p-3"
    >
      <img
        src={passport.photo}
        alt={`${passport.name || "Unnamed dog"} biometric portrait`}
        loading="lazy"
        width={768}
        height={768}
        className="h-16 w-16 shrink-0 rounded-2xl object-cover"
        style={{ objectPosition: "center 30%" }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold tracking-tight">
          {passport.name || "Unnamed"}
        </p>
        <p className="tabular mt-0.5 font-mono text-[11px] tracking-tight text-muted-foreground">
          {passport.animalId}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <VerifiedBadge />
          <span className="text-[11px] text-muted-foreground">{passport.registeredAt}</span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </Link>
  );
}
