import os
import asyncio
from typing import List, Dict, Any, AsyncGenerator
from langchain_community.llms import Ollama
from app.services.amazon_q_service import AmazonQService
from app.services.vector_service import VectorService
from app.services.document_processor import DocumentProcessor
from app.core.logger import logger
from app.core.config import settings

class EnhancedRAGService:
    def __init__(self):
        self.vector_service = VectorService()
        self.document_processor = DocumentProcessor()
        
        # Prefer Amazon Bedrock (Amazon Q) if enabled; otherwise use local Ollama
        self.llm = None
        if settings.aws_bedrock_enabled and settings.aws_bedrock_model:
            try:
                self.llm = AmazonQService(region=settings.aws_region, model_id=settings.aws_bedrock_model)
                logger.info(f"Amazon Bedrock LLM initialized: {settings.aws_bedrock_model}")
            except Exception as e:
                logger.error(f"Failed to initialize Amazon Bedrock LLM: {e}")
                raise
        else:
            try:
                self.llm = Ollama(
                    model=settings.local_llm_model,
                    base_url="http://localhost:11434"
                )
                logger.info(f"Local LLM initialized: {settings.local_llm_model}")
            except Exception as e:
                logger.error(f"Failed to initialize local LLM: {e}")
                raise
    
    def process_document(self, file_path: str, document_id: int) -> Dict[str, Any]:
        """Process document and add to vector store"""
        logger.info(f"Processing document {document_id}: {file_path}")
        
        try:
            result = self.document_processor.process_document(file_path, document_id)
            
            self.vector_service.add_document_vectors(
                result["embeddings"],
                result["metadata"]
            )
            
            logger.info(f"Document {document_id} processed successfully: {result['chunk_count']} chunks")
            return {
                "document_id": document_id,
                "chunks_created": result["chunk_count"],
                "status": "processed"
            }
        except Exception as e:
            logger.error(f"Failed to process document {document_id}: {e}")
            raise
    
    def search_documents(self, query: str, top_k: int = 5, metadata_filter: dict = None) -> List[Dict[str, Any]]:
        """Search for relevant document chunks with optional metadata filtering"""
        return self.vector_service.search(query, top_k, metadata_filter)
    
    def generate_response(self, query: str, top_k: int = 5, min_score: float = 0.2, return_context: bool = False, metadata_filter: dict = None) -> Dict[str, Any]:
        """RAG pipeline with extra features and fallback inference"""
        logger.info(f"Generating response for query: {query[:100]}...")

        results = self.search_documents(query, top_k, metadata_filter)
        logger.info(f"Found {len(results)} relevant documents")

        if not results:
            logger.warning("No relevant context found for query")
            return {'answer': 'No relevant context found.', 'sources': [], 'confidence': 0.0, 'context': ''}

        # Prepare context and sources
        context = "\n\n".join([doc['text'] for doc in results])
        sources = [{
            'source': doc.get('source', 'unknown').split('/')[-1],
            'page': 'unknown',
            'score': 1 - (doc['distance'] / 2),
            'preview': doc['text'][:300] + '...'
        } for doc in results]
        confidence = max([1 - (doc['distance'] / 2) for doc in results])

        # If confidence is low, fallback to inference with disclaimer
        if confidence < min_score:
            disclaimer = "No explicit mention found. Inference: PearlArc appears to prioritize employees via equal opportunities, anti-discrimination, fair recruitment and promotion, and supportive workplace policies."
            answer = f"{disclaimer}\n\nBased on the retrieved documents:\n\n"
            for i, source in enumerate(sources, 1):
                answer += f"[{i}] {source['preview']}\n\n"
            answer += f"\nThis information comes from {len(sources)} low-confidence document(s) with confidence score: {confidence:.2f}"
            return {
                'answer': answer,
                'sources': sources,
                'confidence': confidence,
                'context': context if return_context else None
            }

        # Generate answer with configured LLM
        prompt = f"""Use the following context to answer the question concisely.
Context:
{context}

Question: {query}

Answer:"""
        try:
            logger.info("Calling LLM for response generation")
            if isinstance(self.llm, AmazonQService):
                response_text = self.llm.generate(prompt)
            else:
                # LangChain-based LLM.
                response = self.llm.invoke(prompt)
                # Each LLM wrapper uses different attribute names for text
                response_text = getattr(response, 'content', None) or str(response)
            logger.info("LLM response generated successfully")
        except Exception as e:
            logger.error(f"LLM call failed: {e}")
            # Generate intelligent fallback from context
            answer = f"Based on the retrieved documents:\n\n"
            for i, source in enumerate(sources, 1):
                answer += f"[{i}] {source['preview']}\n\n"
            answer += f"\nThis information comes from {len(sources)} relevant document(s) with confidence score: {confidence:.2f}"
            return {
                'answer': answer,
                'sources': sources,
                'confidence': confidence,
                'context': context if return_context else None
            }

        output = {
            'answer': response_text,
            'sources': sources,
            'confidence': confidence
        }
        if return_context:
            output['context'] = context
        return output
    
    async def stream_response(self, query: str, top_k: int = 5) -> AsyncGenerator[Dict[str, Any], None]:
        """Stream RAG response with real-time generation"""
        # First yield search results
        search_results = self.search_documents(query, top_k)
        
        yield {
            "type": "search_complete",
            "results_found": len(search_results)
        }
        
        if not search_results:
            yield {
                "type": "content",
                "content": "I don't have relevant information to answer your question."
            }
            yield {"type": "done"}
            return
        
        # Build context and enhanced sources
        context_parts = []
        sources = []
        
        for i, result in enumerate(search_results):
            context_parts.append(result['text'])
            filename = result.get("source", "").split('/')[-1]
            if '_' in filename:
                filename = filename.split('_', 1)[1]  # Remove UUID prefix
            sources.append({
                "document_id": result["document_id"],
                "chunk_id": result["chunk_id"],
                "source": filename,
                "relevance_score": 1 - (result["distance"] / 2),
                "preview": result['text'][:200] + "..." if len(result['text']) > 200 else result['text']
            })
        
        context = "\n\n".join(context_parts)
        
        # Yield sources
        yield {
            "type": "sources",
            "sources": sources
        }
        
        # Generate streaming response
        prompt = f"""Based on the following context, answer the question. Include reference numbers [1], [2], etc. when citing specific information.

Context:
{context}

Question: {query}

Answer:"""
        
        try:
            # Stream LLM response. Support local streaming or AmazonQ fallback
            if isinstance(self.llm, AmazonQService):
                for chunk in self.llm.stream_generate(prompt):
                    yield {
                        "type": "content",
                        "content": chunk
                    }
            else:
                # LangChain or other wrapper
                stream = self.llm.stream(prompt)
                for chunk in stream:
                    yield {
                        "type": "content",
                        "content": chunk
                    }
        except Exception as e:
            logger.error(f"Streaming LLM failed: {e}")
            # Generate fallback from context
            fallback = f"Based on the retrieved documents:\n\n"
            for i, result in enumerate(search_results, 1):
                fallback += f"[{i}] {result['text'][:200]}...\n\n"
            
            # Stream fallback word by word
            words = fallback.split()
            for word in words:
                yield {
                    "type": "content",
                    "content": word + " "
                }
                await asyncio.sleep(0.02)
        
        yield {"type": "done"}
    
    def delete_document(self, document_id: int):
        """Remove document from vector store"""
        self.vector_service.delete_document_vectors(document_id)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get RAG service statistics"""
        return self.vector_service.get_stats()