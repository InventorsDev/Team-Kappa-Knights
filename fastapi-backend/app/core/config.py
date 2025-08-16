import os
import json
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
import firebase_admin
from firebase_admin import credentials

load_dotenv()

class Settings(BaseSettings):
    # App settings
    app_name: str = "FastAPI Firebase Auth"
    debug: bool = True
   
    # Database URLs
    POSTGRES_URL: str = Field(..., env="POSTGRES_URL")
   
    # Firebase settings - Updated for production deployment
    FIREBASE_CRED_PATH: str | None = Field(None, env="FIREBASE_CRED_PATH")  # Optional for local dev
    FIREBASE_SERVICE_ACCOUNT_JSON: str | None = Field(None, env="FIREBASE_SERVICE_ACCOUNT_JSON")  # For production
    FIREBASE_EMULATOR_HOST: str = Field(None, env="FIREBASE_EMULATOR_HOST")  # Optional
    FIREBASE_EMULATOR_Link: str = Field(None, env="FIREBASE_EMULATOR_Link")  
   
    FIREBASE_WEB_API_KEY: str = Field(..., env="FIREBASE_WEB_API_KEY")  # For web API calls
   
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

class FirebaseConfig:
    def __init__(self):
        self.settings = settings
        self._initialize_firebase()
   
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        if not firebase_admin._apps:
            try:
                # Try to get credentials - production first, then local dev
                cred = self._get_firebase_credentials()
                firebase_admin.initialize_app(cred)
                print("✅ Firebase Admin SDK initialized successfully")
            except Exception as e:
                print(f"❌ Failed to initialize Firebase: {e}")
                raise
       
        # Set up emulator if specified
        if self.settings.FIREBASE_EMULATOR_HOST:
            os.environ["FIREBASE_AUTH_EMULATOR_HOST"] = self.settings.FIREBASE_EMULATOR_HOST
            print(f"🔧 Firebase Auth Emulator configured: {self.settings.FIREBASE_EMULATOR_HOST}")
    
    def _get_firebase_credentials(self):
        """Get Firebase credentials from environment - supports both production and local dev"""
        
        # Option 1: Production - JSON string in environment variable
        if self.settings.FIREBASE_SERVICE_ACCOUNT_JSON:
            try:
                service_account_info = json.loads(self.settings.FIREBASE_SERVICE_ACCOUNT_JSON)
                print("🚀 Using Firebase credentials from environment variable (Production mode)")
                return credentials.Certificate(service_account_info)
            except json.JSONDecodeError as e:
                print(f"❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON: {e}")
                raise
        
        # Option 2: Local development - file path
        elif self.settings.FIREBASE_CRED_PATH:
            if os.path.exists(self.settings.FIREBASE_CRED_PATH):
                print(f"🔧 Using Firebase credentials from file: {self.settings.FIREBASE_CRED_PATH}")
                return credentials.Certificate(self.settings.FIREBASE_CRED_PATH)
            else:
                raise FileNotFoundError(f"Firebase credentials file not found: {self.settings.FIREBASE_CRED_PATH}")
        
        # No credentials found
        else:
            raise ValueError(
                "No Firebase credentials found. Please set either:\n"
                "- FIREBASE_SERVICE_ACCOUNT_JSON (for production)\n"
                "- FIREBASE_CRED_PATH (for local development)"
            )
   
    @property
    def is_emulator_mode(self) -> bool:
        """Check if running in emulator mode"""
        return bool(self.settings.FIREBASE_EMULATOR_HOST)
    
    @property
    def is_production_mode(self) -> bool:
        """Check if running in production mode"""
        return bool(self.settings.FIREBASE_SERVICE_ACCOUNT_JSON)

# Initialize Firebase configuration
firebase_config = FirebaseConfig()