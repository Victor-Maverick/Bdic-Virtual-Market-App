//vendor/dashboard/chats
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Phone, Video } from 'lucide-react';
import { toast } from 'react-toastify';
import { chatService } from '@/services/chatService';
import { videoCallService, VideoCallRequest, VideoCallResponse } from '@/services/videoCallService';
import { voiceCallService, VoiceCallRequest, VoiceCallResponse } from '@/services/voiceCallService';
import VideoCallModal from '@/components/VideoCallModal';
import VoiceCallModal from '@/components/VoiceCallModal';
import ImprovedChatInterface from '@/components/ImprovedChatInterface';
import VendorShopGuard from "@/components/VendorShopGuard";
import DashboardHeader from "@/components/dashboardHeader";
import DashboardOptions from "@/components/dashboardOptions";

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



const VendorChatsPage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm] = useState('');

    
    // Chat interface state
    const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);

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
        };
    }, [session?.user?.email, router, fetchConversations, conversations.length]);



    const openChat = async (conversation: ChatConversation) => {
        console.log('Opening chat with buyer:', conversation.buyerEmail);
        setSelectedConversation(conversation);
        
        // Mark messages as read
        if (session?.user?.email) {
            try {
                await chatService.markMessagesAsRead(conversation.buyerEmail, session.user.email);
                
                // Update the conversation's unread count locally
                setConversations(prev => prev.map(conv => 
                    conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
                ));
            } catch (error) {
                console.error('Error marking messages as read:', error);
            }
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
            <VendorShopGuard showSubHeader={false}>
                <DashboardHeader />
                <DashboardOptions />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#022B23] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading conversations...</p>
                    </div>
                </div>
            </VendorShopGuard>
        );
    }

    return (
        <VendorShopGuard showSubHeader={false}>
            <DashboardHeader />
            <DashboardOptions />
            {/* Chat Interface with responsive margins */}
            <div className="mx-4 sm:mx-25 my-4 sm:my-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-200px)] flex">
                    {/* Left Panel - Conversations List */}
                    <div className={`${
                        selectedConversation 
                            ? 'hidden lg:flex lg:w-80' 
                            : 'w-full max-w-full lg:max-w-sm'
                    } bg-white border-r border-gray-200 flex flex-col rounded-l-lg`}>
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
                                            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100 ${
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
                        <div className="flex-1 flex flex-col bg-white rounded-r-lg lg:rounded-l-none">
                            <ImprovedChatInterface
                                otherUserEmail={selectedConversation.buyerEmail}
                                otherUserName={selectedConversation.buyerName}
                                className="h-full"
                                headerActions={
                                    <div className="flex items-center gap-2">
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
                                        {/* Mobile close button */}
                                        <button
                                            onClick={() => setSelectedConversation(null)}
                                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 lg:hidden"
                                        >
                                            ×
                                        </button>
                                    </div>
                                }
                            />
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