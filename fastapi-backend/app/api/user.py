from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import UserProfileModel  # your ORM model
from app.schemas.user import UserProfileUpdate, UserProfileResponse, OnboardingComplete
from app.core.security import get_current_user_uid
from app.core.database import get_postgres_db
from firebase_admin import auth
from datetime import datetime
from app.utils.cloudinary import upload_image_to_cloudinary


router = APIRouter()



@router.get("/me", response_model=UserProfileResponse)
async def get_current_user(
    db: AsyncSession = Depends(get_postgres_db),
    current_user_uid: str = Depends(get_current_user_uid)
):
    """
    Get user profile from YOUR database
    """
    result = await db.execute(
        select(UserProfileModel).where(UserProfileModel.user_id == current_user_uid)
    )
    user_profile = result.scalars().first()
    
    if not user_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User profile not found"
        )
    
    return user_profile  # Returns interests, skills, bio, etc.




@router.post("/sync-profile", status_code=status.HTTP_201_CREATED)
async def sync_user_profile(
    db: AsyncSession = Depends(get_postgres_db),
    current_user_uid: str = Depends(get_current_user_uid)  # User is already authenticated
):
    try:
        # Check if profile already exists
        result = await db.execute(
            select(UserProfileModel).where(UserProfileModel.user_id == current_user_uid)
        )
        existing_profile = result.scalars().first()
        
        if existing_profile:
            return {"message": "Profile already exists", "uid": current_user_uid}
        
        # Get user info from Firebase (works for both email/password and Google users)
        firebase_user = auth.get_user(current_user_uid)
        
        # Create profile with Firebase data
        new_profile = UserProfileModel(
            user_id=current_user_uid,
            email=firebase_user.email,
            full_name=firebase_user.display_name or firebase_user.email.split('@')[0],
            interests=[],
            skills=[],
            bio=None,
            skill_level=None,  # Will be set during onboarding
            learning_goal=None,  # Will be set during onboarding
            support_style=None,  # Will be set during onboarding
            onboarding_completed=False,  # Will be True after onboarding
            onboarding_completed_at=None,
        )
        
        db.add(new_profile)
        await db.commit()
        await db.refresh(new_profile)
        
        return {"uid": current_user_uid, "email": firebase_user.email}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to sync profile: {str(e)}"
        )



@router.post("/complete-onboarding", status_code=status.HTTP_200_OK)
async def complete_onboarding(
    onboarding_data: OnboardingComplete,
    db: AsyncSession = Depends(get_postgres_db),
    current_user_uid: str = Depends(get_current_user_uid)
):
    """Complete user onboarding after profile sync with data validation"""
    try:
        # Get existing profile
        result = await db.execute(
            select(UserProfileModel).where(UserProfileModel.user_id == current_user_uid)
        )
        user_profile = result.scalars().first()
        
        if not user_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )
        
        # Validate required data exists (saved via /me endpoint during onboarding flow)
        validation_errors = []
        
        if not user_profile.interests or len(user_profile.interests) == 0:
            validation_errors.append("interests")
        
        # Add other validations as needed
        if not user_profile.full_name or user_profile.full_name.strip() == "":
            validation_errors.append("full_name")
        
        if validation_errors:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Missing required onboarding data: {', '.join(validation_errors)}. Please complete all onboarding steps."
            )
        
        # Prevent double completion
        if user_profile.onboarding_completed:
            return {
                "message": "Onboarding already completed",
                "onboarding_completed": True,
                "completed_at": user_profile.onboarding_completed_at
            }
        
        # Update only the final onboarding fields (interests already saved via /me)
        user_profile.skill_level = onboarding_data.skill_level
        user_profile.learning_goal = onboarding_data.learning_goal
        user_profile.support_style = onboarding_data.support_style
        user_profile.onboarding_completed = True
        user_profile.onboarding_completed_at = datetime.utcnow()
        user_profile.updated_at = datetime.utcnow()
        
        await db.commit()
        await db.refresh(user_profile)
        
        return {
            "message": "Onboarding completed successfully",
            "onboarding_completed": True,
            "completed_at": user_profile.onboarding_completed_at,
            "profile": {
                "interests": user_profile.interests,
                "skill_level": user_profile.skill_level,
                "learning_goal": user_profile.learning_goal,
                "support_style": user_profile.support_style
            }
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions (validation errors, etc.)
        await db.rollback()
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to complete onboarding: {str(e)}"
        )




@router.put("/me", response_model=UserProfileResponse)
async def update_user_profile(
    user_update: UserProfileUpdate,
    db: AsyncSession = Depends(get_postgres_db),
    current_user_uid: str = Depends(get_current_user_uid)
):
    result = await db.execute(
        select(UserProfileModel).where(UserProfileModel.user_id == current_user_uid)
    )
    user_obj = result.scalars().first()
    if not user_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
   
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user_obj, key, value)
    
    # Add the missing last_updated timestamp
    user_obj.updated_at = datetime.utcnow()  # or last_updated if that's your field name
    
    await db.commit()
    await db.refresh(user_obj)
    return user_obj



# Upload image endpoint

@router.post("/upload-profile-picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_postgres_db),
    current_user_uid: str = Depends(get_current_user_uid)
):
    """Upload profile picture to Cloudinary and update user profile"""
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )
    
    # Validate file size (e.g., max 5MB)
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB in bytes
    file_content = await file.read()
    
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size too large. Maximum size is 5MB"
        )
    
    try:
        # Check if user exists
        result = await db.execute(
            select(UserProfileModel).where(UserProfileModel.user_id == current_user_uid)
        )
        user_obj = result.scalars().first()
        
        if not user_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="User profile not found"
            )
        
        # Upload to Cloudinary
        upload_result = await upload_image_to_cloudinary(
            file_content=file_content,
            filename=f"user_{current_user_uid}",
            folder="nuroki-profile-pictures"
        )
        
        # Update user profile with new image URL
        user_obj.profile_picture_url = upload_result["secure_url"]
        user_obj.updated_at = datetime.utcnow()
        
        await db.commit()
        await db.refresh(user_obj)
        
        return {
            "success": True,
            "message": "Profile picture uploaded successfully",
            "profile_picture_url": upload_result["secure_url"],
            "public_id": upload_result["public_id"]  # In case you need to delete later
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Profile picture upload failed: {str(e)}"
        )


# Disable account
@router.delete("/disable-me", status_code=status.HTTP_200_OK)
async def disable_user_account(
    db: AsyncSession = Depends(get_postgres_db),
    current_user_uid: str = Depends(get_current_user_uid)
):
    """
    Soft delete - Disable user account and return logout instruction
    """
    result = await db.execute(
        select(UserProfileModel).where(UserProfileModel.user_id == current_user_uid)
    )
    user_obj = result.scalars().first()
    
    if not user_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
    
    if not user_obj.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is already deactivated"
        )
    
    # Soft delete - mark as inactive
    user_obj.is_active = False
    user_obj.deactivated_at = datetime.utcnow()
    user_obj.updated_at = datetime.utcnow()
    
    await db.commit()
    
    # Return response indicating successful deactivation
    # The client should handle the logout after receiving this response
    return {
        "message": "Account successfully deactivated. You will be logged out.",
        "action_required": "logout",
        "logout_url": "/auth/logout"  # Optional: provide logout endpoint
    }

# Delete the authenticated user's profile
@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_profile(
    db: AsyncSession = Depends(get_postgres_db),
    current_user_uid: str = Depends(get_current_user_uid)
):
    result = await db.execute(
        select(UserProfileModel).where(UserProfileModel.user_id == current_user_uid)
    )
    user_obj = result.scalars().first()
    if not user_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    await db.delete(user_obj)
    await db.commit()
    return None



    
    
@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout_user(
    current_user_uid: str = Depends(get_current_user_uid)
):
    """
    Logout endpoint - mainly for client-side cleanup.
    Firebase tokens are stateless, so actual invalidation happens client-side.
    """
    # You can add logging here for analytics
    print(f"User {current_user_uid} logged out")
    
    # If you're maintaining any server-side sessions or cache, clear them here
    # Example: await clear_user_cache(current_user_uid)
    
    return {"message": "Successfully logged out"}