# 🐾 PawPrint
 
**AI-powered Digital Identity Platform for Animals**
 
PawPrint creates, verifies and retrieves trusted digital identities for animals using AI-powered biometrics. No collars, RFID chips, QR tags or ear tags required. Just photos of the animal.
 
> **Status:** Working prototype, dogs only. A personal project built end to end by a non-developer using AI tools. The matching flow was tested on stock dog images (including different angles of the same dogs). Accuracy has **not** been measured yet, so no accuracy claims are made.
 
---
 
## Table of Contents
 
- [Overview](#overview)
- [Design Principles](#design-principles)
- [Core Modules](#core-modules)
- [User Flows](#user-flows)
  - [1. Create Digital Identity](#1-create-digital-identity)
  - [2. Identify Animal](#2-identify-animal)
  - [3. Identity Vault](#3-identity-vault)
  - [4. Animal Passport](#4-animal-passport)
- [UX Details](#ux-details)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Built with Lovable](#built-with-lovable)
---
 
## Overview
 
PawPrint identifies a dog by its natural biometric traits (muzzle pattern, body markings and more) and stores them in a persistent **Digital Identity**, also called an **Animal Passport**. The passport can be retrieved later by taking new photos of the same dog.
 
PawPrint is **not** an image upload tool and **not** a CRUD app. It is a biometric identity platform, and the experience is modeled on Face ID, fingerprint enrollment and passport verification.
 
It is designed to be credible in front of investors, governments, NGOs, veterinary hospitals and animal welfare organizations.
 
## Design Principles
 
The app should feel like an Apple product: premium, minimal, elegant, trustworthy and fast.
 
| Area | Guideline |
|---|---|
| **Inspiration** | Apple, Stripe, Airbnb, Linear |
| **Primary color** | Modern blue |
| **Background** | Pure white |
| **Cards** | Rounded corners, soft shadows |
| **Interaction** | Large touch targets, smooth animations, micro-interactions |
| **Polish** | Premium loading states, beautiful empty states, minimal icons |
| **Accessibility** | High contrast, readable type, simple navigation |
 
## Core Modules
 
| Module | Purpose |
|---|---|
| **Create Digital Identity** | Register a new animal |
| **Identify Animal** | Find an existing animal's identity |
| **Identity Vault** | Browse all registered Animal Passports |
| **Animal Passport** | View a single animal's full digital identity |
 
**Home screen** shows the PawPrint name, tagline and short description, three cards (Create, Identify, Vault), and recent registrations when available.
 
---
 
## User Flows
 
### 1. Create Digital Identity
 
**Step 1: Choose a method** ("How would you like to register this animal?")
 
| Option | Description |
|---|---|
| **AI Guided Capture** ⭐ *Recommended* | Capture the animal live with AI guidance |
| **Import Existing Photos** | Upload photos you already have |
 
#### AI Guided Capture
 
The user taps **Start AI Capture** once. From then on the AI guides them (*Move closer*, *Hold steady*, *Increase lighting*, *Perfect*, *Capturing...*, *Captured Successfully*) and advances automatically. The user never presses a capture button repeatedly.
 
> *AI automatically captures when alignment and image quality are sufficient.*
 
**Capture sequence**
 
| # | Stage | Required | Images | Camera guide |
|---|---|---|---|---|
| 1 | Muzzle | ✅ Yes | 3–5 high-quality | Vertical oval (Face ID style) |
| 2 | Left profile | No | Multiple | Tall rounded rectangle / left-profile silhouette |
| 3 | Right profile | No | Multiple | Mirrored left-profile guide |
| 4 | Front view | No | Multiple | Wide rounded rectangle / body outline |
| 5 | Back view | No | Multiple | Wide rounded rectangle / body outline |
| 6 | Distinguishing marks | No | Optional | Free-form square (scars, birthmarks, collar marks) |
 
- Each stage has its **own intelligent overlay**, and overlays animate smoothly between stages.
- A progress indicator is always visible (e.g. *Step 2 of 5 · Identity Capture · 72%*).
**Real-time validation** runs after *every* image, never at the end:
 
- ✅ Excellent / Accepted
- ⚠️ Too blurry, Dog not detected, Wrong angle, Too dark, Move closer, Hold steady
- The app automatically requests a recapture when needed.
#### Import Existing Photos
 
Upload cards for Muzzle (mandatory), Left, Right, Front, Back, and Distinguishing Marks (optional). Each image is validated immediately and marked **Accepted** or **Rejected** (Too blurry, Poor lighting, Wrong angle). **Continue** stays disabled until all mandatory images are accepted.
 
**Step 2: Passport details**
 
| Field | Required | Notes |
|---|---|---|
| Animal name | Optional | |
| Species | Fixed | Dog |
| Gender | Yes | Male / Female / Don't know |
| Approximate age | Yes | Puppy / Adult / Senior / Don't know |
| Breed, Color | Optional | |
| Owner name, Phone, Location | Optional | |
| Notes | Optional | |
| Animal ID | Auto | e.g. `DOG-2026-000127` |
| Registration date | Auto | |
 
**Step 3: Identity creation**
 
A premium AI processing screen with animated progress:
 
`Detecting dog` → `Extracting biometric features` → `Analyzing muzzle pattern` → `Analyzing body markings` → `Building identity profile` → `Encrypting biometric signature` → `Generating Digital Passport`
 
Registration Quality counts up (62% → 74% → 89% → 97%) and ends on **Excellent Identity Profile**.
 
**Step 4: Success screen**
 
Success animation, **Digital Identity Created Successfully**, Animal ID, Registration Quality (e.g. 97% ★★★★★), and buttons **View Passport** and **Back Home**.
 
### 2. Identify Animal
 
**Choose a method** ("How would you like to identify this animal?")
 
| Option | Description |
|---|---|
| **AI Guided Scan** ⭐ *Recommended* | Face ID–style guided scan |
| **Import Existing Photos** | Upload photos; extra images improve confidence |
 
**Minimum input:** muzzle (mandatory) plus at least one additional angle for the guided scan. For imports, only the muzzle is mandatory, and all uploads are validated immediately.
 
**Scan feedback:** *Move closer → Hold steady → Perfect → Searching... → Generating biometric profile → Comparing identities → Calculating confidence*. If confidence is low, the app prompts: *Capture another angle to improve identification accuracy.*
 
**Results**
 
| Outcome | Display | Actions |
|---|---|---|
| **Match found** | Identity Found · Confidence 98.4% · High Confidence | View Passport, Identify Another Animal |
| **No match** | No Existing Digital Identity Found | Register Animal, Try Again |
 
### 3. Identity Vault
 
A searchable list of every registered Animal Passport.
 
- **Search by:** Animal ID, Animal Name, Owner Name
- **Card contents:** photo, name, Animal ID, registration date, Identity Verified badge
- **Tap a card** to open the Animal Passport
### 4. Animal Passport
 
Designed to look like an official, government-issued digital ID.
 
**Header:** animal photo, name, Animal ID, Identity Verified badge, QR code placeholder, Registration Quality, Latest Identification Confidence.
 
**Information:** Species, Breed, Gender, Approximate Age, Color, Registration Date, Location.
 
**Cards:** Vaccination History, Medical Records, Insurance, Owner Details, Notes, Biometric Images (muzzle, left, right, front, back, distinguishing marks).
 
---
 
## UX Details
 
**Micro-interactions**
 
- Every button animates; cards elevate on touch
- Progress indicators animate; loading states feel premium
- Overlay transitions are smooth
- Haptic feedback where supported
- Subtle success animation after every successful capture
**Empty states**
 
| Screen | Message |
|---|---|
| Identity Vault | No animals registered yet. |
| Search | No matching animal found. |
| Medical Records | No records available. |
| Vaccination | No vaccinations recorded. |
| Insurance | No insurance linked. |
 
---
 
## Tech Stack
 
| Layer | Tool | Role |
|---|---|---|
| Front end | React + TypeScript (built with Lovable) | Guided capture, passport and vault UI |
| Matching | Google Gemini API (via AI Studio) | Matching pipeline; I designed the prompts and matching logic and did not train the model |
| Database | Supabase (vector database) | Stores biometric profiles for similarity matching |
| Planning | ChatGPT | Architecture and prompt design |
 
**Not included yet:** authentication, production-grade security, and large-scale testing.
 
---
 
## How It Works
 
1. **Register:** capture several photos from different angles (muzzle required), since one angle may not hold enough information.
2. **Store:** each photo is turned into a biometric profile and saved in the vector database with the animal's passport.
3. **Identify:** a new photo, or a few, is compared against stored profiles, and a confidence score is shown.
4. **Low confidence:** the app asks for another angle instead of guessing.
## Limitations & Next Steps
 
- Only tested on stock images, not real-world photos (different days, lighting, lookalike breeds).
- Accuracy is unmeasured. Next step: build a test set and track false accepts and false rejects separately to set the confidence threshold.
- Biometric data raises privacy and misidentification risks that need a proper review before real use.
- Longer-term idea: extend the same approach from pets to livestock and, eventually, wildlife.
## Getting Started
 
You need Node.js and npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).
 
```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
 
## Built with Lovable
 
This project was built with [Lovable](https://lovable.dev).
 
- **Ship faster:** describe what you want to build and Lovable handles the code.
- **Stay in sync:** every change made in Lovable is committed to this repository.
- **Full ownership:** the code is yours. Push to `main` on GitHub and changes sync back into Lovable.
👉 [Continue developing in the Lovable editor](https://lovable.dev/projects/121fff9a-1831-474e-ae86-e395853f294a)
 
