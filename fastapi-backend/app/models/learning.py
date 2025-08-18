from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
from enum import Enum
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, ARRAY, Text, Enum as SQLEnum
from datetime import datetime

class EntryType(str, Enum):
    ONBOARDING = "onboarding"
    REGULAR = "regular"
    QUICK_CHECKIN = "quick_checkin"

class MoodType(str, Enum):
    MOTIVATED = "motivated"
    STRESSED = "stressed"
    EXCITED = "excited"
    OKAY = "okay"
    FRUSTRATED = "frustrated"
    TIRED = "tired"
    SCARED = "scared"

class LearningJournalEntryModel(Base):
    __tablename__ = "learning_journal_entries"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String, ForeignKey("user_profiles.user_id"), nullable=False)
    
    # Make title optional (nullable=True) - works for both cases
    title = Column(String(255), nullable=True)  
    
    # Required for onboarding, optional for regular entries
    mood = Column(SQLEnum(MoodType), nullable=True)  
    
    # Optional in onboarding, required in regular - make nullable
    content = Column(Text, nullable=True)  
    
    # Use enum for entry types with default
    entry_type = Column(SQLEnum(EntryType), default=EntryType.REGULAR)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    sentiment_score = Column(Float, nullable=True)
    sentiment_label = Column(String, nullable=True)
    
    user = relationship("UserProfileModel", back_populates="journal_entries")





class LearningProgressModel(Base):
    __tablename__ = "learning_progress"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String, ForeignKey("user_profiles.user_id"), nullable=False)
    skill_or_course_id = Column(Integer, nullable=False)
    status = Column(String, nullable=False)  # e.g., "not_started", "in_progress", "completed"

    # Relationship to user
    user = relationship("UserProfileModel", back_populates="progress_records")
