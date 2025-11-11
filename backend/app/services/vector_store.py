import chromadb
from chromadb.config import Settings
from app.core.config import settings
from app.utils.embedding_utils import get_embeddings
from typing import List, Dict, Any
import os

class VectorStore:
    def __init__(self):
        os.makedirs(settings.chroma_db_path, exist_ok=True)
        self.client = chromadb.PersistentClient(
            path=settings.chroma_db_path,
            settings=Settings(anonymized_telemetry=False)
        )
        self.embedding_function = get_embeddings()
    
    async def create_collection(self, collection_name: str) -> str:
        collection = self.client.create_collection(
            name=collection_name,
            embedding_function=self.embedding_function
        )
        return collection_name
    
    async def add_documents(self, collection_name: str, documents: List[Dict[str, Any]]):
        collection = self.client.get_collection(collection_name)
        
        texts = [doc["content"] for doc in documents]
        metadatas = [{"chunk_id": i, **doc.get("metadata", {})} for i, doc in enumerate(documents)]
        ids = [f"{collection_name}_{i}" for i in range(len(documents))]
        
        collection.add(
            documents=texts,
            metadatas=metadatas,
            ids=ids
        )
    
    async def search(self, collection_name: str, query: str, n_results: int = 5) -> List[Dict[str, Any]]:
        try:
            collection = self.client.get_collection(collection_name)
            results = collection.query(
                query_texts=[query],
                n_results=n_results
            )
            
            return [
                {
                    "content": doc,
                    "metadata": meta,
                    "distance": dist
                }
                for doc, meta, dist in zip(
                    results["documents"][0],
                    results["metadatas"][0],
                    results["distances"][0]
                )
            ]
        except Exception:
            return []
    
    async def delete_collection(self, collection_name: str):
        try:
            self.client.delete_collection(collection_name)
        except Exception:
            pass

_vector_store = None

def get_vector_store() -> VectorStore:
    global _vector_store
    if _vector_store is None:
        _vector_store = VectorStore()
    return _vector_store