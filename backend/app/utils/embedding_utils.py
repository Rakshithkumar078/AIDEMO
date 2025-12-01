from langchain_community.embeddings import OllamaEmbeddings
from chromadb import Documents, EmbeddingFunction, Embeddings
from app.core.config import settings
from typing import List
import logging

logger = logging.getLogger(__name__)

class ChromaOllamaEmbeddingFunction(EmbeddingFunction):
    def __init__(self):
        logger.info("Initializing ChromaOllamaEmbeddingFunction")
        self._model = OllamaEmbeddings(
            model=settings.ollama_embedding_model,
            base_url="http://localhost:11434"
        )

    def __call__(self, input: Documents) -> Embeddings:
        # ChromaDB calls this
        results = self._model.embed_documents(input)
        # Force conversion to list of lists of floats
        return [[float(x) for x in (r.tolist() if hasattr(r, 'tolist') else r)] for r in results]

    def embed_documents(self, input: List[str]) -> List[List[float]]:
        # DocumentProcessor calls this
        results = self._model.embed_documents(input)
        return [[float(x) for x in (r.tolist() if hasattr(r, 'tolist') else r)] for r in results]

    def name(self) -> str:
        return "ollama_embeddings"

# Renamed global variable to avoid stale state
_chroma_embedding_instance = None

def get_embeddings():
    """Get embedding function for ChromaDB"""
    global _chroma_embedding_instance
    if _chroma_embedding_instance is None:
        logger.info("Creating new embedding function instance")
        _chroma_embedding_instance = ChromaOllamaEmbeddingFunction()
    else:
        logger.info("Returning existing embedding function instance")
    return _chroma_embedding_instance