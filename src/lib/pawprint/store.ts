import { useSyncExternalStore } from "react";
import { SEED_PASSPORTS } from "./mock";
import type { CapturedShot, Passport, PassportDetails } from "./types";

/**
 * In-memory registry with localStorage persistence.
 * Swap this module for a real backend client later — the UI only uses
 * the exported hooks and mutators.
 */

const STORAGE_KEY = "pawprint.registry.v1";

let passports: Passport[] = SEED_PASSPORTS;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    const custom = passports.filter(
      (p) => !SEED_PASSPORTS.some((s) => s.animalId === p.animalId),
    );
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
  } catch {
    /* storage unavailable — registry stays in memory */
  }
}

export function hydrateRegistry() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const custom = JSON.parse(raw) as Passport[];
    if (Array.isArray(custom) && custom.length) {
      passports = [...custom, ...SEED_PASSPORTS];
      emit();
    }
  } catch {
    /* ignore malformed cache */
  }
}

const getSnapshot = () => passports;

export function usePassports(): Passport[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => SEED_PASSPORTS);
}

export function getPassport(animalId: string): Passport | undefined {
  return passports.find((p) => p.animalId === animalId);
}

export function nextAnimalId(): string {
  const max = passports.reduce((acc, p) => {
    const n = Number(p.animalId.split("-").pop());
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 126);
  return `DOG-${new Date().getFullYear()}-${String(max + 1).padStart(6, "0")}`;
}

export function addPassport(passport: Passport) {
  passports = [passport, ...passports];
  persist();
  emit();
}

export function recordIdentification(animalId: string, confidence: number) {
  passports = passports.map((p) => (p.animalId === animalId ? { ...p, lastConfidence: confidence } : p));
  persist();
  emit();
}

/* ---------------- Draft (session-scoped enrolment flow) ---------------- */

export interface EnrolmentDraft {
  method: "guided" | "import" | null;
  shots: CapturedShot[];
  photo: string | null;
  quality: number;
  details: PassportDetails;
  animalId: string;
}

export const emptyDetails: PassportDetails = {
  name: "",
  species: "Dog",
  gender: "Don't Know",
  age: "Don't Know",
  breed: "",
  color: "",
  ownerName: "",
  phone: "",
  location: "",
  notes: "",
};

let draft: EnrolmentDraft = {
  method: null,
  shots: [],
  photo: null,
  quality: 0,
  details: emptyDetails,
  animalId: "",
};

export function getDraft() {
  return draft;
}

export function resetDraft() {
  draft = { method: null, shots: [], photo: null, quality: 0, details: emptyDetails, animalId: "" };
}

export function updateDraft(patch: Partial<EnrolmentDraft>) {
  draft = { ...draft, ...patch };
}
