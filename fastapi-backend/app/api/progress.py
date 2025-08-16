from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_postgres_db
from app.core.security import get_current_user_uid
from app.models.learning import LearningProgressModel
from app.schemas.learning import LearningProgressCreate, LearningProgress
from typing import Optional
from app.schemas.learning import LearningProgressResponse, LearningProgressUpdate, ProgressListResponse
from app.services.learning import validate_course_exists_simple
import logging
# Add these endpoints to your progress router
from app.services.learning import get_progress_aggregation_service, ProgressAggregationService
from app.services.learning import ProgressCRUDService, get_progress_crud_service
logger = logging.getLogger(__name__)

router = APIRouter()



@router.get("/leaderboard")
async def get_top_performers(
    course_id: Optional[int] = None,
    limit: int = 10,
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid),
    aggregation_service: ProgressAggregationService = Depends(get_progress_aggregation_service)
):
    """
    Get top performing users (leaderboard)
    
    Query params:
    - course_id: Optional, filter by specific course
    - limit: Number of top users to return (default 10)
    """
    try:
        top_users = await aggregation_service.get_top_performing_users(course_id, limit)
        return {
            "course_id": course_id,
            "top_performers": top_users
        }
    except Exception as e:
        logger.error(f"Error getting top performers: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get leaderboard data"
        )



@router.post("/", response_model=LearningProgress, status_code=status.HTTP_201_CREATED)
async def create_progress(
    progress: LearningProgressCreate,
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid),
):
    """
    Create a new Learning Progress entry with course validation.

    - `skill_or_course_id`: ID referencing a skill or course the progress relates to.
    - `status`: Progress status - must be one of "not_started", "in_progress", or "completed".
    
    The endpoint validates that the course exists in the Django course table before creating progress.
    """

    # Validate status value explicitly if not done in Pydantic schema
    allowed_statuses = {"not_started", "in_progress", "completed"}
    if progress.status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status, must be one of {allowed_statuses}"
        )

    # Validate course_id format
    try:
        course_id_int = int(progress.skill_or_course_id)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="skill_or_course_id must be a valid integer"
        )

    # Validate that the course exists in Django's database
    course_info = await validate_course_exists_simple(db, course_id_int)
    if not course_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Course with ID {course_id_int} does not exist"
        )
    
    logger.info(f"Creating progress for user {user_id} on course: {course_info['title']}")

    # Create new LearningProgressModel instance
    new_progress = LearningProgressModel(
        user_id=user_id,
        skill_or_course_id=course_id_int,  # Use the validated integer
        status=progress.status,
    )
    
    # Add and commit to DB
    db.add(new_progress)
    try:
        await db.commit()
        await db.refresh(new_progress)
        logger.info(f"Successfully created progress entry {new_progress.id} for user {user_id}")
    except Exception as e:
        await db.rollback()
        logger.error(f"Database error creating progress: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create progress entry"
        ) from e

    return new_progress



@router.get("/", response_model=ProgressListResponse)
async def get_user_progress_list(
    course_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid),
    crud_service: ProgressCRUDService = Depends(get_progress_crud_service)
):
    """
    Get list of progress entries for the current user
    
    Query parameters:
    - course_id: Filter by specific course
    - status_filter: Filter by status (not_started, in_progress, completed)
    - limit: Maximum results (default 100)
    - offset: Pagination offset (default 0)
    """
    # Validate status filter if provided
    if status_filter:
        allowed_statuses = {"not_started", "in_progress", "completed"}
        if status_filter not in allowed_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status filter, must be one of {allowed_statuses}"
            )
    
    try:
        progress_list = await crud_service.get_user_progress_list(
            user_id=user_id,
            course_id=course_id,
            progress_status=status_filter,
            limit=limit,
            offset=offset
        )
        
        return {
            "total_count": len(progress_list),
            "progress_entries": progress_list
        }
        
    except Exception as e:
        logger.error(f"Error getting progress list: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve progress list"
        )


@router.get("/{progress_id}", response_model=LearningProgressResponse)
async def get_progress_by_id(
    progress_id: int,
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid),
    crud_service: ProgressCRUDService = Depends(get_progress_crud_service)
):
    """
    Get a specific progress entry by ID
    Users can only access their own progress entries
    """
    try:
        progress_data = await crud_service.get_progress_by_id(progress_id, user_id)
        return progress_data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting progress {progress_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve progress entry"
        )



@router.put("/{progress_id}", response_model=LearningProgressResponse)
async def update_progress(
    progress_id: int,
    progress_update: LearningProgressUpdate,
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid),
    crud_service: ProgressCRUDService = Depends(get_progress_crud_service)
):
    """
    Update a progress entry
    Users can only update their own progress entries
    """
    # Validate status if provided
    if progress_update.status:
        allowed_statuses = {"not_started", "in_progress", "completed"}
        if progress_update.status not in allowed_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status, must be one of {allowed_statuses}"
            )
    
    try:
        # Convert to dict, excluding None values
        update_data = {
            k: v for k, v in progress_update.dict().items() 
            if v is not None
        }
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No valid update data provided"
            )
        
        updated_progress = await crud_service.update_progress(
            progress_id=progress_id,
            user_id=user_id,
            update_data=update_data
        )
        
        logger.info(f"Updated progress {progress_id} for user {user_id}")
        return updated_progress
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating progress {progress_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update progress entry"
        )

@router.delete("/{progress_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_progress(
    progress_id: int,
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid),
    crud_service: ProgressCRUDService = Depends(get_progress_crud_service)
):
    """
    Delete a progress entry
    Users can only delete their own progress entries
    """
    try:
        success = await crud_service.delete_progress(progress_id, user_id)
        if success:
            logger.info(f"Deleted progress {progress_id} for user {user_id}")
            return  # 204 No Content
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete progress entry"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting progress {progress_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete progress entry"
        )
        




@router.get("/user/{target_user_id}/course/{course_id}/stats")
async def get_user_course_stats(
    target_user_id: str,
    course_id: int,
    db: AsyncSession = Depends(get_postgres_db),
    current_user_id: str = Depends(get_current_user_uid),
    aggregation_service: ProgressAggregationService = Depends(get_progress_aggregation_service)
):
    """
    Get detailed progress statistics for a specific user and course
    """
    # You might want to add authorization here (e.g., users can only see their own stats)
    if target_user_id != current_user_id:
        # Add admin check here if needed
        pass
    
    try:
        stats = await aggregation_service.get_user_course_progress(target_user_id, course_id)
        return stats
    except Exception as e:
        logger.error(f"Error getting user course stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to calculate progress statistics"
        )

@router.get("/user/me/stats")
async def get_my_overall_progress(
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid),
    aggregation_service: ProgressAggregationService = Depends(get_progress_aggregation_service)
):
    """
    Get overall progress statistics for the current user across all courses
    """
    try:
        stats = await aggregation_service.get_user_overall_progress(user_id)
        return stats
    except Exception as e:
        logger.error(f"Error getting user overall progress: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to calculate overall progress"
        )

@router.get("/course/{course_id}/stats")
async def get_course_statistics(
    course_id: int,
    db: AsyncSession = Depends(get_postgres_db),
    user_id: str = Depends(get_current_user_uid),  # For auth
    aggregation_service: ProgressAggregationService = Depends(get_progress_aggregation_service)
):
    """
    Get aggregated statistics for a course across all users
    (Might require admin privileges)
    """
    try:
        stats = await aggregation_service.get_course_statistics(course_id)
        return stats
    except Exception as e:
        logger.error(f"Error getting course statistics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to calculate course statistics"
        )

