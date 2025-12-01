import os
import asyncio
import requests
import json
from typing import List, Dict, Any, AsyncGenerator
# from langchain_community.llms import Ollama # Removed due to stability issues
from app.services.amazon_q_service import AmazonQService
from app.services.vector_service import VectorService
from app.services.document_processor import DocumentProcessor
from app.core.logger import logger
from app.core.config import settings

class SimpleOllama:
    def __init__(self, base_url: str, model: str):
        self.base_url = base_url
        self.model = model

    def invoke(self, prompt: str) -> str:
        url = f"{self.base_url}/api/generate"
        data = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        try:
            response = requests.post(url, json=data)
            response.raise_for_status()
            return response.json().get("response", "")
        except Exception as e:
            logger.error(f"SimpleOllama invoke failed: {e}")
            raise

    def stream(self, prompt: str):
        url = f"{self.base_url}/api/generate"
        data = {
            "model": self.model,
            "prompt": prompt,
            "stream": True
        }
        try:
            response = requests.post(url, json=data, stream=True)
            response.raise_for_status()
            for line in response.iter_lines():
                if line:
                    body = json.loads(line)
                    response_part = body.get("response", "")
                    if response_part:
                        yield response_part
                    if body.get("done", False):
                        break
        except Exception as e:
            logger.error(f"SimpleOllama stream failed: {e}")
            raise

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
                self.llm = SimpleOllama(
                    model=settings.local_llm_model,
                    base_url="http://localhost:11434"
                )
                logger.info(f"Local LLM initialized (SimpleOllama): {settings.local_llm_model}")
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
            return {'answer': 'I could not find any relevant information in the uploaded documents to answer your question.', 'sources': [], 'confidence': 0.0, 'context': ''}

        # Prepare context and sources
        context_parts = []
        for i, doc in enumerate(results):
            context_parts.append(f"<document id='{i+1}'>\n{doc['text']}\n</document>")
        context = "\n\n".join(context_parts)
        
        # Use 1 / (1 + distance / 100) for score calculation to handle non-normalized embeddings
        sources = []
        for doc in results:
            dist = doc['distance']
            score = 1.0 / (1.0 + (dist / 100.0))
            logger.info(f"Doc: {doc.get('source', 'unknown')}, Dist: {dist}, Score: {score}")
            sources.append({
                'source': doc.get('source', 'unknown').split('/')[-1],
                'page': 'unknown',
                'score': score,
                'preview': doc['text'][:300] + '...'
            })
        confidence = max([s['score'] for s in sources]) if sources else 0.0

        # Generate answer with configured LLM
        prompt = f"""You are a helpful AI assistant. Answer the question based ONLY on the following provided context.
If the answer is not in the context, say "I cannot answer this based on the provided documents."
Do not use outside knowledge.

Context:
{context}

Question: {query}

Answer:"""
        try:
            logger.info("Calling LLM for response generation")
            if isinstance(self.llm, AmazonQService):
                response_text = self.llm.generate(prompt)
            else:
                # SimpleOllama
                response_text = self.llm.invoke(prompt)
            logger.info("LLM response generated successfully")
        except Exception as e:
            logger.error(f"LLM call failed: {e}")
            # Generic fallback
            answer = f"I encountered an error generating the response, but here is the relevant information found:\n\n"
            for i, source in enumerate(sources, 1):
                answer += f"[{i}] {source['preview']}\n\n"
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
            context_parts.append(f"<document id='{i+1}'>\n{result['text']}\n</document>")
            filename = result.get("source", "").split('/')[-1]
            if '_' in filename:
                filename = filename.split('_', 1)[1]  # Remove UUID prefix
            
            # Use 1 / (1 + distance / 100) for score calculation
            dist = result["distance"]
            score = 1.0 / (1.0 + (dist / 100.0))
            logger.info(f"Stream Doc: {filename}, Dist: {dist}, Score: {score}")
            
            sources.append({
                "document_id": result.get("document_id"),
                "chunk_id": result.get("chunk_id"),
                "source": filename,
                "relevance_score": score,
                "preview": result['text'][:200] + "..." if len(result['text']) > 200 else result['text']
            })
        
        context = "\n\n".join(context_parts)
        
        # Yield sources
        yield {
            "type": "sources",
            "sources": sources
        }
        
        # Generate streaming response
        prompt = f"""You are a helpful AI assistant. Answer the question based ONLY on the following provided context.
If the answer is not in the context, say "I cannot answer this based on the provided documents."
Include reference numbers [1], [2], etc. when citing specific information.

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
                # SimpleOllama
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