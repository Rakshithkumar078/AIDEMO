import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './models/Chat';
import { streamChatMessage } from '../../shared/services/ChatService';
import { SourceReferences, SourceReference } from './components';
import { v4 as uuidv4 } from 'uuid';
import './ChatPage.css';
import { Panel, PanelBody } from '../../components/panel/panel'

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(uuidv4());
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: uuidv4(),
            content: inputValue.trim(),
            role: 'user',
            timestamp: new Date()
        };

        const assistantMessage: ChatMessage = {
            id: uuidv4(),
            content: '',
            role: 'assistant',
            timestamp: new Date(),
            isStreaming: true
        };

        setMessages(prev => [...prev, userMessage, assistantMessage]);
        setInputValue('');
        setIsLoading(true);

        await streamChatMessage(
            {
                user_message: userMessage.content,
                session_id: sessionId
            },
            (chunk: string) => {
                setMessages(prev => prev.map(msg =>
                    msg.id === assistantMessage.id
                        ? { ...msg, content: msg.content + chunk }
                        : msg
                ));
            },
            () => {
                setMessages(prev => prev.map(msg =>
                    msg.id === assistantMessage.id
                        ? { ...msg, isStreaming: false }
                        : msg
                ));
                setIsLoading(false);
            },
            (error: string) => {
                setMessages(prev => prev.map(msg =>
                    msg.id === assistantMessage.id
                        ? { ...msg, content: `Error: ${error}`, isStreaming: false }
                        : msg
                ));
                setIsLoading(false);
            },
            (sources: any[]) => {
                setMessages(prev => prev.map(msg =>
                    msg.id === assistantMessage.id
                        ? { ...msg, sources: sources }
                        : msg
                ));
            }
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const copyToClipboard = (content: string) => {
        navigator.clipboard.writeText(content);
    };

    const startEdit = (messageId: string, content: string) => {
        setEditingMessageId(messageId);
        setEditValue(content);
    };

    const cancelEdit = () => {
        setEditingMessageId(null);
        setEditValue('');
    };

    const saveEdit = async () => {
        if (!editingMessageId || !editValue.trim()) return;

        // Find the message index and remove all messages after it
        const messageIndex = messages.findIndex(msg => msg.id === editingMessageId);
        if (messageIndex === -1) return;

        const updatedMessages = messages.slice(0, messageIndex);
        const editedMessage = { ...messages[messageIndex], content: editValue.trim() };

        setMessages([...updatedMessages, editedMessage]);
        setEditingMessageId(null);
        setEditValue('');

        // Send the edited message
        const assistantMessage: ChatMessage = {
            id: uuidv4(),
            content: '',
            role: 'assistant',
            timestamp: new Date(),
            isStreaming: true
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(true);

        await streamChatMessage(
            {
                user_message: editedMessage.content,
                session_id: sessionId
            },
            (chunk: string) => {
                setMessages(prev => prev.map(msg =>
                    msg.id === assistantMessage.id
                        ? { ...msg, content: msg.content + chunk }
                        : msg
                ));
            },
            () => {
                setMessages(prev => prev.map(msg =>
                    msg.id === assistantMessage.id
                        ? { ...msg, isStreaming: false }
                        : msg
                ));
                setIsLoading(false);
            },
            (error: string) => {
                setMessages(prev => prev.map(msg =>
                    msg.id === assistantMessage.id
                        ? { ...msg, content: `Error: ${error}`, isStreaming: false }
                        : msg
                ));
                setIsLoading(false);
            },
            (sources: any[]) => {
                setMessages(prev => prev.map(msg =>
                    msg.id === assistantMessage.id
                        ? { ...msg, sources: sources }
                        : msg
                ));
            }
        );
    };

    const clearChat = () => {
        setMessages([]);
    };

    const formatTimestamp = (timestamp: Date) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Transform sources from API format to SourceReference format
    const transformSources = (sources: any[]): SourceReference[] => {
        if (!sources || !Array.isArray(sources)) return [];

        return sources.map(source => ({
            document: source.source || source.filename || 'Unknown Document',
            page: source.page || undefined,
            confidence: source.relevance_score || source.confidence || 0,
            content: source.content || source.text || 'No content available'
        }));
    };

    return (
        <>
            <Panel>
                <PanelBody>
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 py-3">
                        <h2 className="mb-0">AI Chat</h2>
                        <div className="d-flex align-items-center flex-wrap gap-3">
                            <button
                                className="btn btn-theme rounded-pill px-4 py-2"
                                onClick={clearChat}
                                disabled={messages.length === 0}
                            >Clear Chat
                            </button>
                        </div>
                    </div>
                </PanelBody>
            </Panel>
            <div className="chat-container">

                {/* Messages */}
                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <div className="text-center text-muted mt-5">
                            <i className="fas fa-comments fa-3x mb-3"></i>
                            <h5>Start a conversation</h5>
                            <p>Ask me anything about your documents</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div key={message.id} className={`d-flex ${message.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div className={`card message-bubble ${message.role} ${message.role === 'user' ? 'bg-primary text-white' : 'bg-light'}`}>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <small className={`${message.role === 'user' ? 'text-white-50' : 'text-muted'}`}>
                                                {message.role === 'user' ? 'You' : 'AI Assistant'} • {formatTimestamp(message.timestamp)}
                                            </small>
                                            <div className="message-actions d-flex gap-1">
                                                {message.role === 'assistant' && !message.isStreaming && (
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => copyToClipboard(message.content)}
                                                        title="Copy to clipboard"
                                                    >
                                                        <i className="fas fa-copy"></i>
                                                    </button>
                                                )}
                                                {message.role === 'user' && (
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => startEdit(message.id, message.content)}
                                                        title="Edit message"
                                                        disabled={isLoading}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {editingMessageId === message.id ? (
                                            <div>
                                                <div className="edit-form">
                                                    <textarea
                                                        className="form-control mb-2"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        rows={3}
                                                    />
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            onClick={saveEdit}
                                                            disabled={!editValue.trim()}
                                                        >
                                                            <i className="fas fa-check me-1"></i>Save
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-secondary"
                                                            onClick={cancelEdit}
                                                        >
                                                            <i className="fas fa-times me-1"></i>Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
                                                {message.isStreaming && (
                                                    <span className="ms-1">
                                                        <i className="fas fa-circle-notch fa-spin"></i>
                                                    </span>
                                                )}
                                                {/* Use the enhanced SourceReferences component */}
                                                {message.role === 'assistant' && message.sources && message.sources.length > 0 && !message.isStreaming && (
                                                    <SourceReferences
                                                        sources={transformSources(message.sources)}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="chat-input">
                    <div className="input-group">
                        <textarea
                            ref={textareaRef}
                            className="form-control"
                            placeholder="Type your message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            rows={1}
                            style={{ resize: 'none', minHeight: '38px' }}
                            disabled={isLoading}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isLoading}
                        >
                            {isLoading ? (
                                <i className="fas fa-circle-notch fa-spin"></i>
                            ) : (
                                <i className="fas fa-arrow-up"></i>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatPage;