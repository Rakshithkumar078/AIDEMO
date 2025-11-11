from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.document import Document
from app.models.chat import ChatMessage
from app.services.vector_store import get_vector_store
from app.services.llm_service import LLMService
from typing import List, Dict, Any

class RAGService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.vector_store = get_vector_store()
        self.llm_service = LLMService(db)
    
    async def search_documents(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        # Get all document collections
        result = await self.db.execute(
            select(Document).where(Document.vector_collection_id.isnot(None))
        )
        documents = result.scalars().all()
        
        all_results = []
        for doc in documents:
            results = await self.vector_store.search(
                doc.vector_collection_id, query, n_results=2
            )
            for result in results:
                result["document_id"] = doc.id
                result["filename"] = doc.filename
            all_results.extend(results)
        
        # Sort by relevance and return top results
        all_results.sort(key=lambda x: x.get("distance", 1.0))
        return all_results[:limit]
    
    async def generate_rag_response(
        self, 
        query: str, 
        model_id: int,
        session_id: str = None
    ) -> ChatMessage:
        # Search for relevant documents
        context_docs = await self.search_documents(query)
        
        # Build context
        context = "\n\n".join([
            f"From {doc['filename']}: {doc['content']}"
            for doc in context_docs
        ])
        
        # Create messages for LLM
        messages = [
            {
                "role": "system",
                "content": "You are a helpful assistant. Use the provided context to answer questions. If the context doesn't contain relevant information, say so."
            },
            {
                "role": "user", 
                "content": f"Context:\n{context}\n\nQuestion: {query}"
            }
        ]
        
        # Generate response
        response = await self.llm_service.generate_response(model_id, messages)
        
        # Get model name
        model = await self.llm_service.get_model(model_id)
        model_name = f"{model.provider}/{model.model_name}" if model else "unknown"
        
        # Save chat message
        chat_message = ChatMessage(
            session_id=session_id,
            user_message=query,
            ai_response=response,
            model_used=model_name
        )
        self.db.add(chat_message)
        await self.db.commit()
        await self.db.refresh(chat_message)
        
        return chat_message