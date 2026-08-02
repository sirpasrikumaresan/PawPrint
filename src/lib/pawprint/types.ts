export type StageId = "muzzle" | "left" | "right" | "front" | "back" | "mark";

export type OverlayKind = "oval" | "left" | "right" | "front" | "back" | "square";

export interface CaptureStage {
  id: StageId;
  title: string;
  short: string;
  hint: string;
  shots: number;
  optional: boolean;
  overlay: OverlayKind;
}

export interface CapturedShot {
  stage: StageId;
  quality: number;
  image: string;
  crop: string;
}

export type Gender = "Male" | "Female" | "Don't Know";
export type AgeBand = "Puppy" | "Adult" | "Senior" | "Don't Know";

export interface PassportDetails {
  name: string;
  species: string;
  gender: Gender;
  age: AgeBand;
  breed: string;
  color: string;
  ownerName: string;
  phone: string;
  location: string;
  notes: string;
}

export interface VaccinationRecord {
  label: string;
  date: string;
  clinic: string;
}

export interface MedicalRecord {
  label: string;
  date: string;
  detail: string;
}

export interface InsurancePolicy {
  provider: string;
  policyId: string;
  validUntil: string;
}

export interface Passport extends PassportDetails {
  animalId: string;
  registeredAt: string;
  quality: number;
  lastConfidence: number | null;
  photo: string;
  shots: CapturedShot[];
  vaccinations: VaccinationRecord[];
  medical: MedicalRecord[];
  insurance: InsurancePolicy | null;
}
