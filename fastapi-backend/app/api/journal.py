import logging
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_postgres_db
from app.models.learning import LearningJournalEntryModel, EntryType, MoodType
from app.schemas.learning import RegularJournalCreate, OnboardingJournalCreate, LearningJournalEntryResponse, LearningJournalEntryUpdate
from app.services.learning import sentiment_service, journal_service
from app.core.security import get_current_user_uid
from sqlalchemy import select
from typing import List, Optional
from sqlalchemy import text
from datetime import datetime



logger = logging.getLogger(__name__)

router = APIRouter()






@router.post("/", response_model=LearningJournalEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_journal_entry(
    entry: RegularJournalCreate,  # Now includes title and mood
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid),
):
    """Create a journal entry with title, mood, content and sentiment analysis"""
    try:
        # Sentiment analysis (keeping your existing logic)
        score, label = await sentiment_service.analyze_sentiment_async(entry.content)
       
        # Create entry with all fields
        new_entry = LearningJournalEntryModel(
            user_id=user_id,
            title=entry.title,  # Now required
            mood=entry.mood,    # Now optional but available
            content=entry.content,
            entry_type=EntryType.REGULAR,  # Default type
            sentiment_score=score,
            sentiment_label=label,
        )
       
        db.add(new_entry)
        await db.commit()
        await db.refresh(new_entry)
       
        # Return with emoji included
        return journal_service.add_mood_emoji(new_entry)
       
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create journal entry: {str(e)}"
        )



@router.post("/onboarding", response_model=LearningJournalEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_onboarding_entry(
    entry: OnboardingJournalCreate,
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid),
):
    """Create onboarding journal entry - mood required, title optional"""
    try:
        # Use the new journal service
        new_entry = await journal_service.create_journal_entry(
            user_id=user_id,
            entry_data=entry.dict(),
            entry_type=EntryType.ONBOARDING
        )
        
        db.add(new_entry)
        await db.commit()
        await db.refresh(new_entry)
        
        # Return with emoji included
        return journal_service.add_mood_emoji(new_entry)
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create onboarding entry: {str(e)}"
        )


@router.put("/{entry_id}", response_model=LearningJournalEntryResponse)
async def update_journal_entry(
    entry_id: int,
    entry_update: LearningJournalEntryUpdate,
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid),
):
    """Update a journal entry - onboarding entries cannot be updated"""
    try:
        # Filter out None values
        update_data = {k: v for k, v in entry_update.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No valid fields provided for update"
            )
        
        updated_entry = await journal_service.update_journal_entry(
            entry_id=entry_id,
            user_id=user_id,
            update_data=update_data,
            db=db
        )
        
        return journal_service.add_mood_emoji(updated_entry)
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update journal entry: {str(e)}"
        )

@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_journal_entry(
    entry_id: int,
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid),
):
    """Delete a journal entry - onboarding entries cannot be deleted"""
    try:
        await journal_service.delete_journal_entry(
            entry_id=entry_id,
            user_id=user_id,
            db=db
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete journal entry: {str(e)}"
        )

@router.get("/", response_model=List[LearningJournalEntryResponse])
async def get_journal_entries(
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid),
    include_onboarding: bool = True,
    limit: int = 20,
    offset: int = 0
):
    """Get all journal entries for the current user"""
    entries = await journal_service.get_user_journal_entries(
        user_id=user_id,
        db=db,
        include_onboarding=include_onboarding,
        limit=limit,
        offset=offset
    )
    return entries




@router.get("/{entry_id}", response_model=LearningJournalEntryResponse)
async def get_journal_entry(
    entry_id: int,
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid),
):
    """Get a specific journal entry"""
    try:
        query = (
            select(LearningJournalEntryModel)
            .where(
                LearningJournalEntryModel.id == entry_id,
                LearningJournalEntryModel.user_id == user_id
            )
        )
        
        result = await db.execute(query)
        entry = result.scalar_one_or_none()
        
        if not entry:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Journal entry not found"
            )
        
        return entry
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch journal entry: {str(e)}"
        )



@router.get("/analytics/sentiment")
async def get_sentiment_analytics(
    days: int = 30,
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid),
):
    """Get sentiment analytics for the user's journal entries"""
    try:
        from sqlalchemy import and_, func
        from datetime import datetime, timedelta
        
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        query = (
            select(
                LearningJournalEntryModel.sentiment_label,
                func.count(LearningJournalEntryModel.id).label('count'),
                func.avg(LearningJournalEntryModel.sentiment_score).label('avg_score')
            )
            .where(
                and_(
                    LearningJournalEntryModel.user_id == user_id,
                    LearningJournalEntryModel.created_at >= cutoff_date,
                    LearningJournalEntryModel.sentiment_label.isnot(None)
                )
            )
            .group_by(LearningJournalEntryModel.sentiment_label)
        )
        
        result = await db.execute(query)
        analytics = result.all()
        
        return {
            "period_days": days,
            "sentiment_distribution": [
                {
                    "sentiment": row.sentiment_label,
                    "count": row.count,
                    "average_confidence": round(float(row.avg_score), 3)
                }
                for row in analytics
            ]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch sentiment analytics: {str(e)}"
        )





@router.get("/analytics/mood-distribution")
async def get_mood_distribution(
    days: int = Query(30, description="Number of days to analyze", ge=1, le=365),
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid),
):
    """Get mood distribution for pie/bar charts"""
    try:
        analytics = await journal_service.get_mood_analytics(user_id, db, days)
        return {
            "success": True,
            "data": analytics
        }
    except Exception as e:
        logger.error(f"Error fetching mood distribution: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch mood distribution"
        )

@router.get("/analytics/mood-timeline")
async def get_mood_timeline(
    days: int = Query(30, description="Number of days for timeline", ge=1, le=365),
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid)
):
    """Get mood timeline for line/scatter charts"""
    try:
        timeline = await journal_service.get_mood_timeline(user_id, db, days)
        return {
            "success": True,
            "data": timeline
        }
    except Exception as e:
        logger.error(f"Error fetching mood timeline: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch mood timeline"
        )

@router.get("/analytics/weekly-summary")
async def get_weekly_mood_summary(
    weeks: int = Query(4, description="Number of weeks to analyze", ge=1, le=52),
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid),
):
    """Get weekly mood summary for trend analysis"""
    try:
        summary = await journal_service.get_weekly_mood_summary(user_id, db, weeks)
        return {
            "success": True,
            "data": summary
        }
    except Exception as e:
        logger.error(f"Error fetching weekly summary: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch weekly summary"
        )

@router.get("/analytics/dashboard")
async def get_mood_dashboard(
    days: int = Query(30, description="Period for analysis", ge=7, le=365),
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid)
):
    """Get comprehensive mood dashboard data"""
    try:
        # Get all analytics in parallel
        import asyncio
        
        distribution_task = journal_service.get_mood_analytics(user_id, db, days)
        timeline_task = journal_service.get_mood_timeline(user_id, db, days)
        weekly_task = journal_service.get_weekly_mood_summary(user_id, db, weeks=min(days//7, 8))
        
        distribution, timeline, weekly = await asyncio.gather(
            distribution_task, timeline_task, weekly_task
        )
        
        return {
            "success": True,
            "data": {
                "period_days": days,
                "mood_distribution": distribution,
                "mood_timeline": timeline,
                "weekly_summary": weekly,
                "generated_at": datetime.utcnow().isoformat()
            }
        }
    except Exception as e:
        logger.error(f"Error fetching mood dashboard: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch mood dashboard"
        )