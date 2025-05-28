'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '@/context/WebSocketContext';
import axios from 'axios';
import {ChatMessage, MessageStatus} from "@/types/chat.types";

interface ChatUIProps {
    currentUser: {
        id: number;
        firstName: string;
    };
    recipient: {
        id: number;
        firstName: string;
    };
}

const ChatUI: React.FC<ChatUIProps> = ({ currentUser, recipient }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { connect, disconnect, sendMessage, isConnected } = useWebSocket();

    // Fetch chat history
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(
                    `https://api.digitalmarke/ws/messages/${currentUser.id}/${recipient.id}`
                );
                setMessages(response.data);
                setLoading(false);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                setError('Failed to load messages');
                setLoading(false);
            }
        };

        fetchMessages();
    }, [currentUser.id, recipient.id]);

    // Connect to WebSocket
    useEffect(() => {
        const handleNewMessage = (message: ChatMessage) => {
            setMessages(prev => [...prev, message]);
        };

        connect(currentUser.id.toString(), handleNewMessage);

        return () => {
            disconnect();
        };
    }, [currentUser.id, connect, disconnect]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const message: ChatMessage = {
            senderId: currentUser.id,
            senderName: currentUser.firstName,
            recipientId: recipient.id,
            recipientName: recipient.firstName,
            content: newMessage,
            chatId: 0, // This will be set by the backend
            status: MessageStatus.RECEIVED,
        };

        sendMessage(message);
        setNewMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* ChatUI header */}
            <div className="bg-gray-100 p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">{recipient.firstName}</h2>
                <div className="flex items-center">
                    <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="ml-2 text-xs text-gray-500">
            {isConnected ? 'Online' : 'Offline'}
          </span>
                </div>
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${message.senderId === currentUser.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                            <p>{message.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                                {new Date(message.timestamp || new Date()).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
          <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={1}
          />
                    <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatUI;