# Nuroki (Team-Kappa-Knights)

An intelligent learning platform that adapts to you. Nuroki helps learners track mood, set goals, and follow a personalized learning journey with in-house and outsourced course recommendations.

## Key Features

- Auth & Profile
  - Email/password and Google sign-in (Firebase Auth)
  - Backend session token stored locally for API calls
  - Profile management (full name, gender, date of birth)
  - Profile photo upload via Cloudinary
  - Account disable/delete (removes backend user and Firebase user/doc)

- Onboarding
  - Interest selection, skill level, and learning goals
  - Personalized flow with progress state persisted

- Dashboard
  - Mood logging (creates journal entry)
  - Recent activity feed (auto-refresh)
  - Days active and average mood (auto-refresh)
  - Weekly mood visualization (auto-refresh)
  - Learning Journey summary (enrollments or suggested defaults)

- Courses
  - Recommendations from backend (in-house) and external sources (outsourced)
  - Clear “In-house” vs “Outsourced” tagging on cards
  - In-house courses navigate to an internal details page
  - Outsourced courses open in a new tab

## Tech Stack

- Frontend: Next.js (App Router), TypeScript, React, TailwindCSS
- State: Zustand
- Notifications: sonner
- Auth/DB: Firebase Auth + Firestore (for some client-side state/documents)
- Media: Cloudinary (profile pictures)
- Backend APIs: REST endpoints (documented below)

## Repository Structure

```
Team-Kappa-Knights/
├─ Frontend/
│  ├─ app/
│  │  ├─ (dashboard)/
│  │  │  ├─ dashboard/
│  │  │  ├─ journals/
│  │  │  ├─ courses/
│  │  │  ├─ skilltree/
│  │  │  └─ layout.tsx
│  │  ├─ (onboarding)/
│  │  ├─ api/
│  │  └─ layout.tsx
│  ├─ components/
│  │  ├─ sections/
│  │  │  ├─ dashboard/ (Mood, Recent, Progress, ThisWeek, LearningJourney)
│  │  │  ├─ profile/ (Photo, PersonalInfo, Security)
│  │  │  └─ courses/ (Details, CourseCard, etc.)
│  │  ├─ common/
│  │  └─ layout/
│  ├─ lib/ (auth, firebase, helpers)
│  ├─ state/ (Zustand stores)
│  └─ public/
└─ README.md  ← you are here
```

## Environment Variables

Create `Frontend/.env.local` and configure the following. Values below are examples/placeholders—use your real values.

Firebase (required)
- NEXT_PUBLIC_FIREBASE_API_KEY=
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
- NEXT_PUBLIC_FIREBASE_PROJECT_ID=
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
- NEXT_PUBLIC_FIREBASE_APP_ID=

Cloudinary (recommended to move out of code constants)
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dexchhhbs
- NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nextjs_profile_upload

Backend API bases (recommended)
- NEXT_PUBLIC_CORE_API_BASE=http://34.228.198.154
- NEXT_PUBLIC_RECO_API_BASE=https://nuroki-backend.onrender.com

Notes
- The app currently references some endpoints directly in code. For multi-env deployments, move hard-coded URLs into these env variables and consume them via a small API client helper.

## Setup & Development

Prerequisites
- Node.js 18+
- pnpm (recommended) or npm/yarn

Install & Run
```
cd Frontend
pnpm install
pnpm dev
# or npm install && npm run dev
```

Build & Start
```
pnpm build
pnpm start
```

## How It Works (Frontend)

- Authentication
  - Email/password login hits backend `POST /api/auth/login`, stores `idToken` in localStorage as `token`, and signs the user into Firebase.
  - On app mount (ProtectedLayout), the client validates the token against `GET /api/user/me`. If invalid, it clears the token and redirects to `/`.

- Profile & Photo
  - Photo uploads post to Cloudinary. The secure URL is stored in Zustand and persisted to backend via `PUT /api/user/me` with `profile_picture_url`.
  - Navbar avatar and profile photo read from the same store and update immediately.

- Onboarding
  - Interests and skill level are saved to backend.
  - The “onboarding completed” flag is toggled only after a valid backend profile exists.

- Mood & Journals
  - Mood logging calls `POST /journal/`.
  - After logging, the client dispatches a `window` event `journal:updated`. The dashboard listens and refreshes:
    - Recent activity (latest journals)
    - Progress (days active, average mood)
    - ThisWeek (today’s/weekly mood)

- Courses & Learning Journey
  - LearningJourney:
    - `GET /enrollments/` lists user enrollments.
    - If empty, shows default demo items from `lib/testData`.
    - For each enrollment, fetches course meta via `GET /courses/{id}/` to resolve title and whether it’s external.
    - Outsourced courses open external URLs; in-house courses link to `/courses/{id}`.
  - Recommendations (CoursesSet):
    - `POST /outrecommendall/` with `{ interest: string[], skill_level?: string }`.
    - Merges in-house and outsourced per backend logic.
    - Cards are tagged and linked accordingly.

## Backend Endpoints Used

Core API (http://34.228.198.154)
- Auth
  - POST `/api/auth/login`
- User
  - GET `/api/user/me`
  - PUT `/api/user/me` (update profile)
  - DELETE `/api/user/me` (delete account)
  - POST `/api/user/logout`
  - DELETE `/api/user/disable-me`
  - POST `/api/user/sync-profile` (initial sync from Firebase signup)
- Journal
  - GET `/journal/`
  - POST `/journal/`

Recommendations API (https://nuroki-backend.onrender.com)
- GET `/enrollments/` (Learning Journey)
- GET `/courses/{id}/` (course meta/title/source)
- POST `/outrecommendall/` (recommend courses)
  - Body: `{ "interest": ["python"], "skill_level": "beginner" }`
  - Logic: if < 4 DB results, fetch external and merge; else DB-only

## Development Conventions

- State: Use Zustand stores in `Frontend/state` for cross-component state (profile, user fields, onboarding, courses).
- API calls: Prefer a small wrapper (e.g., `lib/apiClient.ts`) that injects the base URL and token from env/localStorage.
- Events: Use `window.dispatchEvent(new CustomEvent("journal:updated"))` after journal mutations; listeners should refresh accordingly.
- Images: Use Next Image; profile photos come from Cloudinary `secure_url`.
- Error handling: Log details to console and show user-friendly toasts.

## Troubleshooting

- Avatar reverts after refresh
  - Ensure `PUT /api/user/me` sends the latest `profile_picture_url` (the Cloudinary `secure_url`).
- Navbar avatar not updating
  - Use the shared profile store (`useUserProfileStore`). Avoid stale local-only state.
- Onboarding kicks you out
  - Only set the onboarding state after a successful `GET /api/user/me` validation.
- Days Active or Weekly Mood doesn’t update
  - Ensure the listeners for `journal:updated` are active in `Progress.tsx` and `ThisWeek.tsx`.
- Course titles show `[object Object]`
  - Resolve `course_id` and fetch meta via `/courses/{id}/` to render a clean title.
- Grid layout in Courses
  - Use a consistent grid container and ensure loading/empty placeholders span the full width.

## Testing

If tests exist (e.g., in `Frontend/__tests__`), run:
```
cd Frontend
pnpm test
```
(Adjust to your configured test runner.)

## Roadmap

- Move hard-coded API base URLs into env and unify API client
- Add skeleton loaders for dashboard cards
- Add e2e tests for onboarding and mood logging flows
- Improve accessibility and keyboard navigation

## Contributing

1. Create a feature branch
2. Make changes with clear commit messages
3. Open a PR with description and screenshots (if UI)

## License

This project is confidential to Team-Kappa-Knights unless a license file is added. Contact the maintainers for usage permissions.
