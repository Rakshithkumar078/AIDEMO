from typing import List, Any, Dict
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_community.document_loaders import Docx2txtLoader
import numpy as np
import faiss
import pickle
import os
from pathlib import Path

class DocumentProcessor:
    def __init__(self, embedding_model: str = "all-MiniLM-L6-v2", chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.model = SentenceTransformer(embedding_model)
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
    
    def load_document(self, file_path: str) -> List[Any]:
        """Load document based on file type"""
        file_ext = Path(file_path).suffix.lower()
        
        if file_ext == '.pdf':
            loader = PyPDFLoader(file_path)
        elif file_ext == '.txt':
            loader = TextLoader(file_path)
        elif file_ext in ['.docx', '.doc']:
            loader = Docx2txtLoader(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_ext}")
        
        return loader.load()
    
    def chunk_documents(self, documents: List[Any]) -> List[Any]:
        """Split documents into chunks"""
        chunks = self.splitter.split_documents(documents)
        return chunks
    
    def embed_chunks(self, chunks: List[Any]) -> np.ndarray:
        """Generate embeddings for chunks"""
        texts = [chunk.page_content for chunk in chunks]
        embeddings = self.model.encode(texts)
        return embeddings.astype('float32')
    
    def process_document(self, file_path: str, document_id: int) -> Dict[str, Any]:
        """Complete document processing pipeline"""
        # Load document
        documents = self.load_document(file_path)
        
        # Chunk documents
        chunks = self.chunk_documents(documents)
        
        # Generate embeddings
        embeddings = self.embed_chunks(chunks)
        
        # Prepare metadata
        metadata = []
        for i, chunk in enumerate(chunks):
            metadata.append({
                "text": chunk.page_content,
                "document_id": document_id,
                "chunk_id": i,
                "source": file_path
            })
        
        return {
            "embeddings": embeddings,
            "metadata": metadata,
            "chunk_count": len(chunks)
        }