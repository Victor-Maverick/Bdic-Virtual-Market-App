//vendor/dashboard/chats
'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Phone, Video, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import { chatService, ChatMessage } from '@/services/chatService';
import { videoCallService, VideoCallRequest, VideoCallResponse } from '@/services/videoCallService';
import { voiceCallService, VoiceCallRequest, VoiceCallResponse } from '@/services/voiceCallService';
import VideoCallModal from '@/components/VideoCallModal';
import VoiceCallModal from '@/components/VoiceCallModal';
import Pusher from 'pusher-js';
import Image from "next/image";
import blueCircle from "../../../../../public/assets/images/blueGreenCircle.png";
import VendorShopGuard from "@/components/VendorShopGuard";

interface ChatConversation {
    id: string;
    buyerEmail: string; // This is the OTHER person (not necessarily a buyer)
    buyerName: string;  // Name of the other person
    buyerProfileImage?: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isOnline: boolean;
}

interface PusherChannel {
    bind: (event: string, callback: (data: ChatMessage) => void) => void;
    bind_global: (callback: (eventName: string, data: unknown) => void) => void;
    unbind_all: () => void;
}

const VendorChatsPage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm] = useState('');

    
    // Chat interface state
    const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pusherRef = useRef<Pusher | null>(null);
    const channelRef = useRef<PusherChannel | null>(null);

    // Call states
    const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);
    const [isVoiceCallModalOpen, setIsVoiceCallModalOpen] = useState(false);
    const [currentVideoCall, setCurrentVideoCall] = useState<VideoCallResponse | null>(null);
    const [currentVoiceCall, setCurrentVoiceCall] = useState<VoiceCallResponse | null>(null);
    const [shopId, setShopId] = useState<number>(0);

    const fetchConversations = useCallback(async () => {
        try {
            if (conversations.length === 0) {
                setLoading(true);
            }

            console.log('=== FETCHING VENDOR CONVERSATIONS FROM BACKEND ===');
            console.log('Vendor email:', session?.user?.email);

            const data = await chatService.getConversations(session?.user?.email || '');
            console.log('Raw conversations data from backend:', data);

            // Transform the data to match the expected interface
            const transformedConversations = data.map(conv => ({
                id: conv.id,
                buyerEmail: conv.buyerEmail,
                buyerName: conv.buyerName || conv.buyerEmail?.split('@')[0] || 'Unknown User',
                lastMessage: conv.lastMessage,
                lastMessageTime: conv.lastMessageTime,
                unreadCount: conv.unreadCount,
                isOnline: conv.buyerOnline
            }));

            console.log('Transformed conversations:', transformedConversations);

            // Check for new messages and show notification
            if (conversations.length > 0) {
                const newMessages = transformedConversations.filter(newConv => {
                    const existingConv = conversations.find(conv => conv.id === newConv.id);
                    return !existingConv || new Date(newConv.lastMessageTime) > new Date(existingConv.lastMessageTime);
                });

                if (newMessages.length > 0) {
                    console.log('New messages detected:', newMessages);
                }
            }

            setConversations(transformedConversations);

        } catch (error) {
            console.error('Error fetching conversations:', error);
            if (conversations.length === 0) {
                toast.error('Failed to load conversations');
            }
        } finally {
            setLoading(false);
        }
    }, [session?.user?.email, conversations]);

    useEffect(() => {
        if (!session?.user?.email) {
            router.push('/login');
            return;
        }

        fetchConversations();
        
        // Only set up polling if there are conversations or this is the first load
        let interval: NodeJS.Timeout | null = null;
        if (conversations.length > 0) {
            interval = setInterval(fetchConversations, 10000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
            // Cleanup Pusher on unmount
            if (channelRef.current) {
                channelRef.current.unbind_all();
                pusherRef.current?.unsubscribe(conversationId);
            }
            if (pusherRef.current) {
                pusherRef.current.disconnect();
            }
        };
    }, [session?.user?.email, router, fetchConversations, conversationId, conversations.length]);



    const openChat = async (conversation: ChatConversation) => {
        console.log('Opening chat with buyer:', conversation.buyerEmail);
        console.log('Current vendor email:', session?.user?.email);
        
        if (!session?.user?.email) return;
        
        try {
            setChatLoading(true);
            setSelectedConversation(conversation);
            
            // Generate conversation ID
            const convId = chatService.generateConversationId(session.user.email, conversation.buyerEmail);
            setConversationId(convId);
            
            console.log('Generated conversation ID:', convId);
            console.log('User emails:', { vendor: session.user.email, buyer: conversation.buyerEmail });

            // Load existing messages
            console.log('=== VENDOR LOADING MESSAGES ===');
            console.log('Full conversation object:', conversation);
            
            // With the updated backend, buyerEmail is always the other person
            const otherUserEmail = conversation.buyerEmail;
            
            console.log('Calling getMessages with:', { 
                user1: session.user.email, 
                user2: otherUserEmail,
                conversationId: convId 
            });
            const existingMessages = await chatService.getMessages(session.user.email, otherUserEmail);
            console.log('Received messages:', existingMessages);
            console.log('Message count:', existingMessages.length);
            existingMessages.forEach((msg, index) => {
                console.log(`Message ${index + 1}:`, {
                    id: msg.id,
                    from: msg.fromEmail,
                    to: msg.toEmail,
                    message: msg.message,
                    conversationId: msg.conversationId
                });
            });
            console.log('===============================');
            setMessages(existingMessages);

            // Mark messages as read
            await chatService.markMessagesAsRead(conversation.buyerEmail, session.user.email);
            
            // Setup Pusher for real-time messages
            setupPusherForChat(convId);
            
        } catch (error) {
            console.error('Error opening chat:', error);
            toast.error('Failed to load chat');
        } finally {
            setChatLoading(false);
        }
    };

    const setupPusherForChat = (convId: string) => {
        // Cleanup existing connection
        if (channelRef.current) {
            channelRef.current.unbind_all();
            pusherRef.current?.unsubscribe(conversationId);
        }
        if (pusherRef.current) {
            pusherRef.current.disconnect();
        }

        pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        channelRef.current = pusherRef.current.subscribe(convId) as PusherChannel;
        
        channelRef.current.bind('new-message', (data: ChatMessage) => {
            console.log('Received new message via Pusher:', data);
            addMessageSafely(data);
            scrollToBottom();
        });

        console.log('Pusher setup for chat:', convId);
    };

    const addMessageSafely = (newMessage: ChatMessage) => {
        setMessages(prev => {
            const messageExists = prev.some(msg => msg.id === newMessage.id);
            if (messageExists) {
                console.log('Message already exists, skipping duplicate:', newMessage.id);
                return prev;
            }
            return [...prev, newMessage];
        });
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !session?.user?.email || !selectedConversation) return;

        try {
            // With the updated backend, buyerEmail is always the other person
            const otherUserEmail = selectedConversation.buyerEmail;
            
            const messageData = {
                fromEmail: session.user.email,
                toEmail: otherUserEmail,
                message: newMessage.trim()
            };

            console.log('Sending message:', messageData);
            const sentMessage = await chatService.sendMessage(messageData);
            console.log('Message sent successfully:', sentMessage);
            
            addMessageSafely(sentMessage);
            setNewMessage('');
            scrollToBottom();
            
            // Refresh conversations to update last message
            fetchConversations();
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };



    // Fetch shop ID for the current vendor
    useEffect(() => {
        const fetchShopId = async () => {
            if (session?.user?.email) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/getbyEmail?email=${session.user.email}`);
                    if (response.ok) {
                        const shopData = await response.json();
                        setShopId(shopData.id);
                    }
                } catch (error) {
                    console.error('Error fetching shop ID:', error);
                }
            }
        };
        fetchShopId();
    }, [session?.user?.email]);

    const initiateVideoCall = async (customerEmail: string) => {
        if (!session?.user?.email || shopId === 0) {
            toast.error('Unable to initiate call. Please try again.');
            return;
        }

        // Prevent self-calling
        if (session.user.email === customerEmail) {
            toast.error('You cannot call yourself.');
            return;
        }

        try {
            const request: VideoCallRequest = {
                buyerEmail: session.user.email, // The vendor making the call (initiator)
                vendorEmail: customerEmail, // The customer receiving the call (recipient)
                shopId: shopId,
                shopName: selectedConversation?.buyerName || 'Shop'
            };

            console.log('Vendor initiating video call:', {
                initiator: session.user.email,
                recipient: customerEmail,
                shopId: shopId
            });

            const call = await videoCallService.initiateCall(request);
            setCurrentVideoCall(call);
            setIsVideoCallModalOpen(true);
        } catch (error) {
            console.error('Error initiating video call:', error);
            toast.error('Failed to initiate video call. Please try again.');
        }
    };

    const initiateVoiceCall = async (customerEmail: string) => {
        if (!session?.user?.email || shopId === 0) {
            toast.error('Unable to initiate call. Please try again.');
            return;
        }

        // Prevent self-calling
        if (session.user.email === customerEmail) {
            toast.error('You cannot call yourself.');
            return;
        }

        try {
            const request: VoiceCallRequest = {
                buyerEmail: session.user.email, // The vendor making the call (initiator)
                vendorEmail: customerEmail, // The customer receiving the call (recipient)
                shopId: shopId,
                shopName: selectedConversation?.buyerName || 'Shop'
            };

            console.log('Vendor initiating voice call:', {
                initiator: session.user.email,
                recipient: customerEmail,
                shopId: shopId
            });

            const call = await voiceCallService.initiateCall(request);
            setCurrentVoiceCall(call);
            setIsVoiceCallModalOpen(true);
        } catch (error) {
            console.error('Error initiating voice call:', error);
            toast.error('Failed to initiate voice call. Please try again.');
        }
    };

    const handleCloseVideoCall = (): void => {
        setIsVideoCallModalOpen(false);
        setCurrentVideoCall(null);
    };

    const handleCloseVoiceCall = (): void => {
        setIsVoiceCallModalOpen(false);
        setCurrentVoiceCall(null);
    };

    const filteredConversations = conversations.filter(conv =>
        (conv.buyerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (conv.buyerEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 168) { // 7 days
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg">Loading conversations...</div>
            </div>
        );
    }

    return (
        <VendorShopGuard showSubHeader={false}>
            {/* Chat Interface with 100px margin */}
            <div className="mx-25 my-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-200px)] flex">
                    {/* Left Panel - Conversations List */}
                    <div className={`${selectedConversation ? 'w-80' : 'w-full max-w-sm'} bg-white border-r border-gray-200 flex flex-col rounded-l-lg`}>
                        {/* Chat Filters */}
                        <div className="px-4 py-3 border-b border-gray-200">
                            <div className="flex gap-4 text-sm">
                                <button className="text-[#022B23] font-medium border-b-2 border-[#022B23] pb-1">All chats</button>
                                <button className="text-gray-500 hover:text-[#022B23]">New</button>
                                <button className="text-gray-500 hover:text-[#022B23]">Older</button>
                            </div>
                        </div>

                        {/* Messages Header */}
                        <div className="px-4 py-3 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                        </div>

                        {/* Conversations List */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredConversations.length === 0 ? (
                                <div className="text-center py-12 px-4">
                                    <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {searchTerm ? 'No conversations found' : 'No customer chats yet'}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {searchTerm
                                            ? 'Try adjusting your search terms'
                                            : 'When customers message you, they\'ll appear here'
                                        }
                                    </p>
                                    {!searchTerm && (
                                        <button
                                            onClick={fetchConversations}
                                            disabled={loading}
                                            className="px-4 py-2 bg-[#022B23] text-white rounded-lg hover:bg-[#033d32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                        >
                                            {loading ? 'Checking...' : 'Check for Messages'}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {filteredConversations.map((conversation) => (
                                        <div
                                            key={conversation.id}
                                            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                                selectedConversation?.id === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                            }`}
                                            onClick={() => openChat(conversation)}
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Profile Avatar */}
                                                <div className="relative">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {(conversation.buyerName || 'U').charAt(0).toUpperCase()}
                          </span>
                                                    </div>
                                                    {conversation.unreadCount > 0 && (
                                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {conversation.unreadCount > 9 ? '9' : conversation.unreadCount}
                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Conversation Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="font-medium text-gray-900 truncate text-sm">
                                                            {conversation.buyerName}
                                                        </h3>
                                                        <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {conversation.lastMessage}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel - Chat Interface */}
                    {selectedConversation && (
                        <div className="flex-1 flex flex-col bg-white rounded-r-lg">
                            {/* Chat Header */}
                            <div className="border-b border-gray-200 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {selectedConversation.buyerName}
                                        </h2>
                                        <span className="text-sm text-gray-500">
                    12:23 PM
                  </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => initiateVideoCall(selectedConversation.buyerEmail)}
                                            className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200"
                                            title="Video Call"
                                            disabled={shopId === 0}
                                        >
                                            <Video size={18} className={shopId === 0 ? "text-gray-400" : "text-blue-600"} />
                                        </button>
                                        <button
                                            onClick={() => initiateVoiceCall(selectedConversation.buyerEmail)}
                                            className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200"
                                            title="Voice Call"
                                            disabled={shopId === 0}
                                        >
                                            <Phone size={18} className={shopId === 0 ? "text-gray-400" : "text-green-600"} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
                                {chatLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#022B23] mx-auto"></div>
                                            <p className="mt-2 text-gray-600">Loading messages...</p>
                                        </div>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center text-gray-500 mt-8">
                                        <p>No messages yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((message, index) => (
                                            <div
                                                key={`${message.id}-${message.timestamp}-${index}`}
                                                className={`flex ${
                                                    message.fromEmail === session?.user?.email ? 'justify-end' : 'justify-start'
                                                }`}
                                            >
                                                {message.fromEmail !== session?.user?.email && (
                                                    <div className="flex items-end gap-3">
                                                        <div className="w-[24px] h-[24px] rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-medium">
                              {selectedConversation.buyerName.charAt(0).toUpperCase()}
                            </span>
                                                        </div>
                                                        <div className="bg-gray-200 rounded-2xl rounded-tl-md px-4 py-2 max-w-xs">
                                                            <p className="text-sm text-gray-900">{message.message}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {message.fromEmail === session?.user?.email && (
                                                    <div className="flex gap-2 items-end">
                                                        <div className="bg-[#022B23] text-white rounded-2xl rounded-tr-md px-4 py-2 max-w-xs">
                                                            <p className="text-sm">{message.message}</p>
                                                            <div className="flex items-center justify-end mt-1 gap-1">
                              <span className="text-xs text-gray-300">
                                {formatTime(message.timestamp)}
                              </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Image src={blueCircle} alt={'image'} height={24} width={24} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="border-t border-gray-200 px-6 py-4 bg-white">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={handleKeyPress}
                                            placeholder="Type here"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#022B23] focus:border-transparent text-sm"
                                        />
                                    </div>
                                    <button
                                        onClick={sendMessage}
                                        disabled={!newMessage.trim()}
                                        className="p-3 bg-[#022B23] text-white rounded-full hover:bg-[#033d32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Video Call Modal */}
            <VideoCallModal
                isOpen={isVideoCallModalOpen}
                onClose={handleCloseVideoCall}
                call={currentVideoCall}
                userEmail={session?.user?.email || ''}
                userType="vendor"
            />

            {/* Voice Call Modal */}
            <VoiceCallModal
                isOpen={isVoiceCallModalOpen}
                onClose={handleCloseVoiceCall}
                call={currentVoiceCall}
                userEmail={session?.user?.email || ''}
                userType="vendor"
            />
        </VendorShopGuard>
    );
};

export default VendorChatsPage;