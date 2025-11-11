from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://postgres:password@localhost:5432/aidemo"
    chroma_db_path: str = "./workspace/chromadb"
    storage_type: str = "local"
    storage_path: str = "./workspace/documents"
    grok_api_key: Optional[str] = None
    aws_bucket_name: Optional[str] = None
    aws_region: str = "us-east-1"
    azure_connection_string: Optional[str] = None
    environment: str = "development"
    debug: bool = True
    
    class Config:
        env_file = ".env"

settings = Settings()