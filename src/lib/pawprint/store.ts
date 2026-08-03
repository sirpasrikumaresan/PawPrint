import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { CapturedShot, Passport, PassportDetails } from "./types";

/**
 * Cloud-backed registry. Passport records live in the `passports` table and
 * biometric imagery lives in the private `passport-photos` storage bucket.
 * Storage paths are resolved to signed URLs before reaching the UI, so the
 * components keep consuming plain image URLs.
 */

const BUCKET = "passport-photos";
const SIGNED_URL_TTL = 60 * 60 * 6;

let passports: Passport[] = [];
let hydrated = false;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/* ---------------- mapping ---------------- */

type Row = {
  animal_id: string;
  name: string;
  species: string;
  gender: string;
  age: string;
  breed: string;
  color: string;
  owner_name: string;
  phone: string;
  location: string;
  notes: string;
  registered_at: string;
  quality: number;
  last_confidence: number | null;
  photo: string;
  shots: unknown;
  vaccinations: unknown;
  medical: unknown;
  insurance: unknown;
};

function isStoragePath(value: string) {
  return !!value && !value.startsWith("http") && !value.startsWith("data:") && !value.startsWith("/");
}

async function signPaths(paths: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const unique = [...new Set(paths.filter(isStoragePath))];
  if (!unique.length) return map;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrls(unique, SIGNED_URL_TTL);
  data?.forEach((entry) => {
    if (entry.signedUrl && entry.path) map.set(entry.path, entry.signedUrl);
  });
  return map;
}

function rowToPassport(row: Row, urls: Map<string, string>): Passport {
  const shots = (Array.isArray(row.shots) ? row.shots : []) as CapturedShot[];
  return {
    animalId: row.animal_id,
    name: row.name,
    species: row.species,
    gender: row.gender as Passport["gender"],
    age: row.age as Passport["age"],
    breed: row.breed,
    color: row.color,
    ownerName: row.owner_name,
    phone: row.phone,
    location: row.location,
    notes: row.notes,
    registeredAt: row.registered_at,
    quality: row.quality,
    lastConfidence: row.last_confidence,
    photo: urls.get(row.photo) ?? row.photo,
    shots: shots.map((s) => ({ ...s, image: urls.get(s.image) ?? s.image })),
    vaccinations: (Array.isArray(row.vaccinations) ? row.vaccinations : []) as Passport["vaccinations"],
    medical: (Array.isArray(row.medical) ? row.medical : []) as Passport["medical"],
    insurance: (row.insurance ?? null) as Passport["insurance"],
  };
}

/* ---------------- reads ---------------- */

export function hydrateRegistry() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  void refreshRegistry();
}

export async function refreshRegistry() {
  const { data, error } = await supabase
    .from("passports")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return;

  const rows = data as unknown as Row[];
  const urls = await signPaths(
    rows.flatMap((r) => [r.photo, ...((Array.isArray(r.shots) ? r.shots : []) as CapturedShot[]).map((s) => s.image)]),
  );
  passports = rows.map((r) => rowToPassport(r, urls));
  loaded = true;
  emit();
}

const getSnapshot = () => passports;
const getLoaded = () => loaded;
const getLoadedServer = () => false;
const getServerSnapshot = (): Passport[] => [];

export function usePassports(): Passport[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useRegistryLoaded(): boolean {
  return useSyncExternalStore(subscribe, getLoaded, getLoadedServer);
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

/* ---------------- writes ---------------- */

async function uploadImage(source: string, animalId: string, index: number): Promise<string> {
  if (!source || isStoragePath(source)) return source;
  try {
    const blob = await (await fetch(source)).blob();
    const path = `${animalId}/${index}-${Date.now()}.jpg`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType: blob.type || "image/jpeg", upsert: true });
    if (error) return source;
    return path;
  } catch {
    return source;
  }
}

export async function addPassport(passport: Passport) {
  // Optimistic local insert so the UI stays instant.
  passports = [passport, ...passports];
  emit();

  const sources = [...new Set([passport.photo, ...passport.shots.map((s) => s.image)].filter(Boolean))];
  const uploaded = new Map<string, string>();
  await Promise.all(
    sources.map(async (src, i) => {
      uploaded.set(src, await uploadImage(src, passport.animalId, i));
    }),
  );

  await supabase.from("passports").insert({
    animal_id: passport.animalId,
    name: passport.name,
    species: passport.species,
    gender: passport.gender,
    age: passport.age,
    breed: passport.breed,
    color: passport.color,
    owner_name: passport.ownerName,
    phone: passport.phone,
    location: passport.location,
    notes: passport.notes,
    registered_at: passport.registeredAt,
    quality: passport.quality,
    last_confidence: passport.lastConfidence,
    photo: uploaded.get(passport.photo) ?? passport.photo,
    shots: passport.shots.map((s) => ({ ...s, image: uploaded.get(s.image) ?? s.image })),
    vaccinations: passport.vaccinations,
    medical: passport.medical,
    insurance: passport.insurance,
  });

  void refreshRegistry();
}

export function recordIdentification(animalId: string, confidence: number) {
  passports = passports.map((p) => (p.animalId === animalId ? { ...p, lastConfidence: confidence } : p));
  emit();
  void supabase
    .from("passports")
    .update({ last_confidence: confidence })
    .eq("animal_id", animalId);
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
