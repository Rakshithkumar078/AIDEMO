import aiofiles
import os
from abc import ABC, abstractmethod
from app.core.config import settings
import boto3
from azure.storage.blob.aio import BlobServiceClient

class StorageService(ABC):
    @abstractmethod
    async def store_file(self, file_path: str, content: bytes) -> str:
        pass
    
    @abstractmethod
    async def get_file(self, file_path: str) -> bytes:
        pass
    
    @abstractmethod
    async def delete_file(self, file_path: str) -> bool:
        pass
    
    @property
    @abstractmethod
    def storage_type(self) -> str:
        pass

class LocalStorageService(StorageService):
    def __init__(self, base_path: str):
        self.base_path = base_path
        os.makedirs(base_path, exist_ok=True)
    
    async def store_file(self, file_path: str, content: bytes) -> str:
        full_path = os.path.join(self.base_path, file_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        async with aiofiles.open(full_path, 'wb') as f:
            await f.write(content)
        return file_path
    
    async def get_file(self, file_path: str) -> bytes:
        full_path = os.path.join(self.base_path, file_path)
        async with aiofiles.open(full_path, 'rb') as f:
            return await f.read()
    
    async def delete_file(self, file_path: str) -> bool:
        try:
            full_path = os.path.join(self.base_path, file_path)
            os.remove(full_path)
            return True
        except:
            return False
    
    @property
    def storage_type(self) -> str:
        return "local"

class S3StorageService(StorageService):
    def __init__(self, bucket_name: str, region: str):
        self.bucket_name = bucket_name
        self.s3_client = boto3.client('s3', region_name=region)
    
    async def store_file(self, file_path: str, content: bytes) -> str:
        self.s3_client.put_object(
            Bucket=self.bucket_name,
            Key=file_path,
            Body=content
        )
        return file_path
    
    async def get_file(self, file_path: str) -> bytes:
        response = self.s3_client.get_object(
            Bucket=self.bucket_name,
            Key=file_path
        )
        return response['Body'].read()
    
    async def delete_file(self, file_path: str) -> bool:
        try:
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=file_path
            )
            return True
        except:
            return False
    
    @property
    def storage_type(self) -> str:
        return "s3"

_storage_service = None

def get_storage_service() -> StorageService:
    global _storage_service
    if _storage_service is None:
        if settings.storage_type == "local":
            _storage_service = LocalStorageService(settings.storage_path)
        elif settings.storage_type == "s3":
            _storage_service = S3StorageService(
                settings.aws_bucket_name, 
                settings.aws_region
            )
        else:
            _storage_service = LocalStorageService(settings.storage_path)
    
    return _storage_service