from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime, date
from app.models.user import SkillLevel, LearningGoal, SupportStyle


# users schema
class UserProfileBase(BaseModel):
    interests: List[str] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    bio: Optional[str] = None

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    profile_picture_url: Optional[str] = None
    interests: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    skill_level: Optional[SkillLevel] = None
    learning_goal: Optional[LearningGoal] = None
    support_style: Optional[SupportStyle] = None

class UserProfile(UserProfileBase):
    user_id: str  # Firebase UID

    class Config:
        from_attributes = True


# class UserProfileResponse(UserProfileBase):
#     pass


class UserProfileResponse(BaseModel):
    user_id: str
    email: Optional[str]
    full_name: Optional[str]
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    profile_picture_url: Optional[str] = None
    interests: List[str]
    skills: List[str]
    bio: Optional[str]
    phone: Optional[str] = None
    skill_level: Optional[SkillLevel]
    learning_goal: Optional[LearningGoal]
    support_style: Optional[SupportStyle]
    onboarding_completed: bool
    created_at: datetime
    updated_at: Optional[datetime]

class OnboardingComplete(BaseModel):
    skill_level: SkillLevel
    learning_goal: LearningGoal
    support_style: Optional[SupportStyle] = None  # Optional because user can skip