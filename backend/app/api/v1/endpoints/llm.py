from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.llm_service import LLMService
from app.schemas.llm import LLMModelCreate, LLMModelResponse
from typing import List, Dict, Any

router = APIRouter()

@router.get("/models", response_model=List[LLMModelResponse])
async def get_llm_models(
    active_only: bool = True,
    db: AsyncSession = Depends(get_db)
):
    service = LLMService(db)
    models = await service.get_models(active_only=active_only)
    return models

@router.post("/models", response_model=LLMModelResponse)
async def create_llm_model(
    model: LLMModelCreate,
    db: AsyncSession = Depends(get_db)
):
    service = LLMService(db)
    db_model = await service.create_model(model)
    return db_model

@router.put("/models/{model_id}", response_model=LLMModelResponse)
async def update_llm_model(
    model_id: int,
    model_data: Dict[str, Any],
    db: AsyncSession = Depends(get_db)
):
    service = LLMService(db)
    updated_model = await service.update_model(model_id, model_data)
    if not updated_model:
        raise HTTPException(status_code=404, detail="Model not found")
    return updated_model