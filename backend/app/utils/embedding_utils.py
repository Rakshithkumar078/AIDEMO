from sentence_transformers import SentenceTransformer
import chromadb.utils.embedding_functions as embedding_functions

_embedding_model = None

def get_embeddings():
    """Get embedding function for ChromaDB"""
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
    return _embedding_model

def get_sentence_transformer():
    """Get SentenceTransformer model for direct use"""
    return SentenceTransformer('all-MiniLM-L6-v2')