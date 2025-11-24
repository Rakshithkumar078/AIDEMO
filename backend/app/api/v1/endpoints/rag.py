from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.enhanced_rag_service import EnhancedRAGService
from typing import Dict, Any, List

router = APIRouter()

@router.get("/stats")
async def get_rag_stats(db: AsyncSession = Depends(get_db)) -> Dict[str, Any]:
    """Get RAG service statistics"""
    rag_service = EnhancedRAGService()
    return rag_service.get_stats()

@router.post("/search")
async def search_documents(
    query: str,
    top_k: int = 5,
    db: AsyncSession = Depends(get_db)
) -> List[Dict[str, Any]]:
    """Search for relevant documents"""
    rag_service = EnhancedRAGService()
    return rag_service.search_documents(query, top_k)

@router.post("/generate")
async def generate_response(
    query: str,
    top_k: int = 5,
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """Generate RAG response with citations"""
    rag_service = EnhancedRAGService()
    return rag_service.generate_response(query, top_k)