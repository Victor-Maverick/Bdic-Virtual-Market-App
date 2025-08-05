'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { aiAssistantService, ShopResult } from '@/services/aiAssistantService';

interface ChatMessage {
    id: string;
    message: string;
    isBot: boolean;
    timestamp: Date;
    suggestions?: string[];
    shopResults?: ShopResult[];
}



const VirtualMarketPage = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    const [conversationState, setConversationState] = useState('INITIAL');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const initializeChat = useCallback(async () => {
        try {
            setIsLoading(true);
            const chatResponse = await aiAssistantService.sendMessage({
                message: 'Hello',
                sessionId,
                conversationState: 'INITIAL'
            });
            
            const botMessage: ChatMessage = {
                id: `bot_${Date.now()}`,
                message: chatResponse.message,
                isBot: true,
                timestamp: new Date(),
                suggestions: chatResponse.suggestions,
                shopResults: chatResponse.shopResults
            };

            setMessages([botMessage]);
            setConversationState(chatResponse.conversationState);
        } catch (error) {
            console.error('Error initializing chat:', error);
            toast.error('Failed to initialize virtual assistant');
        } finally {
            setIsLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        // Initialize conversation
        initializeChat();
    }, [initializeChat]);


    const sendMessage = async (message: string) => {
        if (!message.trim() || isLoading) return;

        // Add user message
        const userMessage: ChatMessage = {
            id: `user_${Date.now()}`,
            message: message.trim(),
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const chatResponse = await aiAssistantService.sendMessage({
                message: message.trim(),
                sessionId,
                conversationState
            });
            
            const botMessage: ChatMessage = {
                id: `bot_${Date.now()}`,
                message: chatResponse.message,
                isBot: true,
                timestamp: new Date(),
                suggestions: chatResponse.suggestions,
                shopResults: chatResponse.shopResults
            };

            setMessages(prev => [...prev, botMessage]);
            setConversationState(chatResponse.conversationState);
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
            
            const errorMessage: ChatMessage = {
                id: `error_${Date.now()}`,
                message: 'Sorry, I encountered an error. Please try again.',
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        sendMessage(suggestion);
    };

    const handleShopClick = (shop: ShopResult) => {
        router.push(`/marketPlace/store/${shop.shopId}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputMessage);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#022B23] rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-semibold text-[#022B23]">Virtual Market Assistant</h1>
                            <p className="text-xs sm:text-sm text-gray-600">Find products and shops across all markets</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Container */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                <div className="bg-white rounded-lg shadow-sm border h-[500px] sm:h-[600px] flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                                    {/* Avatar */}
                                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        message.isBot ? 'bg-[#022B23]' : 'bg-blue-500'
                                    }`}>
                                        {message.isBot ? (
                                            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                        ) : (
                                            <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                        )}
                                    </div>

                                    {/* Message Content */}
                                    <div className={`flex flex-col ${message.isBot ? 'items-start' : 'items-end'}`}>
                                        <div className={`rounded-lg px-3 py-2 sm:px-4 sm:py-2 ${
                                            message.isBot 
                                                ? 'bg-gray-100 text-gray-800' 
                                                : 'bg-[#022B23] text-white'
                                        }`}>
                                            <p className="text-xs sm:text-sm">{message.message}</p>
                                        </div>
                                        
                                        <span className="text-xs text-gray-500 mt-1">
                                            {formatTime(message.timestamp)}
                                        </span>

                                        {/* Suggestions */}
                                        {message.suggestions && message.suggestions.length > 0 && (
                                            <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 max-w-full">
                                                {message.suggestions.map((suggestion, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                        className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                                                    >
                                                        {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Shop Results */}
                                        {message.shopResults && message.shopResults.length > 0 && (
                                            <div className="mt-3 space-y-2 w-full">
                                                <p className="text-sm font-medium text-gray-700">Available Shops:</p>
                                                {message.shopResults.map((shop) => (
                                                    <div
                                                        key={shop.shopId}
                                                        onClick={() => handleShopClick(shop)}
                                                        className="bg-white border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-medium text-[#022B23]">{shop.shopName}</h4>
                                                                <p className="text-sm text-gray-600">{shop.address}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {shop.market} • {shop.marketSection}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                                    {shop.productCount} products
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-[#022B23] rounded-full flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t p-4">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#022B23] focus:border-transparent"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !inputMessage.trim()}
                                className="bg-[#022B23] text-white px-4 py-2 rounded-lg hover:bg-[#033d32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VirtualMarketPage;