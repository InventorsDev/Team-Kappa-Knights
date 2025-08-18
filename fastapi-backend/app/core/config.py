import os
import json
import boto3
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
import firebase_admin
from firebase_admin import credentials

# Load .env for local development
load_dotenv()

class Settings(BaseSettings):
    # App settings
    app_name: str = "FastAPI Firebase Auth"
    debug: bool = True
   
    # Database URLs
    POSTGRES_URL: str | None = Field(None, env="POSTGRES_URL")
   
    # Firebase settings
    FIREBASE_CRED_PATH: str | None = Field(None, env="FIREBASE_CRED_PATH")  # Local dev
    FIREBASE_SERVICE_ACCOUNT_JSON: str | None = Field(None, env="FIREBASE_SERVICE_ACCOUNT_JSON")  # Local env override
    FIREBASE_EMULATOR_HOST: str | None = Field(None, env="FIREBASE_EMULATOR_HOST")
    FIREBASE_EMULATOR_Link: str | None = Field(None, env="FIREBASE_EMULATOR_Link")  
    FIREBASE_WEB_API_KEY: str | None = Field(None, env="FIREBASE_WEB_API_KEY")
    
    # AWS settings
    AWS_REGION: str = Field("us-east-1", env="AWS_REGION")
    USE_AWS_PARAMETER_STORE: bool = Field(False, env="USE_AWS_PARAMETER_STORE")
   
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Load from AWS Parameter Store if enabled
        if self.USE_AWS_PARAMETER_STORE:
            self._load_from_parameter_store()
    
    def _load_from_parameter_store(self):
        """Load configuration from AWS Systems Manager Parameter Store"""
        try:
            ssm = boto3.client('ssm', region_name=self.AWS_REGION)
            
            # Fetch parameters
            parameters = ssm.get_parameters(
                Names=[
                    '/neuroki/firebase/service-account-json',
                    '/neuroki/firebase/web-api-key',
                    '/neuroki/postgres/url'
                ],
                WithDecryption=True
            )
            
            # Map parameters to settings
            for param in parameters['Parameters']:
                if param['Name'] == '/neuroki/firebase/service-account-json':
                    self.FIREBASE_SERVICE_ACCOUNT_JSON = param['Value']
                elif param['Name'] == '/neuroki/firebase/web-api-key':
                    self.FIREBASE_WEB_API_KEY = param['Value']
                elif param['Name'] == '/neuroki/postgres/url':
                    self.POSTGRES_URL = param['Value']
            
            print("✅ Configuration loaded from AWS Parameter Store")
            
        except Exception as e:
            print(f"❌ Failed to load from Parameter Store: {e}")
            print("Falling back to environment variables...")

settings = Settings()

class FirebaseConfig:
    def __init__(self):
        self.settings = settings
        self._initialize_firebase()
   
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        if not firebase_admin._apps:
            try:
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
        """Get Firebase credentials from various sources"""
        
        # Option 1: JSON string from Parameter Store or environment
        if self.settings.FIREBASE_SERVICE_ACCOUNT_JSON:
            try:
                service_account_info = json.loads(self.settings.FIREBASE_SERVICE_ACCOUNT_JSON)
                print("🚀 Using Firebase credentials from Parameter Store/Environment")
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
                "- AWS Parameter Store parameters (for production)\n"
                "- FIREBASE_SERVICE_ACCOUNT_JSON (environment variable)\n"
                "- FIREBASE_CRED_PATH (for local development)"
            )
   
    @property
    def is_emulator_mode(self) -> bool:
        """Check if running in emulator mode"""
        return bool(self.settings.FIREBASE_EMULATOR_HOST)
    
    @property
    def is_production_mode(self) -> bool:
        """Check if running with Parameter Store"""
        return self.settings.USE_AWS_PARAMETER_STORE

# Initialize Firebase configuration
firebase_config = FirebaseConfig()