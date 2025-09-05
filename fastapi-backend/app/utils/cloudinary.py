# utils/cloudinary_config.py
import cloudinary
import cloudinary.uploader
from typing import Dict, Any
import time
from app.core.config import settings 

async def upload_image_to_cloudinary(
    file_content: bytes, 
    filename: str, 
    folder: str = "nuroki-profile-pictures"
) -> Dict[str, Any]:
    """
    Upload image to Cloudinary
    
    Args:
        file_content: The image file content as bytes
        filename: Original filename
        folder: Cloudinary folder to upload to
        
    Returns:
        Dict containing upload result
    """
    try:
        # Verify Cloudinary is configured
        if not all([settings.CLOUDINARY_NAME, settings.CLOUDINARY_API_KEY, settings.CLOUDINARY_API_SECRET]):
            raise Exception("Cloudinary not properly configured - missing credentials")
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            file_content,
            folder=folder,
            resource_type="auto",
            public_id=f"{filename}_{int(time.time())}"  # Add timestamp to avoid conflicts
        )
        return result
    except Exception as e:
        raise Exception(f"Cloudinary upload failed: {str(e)}")

async def delete_image_from_cloudinary(public_id: str) -> bool:
    """Delete image from Cloudinary using public_id"""
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result.get("result") == "ok"
    except Exception as e:
        print(f"Error deleting image from Cloudinary: {e}")
        return False