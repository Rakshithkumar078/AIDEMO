export interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    isStreaming?: boolean;
    sources?: Source[];
}

export interface Source {
    document_id: number;
    chunk_id: number;
    source: string;
    relevance_score: number;
}

export interface ChatRequest {
    user_message: string;
    session_id?: string;
    model_id?: number;
}

export interface StreamChunk {
    content?: string;
    done?: boolean;
    error?: string;
}