# Nuroki Backend (FastAPI)

## Project Vision

**Nuroki** empowers individuals with personalized learning paths and emotional well-being insights, fostering a more effective and supportive self-learning journey.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Core Features](#core-features)
- [Getting Started (Backend)](#getting-started-backend)
- [Firebase Emulator Setup (Local Dev)](#firebase-emulator-setup-local-dev)
- [API Endpoints](#api-endpoints)
- [Frontend Integration](#frontend-integration)
- [Environment Variables & Config](#environment-variables--config)
- [Contributing](#contributing)

---

## Project Overview

Nuroki is an MVP web application that integrates:
- **Personalized course recommendations**
- **Progress tracking**
- **Sentiment analysis via learning journal**
- **Visual skill tree**

The backend is built with **FastAPI** and integrates with **Firebase** for authentication and data storage. Sentiment analysis uses **DistilBERT SST2**.

---

## Tech Stack

- **Backend:** FastAPI, Python
- **Database/Auth:** Firebase (Firestore, Auth)
- **AI/NLP:** DistilBERT SST2 (sentiment analysis)
- **Frontend:** React, Tailwind CSS (handled by frontend team)
- **Emulator:** Firebase Emulator Suite (for local backend dev/testing)

---

## Folder Structure

```
app/
  api/         # API route handlers (auth, journal, progress, user)
  core/        # Core config, database, security logic
  models/      # Pydantic models for data structure
  schemas/     # Request/response schemas
  services/    # Business logic (learning, user, sentiment)
  main.py      # FastAPI entry point
emulator-data/ # Firebase emulator data (for local dev)
.gitignore
.env           # Environment variables (not committed)
firebase.json  # Firebase config
requirements.txt
```

---

## Core Features

- **User Authentication:** Firebase Auth (JWT)
- **User Profile:** Interests, skills, profile info
- **Learning Progress Tracking:** Track user progress on courses
- **Journal & Sentiment Analysis:** Users submit journal entries, analyzed for sentiment using DistilBERT SST2
- **Course Recommendation:** (Handled by Django backend)
- **Skill Tree Visualization:** (Data served by Django backend)

---

## Getting Started (Backend)

### 1. Clone the Repository

```sh
git clone https://github.com/your-org/neuroloom-backend.git
cd neuroloom-backend
```

### 2. Install Dependencies

```sh
pip install -r requirements.txt
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```
FIREBASE_CRED_PATH=path/to/your/firebase-adminsdk.json
FIREBASE_WEB_API_KEY=your_firebase_web_api_key
USE_FIREBASE_EMULATOR=true
```

- For local dev, use the emulator credentials.
- For production, replace with actual Firebase credentials.

### 4. Run the Backend

```sh
uvicorn app.main:app --reload
```

---

## Firebase Emulator Setup (Local Dev)

**Why use the emulator?**  
- Safe, free local testing of Firebase Auth and Firestore.
- No risk to production data.

**How to use:**
1. Install the [Firebase CLI](https://firebase.google.com/docs/cli).
2. Start the emulator:

    ```sh
    firebase emulators:start
    ```

3. The backend will connect to the emulator if `USE_FIREBASE_EMULATOR=true` in `.env`.

**Note:**  
Frontend developers should use production Firebase credentials, not the emulator.

---

## API Endpoints

### Auth

- `POST /api/auth/signup` – Register new user
- `POST /api/auth/login` – Login user, returns JWT
- `GET /api/auth/me` – Get current user profile

### User Profile

- `GET /api/user/profile` – Get user profile
- `PUT /api/user/profile` – Update user profile (interests, skills, etc.)
- `POST /api/user/sync-profile` – Sync user profile upon creation by the frontend developer using firebase auth
- `POST /api/user/complete-onboarding` – Complete onboarding process after updating user with interest

### Journal & Sentiment
- `POST /journal/onboarding` – Submit onboarding journal entry (returns sentiment)
- `POST /journal/` – Submit journal entry (returns sentiment)
- `GET /journal/entries` – List user journal entries

### Learning Progress

- `GET /progress/` – Get user learning progress
- `POST /progress/` – Update/add progress for a course

> **Full API docs available at**:  
> `http://localhost:8000/docs` (Swagger UI)
> `http://localhost:8000/redoc` (Swagger UI)


---

## Frontend Integration

- **Auth:** Use Firebase Auth SDK on frontend. Send JWT in `Authorization: Bearer <token>` header for protected endpoints.
- **Endpoints:** See above for available routes. All endpoints expect/return JSON.
- **CORS:** Configured for local frontend dev (`localhost`).
- **API Documentation:** Check out the full API documentation [here](./fastapi-backend/API_DOC.md).
---

## Environment Variables & Config

- **`.env`**: Store secrets and config here.  
  _Never commit this file to version control!_
- **`app/core/config.py`**: Loads and manages all config from `.env`.

---

## Contributing

- See `contribution.md` for guidelines.
- Use feature branches and submit pull requests.
- Write clear commit messages and document new endpoints.

---

## Notes

- **Backend Developers:**  
  - FastAPI dev handles user profile, journal/sentiment, and progress endpoints.
  - Django dev handles course recommendation and skill tree endpoints (see separate repo).
- **Emulator:**  
  - For local backend dev only.  
  - Frontend devs should use production Firebase keys.

---

**Questions?**  
Open an issue or contact the backend team.

---