'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface WebSocketContextType {
    client: Client | null;
    isConnected: boolean;
    connect: (userId: string, onMessageReceived: (message: ChatMessage) => void) => void;
    disconnect: () => void;
    sendMessage: (message: ChatMessage) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const [client, setClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const connect = (userId: string, onMessageReceived: (message: ChatMessage) => void) => {
        const stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                setIsConnected(true);
                stompClient.subscribe(`/user/${userId}/queue/messages`, (message: IMessage) => {
                    const receivedMessage: ChatMessage = JSON.parse(message.body);
                    onMessageReceived(receivedMessage);
                });
            },
            onDisconnect: () => {
                setIsConnected(false);
            },
        });

        stompClient.activate();
        setClient(stompClient);
    };

    const disconnect = () => {
        if (client) {
            client.deactivate();
            setClient(null);
            setIsConnected(false);
        }
    };

    const sendMessage = (message: ChatMessage) => {
        if (client && isConnected) {
            client.publish({
                destination: '/app/chat',
                body: JSON.stringify(message),
            });
        }
    };

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ client, isConnected, connect, disconnect, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = (): WebSocketContextType => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

interface ChatMessage {
    id?: number;
    chatId: number;
    senderId: number;
    recipientId: number;
    senderName: string;
    recipientName: string;
    content: string;
    timestamp?: Date;
    status?: MessageStatus;
}

enum MessageStatus {
    RECEIVED = 'RECEIVED',
    DELIVERED = 'DELIVERED'
}