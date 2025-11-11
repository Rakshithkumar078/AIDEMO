from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentBase(BaseModel):
    filename: str
    uploader_id: Optional[str] = None

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    id: int
    file_path: str
    file_size: int
    uploaded_at: datetime
    storage_type: str
    vector_collection_id: Optional[str] = None
    
    class Config:
        from_attributes = True