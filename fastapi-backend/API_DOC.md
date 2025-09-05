# 🚀 API Documentation

**Base URL:**  
```
http://34.228.198.154
```

---

## 🔑 Authentication & Onboarding Flow  

**Firebase** was used for authentication. After the user signs up or logs in, Firebase issues a **JWT token** that must be attached to all requests:  

```http
Authorization: Bearer <firebase_jwt_token>
```

### Onboarding Call Sequence
1. **Signup/Login (handled by Firebase)**  
   - User authenticates with Firebase.  
   - Receive a JWT token.  

2. **Sync Profile**  
   - `POST /users/sync-profile`  
   - Syncs Firebase user with backend.  

3. **Update User (Add Interests)**  
   - `PATCH /users/{id}`  
   - Add user interests/preferences.  

4. **Create Onboarding Journal**  
   - `POST /journals/onboarding`  
   - Creates the first onboarding journal entry.  

5. **Complete Onboarding**  
   - `POST /users/{id}/complete-onboarding`  
   - Marks onboarding flow as completed.  

6. **Upload Profile Picture**
   - `POST /users/upload-profile-picture`
   - Upload profile picture.  
---

## 📘 Journals API  

### 1. Create Journal Entry  
**POST /journals/**  
```json
{
  "title": "My first journal",
  "mood": "happy",
  "content": "Today was amazing, I had so much fun learning FastAPI."
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "My first journal",
  "mood": "happy 😊",
  "content": "Today was amazing...",
  "sentiment_score": 0.92,
  "sentiment_label": "positive",
  "entry_type": "REGULAR"
}
```

---

### 2. Update Journal Entry  
**PUT /journals/{entry_id}**  
```json
{
  "title": "Updated title",
  "mood": "neutral",
  "content": "Revised journal content."
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Updated title",
  "mood": "neutral 😐",
  "content": "Revised journal content."
}
```

---

### 3. Delete Journal Entry  
**DELETE /journals/{entry_id}**  
- Response: `204 No Content`  

---

### 4. Get All Journal Entries  
**GET /journals/**  
**Query Params:**  
- `include_onboarding` (default: true)  
- `limit` (default: 20)  
- `offset` (default: 0)  

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "My first journal",
    "mood": "happy 😊",
    "content": "Today was amazing..."
  }
]
```

---

### 5. Get Journal by ID  
**GET /journals/{entry_id}**  
**Response (200):**
```json
{
  "id": 1,
  "title": "My first journal",
  "mood": "happy 😊",
  "content": "Today was amazing..."
}
```

---

## 📘 Learning Progress API  

### 1. Leaderboard – Get Top Performers  
**GET /progress/leaderboard?course_id=101&limit=10**  
**Response (200):**
```json
{
  "course_id": 101,
  "top_performers": [
    { "user_id": "u123", "score": 95, "name": "Alice" }
  ]
}
```

---

### 2. Create Progress Entry  
**POST /progress/**  
```json
{
  "skill_or_course_id": 101,
  "status": "in_progress"
}
```

**Response (201):**
```json
{
  "id": 1,
  "user_id": "u123",
  "skill_or_course_id": 101,
  "status": "in_progress"
}
```

---

### 3. Get User Progress List  
**GET /progress/?status_filter=in_progress&limit=50**  
**Response (200):**
```json
{
  "total_count": 2,
  "progress_entries": [
    { "id": 1, "skill_or_course_id": 101, "status": "in_progress" }
  ]
}
```

---

### 4. Get Progress by ID  
**GET /progress/{progress_id}**  
**Response (200):**
```json
{
  "id": 1,
  "skill_or_course_id": 101,
  "status": "in_progress",
  "user_id": "u123"
}
```

---

### 5. Update Progress  
**PUT /progress/{progress_id}**  
```json
{
  "status": "completed"
}
```

**Response (200):**
```json
{
  "id": 1,
  "skill_or_course_id": 101,
  "status": "completed",
  "user_id": "u123"
}
```

---

### 6. Delete Progress  
**DELETE /progress/{progress_id}**  
- Response: `204 No Content`  

---

### 7. Get User Course Stats  
**GET /progress/user/{target_user_id}/course/{course_id}/stats**  
```json
{
  "user_id": "u123",
  "course_id": 101,
  "completed_lessons": 8,
  "total_lessons": 10,
  "progress_percentage": 80
}
```

---

### 8. Get My Overall Progress  
**GET /progress/user/me/stats**  
```json
{
  "total_courses": 5,
  "completed_courses": 2,
  "in_progress_courses": 3,
  "overall_progress_percentage": 60
}
```

---

### 9. Get Course Statistics  
**GET /progress/course/{course_id}/stats**  
```json
{
  "course_id": 101,
  "total_users": 50,
  "completed_users": 20,
  "in_progress_users": 25,
  "not_started_users": 5
}
```

---

## 📌 Notes for Frontend Dev  
- Always send Firebase JWT in `Authorization` header.  
- Onboarding journal entries **cannot be updated or deleted**.  
- Only allowed progress statuses: `"not_started"`, `"in_progress"`, `"completed"`.  
- Some endpoints (`leaderboard`, `course stats`) may later require **admin permissions**.  
- You can also test APIs directly at:  
  - Swagger UI → [http://34.228.198.154/docs](http://34.228.198.154/docs)  
  - ReDoc → [http://34.228.198.154/redoc](http://34.228.198.154/redoc)  
  - Import OpenAPI → [http://34.228.198.154/openapi.json](http://34.228.198.154/openapi.json)  
