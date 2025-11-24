from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.llm import LLMModel
from app.schemas.llm import LLMModelCreate
import openai
from app.services.amazon_q_service import AmazonQService
from typing import List, Optional, Dict, Any, AsyncGenerator

class LLMService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_model(self, model_data: LLMModelCreate) -> LLMModel:
        db_model = LLMModel(**model_data.model_dump())
        self.db.add(db_model)
        await self.db.commit()
        await self.db.refresh(db_model)
        return db_model
    
    async def get_models(self, active_only: bool = True) -> List[LLMModel]:
        query = select(LLMModel)
        if active_only:
            query = query.where(LLMModel.is_active == True)
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_model(self, model_id: int) -> Optional[LLMModel]:
        result = await self.db.execute(
            select(LLMModel).where(LLMModel.id == model_id)
        )
        return result.scalar_one_or_none()
    
    async def update_model(self, model_id: int, model_data: Dict[str, Any]) -> Optional[LLMModel]:
        model = await self.get_model(model_id)
        if not model:
            return None
        
        for key, value in model_data.items():
            setattr(model, key, value)
        
        await self.db.commit()
        await self.db.refresh(model)
        return model
    
    async def generate_response(self, model_id: int, messages: List[Dict[str, str]]) -> str:
        model = await self.get_model(model_id)
        if not model or not model.is_active:
            raise ValueError("Model not found or inactive")
        
        if model.provider.lower() == "openai":
            client = openai.AsyncOpenAI(
                api_key=model.api_key,
                base_url=model.base_url
            )
            
            response = await client.chat.completions.create(
                model=model.model_name,
                messages=messages,
                **model.parameters
            )
            return response.choices[0].message.content

        if model.provider.lower() in ("amazon", "amazon_bedrock", "bedrock", "amazon_q"):
            # Use Amazon Bedrock runtime
            bedrock = AmazonQService(region=settings.aws_region, model_id=model.model_name)
            # Amazon Bedrock wrapper is synchronous; call generate
            return bedrock.generate("\n\n".join([m["content"] for m in messages]))
        
        raise ValueError(f"Unsupported provider: {model.provider}")
    
    async def stream_response(self, model_id: int, messages: List[Dict[str, str]]) -> AsyncGenerator[str, None]:
        """Stream response from LLM"""
        model = await self.get_model(model_id)
        if not model or not model.is_active:
            raise ValueError("Model not found or inactive")
        
        if model.provider.lower() == "openai":
            client = openai.AsyncOpenAI(
                api_key=model.api_key,
                base_url=model.base_url
            )
            
            stream = await client.chat.completions.create(
                model=model.model_name,
                messages=messages,
                stream=True,
                **model.parameters
            )
            
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        
        if model.provider.lower() in ("amazon", "amazon_bedrock", "bedrock", "amazon_q"):
            bedrock = AmazonQService(region=settings.aws_region, model_id=model.model_name)
            # Bedrock streaming isn't implemented in this wrapper - yield full response
            result = bedrock.generate("\n\n".join([m["content"] for m in messages]))
            for part in result.split("\n"):
                if part.strip():
                    yield part
        
        else:
            raise ValueError(f"Unsupported provider: {model.provider}")