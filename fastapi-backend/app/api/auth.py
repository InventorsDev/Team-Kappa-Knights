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