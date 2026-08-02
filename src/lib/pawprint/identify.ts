import type { Passport } from "./types";

export interface IdentifySession {
  outcome: "match" | "none";
  confidence: number;
  passport: Passport | null;
  angles: number;
}

let session: IdentifySession = { outcome: "none", confidence: 0, passport: null, angles: 0 };

export function setIdentifySession(next: IdentifySession) {
  session = next;
}

export function getIdentifySession() {
  return session;
}
