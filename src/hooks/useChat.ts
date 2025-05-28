'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import {ChatMessage, MessageStatus} from "@/types/chat.types";

export const useChat = (currentUserId: number, recipientId?: number) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMessages = async () => {
        if (!recipientId) return;

        try {
            setLoading(true);
            const response = await axios.get(
                `https://api.digitalmarke/messages/${currentUserId}/${recipientId}`
            );
            setMessages(response.data);
            setLoading(false);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError('Failed to load messages');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [currentUserId, recipientId]);

    const sendMessage = async (content: string) => {
        if (!recipientId) return;

        try {
            const newMessage: ChatMessage = {
                recipientName: "", senderName: "",
                senderId: currentUserId,
                recipientId: recipientId,
                content: content,
                chatId: 0, // Will be set by backend
                status: MessageStatus.RECEIVED
            };

            // Optimistic update
            setMessages(prev => [...prev, {
                ...newMessage,
                timestamp: new Date(),
            }]);

            await axios.post('https://api.digitalmarke/chat', newMessage);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError('Failed to send message');
            // Rollback optimistic update
            setMessages(prev => prev.slice(0, -1));
        }
    };

    return { messages, loading, error, sendMessage, fetchMessages };
};