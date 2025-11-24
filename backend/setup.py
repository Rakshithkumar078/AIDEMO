#!/usr/bin/env python3
"""
Setup script for AIDEMO Backend
"""
import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings
from app.core.database import Base
from app.models import document, chat, llm
from app.services.llm_service import LLMService
from app.schemas.llm import LLMModelCreate

async def create_tables():
    """Create database tables"""
    engine = create_async_engine(settings.database_url)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await engine.dispose()

async def create_default_llm_model():
    """Create a default GROK model"""
    from app.core.database import AsyncSessionLocal
    
    async with AsyncSessionLocal() as db:
        service = LLMService(db)
        
        # Check if any models exist
        models = await service.get_models(active_only=False)
        if not models:
            default_model = LLMModelCreate(
                name="GROK Beta",
                provider="openai",
                model_name="grok-beta",
                api_key=settings.groq_api_key,
                base_url="https://api.x.ai/v1",
                is_active=True,
                parameters={
                    "temperature": 0.7,
                    "max_tokens": 1000
                },
                created_by="system"
            )
            await service.create_model(default_model)
            print("Created default GROK model")

async def setup():
    """Run setup tasks"""
    print("Setting up AIDEMO Backend...")
    
    # Create directories
    os.makedirs(settings.storage_path, exist_ok=True)
    os.makedirs(settings.chroma_db_path, exist_ok=True)
    os.makedirs("workspace/temp", exist_ok=True)
    
    # Create database tables
    await create_tables()
    print("Database tables created")
    
    # Create default LLM model
    await create_default_llm_model()
    
    print("Setup completed!")

if __name__ == "__main__":
    asyncio.run(setup())