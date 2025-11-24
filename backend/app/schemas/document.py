from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentBase(BaseModel):
    filename: str
    uploader_id: Optional[str] = None

class DocumentCreate(DocumentBase):
    file_size: Optional[int] = None

class DocumentResponse(BaseModel):
    id: int
    name: str
    file_size: int
    file_type: str
    uploaded_by: str
    upload_date: str
    file_path: str
    storage_type: str
    vector_collection_id: Optional[str] = None
    
    @classmethod
    def from_db_model(cls, document):
        return cls(
            id=document.id,
            name=document.filename,
            file_size=document.file_size,
            file_type=document.filename.split('.')[-1].upper() if '.' in document.filename else 'UNKNOWN',
            uploaded_by=document.uploader_id or 'Anonymous',
            upload_date=document.uploaded_at.isoformat(),
            file_path=document.file_path,
            storage_type=document.storage_type,
            vector_collection_id=document.vector_collection_id
        )
    
    class Config:
        from_attributes = True

class DocumentContentResponse(BaseModel):
    content: str
    metadata: dict
    
    class Config:
        from_attributes = True