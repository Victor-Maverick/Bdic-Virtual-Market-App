'use client'
import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface ChatMessage {
    sender: string;
    content: string;
    type: 'CHAT' | 'JOIN' | 'LEAVE';
    timestamp?: string;
}

export default function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState('');
    const stompClient = useRef<Client | null>(null);
    const username = useRef(`User${Math.floor(Math.random() * 1000)}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Connect to WebSocket
    useEffect(() => {
        const connectWebSocket = async () => {
            try {
                const socket = new SockJS('https://api.digitalmarke.bdic.ng/ws-chat');

                stompClient.current = new Client({
                    webSocketFactory: () => socket,
                    connectHeaders: {
                        'username': username.current,
                        'Accept-Version': '1.2'
                    },
                    reconnectDelay: 5000,
                    heartbeatIncoming: 10000,
                    heartbeatOutgoing: 10000,
                    debug: (str) => console.debug('STOMP:', str),

                    onConnect: () => {
                        console.log('Connected to WebSocket');
                        setIsConnected(true);
                        setError('');

                        // Subscribe to public channel
                        stompClient.current?.subscribe('/topic/public', (message) => {
                            try {
                                const newMessage: ChatMessage = JSON.parse(message.body);
                                console.log('Received message:', newMessage);
                                setMessages(prev => [...prev, newMessage]);
                            } catch (e) {
                                console.error('Error parsing message:', e);
                                setError('Error parsing incoming message');
                            }
                        });

                        // Notify others of user joining
                        sendJoinMessage();
                    },

                    onStompError: (frame) => {
                        console.error('STOMP error:', frame);
                        setError(`STOMP error: ${frame.headers.message || 'Unknown error'}`);
                        setIsConnected(false);
                    },

                    onWebSocketError: (event) => {
                        console.error('WebSocket error:', event);
                        setError('WebSocket connection error');
                        setIsConnected(false);
                    },

                    onDisconnect: () => {
                        console.log('Disconnected from WebSocket');
                        setIsConnected(false);
                    }
                });

                stompClient.current.activate();
            } catch (error) {
                console.error('Error connecting to WebSocket:', error);
                setError('Failed to connect to chat server');
            }
        };

        connectWebSocket();

        return () => {
            if (stompClient.current?.connected) {
                sendLeaveMessage();
                stompClient.current.deactivate();
            }
        };
    }, []);

    const sendMessage = (message: ChatMessage) => {
        if (!stompClient.current?.connected) {
            setError('Not connected to chat server');
            return;
        }

        try {
            const chatMessage: ChatMessage = {
                ...message,
                timestamp: new Date().toISOString()
            };

            console.log('Sending message:', chatMessage);

            stompClient.current.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(chatMessage),
                headers: {
                    'content-type': 'application/json',
                    'username': username.current
                }
            });
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message');
        }
    };

    const sendJoinMessage = () => {
        sendMessage({
            sender: username.current,
            content: `${username.current} joined the chat`,
            type: 'JOIN'
        });
    };

    const sendLeaveMessage = () => {
        sendMessage({
            sender: username.current,
            content: `${username.current} left the chat`,
            type: 'LEAVE'
        });
    };

    const handleSend = () => {
        if (!input.trim()) return;

        sendMessage({
            sender: username.current,
            content: input,
            type: 'CHAT'
        });
        setInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const reconnect = () => {
        setError('');
        if (stompClient.current) {
            stompClient.current.deactivate();
        }
        // Trigger reconnection by reloading the component
        window.location.reload();
    };

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto p-4">
            {/* Header */}
            <div className="mb-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Chat Room</h1>
                <p className="text-sm text-gray-600">Connected as: {username.current}</p>
            </div>

            {/* Connection Status */}
            <div className={`p-2 mb-2 rounded text-white text-center transition-colors duration-300
                ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}>
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                {!isConnected && (
                    <button
                        onClick={reconnect}
                        className="ml-2 px-2 py-1 bg-white text-red-500 rounded text-xs hover:bg-gray-100"
                    >
                        Reconnect
                    </button>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-2 rounded">
                    <div className="flex justify-between items-center">
                        <span>{error}</span>
                        <button
                            onClick={() => setError('')}
                            className="text-red-500 hover:text-red-700"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto mb-4 border rounded p-2 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <div key={i} className={`mb-3 ${msg.sender === username.current ? 'text-right' : ''}`}>
                            {msg.type === 'JOIN' || msg.type === 'LEAVE' ? (
                                <div className="text-center text-gray-500 text-sm italic py-1">
                                    {msg.content}
                                </div>
                            ) : (
                                <>
                                    {msg.sender !== username.current && (
                                        <div className="font-bold text-blue-600 text-sm mb-1">{msg.sender}</div>
                                    )}
                                    <div className={`inline-block px-3 py-2 rounded-lg max-w-xs break-words
                                        ${msg.sender === username.current
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white border shadow-sm'}`}>
                                        {msg.content}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!isConnected}
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || !isConnected}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    Send
                </button>
            </div>
        </div>
    );
}