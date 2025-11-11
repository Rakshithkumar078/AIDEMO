import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_upload_document():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        files = {"file": ("test.txt", b"Test content", "text/plain")}
        response = await ac.post("/api/v1/documents/upload", files=files)
        assert response.status_code == 200
        data = response.json()
        assert data["filename"] == "test.txt"

@pytest.mark.asyncio
async def test_get_documents():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/documents/")
        assert response.status_code == 200
        assert isinstance(response.json(), list)