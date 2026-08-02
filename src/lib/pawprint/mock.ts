import dog1 from "@/assets/dog-1.jpg";
import dog2 from "@/assets/dog-2.jpg";
import dog3 from "@/assets/dog-3.jpg";
import dog4 from "@/assets/dog-4.jpg";
import { CAPTURE_STAGES, STAGE_CROP } from "./stages";
import type { CapturedShot, Passport } from "./types";

export const MOCK_PHOTOS = [dog1, dog2, dog3, dog4];

export function buildShots(image: string, includeMark = true): CapturedShot[] {
  return CAPTURE_STAGES.filter((s) => includeMark || !s.optional).map((stage, i) => ({
    stage: stage.id,
    quality: 92 + ((i * 7) % 8),
    image,
    crop: STAGE_CROP[stage.id],
  }));
}

/** Mock registry — replace with a real API/database later. */
export const SEED_PASSPORTS: Passport[] = [
  {
    animalId: "DOG-2026-000124",
    name: "Nova",
    species: "Dog",
    gender: "Female",
    age: "Adult",
    breed: "Golden Retriever",
    color: "Golden",
    ownerName: "Aarav Mehta",
    phone: "+91 98200 41120",
    location: "Bandra West, Mumbai",
    notes: "Friendly with children. Responds to whistle.",
    registeredAt: "2026-03-14",
    quality: 97,
    lastConfidence: 98.4,
    photo: dog1,
    shots: buildShots(dog1),
    vaccinations: [
      { label: "Rabies", date: "2026-01-08", clinic: "Paws & Care Veterinary" },
      { label: "DHPP Booster", date: "2025-11-22", clinic: "Paws & Care Veterinary" },
    ],
    medical: [
      { label: "Annual health check", date: "2026-02-02", detail: "All parameters normal." },
    ],
    insurance: { provider: "SafePaw Assurance", policyId: "SP-4471-2026", validUntil: "2027-01-31" },
  },
  {
    animalId: "DOG-2026-000125",
    name: "Rex",
    species: "Dog",
    gender: "Male",
    age: "Adult",
    breed: "German Shepherd",
    color: "Black & Tan",
    ownerName: "Municipal Shelter — Zone 4",
    phone: "+91 98111 20034",
    location: "Sector 21, New Delhi",
    notes: "Shelter intake. Under behavioural observation.",
    registeredAt: "2026-04-02",
    quality: 94,
    lastConfidence: 96.1,
    photo: dog2,
    shots: buildShots(dog2, false),
    vaccinations: [{ label: "Rabies", date: "2026-04-03", clinic: "Zone 4 Shelter Clinic" }],
    medical: [],
    insurance: null,
  },
  {
    animalId: "DOG-2026-000126",
    name: "Pixie",
    species: "Dog",
    gender: "Female",
    age: "Puppy",
    breed: "Indie",
    color: "White & Brown",
    ownerName: "Street Care Foundation",
    phone: "+91 90040 77821",
    location: "Koramangala, Bengaluru",
    notes: "Community dog. Fed daily at 7th block.",
    registeredAt: "2026-05-19",
    quality: 91,
    lastConfidence: null,
    photo: dog3,
    shots: buildShots(dog3, false),
    vaccinations: [],
    medical: [{ label: "Deworming", date: "2026-05-20", detail: "First cycle completed." }],
    insurance: null,
  },
];

export const PROCESSING_STEPS = [
  "Detecting dog",
  "Extracting biometric features",
  "Analyzing muzzle pattern",
  "Analyzing body markings",
  "Building identity profile",
  "Encrypting biometric signature",
  "Generating digital passport",
];

export const MATCH_STEPS = [
  "Generating biometric profile",
  "Comparing identities",
  "Calculating confidence",
];
