import chromadb
from chromadb.config import Settings
from typing import List, Dict, Any
from app.utils.embedding_utils import get_embeddings
from app.core.config import settings

class VectorService:
    def __init__(self, persist_dir: str = None):
        if persist_dir is None:
            persist_dir = settings.chroma_db_path
            
        self.client = chromadb.PersistentClient(path=persist_dir)
        # Use the Ollama embedding function for the collection
        self.embedding_function = get_embeddings()
        self.collection = self.client.get_or_create_collection(
            name="documents_ollama",
            embedding_function=self.embedding_function
        )
    
    def add_document_vectors(self, embeddings: List[List[float]], metadata: List[Dict[str, Any]]):
        """Add document vectors to ChromaDB"""
        texts = [meta["text"] for meta in metadata]
        ids = [f"{meta['document_id']}_{meta['chunk_id']}" for meta in metadata]
        
        # ChromaDB expects embeddings as list of lists, which OllamaEmbeddings provides
        self.collection.add(
            embeddings=embeddings,
            documents=texts,
            metadatas=metadata,
            ids=ids
        )
    
    def search(self, query: str, top_k: int = 5, metadata_filter: dict = None) -> List[Dict[str, Any]]:
        """Search for similar documents with optional metadata filtering"""
        query_args = {
            "query_texts": [query],
            "n_results": top_k
        }
        if metadata_filter:
            query_args["where"] = metadata_filter
            
        results = self.collection.query(**query_args)

        formatted_results = []
        if results['documents']:
            for i, (doc, meta, distance) in enumerate(zip(
                results['documents'][0],
                results['metadatas'][0], 
                results['distances'][0]
            )):
                result = meta.copy()
                result["text"] = doc
                result["distance"] = distance
                result["rank"] = i + 1
                formatted_results.append(result)

        return formatted_results
    
    def delete_document_vectors(self, document_id: int):
        """Remove vectors for a specific document"""
        results = self.collection.get(where={"document_id": document_id})
        if results['ids']:
            self.collection.delete(ids=results['ids'])
    
    def get_stats(self) -> Dict[str, Any]:
        """Get vector store statistics"""
        count = self.collection.count()
        # Note: Dimension check might need an actual embedding if not stored in metadata
        # For now, we assume the configured model's dimension
        return {
            "total_vectors": count,
            "total_documents": len(set(meta.get("document_id", 0) for meta in self.collection.get()['metadatas'])) if count > 0 else 0,
            "embedding_model": settings.ollama_embedding_model
        }