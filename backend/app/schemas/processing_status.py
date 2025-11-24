from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class ProcessingStage(str, Enum):
    UPLOADING = "uploading"
    PROCESSING = "processing"
    EMBEDDING = "embedding"
    COMPLETED = "completed"
    ERROR = "error"

class ProcessingStatus(BaseModel):
    id: int
    status: ProcessingStage
    progress: float
    message: str
    error: Optional[str] = None
    estimated_completion: Optional[datetime] = None

    class Config:
        from_attributes = True