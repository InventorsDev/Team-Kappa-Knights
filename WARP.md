# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Repository name: Team-Kappa-Knights (Nuroki)
- Primary app: Next.js (App Router) frontend in Frontend/
- Key tech: TypeScript, TailwindCSS v4, Zustand, Jest, ESLint (flat config), Firebase Auth, Cloudinary; integrates with two backend API bases (see README.md)

How to run and develop
- Use Node.js 18+ and pnpm (recommended). All commands below assume you run them inside Frontend/.

Setup and local dev
```bash path=null start=null
cd Frontend
pnpm install
pnpm dev
```

Build and production start
```bash path=null start=null
pnpm build
pnpm start
```

Linting
```bash path=null start=null
pnpm lint
```

Testing (Jest via next/jest)
- Run all tests
```bash path=null start=null
pnpm test
```
- Watch mode
```bash path=null start=null
pnpm run test:watch
```
- Run a single test file
```bash path=null start=null
pnpm test -- path/to/file.test.tsx
```
- Run tests by name pattern
```bash path=null start=null
pnpm test -- -t "pattern here"
```

Type checking (no emit)
```bash path=null start=null
pnpm exec tsc --noEmit
```

Environment configuration
- Create Frontend/.env.local and populate environment variables for Firebase, Cloudinary, and API base URLs.
- See README.md for the full list and guidance. Use NEXT_PUBLIC_* for values needed by the browser.

Important configuration files
- Frontend/package.json: scripts (dev/build/start/lint/test), dependencies
- Frontend/jest.config.ts and Frontend/jest.setup.ts: Jest with next/jest, jsdom env, Testing Library setup
- Frontend/eslint.config.mjs: Flat config extending Next core web vitals + TypeScript
- Frontend/tsconfig.json: strict, path alias @/*, moduleResolution bundler
- Frontend/postcss.config.mjs and Tailwind v4 (@tailwindcss/postcss)

High-level architecture and data flow
- App structure (Next.js App Router)
  - Frontend/app contains route groups like (dashboard) and (onboarding).
  - Protected areas are wrapped by a layout that validates session on mount.
- Authentication
  - Email/password auth via backend POST /api/auth/login, then user is signed into Firebase.
  - The backend session token is stored in localStorage as token and validated via GET /api/user/me. Invalid tokens trigger logout/redirect.
- State management
  - Shared cross-page data (e.g., user profile fields, onboarding state, courses) is kept in Zustand stores under Frontend/state.
- Media
  - Profile images are uploaded to Cloudinary; the secure_url is stored in state and persisted to backend via PUT /api/user/me.
- Events and reactivity on the dashboard
  - After journal mutations (e.g., mood log), the client dispatches window.dispatchEvent(new CustomEvent("journal:updated")).
  - Dashboard cards (Recent, Progress, ThisWeek) listen for this event to refresh.
- Courses and recommendations
  - A Learning Journey view lists enrollments via GET /enrollments/ and resolves metadata via GET /courses/{id}/.
  - Recommendations are produced by POST /outrecommendall/ and merged with in-house course data; cards are tagged as In-house vs Outsourced. Outsourced open in a new tab; in-house route internally.

Conventions and helpers
- API access: Prefer a small client wrapper that injects the base URL(s) and auth token from env/localStorage before making fetch calls.
- Path aliases: Use @/* per tsconfig.json to simplify imports.
- Testing: jsdom environment with Testing Library; adjust test files as needed under Frontend/.

Reference locations
- Primary docs: README.md (root) → includes features, setup, env vars, endpoints, and troubleshooting.
- Frontend source: Frontend/app, Frontend/components, Frontend/state, Frontend/lib.

Notes for agents
- Run all commands from Frontend/ unless specified otherwise.
- If commands fail due to missing env, ensure Frontend/.env.local is present with valid keys.
- When narrowing test scope, prefer pnpm test -- path/to/file or -t for test name patterns.
