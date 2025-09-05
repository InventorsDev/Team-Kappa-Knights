
# services/sentiment_service.py
import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import Optional, List, Tuple, Dict, Any
from transformers import pipeline
# services/course_validation.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, select, and_, func, extract, and_
from fastapi import HTTPException, status
from app.core.database import get_postgres_db
from fastapi import Depends
from app.models.learning import LearningProgressModel, LearningJournalEntryModel, MoodType, EntryType
from datetime import datetime, timedelta
from collections import defaultdict


logger = logging.getLogger(__name__)





class SentimentAnalysisService:
    def __init__(self):
        """Initialize the sentiment analyzer once on startup"""
        try:
            self.sentiment_analyzer = pipeline(
                "sentiment-analysis", 
                model="distilbert-base-uncased-finetuned-sst-2-english"
            )
            # Thread pool for CPU-bound operations
            self.executor = ThreadPoolExecutor(max_workers=2)
            logger.info("Sentiment analysis service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize sentiment analyzer: {e}")
            self.sentiment_analyzer = None
            self.executor = None

    def _preprocess_text(self, text: str) -> Optional[str]:
        """Preprocess text for sentiment analysis"""
        if not text or not isinstance(text, str):
            return None
        
        text = text.strip()
        if not text:
            return None
        
        # DistilBERT has a 512 token limit, truncate long text
        # Rough estimate: 4 chars per token, so 2000 chars ≈ 500 tokens
        if len(text) > 2000:
            text = text[:2000] + "..."
            logger.info("Truncated long text for sentiment analysis")
        
        return text

    def _analyze_single(self, text: str) -> Tuple[Optional[float], Optional[str]]:
        """Analyze sentiment for a single text"""
        try:
            if not self.sentiment_analyzer:
                logger.warning("Sentiment analyzer not initialized")
                return None, None
            
            processed_text = self._preprocess_text(text)
            if not processed_text:
                return None, None
            
            result = self.sentiment_analyzer(processed_text)[0]
            label = result["label"].lower()
            score = result["score"]
            
            logger.debug(f"Sentiment analysis: {label} ({score:.2f})")
            return score, label
            
        except Exception as e:
            logger.error(f"Sentiment analysis failed for single text: {e}")
            return None, None

    def analyze_sentiment(self, text: str) -> Tuple[Optional[float], Optional[str]]:
        """Public method for single text sentiment analysis"""
        return self._analyze_single(text)

    async def analyze_sentiment_async(self, text: str) -> Tuple[Optional[float], Optional[str]]:
        """Async method for single text sentiment analysis"""
        if not self.executor:
            return self.analyze_sentiment(text)
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, self._analyze_single, text)

    def __del__(self):
        """Cleanup thread pool on destruction"""
        if hasattr(self, 'executor') and self.executor:
            self.executor.shutdown(wait=False)

# Global instance - initialize once
sentiment_service = SentimentAnalysisService()









class JournalService:
    MOOD_EMOJI_MAP = {
        MoodType.MOTIVATED: "🤩",
        MoodType.STRESSED: "😐", 
        MoodType.EXCITED: "😄",
        MoodType.OKAY: "🙂",
        MoodType.FRUSTRATED: "😫",
        MoodType.TIRED: "😴",
        MoodType.SCARED: "😨"
    }
    
    def __init__(self, sentiment_service: SentimentAnalysisService):
        self.sentiment_service = sentiment_service
    
    def _generate_onboarding_title(self) -> str:
        """Generate auto title for onboarding entries"""
        return f"Onboarding Check-in - {datetime.now().strftime('%B %d, %Y')}"
    
    def _validate_entry_data(self, entry_data: Dict[str, Any], entry_type: EntryType) -> None:
        """Validate entry data based on type"""
        if entry_type == EntryType.REGULAR:
            if not entry_data.get("title"):
                raise ValueError("Title is required for regular journal entries")
            if not entry_data.get("content"):
                raise ValueError("Content is required for regular journal entries")
        
        elif entry_type == EntryType.ONBOARDING:
            if not entry_data.get("mood"):
                raise ValueError("Mood is required for onboarding entries")
    
    async def create_journal_entry(
        self, 
        user_id: str, 
        entry_data: Dict[str, Any], 
        entry_type: EntryType = EntryType.REGULAR
    ) -> LearningJournalEntryModel:
        """Create journal entry with proper validation and title handling"""
        
        # Validate based on entry type
        self._validate_entry_data(entry_data, entry_type)
        
        # Handle title logic
        title = entry_data.get("title")
        if entry_type == EntryType.ONBOARDING and not title:
            title = self._generate_onboarding_title()
        
        # convert mood string to enum if provided
        mood = None
        if entry_data.get("mood"):
            try:
                mood = MoodType(entry_data.get("mood"))
            except ValueError:
                raise ValueError(f"Invalid mood value: {entry_data.get('mood')}")
        
        # Analyze sentiment if content exists
        sentiment_score, sentiment_label = None, None
        content = entry_data.get("content")
        if content:
            sentiment_score, sentiment_label = await self.sentiment_service.analyze_sentiment_async(content)
        
        # Create entry
        new_entry = LearningJournalEntryModel(
            user_id=user_id,
            title=title,
            mood=mood,
            content=content,
            entry_type=entry_type,
            sentiment_score=sentiment_score,
            sentiment_label=sentiment_label,
        )
        
        return new_entry
    
    def add_mood_emoji(self, entry: LearningJournalEntryModel) -> Dict[str, Any]:
        """Add emoji to journal entry for API response"""
        entry_dict = {
            "id": entry.id,
            "user_id": entry.user_id,
            "title": entry.title,
            "mood": entry.mood,
            "mood_emoji": self.MOOD_EMOJI_MAP.get(entry.mood) if entry.mood else None,
            "content": entry.content,
            "entry_type": entry.entry_type,
            "created_at": entry.created_at,
            "updated_at": entry.updated_at,
            "sentiment_score": entry.sentiment_score,
            "sentiment_label": entry.sentiment_label,
        }
        return entry_dict

    async def get_journal_entry(
        self, 
        entry_id: int, 
        user_id: str, 
        db: AsyncSession
    ) -> Optional[LearningJournalEntryModel]:
        """Get a specific journal entry by ID and user"""
        try:
            result = await db.execute(
                select(LearningJournalEntryModel)
                .where(
                    LearningJournalEntryModel.id == entry_id,
                    LearningJournalEntryModel.user_id == user_id
                )
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching journal entry {entry_id}: {e}")
            return None
        
    async def get_user_journal_entries(
            self,
            user_id: str,
            db: AsyncSession,
            include_onboarding: bool = True,
            limit: Optional[int] = None,
            offset: int = 0
        ) -> List[Dict[str, Any]]:
            """Get all journal entries for a user with emojis"""
            try:
                query = select(LearningJournalEntryModel).where(
                    LearningJournalEntryModel.user_id == user_id
                )
                
                # Optionally exclude onboarding entries
                if not include_onboarding:
                    query = query.where(LearningJournalEntryModel.entry_type != EntryType.ONBOARDING)
                
                # Add pagination
                query = query.order_by(LearningJournalEntryModel.created_at.desc())
                if limit:
                    query = query.limit(limit).offset(offset)
                
                result = await db.execute(query)
                entries = result.scalars().all()
                
                # Add emojis to each entry
                return [self.add_mood_emoji(entry) for entry in entries]
                
            except Exception as e:
                logger.error(f"Error fetching user journal entries: {e}")
                return []
        
    async def update_journal_entry(
        self,
        entry_id: int,
        user_id: str,
        update_data: Dict[str, Any],
        db: AsyncSession
    ) -> LearningJournalEntryModel:
        """Update a journal entry - onboarding entries cannot be updated"""
        
        # Get the existing entry
        existing_entry = await self.get_journal_entry(entry_id, user_id, db)
        if not existing_entry:
            raise ValueError("Journal entry not found")
        
        # Prevent updating onboarding entries
        if existing_entry.entry_type == EntryType.ONBOARDING:
            raise ValueError("Onboarding entries cannot be updated")
        
        # Validate update data for regular entries
        if "title" in update_data and not update_data["title"]:
            raise ValueError("Title cannot be empty for regular journal entries")
        
        # Re-analyze sentiment if content is being updated
        sentiment_score, sentiment_label = existing_entry.sentiment_score, existing_entry.sentiment_label
        if "content" in update_data and update_data["content"]:
            sentiment_score, sentiment_label = await self.sentiment_service.analyze_sentiment_async(
                update_data["content"]
            )
        
        # Update fields
        for field, value in update_data.items():
            if hasattr(existing_entry, field):
                setattr(existing_entry, field, value)
        
        # Update sentiment if content changed
        if "content" in update_data:
            existing_entry.sentiment_score = sentiment_score
            existing_entry.sentiment_label = sentiment_label
        
        # Update timestamp
        existing_entry.updated_at = datetime.utcnow()
        
        try:
            await db.commit()
            await db.refresh(existing_entry)
            return existing_entry
        except Exception as e:
            await db.rollback()
            raise Exception(f"Failed to update journal entry: {str(e)}")
    
    async def delete_journal_entry(
        self,
        entry_id: int,
        user_id: str,
        db: AsyncSession
    ) -> bool:
        """Delete a journal entry - onboarding entries cannot be deleted"""
        
        # Get the existing entry
        existing_entry = await self.get_journal_entry(entry_id, user_id, db)
        if not existing_entry:
            raise ValueError("Journal entry not found")
        
        # Prevent deleting onboarding entries
        if existing_entry.entry_type == EntryType.ONBOARDING:
            raise ValueError("Onboarding entries cannot be deleted")
        
        try:
            await db.delete(existing_entry)
            await db.commit()
            return True
        except Exception as e:
            await db.rollback()
            raise Exception(f"Failed to delete journal entry: {str(e)}")

    async def get_mood_analytics(
        self, 
        user_id: str, 
        db: AsyncSession,
        days: int = 30
    ) -> Dict[str, Any]:
        """Get mood analytics for graph plotting"""
        try:
            # Get mood distribution over last X days
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            # Mood frequency count
            mood_query = select(
                LearningJournalEntryModel.mood,
                func.count(LearningJournalEntryModel.id).label('count')
            ).where(
                and_(
                    LearningJournalEntryModel.user_id == user_id,
                    LearningJournalEntryModel.mood.isnot(None),
                    LearningJournalEntryModel.created_at >= cutoff_date
                )
            ).group_by(LearningJournalEntryModel.mood)
            
            result = await db.execute(mood_query)
            mood_data = result.all()
            
            # Convert to plottable format
            mood_distribution = []
            for mood, count in mood_data:
                mood_distribution.append({
                    "mood": mood.value,  # Get string value from enum
                    "mood_display": mood.value.title(),  # "motivated" -> "Motivated"
                    "emoji": self.MOOD_EMOJI_MAP.get(mood, ""),
                    "count": count
                })
            
            return {
                "period_days": days,
                "total_entries": sum(item["count"] for item in mood_distribution),
                "mood_distribution": mood_distribution,
                "generated_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting mood analytics: {e}")
            return {
                "period_days": days,
                "total_entries": 0,
                "mood_distribution": [],
                "error": str(e)
            }

    async def get_mood_timeline(
        self,
        user_id: str,
        db: AsyncSession,
        days: int = 30
    ) -> Dict[str, Any]:
        """Get mood timeline for time-series graph"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            # Get mood entries over time
            timeline_query = select(
                LearningJournalEntryModel.mood,
                LearningJournalEntryModel.created_at,
                LearningJournalEntryModel.sentiment_score
            ).where(
                and_(
                    LearningJournalEntryModel.user_id == user_id,
                    LearningJournalEntryModel.mood.isnot(None),
                    LearningJournalEntryModel.created_at >= cutoff_date
                )
            ).order_by(LearningJournalEntryModel.created_at.asc())
            
            result = await db.execute(timeline_query)
            timeline_data = result.all()
            
            # Convert moods to numeric values for plotting
            mood_to_numeric = {
                MoodType.SCARED: 1,
                MoodType.FRUSTRATED: 2,
                MoodType.TIRED: 3,
                MoodType.STRESSED: 4,
                MoodType.OKAY: 5,
                MoodType.MOTIVATED: 6,
                MoodType.EXCITED: 7
            }
            
            timeline = []
            for mood, created_at, sentiment_score in timeline_data:
                timeline.append({
                    "date": created_at.isoformat(),
                    "mood": mood.value,
                    "mood_numeric": mood_to_numeric.get(mood, 5),
                    "emoji": self.MOOD_EMOJI_MAP.get(mood, ""),
                    "sentiment_score": sentiment_score
                })
            
            return {
                "period_days": days,
                "timeline": timeline,
                "mood_scale": {
                    "1": {"label": "Scared", "emoji": "😨"},
                    "2": {"label": "Frustrated", "emoji": "😫"},
                    "3": {"label": "Tired", "emoji": "😴"},
                    "4": {"label": "Stressed", "emoji": "😐"},
                    "5": {"label": "Okay", "emoji": "🙂"},
                    "6": {"label": "Motivated", "emoji": "🤩"},
                    "7": {"label": "Excited", "emoji": "😄"}
                }
            }
            
        except Exception as e:
            logger.error(f"Error getting mood timeline: {e}")
            return {
                "period_days": days,
                "timeline": [],
                "error": str(e)
            }

    async def get_weekly_mood_summary(
        self,
        user_id: str,
        db: AsyncSession,
        weeks: int = 4
    ) -> Dict[str, Any]:
        """Get weekly mood averages for trend analysis"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(weeks=weeks)
            
            # Group by week and get average mood
            weekly_query = select(
                extract('week', LearningJournalEntryModel.created_at).label('week'),
                extract('year', LearningJournalEntryModel.created_at).label('year'),
                LearningJournalEntryModel.mood,
                func.count(LearningJournalEntryModel.id).label('count')
            ).where(
                and_(
                    LearningJournalEntryModel.user_id == user_id,
                    LearningJournalEntryModel.mood.isnot(None),
                    LearningJournalEntryModel.created_at >= cutoff_date
                )
            ).group_by(
                extract('week', LearningJournalEntryModel.created_at),
                extract('year', LearningJournalEntryModel.created_at),
                LearningJournalEntryModel.mood
            ).order_by('year', 'week')
            
            result = await db.execute(weekly_query)
            weekly_data = result.all()
            
            # Process weekly data
            mood_to_numeric = {
                MoodType.SCARED: 1, MoodType.FRUSTRATED: 2, MoodType.TIRED: 3,
                MoodType.STRESSED: 4, MoodType.OKAY: 5, MoodType.MOTIVATED: 6, MoodType.EXCITED: 7
            }
            
            weeks_summary = defaultdict(lambda: {"total_entries": 0, "mood_sum": 0, "moods": []})
            
            for week, year, mood, count in weekly_data:
                week_key = f"{int(year)}-W{int(week)}"
                weeks_summary[week_key]["total_entries"] += count
                weeks_summary[week_key]["mood_sum"] += mood_to_numeric[mood] * count
                weeks_summary[week_key]["moods"].append({
                    "mood": mood.value,
                    "count": count
                })
            
            # Calculate weekly averages
            weekly_summary = []
            for week_key, data in weeks_summary.items():
                avg_mood = data["mood_sum"] / data["total_entries"] if data["total_entries"] > 0 else 5
                weekly_summary.append({
                    "week": week_key,
                    "average_mood_numeric": round(avg_mood, 2),
                    "total_entries": data["total_entries"],
                    "mood_breakdown": data["moods"]
                })
            
            return {
                "period_weeks": weeks,
                "weekly_summary": sorted(weekly_summary, key=lambda x: x["week"])
            }
            
        except Exception as e:
            logger.error(f"Error getting weekly mood summary: {e}")
            return {
                "period_weeks": weeks,
                "weekly_summary": [],
                "error": str(e)
            }

# Global instance
journal_service = JournalService(sentiment_service)











# # Alternative: Simple validation function (no class)
async def validate_course_exists_simple(db: AsyncSession, course_id: str | int) -> dict | None:
    """
    Simple function to validate course exists and return basic info
    
    Args:
        db: Database session
        course_id: The course ID to validate
        
    Returns:
        dict: Course info or None if not found
    """
    try:
        # Convert to int if it's a string
        course_id_int = int(course_id)
        
        query = text("""
            SELECT course_id, title, created_at
            FROM base_courses 
            WHERE course_id = :course_id 
            LIMIT 1
        """)
        result = await db.execute(query, {"course_id": course_id_int})
        row = result.fetchone()
        
        if row:
            return {
                "id": row.course_id,
                "title": row.title,
                "created_at": row.created_at
            }
        return None
    except ValueError:
        logger.error(f"Invalid course_id format: {course_id} (must be a number)")
        return None
    except Exception as e:
        logger.error(f"Error validating course {course_id}: {e}")
        return None





class ProgressCRUDService:
    """Service for CRUD operations on learning progress"""
    
    def __init__(self, db_session: AsyncSession):
        self.db = db_session
    
    async def get_user_progress_list(
        self, 
        user_id: str,
        course_id: Optional[int] = None,
        progress_status: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """
        Get list of progress entries for a user with optional filtering
        
        Args:
            user_id: User ID to get progress for
            course_id: Optional filter by specific course
            progress_status: Optional filter by status
            limit: Maximum number of results
            offset: Pagination offset
            
        Returns:
            List of progress entries
        """
        try:
            # Build the query with filters
            query = select(LearningProgressModel).where(
                LearningProgressModel.user_id == user_id
            )
            
            if course_id:
                query = query.where(
                    LearningProgressModel.skill_or_course_id == (course_id)
                )
            
            if progress_status:
                query = query.where(
                    LearningProgressModel.status == progress_status
                )
            
            # Add pagination
            query = query.offset(offset).limit(limit)
            
            # Order by most recent first
            # query = query.order_by(LearningProgressModel.created_at.desc())
            
            result = await self.db.execute(query)
            progress_entries = result.scalars().all()
            
            return [
                {
                    "id": entry.id,
                    "user_id": entry.user_id,
                    "skill_or_course_id": entry.skill_or_course_id,
                    "status": entry.status
                }
                for entry in progress_entries
            ]
            
        except Exception as e:
            logger.error(f"Error getting progress list for user {user_id}: {e}")
            raise
    
    async def get_progress_by_id(self, progress_id: int, user_id: str) -> Dict[str, Any]:
        """
        Get a specific progress entry by ID
        
        Args:
            progress_id: Progress entry ID
            user_id: User ID (for ownership validation)
            
        Returns:
            Progress entry data
            
        Raises:
            HTTPException: If not found or user doesn't own the progress
        """
        try:
            query = select(LearningProgressModel).where(
                and_(
                    LearningProgressModel.id == progress_id,
                    LearningProgressModel.user_id == user_id
                )
            )
            
            result = await self.db.execute(query)
            progress_entry = result.scalar_one_or_none()
            
            if not progress_entry:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Progress entry {progress_id} not found or you don't have permission to access it"
                )
            
            return {
                "id": progress_entry.id,
                "user_id": progress_entry.user_id,
                "skill_or_course_id": progress_entry.skill_or_course_id,
                "status": progress_entry.status,
                # "created_at": progress_entry.created_at,
                # "updated_at": progress_entry.updated_at
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error getting progress {progress_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve progress entry"
            ) from e
    
    async def update_progress(
        self, 
        progress_id: int, 
        user_id: str, 
        update_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Update a progress entry
        
        Args:
            progress_id: Progress entry ID to update
            user_id: User ID (for ownership validation)
            update_data: Data to update
            
        Returns:
            Updated progress entry
            
        Raises:
            HTTPException: If not found, no permission, or update fails
        """
        try:
            # First, get the existing progress entry
            query = select(LearningProgressModel).where(
                and_(
                    LearningProgressModel.id == progress_id,
                    LearningProgressModel.user_id == user_id
                )
            )
            
            result = await self.db.execute(query)
            progress_entry = result.scalar_one_or_none()
            
            if not progress_entry:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Progress entry {progress_id} not found or you don't have permission to update it"
                )
            
            # Update fields that are provided
            if "status" in update_data:
                progress_entry.status = update_data["status"]
            
            # You can add more updateable fields here as needed
            # if "skill_or_course_id" in update_data:
            #     progress_entry.skill_or_course_id = str(update_data["skill_or_course_id"])
            
            await self.db.commit()
            await self.db.refresh(progress_entry)
            
            return {
                "id": progress_entry.id,
                "user_id": progress_entry.user_id,
                "skill_or_course_id": progress_entry.skill_or_course_id,
                "status": progress_entry.status,
                # "created_at": progress_entry.created_at,
                # "updated_at": progress_entry.updated_at
            }
            
        except HTTPException:
            raise
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating progress {progress_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update progress entry"
            ) from e
    
    async def delete_progress(self, progress_id: int, user_id: str) -> bool:
        """
        Delete a progress entry
        
        Args:
            progress_id: Progress entry ID to delete
            user_id: User ID (for ownership validation)
            
        Returns:
            True if deleted successfully
            
        Raises:
            HTTPException: If not found or no permission
        """
        try:
            # First, get the existing progress entry
            query = select(LearningProgressModel).where(
                and_(
                    LearningProgressModel.id == progress_id,
                    LearningProgressModel.user_id == user_id
                )
            )
            
            result = await self.db.execute(query)
            progress_entry = result.scalar_one_or_none()
            
            if not progress_entry:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Progress entry {progress_id} not found or you don't have permission to delete it"
                )
            
            await self.db.delete(progress_entry)
            await self.db.commit()
            
            logger.info(f"Successfully deleted progress entry {progress_id} for user {user_id}")
            return True
            
        except HTTPException:
            raise
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting progress {progress_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete progress entry"
            ) from e


# Dependency function
async def get_progress_crud_service(
    db: AsyncSession = Depends(get_postgres_db)
) -> ProgressCRUDService:
    """Dependency to get progress CRUD service"""
    return ProgressCRUDService(db)





class ProgressAggregationService:
    """Service to calculate aggregated progress statistics"""
    
    def __init__(self, db_session: AsyncSession):
        self.db = db_session
    
    async def get_user_course_progress(self, user_id: str, course_id: int) -> Dict:
        """
        Get detailed progress for a specific user and course
        
        Returns:
            dict: Progress statistics for the user-course combination
        """
        try:
            query = text("""
                SELECT 
                    COUNT(*) as total_items,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_items,
                    COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_items,
                    COUNT(CASE WHEN status = 'not_started' THEN 1 END) as not_started_items
                FROM learning_progress 
                WHERE user_id = :user_id AND skill_or_course_id = :course_id
            """)
            
            result = await self.db.execute(query, {
                "user_id": user_id, 
                "course_id": course_id
            })
            row = result.fetchone()
            
            if row and row.total_items > 0:
                completion_percentage = (row.completed_items / row.total_items) * 100
                return {
                    "user_id": user_id,
                    "course_id": course_id,
                    "total_items": row.total_items,
                    "completed_items": row.completed_items,
                    "in_progress_items": row.in_progress_items,
                    "not_started_items": row.not_started_items,
                    "completion_percentage": round(completion_percentage, 2)
                }
            
            return {
                "user_id": user_id,
                "course_id": course_id,
                "total_items": 0,
                "completed_items": 0,
                "in_progress_items": 0,
                "not_started_items": 0,
                "completion_percentage": 0.0
            }
            
        except Exception as e:
            logger.error(f"Error calculating user course progress: {e}")
            raise
    
    async def get_user_overall_progress(self, user_id: str) -> Dict:
        """
        Get overall progress across all courses for a user
        
        Returns:
            dict: Overall user progress statistics
        """
        try:
            query = text("""
                SELECT 
                    COUNT(DISTINCT skill_or_course_id) as total_courses,
                    COUNT(*) as total_items,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_items,
                    COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_items
                FROM learning_progress 
                WHERE user_id = :user_id
            """)
            
            result = await self.db.execute(query, {"user_id": user_id})
            row = result.fetchone()
            
            if row and row.total_items > 0:
                completion_percentage = (row.completed_items / row.total_items) * 100
                return {
                    "user_id": user_id,
                    "total_courses": row.total_courses,
                    "total_items": row.total_items,
                    "completed_items": row.completed_items,
                    "in_progress_items": row.in_progress_items,
                    "completion_percentage": round(completion_percentage, 2)
                }
            
            return {
                "user_id": user_id,
                "total_courses": 0,
                "total_items": 0,
                "completed_items": 0,
                "in_progress_items": 0,
                "completion_percentage": 0.0
            }
            
        except Exception as e:
            logger.error(f"Error calculating user overall progress: {e}")
            raise
    
    async def get_course_statistics(self, course_id: int) -> Dict:
        """
        Get aggregated statistics for a specific course across all users
        
        Returns:
            dict: Course-wide progress statistics
        """
        try:
            query = text("""
                SELECT 
                    COUNT(DISTINCT user_id) as total_users,
                    COUNT(*) as total_progress_entries,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_entries,
                    COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_entries,
                    AVG(CASE WHEN status = 'completed' THEN 1.0 ELSE 0.0 END) * 100 as avg_completion_rate
                FROM learning_progress 
                WHERE skill_or_course_id = :course_id
            """)
            
            result = await self.db.execute(query, {"course_id": course_id})
            row = result.fetchone()
            
            if row:
                return {
                    "course_id": course_id,
                    "total_users": row.total_users or 0,
                    "total_progress_entries": row.total_progress_entries or 0,
                    "completed_entries": row.completed_entries or 0,
                    "in_progress_entries": row.in_progress_entries or 0,
                    "average_completion_rate": round(row.avg_completion_rate or 0.0, 2)
                }
            
            return {
                "course_id": course_id,
                "total_users": 0,
                "total_progress_entries": 0,
                "completed_entries": 0,
                "in_progress_entries": 0,
                "average_completion_rate": 0.0
            }
            
        except Exception as e:
            logger.error(f"Error calculating course statistics: {e}")
            raise
    
    async def get_top_performing_users(self, course_id: Optional[int] = None, limit: int = 10) -> List[Dict]:
        """
        Get top performing users (highest completion rates)
        
        Args:
            course_id: Optional course filter
            limit: Number of top users to return
            
        Returns:
            list: Top performing users with their stats
        """
        try:
            if course_id:
                # Top users for a specific course
                query = text("""
                    SELECT 
                        user_id,
                        COUNT(*) as total_items,
                        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_items,
                        (COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*)) as completion_percentage
                    FROM learning_progress 
                    WHERE skill_or_course_id = :course_id
                    GROUP BY user_id
                    HAVING COUNT(*) > 0
                    ORDER BY completion_percentage DESC, completed_items DESC
                    LIMIT :limit
                """)
                params = {"course_id": course_id, "limit": limit}
            else:
                # Top users overall
                query = text("""
                    SELECT 
                        user_id,
                        COUNT(DISTINCT skill_or_course_id) as courses_enrolled,
                        COUNT(*) as total_items,
                        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_items,
                        (COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*)) as completion_percentage
                    FROM learning_progress 
                    GROUP BY user_id
                    HAVING COUNT(*) > 0
                    ORDER BY completion_percentage DESC, completed_items DESC
                    LIMIT :limit
                """)
                params = {"limit": limit}
            
            result = await self.db.execute(query, params)
            rows = result.fetchall()
            
            return [
                {
                    "user_id": row.user_id,
                    "total_items": row.total_items,
                    "completed_items": row.completed_items,
                    "completion_percentage": round(row.completion_percentage, 2),
                    **({"courses_enrolled": row.courses_enrolled} if not course_id else {})
                }
                for row in rows
            ]
            
        except Exception as e:
            logger.error(f"Error getting top performing users: {e}")
            raise


# Dependency function
async def get_progress_aggregation_service(
    db: AsyncSession = Depends(get_postgres_db)
) -> ProgressAggregationService:
    """Dependency to get progress aggregation service"""
    return ProgressAggregationService(db)