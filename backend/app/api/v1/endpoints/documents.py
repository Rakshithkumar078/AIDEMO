from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.document_service import DocumentService
from app.schemas.document import DocumentCreate, DocumentResponse, DocumentContentResponse
from app.schemas.processing_status import ProcessingStatus
from typing import List

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    uploaded_by: str = Form("Anonymous"),
    db: AsyncSession = Depends(get_db)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    content = await file.read()
    document_create = DocumentCreate(
        filename=file.filename,
        uploader_id=uploaded_by,
        file_size=len(content)
    )
    
    service = DocumentService(db)
    document = await service.upload_document(content, document_create)
    return document

@router.get("/", response_model=List[DocumentResponse])
async def get_documents(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    service = DocumentService(db)
    documents = await service.get_documents(skip=skip, limit=limit)
    return documents

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: int,
    db: AsyncSession = Depends(get_db)
):
    service = DocumentService(db)
    document = await service.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@router.get("/{document_id}/content", response_model=DocumentContentResponse)
async def get_document_content(
    document_id: int,
    db: AsyncSession = Depends(get_db)
):
    service = DocumentService(db)
    content_response = await service.get_document_content(document_id)
    if not content_response:
        raise HTTPException(status_code=404, detail="Document not found")
    return content_response

@router.get("/{document_id}/preview")
async def preview_document(
    document_id: int,
    db: AsyncSession = Depends(get_db)
):
    from fastapi.responses import Response
    service = DocumentService(db)
    file_data = await service.get_document_file(document_id)
    if not file_data:
        raise HTTPException(status_code=404, detail="Document not found")
    
    content, content_type = file_data
    return Response(content=content, media_type=content_type)

@router.get("/{document_id}/status", response_model=ProcessingStatus)
async def get_document_status(
    document_id: int,
    db: AsyncSession = Depends(get_db)
):
    service = DocumentService(db)
    document = await service.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Return current status based on document state
    return ProcessingStatus(
        id=document.id,
        status=document.status,
        progress=float(document.processing_progress),
        message=document.processing_message,
        error=document.processing_error
    )

@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    db: AsyncSession = Depends(get_db)
):
    service = DocumentService(db)
    success = await service.delete_document(document_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document deleted successfully"}