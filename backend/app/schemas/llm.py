from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class LLMModelBase(BaseModel):
    name: str
    provider: str
    model_name: str
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    is_active: bool = True
    parameters: Dict[str, Any] = {}

class LLMModelCreate(LLMModelBase):
    created_by: Optional[str] = None

class LLMModelResponse(LLMModelBase):
    id: int
    created_by: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True