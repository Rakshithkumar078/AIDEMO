from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.document import Document
from app.schemas.document import DocumentCreate
from app.utils.storage import get_storage_service
from app.utils.file_utils import process_document
from app.services.vector_store import get_vector_store
import uuid
from typing import List, Optional

class DocumentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.storage = get_storage_service()
        self.vector_store = get_vector_store()
    
    async def upload_document(self, file_content: bytes, document: DocumentCreate) -> Document:
        # Generate unique file path
        file_id = str(uuid.uuid4())
        file_path = f"{file_id}_{document.filename}"
        
        # Store file
        await self.storage.store_file(file_path, file_content)
        
        # Process document and create embeddings
        chunks = await process_document(file_content, document.filename)
        collection_id = await self.vector_store.create_collection(file_id)
        await self.vector_store.add_documents(collection_id, chunks)
        
        # Save to database
        db_document = Document(
            filename=document.filename,
            file_path=file_path,
            file_size=len(file_content),
            uploader_id=document.uploader_id,
            storage_type=self.storage.storage_type,
            vector_collection_id=collection_id
        )
        self.db.add(db_document)
        await self.db.commit()
        await self.db.refresh(db_document)
        return db_document
    
    async def get_documents(self, skip: int = 0, limit: int = 100) -> List[Document]:
        result = await self.db.execute(
            select(Document).offset(skip).limit(limit)
        )
        return result.scalars().all()
    
    async def get_document(self, document_id: int) -> Optional[Document]:
        result = await self.db.execute(
            select(Document).where(Document.id == document_id)
        )
        return result.scalar_one_or_none()
    
    async def delete_document(self, document_id: int) -> bool:
        document = await self.get_document(document_id)
        if not document:
            return False
        
        # Delete from storage
        await self.storage.delete_file(document.file_path)
        
        # Delete from vector store
        if document.vector_collection_id:
            await self.vector_store.delete_collection(document.vector_collection_id)
        
        # Delete from database
        await self.db.delete(document)
        await self.db.commit()
        return True