# PawPrint_V2

# PROJECT

Build a production-quality mobile-first web application called PawPrint.

PawPrint is an AI-powered Digital Identity Platform for Animals.

The MVP focuses only on DOGS.

The purpose of PawPrint is to uniquely identify a dog using its natural biometric characteristics instead of collars, RFID chips, QR tags, ear tags or any physical identifier.

The application should create a persistent Digital Identity (Animal Passport) that can later be retrieved simply by taking new photos of the same dog.

This is NOT an image upload application.

This is NOT a CRUD application.

This is a biometric identity platform.

The entire experience should feel similar to Face ID, fingerprint enrollment and passport verification.

Use mock data wherever backend or AI functionality is required.

Generate production-quality UI.

Do not generate wireframes.

------------------------------------------------------------

# DESIGN PHILOSOPHY

The application should feel like an Apple product.

Premium.

Modern.

Minimal.

Elegant.

Trustworthy.

Fast.

The UI should communicate that PawPrint is building identity infrastructure.

Design inspiration

• Apple

• Stripe

• Airbnb

• Linear

------------------------------------------------------------

# DESIGN SYSTEM

Primary Color

Modern Blue

Background

Pure White

Cards

Rounded

Soft Shadows

Large touch targets

Professional Typography

Smooth animations

Premium loading states

Beautiful empty states

Minimal icons

Micro interactions

Everything should feel polished.

------------------------------------------------------------

# NAVIGATION

The application contains FOUR major modules.

1. Create Digital Identity

2. Identify Animal

3. Identity Vault

4. Animal Passport

Keep navigation extremely simple.

------------------------------------------------------------

# HOME SCREEN

Display

PawPrint

Tagline

AI-powered Digital Identity Platform for Animals

Short description

Create, verify and retrieve trusted digital identities for animals using AI-powered biometrics.

Display three premium cards.

------------------------------------------------------------

Create Digital Identity

Register a new animal.

------------------------------------------------------------

Identify Animal

Identify an existing animal.

------------------------------------------------------------

Identity Vault

Browse all registered Animal Passports.

------------------------------------------------------------

Display recent registrations below if available.

------------------------------------------------------------

# CREATE DIGITAL IDENTITY

Do NOT immediately ask users to upload photos.

First ask

How would you like to register this animal?

Display two large cards.

------------------------------------------------------------

AI Guided Capture

Recommended

Capture the animal live using AI guidance.

------------------------------------------------------------

Import Existing Photos

Upload photographs already available.

------------------------------------------------------------

Highlight AI Guided Capture as Recommended.

------------------------------------------------------------

# AI GUIDED CAPTURE

The capture experience should feel like Face ID.

The user presses only ONE button.

Start AI Capture

After that the AI guides the user.

Examples

Move closer

Hold steady

Increase lighting

Perfect

Capturing...

Captured Successfully

The application should automatically move to the next step.

The user should NOT repeatedly press Capture.

Display

"AI automatically captures when alignment and image quality are sufficient."

------------------------------------------------------------

# DYNAMIC CAMERA OVERLAYS

Do NOT use the same overlay for every capture.

Each capture stage should use a different intelligent guide.

Muzzle

Use a vertical oval similar to Face ID.

The user aligns only the muzzle inside the guide.

------------------------------------------------------------

Left Profile

Replace the oval with a tall rounded rectangle or left-profile silhouette that frames the dog's head and upper body.

------------------------------------------------------------

Right Profile

Mirror the Left Profile guide.

------------------------------------------------------------

Front View

Use a wider rounded rectangle or body outline.

------------------------------------------------------------

Back View

Use a wider rounded rectangle or body outline.

------------------------------------------------------------

Optional Distinguishing Mark

Display a free-form square guide.

Allow the user to capture scars, birthmarks, collar marks or other unique identifiers.

------------------------------------------------------------

Smoothly animate the overlay transition between every capture.

The overlays should feel intelligent rather than static.

------------------------------------------------------------

# CAPTURE ORDER

The capture sequence should be

1.

Muzzle

Mandatory

Capture 3–5 high-quality images automatically.

------------------------------------------------------------

2.

Left Profile

Capture multiple images automatically.

------------------------------------------------------------

3.

Right Profile

Capture multiple images automatically.

------------------------------------------------------------

4.

Front View

Capture multiple images automatically.

------------------------------------------------------------

5.

Back View

Capture multiple images automatically.

------------------------------------------------------------

6.

Optional Distinguishing Marks

------------------------------------------------------------

Display progress

Step 2 of 5

Identity Capture

72%

------------------------------------------------------------

# REAL-TIME AI VALIDATION

Validation happens immediately after every captured image.

Never after all images are completed.

Examples

✓ Excellent

✓ Accepted

Too blurry

Dog not detected

Wrong angle

Too dark

Move closer

Hold steady

Automatically request recapture when necessary.

------------------------------------------------------------

# IMPORT EXISTING PHOTOS

Alternative workflow.

Display upload cards.

Muzzle

Mandatory

Left Profile

Right Profile

Front View

Back View

Optional Distinguishing Marks

Immediately validate every uploaded image.

Display

Accepted

Rejected

Too blurry

Poor lighting

Wrong angle

Continue remains disabled until all mandatory images are accepted.

------------------------------------------------------------

# PASSPORT DETAILS

After successful capture.

Collect

Animal Name

Optional

Species

Dog

Gender

Male

Female

Don't Know

Approximate Age

Puppy

Adult

Senior

Don't Know

Breed

Optional

Color

Optional

Owner Name

Optional

Phone Number

Optional

Location

Optional

Notes

Optional

Animal ID

Automatically Generated

Registration Date

Automatically Generated

------------------------------------------------------------

# DIGITAL IDENTITY CREATION

Display a premium AI processing screen.

Animated progress.

Examples

Detecting Dog

Extracting biometric features

Analyzing muzzle pattern

Analyzing body markings

Building identity profile

Encrypting biometric signature

Generating Digital Passport

Registration Quality

62%

74%

89%

97%

Display

Excellent Identity Profile

------------------------------------------------------------

# SUCCESS SCREEN

Display

Digital Identity Created Successfully

Large Success Animation

Animal ID

DOG-2026-000127

Registration Quality

97%

★★★★★

Buttons

View Passport

Back Home

------------------------------------------------------------

# IDENTIFY ANIMAL

Display

How would you like to identify this animal?

AI Guided Scan

Recommended

Import Existing Photos

------------------------------------------------------------

# AI GUIDED SCAN

Behaves similar to Face ID.

The AI guides the user.

Minimum requirement

Muzzle

PLUS

At least ONE additional angle.

Display

Move closer

Hold steady

Perfect

Searching...

Generating biometric profile

Comparing identities

Calculating confidence

If confidence is low

Display

Capture another angle to improve identification accuracy.

------------------------------------------------------------

# IMPORT PHOTOS

Muzzle Mandatory

Other images Optional

Display

Additional images improve confidence.

Immediately validate every uploaded image.

------------------------------------------------------------

# MATCH FOUND

Display

Identity Found

Confidence

98.4%

High Confidence

Buttons

View Passport

Identify Another Animal

------------------------------------------------------------

# NO MATCH

Display

No Existing Digital Identity Found.

Buttons

Register Animal

Try Again

------------------------------------------------------------

# IDENTITY VAULT

Display every registered Animal Passport.

Include Search.

Search by

Animal ID

Animal Name

Owner Name

Display beautiful cards.

Animal Photo

Animal Name

Animal ID

Registration Date

Identity Verified Badge

Tap opens Animal Passport.

------------------------------------------------------------

# ANIMAL PASSPORT

Design like an official Government-issued Digital Identity.

Header

Animal Photo

Animal Name

Animal ID

Identity Verified Badge

QR Code Placeholder

Registration Quality

Latest Identification Confidence

Information

Species

Breed

Gender

Approximate Age

Color

Registration Date

Location

Cards

Vaccination History

Medical Records

Insurance

Owner Details

Notes

Biometric Images

Display captured muzzle, left, right, front, back and distinguishing mark images.

------------------------------------------------------------

# MICRO INTERACTIONS

Every button should animate.

Cards should elevate on touch.

Progress indicators should animate.

Loading should feel premium.

Overlay transitions should animate smoothly.

Use haptic feedback where supported.

Use subtle success animations after every successful capture.

------------------------------------------------------------

# EMPTY STATES

Identity Vault

"No animals registered yet."

Search

"No matching animal found."

Medical Records

"No records available."

Vaccination

"No vaccinations recorded."

Insurance

"No insurance linked."

------------------------------------------------------------

# ACCESSIBILITY

Large tap targets.

Readable typography.

High color contrast.

Simple navigation.

------------------------------------------------------------

# TECHNICAL REQUIREMENTS

Use React.

Use TypeScript.

Create reusable components.

Use mock data only.

Do NOT implement authentication.

Do NOT connect a backend.

Do NOT connect Gemini.

Do NOT connect Supabase.

Structure the project cleanly so these can be integrated later.

------------------------------------------------------------

# IMPORTANT

Prioritize user experience over forms.

The application should feel like a premium startup product rather than a hackathon prototype.

The entire experience should communicate trust, intelligence and simplicity.

The final UI should be something that could realistically be presented to investors, governments, NGOs, veterinary hospitals and animal welfare organizations as the foundation of a global AI-powered Digital Identity Platform for Animals.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/121fff9a-1831-474e-ae86-e395853f294a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
