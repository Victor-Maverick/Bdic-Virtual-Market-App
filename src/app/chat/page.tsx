//chat/page.tsx
'use client'

import React, { useState } from 'react';
import ChatList from '../../components/ChatList';
import ChatUI from '../../components/ChatUI';
import { WebSocketProvider } from '@/context/WebSocketContext';

const ChatPage = () => {
    // In a real app, you would get the current user from your auth context
    const [currentUser] = useState({
        id: 1, // This should come from your auth system
        firstName: 'Current User',
    });

    const [selectedRecipient, setSelectedRecipient] = useState<{
        id: number;
        firstName: string;
    } | null>(null);

    return (
        <WebSocketProvider>
            <div className="flex h-screen bg-white">
                {/* Sidebar with chat list */}
                <div className="w-1/3 border-r border-gray-200">
                    <ChatList
                        currentUser={currentUser}
                        onSelectChat={(recipient) => setSelectedRecipient(recipient)}
                    />
                </div>

                {/* Main chat area */}
                <div className="flex-1 flex flex-col">
                    {selectedRecipient ? (
                        <ChatUI currentUser={currentUser} recipient={selectedRecipient} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Select a chat to start messaging
                        </div>
                    )}
                </div>
            </div>
        </WebSocketProvider>
    );
};

export default ChatPage;