from sqlalchemy import Column, Integer, String, DateTime, BigInteger, Enum
from sqlalchemy.sql import func
from app.core.database import Base
from app.schemas.processing_status import ProcessingStage

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(BigInteger, nullable=False)
    uploader_id = Column(String, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    storage_type = Column(String, default="local")
    vector_collection_id = Column(String, nullable=True)
    status = Column(Enum(ProcessingStage, values_callable=lambda obj: [e.value for e in obj]), 
                   default=ProcessingStage.UPLOADING.value)
    processing_progress = Column(Integer, default=0)
    processing_message = Column(String, default="Starting upload...")
    processing_error = Column(String, nullable=True)
    
    # Properties for frontend compatibility
    @property
    def name(self) -> str:
        return self.filename
    
    @property
    def file_type(self) -> str:
        return self.filename.split('.')[-1].upper() if '.' in self.filename else 'UNKNOWN'
    
    @property
    def uploaded_by(self) -> str:
        return self.uploader_id or 'Anonymous'
    
    @property
    def upload_date(self) -> str:
        return self.uploaded_at.isoformat() if self.uploaded_at else ''