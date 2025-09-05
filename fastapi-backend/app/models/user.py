from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, ARRAY, Text, Boolean, Enum as SQLEnum
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
from app.core.database import Base
from sqlalchemy import Date
from enum import Enum

class SkillLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate" 
    ADVANCED = "advanced"

class LearningGoal(str, Enum):
    CAREER_SWITCH = "career_switch"
    MASTER_SKILLS = "master_skills"
    STAY_CONSISTENT = "stay_consistent"
    EXPLORE_CURIOUS = "explore_curious"
    EMOTIONAL_BALANCE = "emotional_balance"

class SupportStyle(str, Enum):
    GENTLE_REMINDERS = "gentle_reminders"
    MOTIVATIONAL_PUSH = "motivational_push"
    FULL_CONTROL = "full_control"
    FIGURING_OUT = "figuring_out"
    NONE = "none"  # For skip option

class UserProfileModel(Base):
    __tablename__ = "user_profiles"
    
    user_id = Column(String, primary_key=True)  # Firebase UID as primary key
    email = Column(String, nullable=True)       # For faster queries
    full_name = Column(String, nullable=True)
    
    profile_picture_url = Column(String, nullable=True)  # Cloudinary URL
    gender = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    
    # Existing fields
    interests = Column(ARRAY(String), default=[])
    skills = Column(ARRAY(String), default=[])
    bio = Column(Text, nullable=True)
    
    # New onboarding fields
    skill_level = Column(SQLEnum(SkillLevel), nullable=True)
    learning_goal = Column(SQLEnum(LearningGoal), nullable=True)
    support_style = Column(SQLEnum(SupportStyle), nullable=True)
    
    # Onboarding completion tracking
    onboarding_completed = Column(Boolean, default=False)
    onboarding_completed_at = Column(DateTime, nullable=True)
    
    # Soft delete fields
    is_active = Column(Boolean, default=True)
    deactivated_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    journal_entries = relationship(
        "LearningJournalEntryModel", back_populates="user", cascade="all, delete-orphan"
    )
    progress_records = relationship(
        "LearningProgressModel", back_populates="user", cascade="all, delete-orphan"
    )