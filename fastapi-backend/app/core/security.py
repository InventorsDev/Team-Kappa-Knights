from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import UserProfileModel
from datetime import datetime
from app.core.database import get_postgres_db
from sqlalchemy import select

security = HTTPBearer()

async def verify_firebase_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No authorization credentials provided",
        )
    token = credentials.credentials

    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Firebase token: {str(e)}",
        )



async def ensure_user_active(user_uid: str, db: AsyncSession):
    """
    Check if user account is deactivated and reactivate it automatically.
    This is called on every authenticated request.
    """
    result = await db.execute(
        select(UserProfileModel).where(UserProfileModel.user_id == user_uid)
    )
    user_obj = result.scalars().first()
    
    if user_obj and not user_obj.is_active:
        # Auto-reactivate the account (Instagram-style)
        user_obj.is_active = True
        user_obj.deactivated_at = None
        user_obj.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(user_obj)
        print(f"Account auto-reactivated for user: {user_uid}")
    
    return user_obj

async def get_current_user_uid(
    decoded_token: dict = Depends(verify_firebase_token),
    db: AsyncSession = Depends(get_postgres_db)
) -> str:
    """
    Get current user UID and auto-reactivate account if needed.
    This is your main authentication dependency.
    """
    uid = decoded_token.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Missing user UID in token")
    
    # Auto-reactivate if account was disabled
    await ensure_user_active(uid, db)
    return uid
