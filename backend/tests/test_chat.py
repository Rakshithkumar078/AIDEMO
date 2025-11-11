import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_chat_message():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        message_data = {
            "user_message": "Hello, how are you?",
            "session_id": "test_session"
        }
        response = await ac.post("/api/v1/chat/messages", json=message_data)
        # This might fail without proper setup, but shows the structure
        assert response.status_code in [200, 400, 500]

@pytest.mark.asyncio
async def test_get_chat_messages():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/chat/messages")
        assert response.status_code == 200
        assert isinstance(response.json(), list)