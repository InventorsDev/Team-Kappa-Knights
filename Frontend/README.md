## Frontend Readme File

This file exists to guide the frontend developers on how to structure their code.

# Folder structure

```text
Frontend/
├── .next/
├── app/          # Keep this folder clean, only the routes should be placed here, all folder names must be lowercase
│   └── signup/
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── components/   # All components should be placed here
│   ├── common/   # components like buttons, inputs, etc. should be placed here
│   ├── layout/   # components like headers, footers, etc. should be placed here
│   ├── sections/ # sections of the application like loginPage, signupPage, etc. should be placed here
│   └── ui/       # All UI components should be placed here
├── lib/          # All libraries and utility functions should be placed here
├── node_modules/
├── public/ # All public assets should be placed here, NB logos should be exported and placed in an SVG folder.
├── .env.local
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── tsconfig.json

---

Any questions should be referred to me through whatsapp.

# Branching
run
git fetch origin

git checkout -b your-branch-name origin/frontend/branch
```
