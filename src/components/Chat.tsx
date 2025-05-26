'use client';
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

    // Connect to WebSocket
    useEffect(() => {
        const socket = new SockJS('https://api.digitalmarke.bdic.ng/ws-chat');

        stompClient.current = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                'username': username.current
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            debug: (str) => console.debug('STOMP:', str),

            onConnect: () => {
                setIsConnected(true);
                setError('');

                // Subscribe to public channel
                stompClient.current?.subscribe('/topic/public', (message) => {
                    const newMessage: ChatMessage = JSON.parse(message.body);
                    setMessages(prev => [...prev, newMessage]);
                });

                // Notify others of user joining
                sendMessage({
                    sender: username.current,
                    content: `${username.current} joined the chat`,
                    type: 'JOIN'
                });
            },

            onStompError: (frame) => {
                setError(`STOMP error: ${frame.headers.message}`);
            },

            onWebSocketError: (event) => {
                setError('WebSocket error: ' + event.type);
            }
        });

        stompClient.current.activate();

        return () => {
            if (stompClient.current?.connected) {
                sendMessage({
                    sender: username.current,
                    content: `${username.current} left the chat`,
                    type: 'LEAVE'
                });
                stompClient.current.deactivate();
            }
        };
    }, []);

    const sendMessage = (message: ChatMessage) => {
        if (!stompClient.current?.connected) {
            setError('Not connected to chat server');
            return;
        }

        const chatMessage: ChatMessage = {
            ...message,
            timestamp: new Date().toISOString()
        };

        stompClient.current.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify(chatMessage),
            headers: { 'content-type': 'application/json' }
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

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto p-4">
            {/* Connection Status */}
            <div className={`p-2 mb-2 rounded text-white text-center 
        ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-2">
                    {error}
                </div>
            )}

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto mb-4 border rounded p-2 bg-gray-50">
                {messages.map((msg, i) => (
                    <div key={i} className={`mb-2 ${msg.sender === username.current ? 'text-right' : ''}`}>
                        {msg.sender !== username.current && (
                            <div className="font-bold text-blue-600">{msg.sender}</div>
                        )}
                        <div className={`inline-block px-3 py-1 rounded-lg 
              ${msg.sender === username.current
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200'}`}>
                            {msg.content}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {new Date(msg.timestamp || '').toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 border rounded p-2"
                    disabled={!isConnected}
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || !isConnected}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Send
                </button>
            </div>
        </div>
    );
}