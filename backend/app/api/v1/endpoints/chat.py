from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.chat import ChatMessage
from app.schemas.chat import ChatMessageCreate, ChatMessageResponse
from app.services.enhanced_rag_service import EnhancedRAGService
from app.core.logger import logger
from typing import List, Optional
import json
import asyncio

router = APIRouter()

@router.post("/stream")
async def stream_chat(
    message: ChatMessageCreate,
    db: AsyncSession = Depends(get_db)
):
    async def generate_stream():
        try:
            logger.info(f"Starting streaming chat for message: {message.user_message[:100]}...")
            # Use enhanced RAG service with streaming
            rag_service = EnhancedRAGService()
            
            async for chunk in rag_service.stream_response(message.user_message, top_k=5):
                yield f"data: {json.dumps(chunk)}\n\n"
            
            logger.info("Streaming chat completed successfully")
        except Exception as e:
            logger.error(f"Streaming chat failed: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        generate_stream(),
        media_type="text/plain",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )

@router.post("/messages", response_model=ChatMessageResponse)
async def create_chat_message(
    message: ChatMessageCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        logger.info(f"Processing chat message: {message.user_message[:100]}...")
        # Use enhanced RAG service
        rag_service = EnhancedRAGService()
        result = rag_service.generate_response(message.user_message, top_k=5)
        response = result["answer"]
        logger.info("Chat message processed successfully")
        
        # Save chat message
        chat_message = ChatMessage(
            session_id=message.session_id,
            user_message=message.user_message,
            ai_response=response,
            model_used="groq/llama-3.1-8b-instant"
        )
        db.add(chat_message)
        await db.commit()
        await db.refresh(chat_message)
        
        return chat_message
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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