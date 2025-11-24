from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://postgres:password@localhost:5432/aidemo"
    chroma_db_path: str = "./workspace/chromadb"
    storage_type: str = "local"
    storage_path: str = "./workspace/documents"
    local_llm_model: str = "llama2"
    local_llm_provider: str = "ollama"
    aws_bucket_name: Optional[str] = None
    aws_region: str = "us-east-1"
    aws_bedrock_model: Optional[str] = None
    aws_bedrock_enabled: bool = False
    azure_connection_string: Optional[str] = None
    environment: str = "development"
    debug: bool = True
    
    class Config:
        env_file = ".env"

settings = Settings()