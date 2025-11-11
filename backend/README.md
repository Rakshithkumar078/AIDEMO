# AIDEMO Backend

FastAPI backend with RAG capabilities, vector storage, and LLM integration.

## Features

- **Document Management**: Upload, process, and store documents (PDF, DOCX, TXT, etc.)
- **Vector Storage**: ChromaDB integration with embedding generation
- **RAG Pipeline**: Retrieval Augmented Generation for intelligent responses
- **Multiple LLM Support**: OpenAI, Anthropic, and local model integration
- **Configurable Storage**: Local filesystem, AWS S3, Azure Blob support
- **Async Architecture**: Full async/await support with SQLAlchemy 2.0

## Quick Start

### Prerequisites
- Python 3.12+
- PostgreSQL database
- UV package manager (recommended) or pip

### Installation

1. **Install UV package manager** (if not already installed):
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. **Clone and setup**:
   ```bash
   cd backend
   uv sync  # or pip install -r requirements.txt
   ```

3. **Environment setup**:
   ```bash
   cp .env.development .env
   # Edit .env with your database URL and API keys
   ```

4. **Database setup**:
   ```bash
   # Create PostgreSQL database
   createdb aidemo_dev
   
   # Run setup script (creates tables and default data)
   python setup.py
   
   # Or use Alembic migrations
   alembic upgrade head
   ```

5. **Start the server**:
   ```bash
   python start.py
   # or
   uvicorn app.main:app --reload
   ```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://postgres:password@localhost:5432/aidemo` |
| `CHROMA_DB_PATH` | ChromaDB storage path | `./workspace/chromadb` |
| `STORAGE_TYPE` | Storage backend (`local`, `s3`, `azure`) | `local` |
| `STORAGE_PATH` | Local storage path | `./workspace/documents` |
| `OPENAI_API_KEY` | OpenAI API key | None |
| `AWS_BUCKET_NAME` | S3 bucket name | None |
| `AWS_REGION` | AWS region | `us-east-1` |

### Storage Backends

- **Local**: Files stored in `./workspace/documents/`
- **AWS S3**: Configure `AWS_BUCKET_NAME` and AWS credentials
- **Azure Blob**: Configure `AZURE_CONNECTION_STRING`

## API Endpoints

### Documents
- `POST /api/v1/documents/upload` - Upload document
- `GET /api/v1/documents/` - List documents
- `GET /api/v1/documents/{id}` - Get document details
- `DELETE /api/v1/documents/{id}` - Delete document

### Chat
- `POST /api/v1/chat/messages` - Send chat message (RAG)
- `GET /api/v1/chat/messages` - Get chat history

### LLM Management
- `GET /api/v1/llm/models` - List LLM models
- `POST /api/v1/llm/models` - Add LLM model
- `PUT /api/v1/llm/models/{id}` - Update LLM model

## Usage Examples

### Upload Document
```bash
curl -X POST "http://localhost:8000/api/v1/documents/upload" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@document.pdf"
```

### Chat with RAG
```bash
curl -X POST "http://localhost:8000/api/v1/chat/messages" \
     -H "Content-Type: application/json" \
     -d '{
       "user_message": "What is this document about?",
       "session_id": "my-session"
     }'
```

### Add LLM Model
```bash
curl -X POST "http://localhost:8000/api/v1/llm/models" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "GPT-4",
       "provider": "openai",
       "model_name": "gpt-4",
       "api_key": "your-api-key",
       "parameters": {"temperature": 0.7}
     }'
```

## Development

### Project Structure
```
backend/
├── app/
│   ├── api/v1/endpoints/     # API route handlers
│   ├── core/                 # Core configuration
│   ├── models/               # SQLAlchemy models
│   ├── schemas/              # Pydantic schemas
│   ├── services/             # Business logic
│   └── utils/                # Utilities
├── alembic/                  # Database migrations
├── tests/                    # Test files
└── workspace/                # File storage
```

### Running Tests
```bash
pytest tests/
```

### Database Migrations
```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head
```

## API Documentation

Visit `http://localhost:8000/docs` for interactive Swagger documentation.

## Architecture

### RAG Pipeline
1. **Document Upload** → File storage + metadata in PostgreSQL
2. **Text Extraction** → Support for PDF, DOCX, TXT, etc.
3. **Chunking** → Split documents into overlapping chunks
4. **Embedding** → Generate embeddings using sentence-transformers
5. **Vector Storage** → Store in ChromaDB with metadata
6. **Query Processing** → Search relevant chunks
7. **Context Augmentation** → Combine chunks with user query
8. **LLM Generation** → Generate response using configured model

### Abstractions
- **Storage Service**: Pluggable storage backends
- **Vector Store**: Pluggable vector databases
- **LLM Service**: Multiple LLM provider support

## Deployment

### Docker (Coming Soon)
```bash
docker build -t aidemo-backend .
docker run -p 8000:8000 aidemo-backend
```

### Production Checklist
- [ ] Set `DEBUG=false` in production
- [ ] Configure proper database connection pooling
- [ ] Set up proper logging
- [ ] Configure CORS for your frontend domain
- [ ] Set up SSL/TLS
- [ ] Configure file storage (S3/Azure)
- [ ] Set up monitoring and health checks