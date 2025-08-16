from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from app.models.learning import EntryType, MoodType
# learning sentiment analysis schema
class LearningJournalEntryBase(BaseModel):
    content: str = Field(
        ..., 
        min_length=1,
        max_length=5000,
        example="Today I learned about transformers in NLP! The attention mechanism is fascinating."
    )



class OnboardingJournalCreate(LearningJournalEntryBase):
    mood: MoodType  # Required for onboarding
    content: Optional[str] = None  # Optional
    title: Optional[str] = None  # Optional - will be auto-generated

class RegularJournalCreate(LearningJournalEntryBase):
    title: str  # Required for regular entries
    mood: Optional[MoodType] = None  # Optional
    content: str  # Required


# schemas.py - Add update schema
class LearningJournalEntryUpdate(LearningJournalEntryBase):
    title: Optional[str] = None
    mood: Optional[MoodType] = None
    content: Optional[str] = None
    
    class Config:
        # Don't allow empty strings
        str_min_length = 1

# Enhanced response model with emoji
class LearningJournalEntryResponse(LearningJournalEntryBase):
    id: int
    user_id: str
    title: Optional[str]
    mood: Optional[MoodType]
    mood_emoji: Optional[str] = Field(None, example="😊")
    content: Optional[str]
    entry_type: EntryType
    created_at: datetime
    updated_at: Optional[datetime]
    sentiment_score: Optional[float] = Field(None, ge=0.0, le=1.0, example=0.95)
    sentiment_label: Optional[str] = Field(None, example="positive")
    
    
    class Config:
        from_attributes = True






# learning progress schema
class LearningProgressBase(BaseModel):
    skill_or_course_id: int
    status: str  # e.g. "not_started", "in_progress", "completed"

class LearningProgressCreate(LearningProgressBase):
    pass

class LearningProgress(LearningProgressBase):
    id: int
    user_id: str

    class Config:
        from_attributes = True



# Pydantic models for requests/responses
class LearningProgressUpdate(BaseModel):
    status: Optional[str] = None

class LearningProgressResponse(BaseModel):
    id: int
    user_id: str
    skill_or_course_id: int
    status: str
    # created_at: datetime
    # updated_at: Optional[datetime] = None

class ProgressListResponse(BaseModel):
    total_count: int
    progress_entries: List[LearningProgressResponse]
