from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ChatMessageBase(BaseModel):
    user_message: str
    session_id: Optional[str] = None

class ChatMessageCreate(ChatMessageBase):
    model_id: Optional[int] = None

class ChatMessageResponse(BaseModel):
    id: int
    session_id: Optional[str]
    user_message: str
    ai_response: str
    timestamp: datetime
    model_used: str
    
    class Config:
        from_attributes = True