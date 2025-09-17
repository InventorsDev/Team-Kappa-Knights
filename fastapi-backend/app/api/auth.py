import os
from fastapi import APIRouter, HTTPException, status, Depends
from app.core.security import verify_firebase_token
from pydantic import BaseModel, EmailStr
import requests
from firebase_admin import auth
from firebase_admin.auth import EmailAlreadyExistsError
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_postgres_db
from app.models.user import UserProfileModel, SkillLevel, LearningGoal, SupportStyle  # Your ORM model
from app.core.config import settings
from typing import Optional
from datetime import datetime
from sqlalchemy import select
from app.core.security import get_current_user_uid
from pydantic import BaseModel, field_validator, ValidationInfo, model_validator


router = APIRouter()

class UserCreateRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    # skill_level: Optional[SkillLevel] = None
    # learning_goal: Optional[LearningGoal] = None
    # support_style: Optional[SupportStyle] = None


router = APIRouter()

# You need Firebase Web API Key here from your Firebase project settings

FIREBASE_WEB_API_KEY = settings.FIREBASE_WEB_API_KEY
EMULATOR_HOST = settings.FIREBASE_EMULATOR_Link


@router.get("/protected")
async def protected_route(user=Depends(verify_firebase_token)):
    # user contains decoded Firebase token info
    return {"message": "You are authenticated", "uid": user["uid"]}




class LoginRequest(BaseModel):
    email: EmailStr
    password: str



@router.post("/login")
async def login(login_req: LoginRequest, db: AsyncSession = Depends(get_postgres_db)):
    # Use emulator URL instead of production
   
    # url = f"{EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}"
    
    # production url
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}"
    
    payload = {
        "email": login_req.email,
        "password": login_req.password,
        "returnSecureToken": True
    }
    
    response = requests.post(url, json=payload)
    
    if response.status_code != 200:
        firebase_error = response.json() if response.text else {}
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Firebase error: {firebase_error}"
        )
    
    data = response.json()
    user_uid = data.get("localId")
    reactivated = False
    if user_uid:
        result = await db.execute(
            select(UserProfileModel).where(UserProfileModel.user_id == user_uid)
        )
        user_obj = result.scalars().first()
        
        if user_obj and not user_obj.is_active:
            # auto-reactivate the account
            user_obj.is_active = True
            user_obj.deactivated_at = None
            user_obj.updated_at = datetime.utcnow()
            await db.commit()
            await db.refresh(user_obj)
            reactivated = True
            print(f"Account auto-reactivated for user: {user_uid}")
    return {
        "idToken": data["idToken"],
        "refreshToken": data.get("refreshToken"),
        "expiresIn": data.get("expiresIn"),
        "localId": data.get("localId"),
        "email": data.get("email"),
        "account_reactivated": reactivated
    }




@router.get("/me")
async def get_current_user(user=Depends(verify_firebase_token)):
    """
    Return decoded Firebase token info (like uid, email, etc.)
    """
    return {
        "uid": user.get("uid"),
        "email": user.get("email"),
        "name": user.get("name"),
        "picture": user.get("picture"),
        "firebase_claims": user.get("firebase", {})
    }




@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(
    user: UserCreateRequest,  # Should include full_name, email, password
    db: AsyncSession = Depends(get_postgres_db),
):
    try:
        # Create user in Firebase
        user_record = auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.full_name  # Also set in Firebase
        )
        

        # Create profile in Postgres with the data frontend sent
        new_profile = UserProfileModel(
            user_id=user_record.uid,
            email=user.email,        # Store it
            full_name=user.full_name, # Store it
            interests=[],
            skills=[],
            bio=None,
            skill_level=None,          # Will be set in onboarding
            learning_goal=None,       # Will be set in onboarding  
            support_style=None,       # Will be set in onboarding
            onboarding_completed=False,  # Always False initially
            onboarding_completed_at=None,
        )

        db.add(new_profile)
        await db.commit()
        await db.refresh(new_profile)

        return {"uid": user_record.uid, "email": user_record.email}

    except EmailAlreadyExistsError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )




class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str
    
    @field_validator('current_password')
    @classmethod
    def current_password_not_empty(cls, v: str) -> str:
        if not v or v.strip() == '':
            raise ValueError('Current password is required')
        return v

    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError('New password must be at least 6 characters long')
        return v

    @field_validator('confirm_password')
    @classmethod
    def passwords_match(cls, v: str, info: ValidationInfo) -> str:
        new_password = info.data.get('new_password')
        if new_password and v != new_password:
            raise ValueError('New password and confirm password do not match')
        return v

    @model_validator(mode='after')
    def check_new_password_differs(self):
        """Check that new password is different from current password"""
        if self.current_password == self.new_password:
            raise ValueError('New password must be different from the current password')
        return self



@router.put("/password", status_code=status.HTTP_200_OK)
async def change_password(
    password_change: ChangePasswordRequest,
    decoded_token: dict = Depends(verify_firebase_token),
    current_user_uid: str = Depends(get_current_user_uid)
):
    """
    Change user password - requires current password verification
    """
    user_email = decoded_token.get('email')
    if not user_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to retrieve user email from token"
        )
    
    # Step 1: Verify current password by attempting to sign in
    verify_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}"
    # For production: f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}"
    
    verify_payload = {
        "email": user_email,
        "password": password_change.current_password,
        "returnSecureToken": False
    }
    
    verify_response = requests.post(verify_url, json=verify_payload)
    
    if verify_response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Step 2: Update password using Firebase Admin SDK
    try:
        auth.update_user(
            current_user_uid,
            password=password_change.new_password
        )
        # Revoke tokens to force sign-out
        auth.revoke_refresh_tokens(current_user_uid)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update password: {str(e)}"
        )
    
    return {
        "message": "Password successfully updated",
        "timestamp": datetime.utcnow().isoformat()
    }