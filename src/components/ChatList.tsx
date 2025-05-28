'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ChatUser {
    id: number;
    name: string;
    lastMessage?: string;
    lastMessageTime?: Date;
    unreadCount?: number;
}

interface ChatListProps {
    currentUser: {
        id: number;
        name: string;
    };
    onSelectChat: (recipient: ChatUser) => void;
}

const ChatList: React.FC<ChatListProps> = ({ currentUser, onSelectChat }) => {
    const [users, setUsers] = useState<ChatUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchChatUsers = async () => {
            try {
                // In a real app, you would fetch the list of users the current user has chatted with
                // For demo purposes, we'll use a mock API
                const response = await axios.get('https://api.digitalmarke.bdic.ng/api/users/all'); // You'll need to implement this endpoint
                setUsers(response.data);
                setLoading(false);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                setError('Failed to load chat users');
                setLoading(false);
            }
        };

        fetchChatUsers();
    }, [currentUser.id]);

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
        <div className="h-full overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Chats</h2>
            </div>
            <div className="divide-y divide-gray-200">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => onSelectChat(user)}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium">{user.name}</h3>
                            {user.unreadCount && user.unreadCount > 0 && (
                                <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {user.unreadCount}
                </span>
                            )}
                        </div>
                        {user.lastMessage && (
                            <p className="text-sm text-gray-500 truncate mt-1">{user.lastMessage}</p>
                        )}
                        {user.lastMessageTime && (
                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(user.lastMessageTime).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatList;