# Nuroki Backend (Django)

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

- **Backend:** Django, Python
- **Database/Auth:** Firebase (Firestore, Auth)
- **AI/NLP:** DistilBERT SST2 (sentiment analysis)
- **Frontend:** React, Tailwind CSS (handled by frontend team)
- **Emulator:** Firebase Emulator Suite (for local backend dev/testing)


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
DATABASE_PASSWORD= 'url password'
DATABASE_URL= 'postgres database url'

```


### 4. Run the Backend

```sh
py manage.py runserver
```

---



## API Endpoints

### Auth

- `POST /recommend/` – the recommendation system api
- `POST /outrecommendall/` – the recommendationsystem for courses outside the database
- `GET /courses/` – Get all courses



- `GET /roadmap/` – Get all roadmap
- `GET /search` – search for courses


> **Full API docs available at**:  
> `http://localhost:8000/swagger` (Swagger UI)
> `http://localhost:8000/redoc` (Swagger UI)


---

## Frontend Integration

- **Auth:** Use Firebase Auth SDK on frontend. Send JWT in `Authorization: Bearer <token>` header for protected endpoints.
- **Endpoints:** See above for available routes. All endpoints expect/return JSON.
- **CORS:** Configured for local frontend dev (`localhost`).
- **API Documentation:** Check out the full API documentation [here](https://nuroki-backend.onrender.com).
---

## Environment Variables & Config

- **`.env`**: Store secrets and config here.  
  _Never commit this file to version control!_
- **`app/core/config.py`**: Loads and manages all config from `.env`.

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