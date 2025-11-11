from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.services.rag_service import RAGService
from app.models.chat import ChatMessage
from app.schemas.chat import ChatMessageCreate, ChatMessageResponse
from typing import List, Optional

router = APIRouter()

@router.post("/messages", response_model=ChatMessageResponse)
async def create_chat_message(
    message: ChatMessageCreate,
    db: AsyncSession = Depends(get_db)
):
    # Use default model if none specified
    model_id = message.model_id or 1
    
    service = RAGService(db)
    try:
        chat_message = await service.generate_rag_response(
            query=message.user_message,
            model_id=model_id,
            session_id=message.session_id
        )
        return chat_message
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate response")

@router.get("/messages", response_model=List[ChatMessageResponse])
async def get_chat_messages(
    session_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    query = select(ChatMessage).offset(skip).limit(limit).order_by(ChatMessage.timestamp.desc())
    
    if session_id:
        query = query.where(ChatMessage.session_id == session_id)
    
    result = await db.execute(query)
    messages = result.scalars().all()
    return messages