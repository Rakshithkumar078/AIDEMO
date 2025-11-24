import { ChatRequest } from "../../pages/chat/models/Chat";
import api from "../../store/AuthHeader";

export const sendChatMessage = (request: ChatRequest) => {
    return api().post("/api/v1/chat/messages", request);
};

export const streamChatMessage = async (
    request: ChatRequest,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void,
    onSources?: (sources: any[]) => void
) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/chat/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.error) {
                            onError(data.error);
                            return;
                        }
                        if (data.type === 'done') {
                            onComplete();
                            return;
                        }
                        if (data.type === 'content' && data.content) {
                            onChunk(data.content);
                        }
                        if (data.type === 'sources' && data.sources && onSources) {
                            onSources(data.sources);
                        }
                        // Skip search_complete events
                    } catch (e) {
                        console.error('Error parsing SSE data:', e);
                    }
                }
            }
        }
    } catch (error) {
        onError(error instanceof Error ? error.message : 'Unknown error');
    }
};

export const getChatMessages = (sessionId?: string) => {
    const params = sessionId ? { session_id: sessionId } : {};
    return api().get("/api/v1/chat/messages", { params });
};