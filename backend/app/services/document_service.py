from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentContentResponse, DocumentResponse
from app.schemas.processing_status import ProcessingStage
from app.utils.storage import get_storage_service
from app.utils.file_utils import extract_text_content
from app.services.enhanced_rag_service import EnhancedRAGService
from app.core.logger import logger
import uuid
import os
import asyncio
from typing import List, Optional

class DocumentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.storage = get_storage_service()
        self.rag_service = EnhancedRAGService()
    
    async def upload_document(self, file_content: bytes, document: DocumentCreate) -> DocumentResponse:
        # Generate unique file path
        file_id = str(uuid.uuid4())
        file_path = f"{file_id}_{document.filename}"
        
        # Store file
        await self.storage.store_file(file_path, file_content)
        
        # Save to database first to get document ID
        db_document = Document(
            filename=document.filename,
            file_path=file_path,
            file_size=document.file_size or len(file_content),
            uploader_id=document.uploader_id,
            storage_type=self.storage.storage_type,
            status=ProcessingStage.UPLOADING.value,
            processing_progress=0,
            processing_message="Upload completed, starting processing..."
        )
        self.db.add(db_document)
        await self.db.commit()
        await self.db.refresh(db_document)
        
        # Process document for RAG with proper transaction handling
        try:
            # Update status to processing
            db_document.status = ProcessingStage.PROCESSING.value
            db_document.processing_progress = 25
            db_document.processing_message = "Processing document..."
            await self.db.commit()
            
            # Save file temporarily for processing
            temp_path = f"workspace/temp/{file_path}"
            os.makedirs(os.path.dirname(temp_path), exist_ok=True)
            with open(temp_path, "wb") as f:
                f.write(file_content)
            
            logger.info(f"Starting RAG processing for document {db_document.id}")
            
            # Update status to embedding
            db_document.status = ProcessingStage.EMBEDDING.value
            db_document.processing_progress = 75
            db_document.processing_message = "Generating embeddings..."
            await self.db.commit()
            
            # Run blocking RAG processing in a separate thread
            loop = asyncio.get_running_loop()
            await loop.run_in_executor(
                None,
                self.rag_service.process_document,
                temp_path,
                db_document.id
            )
            
            # Clean up temp file
            os.remove(temp_path)
            
            # Update status to completed
            db_document.status = ProcessingStage.COMPLETED.value
            db_document.processing_progress = 100
            db_document.processing_message = "Document processed successfully"
            await self.db.commit()
            
            logger.info(f"RAG processing completed for document {db_document.id}")
            
        except Exception as e:
            logger.error(f"RAG processing failed for document {db_document.id}: {e}")
            # Update status to error but keep document in database
            try:
                db_document.status = ProcessingStage.ERROR.value
                db_document.processing_error = str(e)
                db_document.processing_message = "Processing failed"
                await self.db.commit()
            except Exception as commit_error:
                logger.error(f"Failed to update error status for document {db_document.id}: {commit_error}")

        return DocumentResponse.from_db_model(db_document)
    
    async def get_documents(self, skip: int = 0, limit: int = 100) -> List[DocumentResponse]:
        result = await self.db.execute(
            select(Document).offset(skip).limit(limit)
        )
        documents = result.scalars().all()
        return [DocumentResponse.from_db_model(doc) for doc in documents]
    
    async def get_document(self, document_id: int) -> Optional[Document]:
        result = await self.db.execute(
            select(Document).where(Document.id == document_id)
        )
        return result.scalar_one_or_none()
    
    async def get_document_content(self, document_id: int) -> Optional[DocumentContentResponse]:
        document = await self.get_document(document_id)
        if not document:
            return None
        
        try:
            # Get file content from storage
            file_content = await self.storage.get_file(document.file_path)
            
            # Extract text content
            text_content = await extract_text_content(file_content, document.filename)
            
            return DocumentContentResponse(
                content=text_content,
                metadata={
                    "name": document.filename,
                    "file_size": document.file_size,
                    "file_type": document.filename.split('.')[-1].upper() if '.' in document.filename else 'UNKNOWN',
                    "upload_date": document.uploaded_at.isoformat()
                }
            )
        except Exception as e:
            return DocumentContentResponse(
                content=f"Error reading document content: {str(e)}",
                metadata={
                    "name": document.filename,
                    "file_size": document.file_size,
                    "file_type": document.filename.split('.')[-1].upper() if '.' in document.filename else 'UNKNOWN',
                    "upload_date": document.uploaded_at.isoformat()
                }
            )
    
    async def delete_document(self, document_id: int) -> bool:
        document = await self.get_document(document_id)
        if not document:
            return False
        
        try:
            # Delete from storage
            await self.storage.delete_file(document.file_path)
        except Exception:
            pass  # Continue even if file deletion fails
        
        try:
            # Delete from RAG vector store
            logger.info(f"Deleting document {document_id} from RAG vector store")
            self.rag_service.delete_document(document_id)
        except Exception as e:
            logger.error(f"Failed to delete document {document_id} from vector store: {e}")
        
        # Delete from database
        await self.db.delete(document)
        await self.db.commit()
        return True
    
    async def get_document_file(self, document_id: int):
        document = await self.get_document(document_id)
        if not document:
            return None
        
        try:
            file_content = await self.storage.get_file(document.file_path)
            
            # Determine content type based on file extension
            file_ext = document.filename.lower().split('.')[-1]
            content_type_map = {
                'pdf': 'application/pdf',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif',
                'txt': 'text/plain',
                'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'doc': 'application/msword'
            }
            
            content_type = content_type_map.get(file_ext, 'application/octet-stream')
            return file_content, content_type
        except FileNotFoundError:
            print(f"File not found: {document.file_path}")
            return None
        except Exception as e:
            print(f"Error reading file: {e}")
            return None