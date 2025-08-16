from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth

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




async def get_current_user_uid(decoded_token: dict = Depends(verify_firebase_token)) -> str:
    """
    Extract and return the UID from the decoded Firebase token.
    This dependency assumes that `verify_firebase_token` returns the decoded token dict.
    """
    uid = decoded_token.get("uid")
    if not uid:
        # If UID missing for some reason (should not happen after Firebase validation)
        raise HTTPException(status_code=401, detail="Missing user UID in token")
    return uid
