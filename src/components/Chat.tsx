'use client';

import React, { useState, useEffect, useRef, FormEvent } from 'react';

// Types
interface ChatMessage {
    sender: string;
    content: string;
    type: 'JOIN' | 'LEAVE' | 'CHAT';
}

interface StompFrame {
    body: string;
}

interface StompSubscription {
    unsubscribe: () => void;
}

interface StompClient {
    connect: (headers: Record<string, string>, onConnect: () => void, onError: (error: Error) => void) => void;
    subscribe: (destination: string, callback: (message: StompFrame) => void) => StompSubscription;
    send: (destination: string, headers: Record<string, string>, body: string) => void;
    disconnect?: () => void;
}

interface SockJSConstructor {
    new (url: string): unknown;
}

interface StompConstructor {
    over: (socket: unknown) => StompClient;
}

// Declare global SockJS and Stomp for WebSocket connections
declare global {
    interface Window {
        SockJS: SockJSConstructor;
        Stomp: StompConstructor;
    }
}

const ChatComponent: React.FC = () => {
    // State management
    const [username, setUsername] = useState<string>('');
    const [currentUsername, setCurrentUsername] = useState<string | null>(null);
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [connectionError, setConnectionError] = useState<string>('');
    const [showChat, setShowChat] = useState<boolean>(false);

    // Refs
    const stompClientRef = useRef<StompClient | null>(null);
    const messageAreaRef = useRef<HTMLUListElement>(null);

    // Avatar colors
    const colors = [
        '#2196F3', '#32c787', '#00BCD4', '#ff5652',
        '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
    ];

    // Scroll to bottom of messages
    const scrollToBottom = (): void => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        }
    };

    // Generate avatar color based on username
    const getAvatarColor = (messageSender: string): string => {
        let hash = 0;
        for (let i = 0; i < messageSender.length; i++) {
            hash = 31 * hash + messageSender.charCodeAt(i);
        }
        const index = Math.abs(hash % colors.length);
        return colors[index];
    };

    // Handle username form submission
    const handleUsernameSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const trimmedUsername = username.trim();

        if (trimmedUsername) {
            setCurrentUsername(trimmedUsername);
            setShowChat(true);
            setIsConnecting(true);
            setConnectionError('');
            connectToChat(trimmedUsername);
        }
    };

    // Connect to WebSocket
    const connectToChat = (user: string): void => {
        if (typeof window !== 'undefined' && window.SockJS && window.Stomp) {
            try {
                const socket = new window.SockJS('https://api.digitalmarke.bdic.ng/ws');
                stompClientRef.current = window.Stomp.over(socket);

                stompClientRef.current.connect(
                    {},
                    () => onConnected(user),
                    (error: Error) => onError(error)
                );
            } catch (error) {
                console.error('Failed to create WebSocket connection:', error);
                onError(error instanceof Error ? error : new Error('Unknown connection error'));
            }
        } else {
            setConnectionError('WebSocket libraries not loaded. Please refresh the page.');
            setIsConnecting(false);
        }
    };

    // Handle successful connection
    const onConnected = (user: string): void => {
        if (stompClientRef.current) {
            // Subscribe to public topic
            stompClientRef.current.subscribe('/topic/public', onMessageReceived);

            // Send join message
            stompClientRef.current.send(
                '/app/chat.addUser',
                {},
                JSON.stringify({ sender: user, type: 'JOIN' })
            );

            setIsConnected(true);
            setIsConnecting(false);
        }
    };

    // Handle connection error
    const onError = (error: Error): void => {
        console.error('WebSocket connection error:', error);
        setConnectionError('Could not connect to WebSocket server. Please refresh this page to try again!');
        setIsConnecting(false);
        setIsConnected(false);
    };

    // Handle message form submission
    const handleMessageSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const messageContent = message.trim();

        if (messageContent && stompClientRef.current && currentUsername) {
            const chatMessage: ChatMessage = {
                sender: currentUsername,
                content: messageContent,
                type: 'CHAT'
            };

            stompClientRef.current.send(
                '/app/chat.sendMessage',
                {},
                JSON.stringify(chatMessage)
            );
            setMessage('');
        }
    };

    // Handle received messages
    const onMessageReceived = (payload: StompFrame): void => {
        try {
            const receivedMessage: ChatMessage = JSON.parse(payload.body);
            setMessages(prev => [...prev, receivedMessage]);
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load WebSocket libraries
    useEffect(() => {
        const loadWebSocketLibraries = async (): Promise<void> => {
            if (typeof window !== 'undefined') {
                // Load SockJS
                if (!window.SockJS) {
                    const sockjsScript = document.createElement('script');
                    sockjsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.1.4/sockjs.min.js';
                    document.head.appendChild(sockjsScript);

                    await new Promise((resolve) => {
                        sockjsScript.onload = resolve;
                    });
                }

                // Load Stomp
                if (!window.Stomp) {
                    const stompScript = document.createElement('script');
                    stompScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js';
                    document.head.appendChild(stompScript);

                    await new Promise((resolve) => {
                        stompScript.onload = resolve;
                    });
                }
            }
        };

        loadWebSocketLibraries();
    }, []);

    // Render message item
    const renderMessage = (msg: ChatMessage, index: number) => {
        if (msg.type === 'JOIN' || msg.type === 'LEAVE') {
            return (
                <li key={index} className="w-full text-center clear-both">
                    <p className="text-gray-500 text-sm break-words m-0">
                        {msg.type === 'JOIN' ? `${msg.sender} joined!` : `${msg.sender} left!`}
                    </p>
                </li>
            );
        }

        return (
            <li key={index} className="leading-6 py-2.5 px-5 m-0 border-b border-gray-100 pl-17 relative">
                <i
                    className="absolute w-10 h-10 overflow-hidden left-2.5 inline-block align-middle text-lg leading-10 text-white text-center rounded-full font-normal uppercase"
                    style={{ backgroundColor: getAvatarColor(msg.sender) }}
                >
                    {msg.sender[0]}
                </i>
                <span className="text-gray-800 font-semibold">{msg.sender}</span>
                <p className="text-gray-600 m-0">{msg.content}</p>
            </li>
        );
    };

    return (
        <div className="h-screen overflow-hidden bg-gray-100 font-sans">
            {/* Username Page */}
            {!showChat && (
                <div id="username-page" className="text-center h-full flex items-center justify-center">
                    <div className="bg-white shadow-lg rounded-sm w-full max-w-lg inline-block relative py-9 px-14 min-h-64">
                        <h1 className="text-2xl font-normal mb-5">Type your username to enter the Chatroom</h1>
                        <form onSubmit={handleUsernameSubmit}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Username"
                                    autoComplete="off"
                                    className="w-full min-h-9 text-base border border-gray-300 pl-2.5 outline-none rounded"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mt-2.5">
                                <button
                                    type="submit"
                                    className="bg-green-500 shadow-md text-white border border-transparent text-sm outline-none leading-none whitespace-nowrap align-middle py-2.5 px-4 rounded-sm transition-all duration-200 cursor-pointer min-h-9 hover:bg-green-600"
                                >
                                    Start Chatting
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Chat Page */}
            {showChat && (
                <div id="chat-page" className="relative h-full">
                    <div className="max-w-3xl mx-auto bg-white shadow-lg mt-8 h-[calc(100%-60px)] max-h-96 relative md:mt-8 sm:mx-2.5 sm:mt-2.5 sm:h-[calc(100%-30px)]">
                        {/* Chat Header */}
                        <div className="text-center py-4 border-b border-gray-200 sm:py-2.5">
                            <h2 className="m-0 font-medium text-lg sm:text-base">Bdic Virtual Chat</h2>
                        </div>

                        {/* Connecting Status */}
                        {isConnecting && (
                            <div className="pt-1.5 text-center text-gray-500 absolute top-16 w-full sm:top-15">
                                Connecting...
                            </div>
                        )}

                        {/* Connection Error */}
                        {connectionError && (
                            <div className="pt-1.5 text-center text-red-500 absolute top-16 w-full sm:top-15">
                                {connectionError}
                            </div>
                        )}

                        {/* Messages Area */}
                        <ul
                            ref={messageAreaRef}
                            id="messageArea"
                            className="list-none bg-white m-0 overflow-auto py-0 px-5 h-[calc(100%-150px)] sm:h-[calc(100%-120px)]"
                        >
                            {messages.map((msg, index) => renderMessage(msg, index))}
                        </ul>

                        {/* Message Form */}
                        <form onSubmit={handleMessageSubmit} className="p-5">
                            <div className="mb-4">
                                <div className="clearfix">
                                    <input
                                        type="text"
                                        id="message"
                                        placeholder="Type a message..."
                                        autoComplete="off"
                                        className="float-left w-[calc(100%-85px)] min-h-9 text-base border border-gray-300 pl-2.5 outline-none sm:w-[calc(100%-70px)]"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        disabled={!isConnected}
                                    />
                                    <button
                                        type="submit"
                                        className="float-left w-20 h-9 ml-1.5 bg-green-500 shadow-md text-white border border-transparent text-sm outline-none leading-none whitespace-nowrap align-middle py-2.5 px-4 rounded-sm transition-all duration-200 cursor-pointer hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed sm:w-16"
                                        disabled={!isConnected}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatComponent;