from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import app.core.config  # To trigger Firebase init
from app.api import auth, user, journal, progress
from app.core.database import init_postgres_db
# from app.models.user import UserProfileModel
# from app.models.learning import LearningJournalEntryModel, LearningProgressModel
import logging

app = FastAPI(title="Nuroki FastAPI with Firebase Auth", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://localhost:5173",  # Vite dev server
        "http://localhost:8080",  # Alternative frontend port
        "https://your-frontend-domain.com",  # Replace with actual frontend domain
        "https://your-frontend-domain.netlify.app",  # If using Netlify
        "https://your-frontend-domain.vercel.app",  # If using Vercel
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(user.router, prefix="/api/user", tags=["user"])
app.include_router(journal.router, prefix="/journal", tags=["journals"])
app.include_router(progress.router, prefix="/progress", tags=["progress"])

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

# Add to your endpoint file
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Initialize databases on startup"""
    await init_postgres_db()

# Optional: root endpoint for health check
@app.get("/")
async def root():
    return {"message": "Nuroki FastAPI running"}

# Health check endpoint for load balancer
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "nuroki-api"}