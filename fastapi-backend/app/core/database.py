from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from app.core.config import settings

# PostgreSQL connection for user management, permissions, metadata
POSTGRES_URL = settings.POSTGRES_URL
ASYNC_POSTGRES_URL = settings.POSTGRES_URL.replace("postgresql://", "postgresql+asyncpg://")

# Sync engine for migrations
sync_engine = create_engine(POSTGRES_URL, pool_size=10, max_overflow=20, pool_pre_ping=True, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)

# Async engine for FastAPI
async_engine = create_async_engine(ASYNC_POSTGRES_URL)
AsyncSessionLocal = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

async def init_postgres_db():
    """Initialize PostgreSQL database"""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_postgres_db():
    """Dependency to get PostgreSQL database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()