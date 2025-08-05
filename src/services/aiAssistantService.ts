import axios from 'axios';

const BOT_SERVICE_URL = process.env.NEXT_PUBLIC_BOT_SERVICE_URL || 'http://localhost:8087';

export interface ChatRequest {
    message: string;
    sessionId: string;
    conversationState: string;
}

export interface ShopResult {
    shopId: number;
    shopName: string;
    address: string;
    market: string;
    marketSection: string;
    productCount: number;
}

export interface ChatResponse {
    message: string;
    conversationState: string;
    suggestions: string[];
    shopResults: ShopResult[];
    requiresInput: boolean;
}

class AIAssistantService {
    private baseURL: string;

    constructor() {
        this.baseURL = `${BOT_SERVICE_URL}/api/bot`;
    }

    async sendMessage(request: ChatRequest): Promise<ChatResponse> {
        try {
            const response = await axios.post(`${this.baseURL}/chat`, request, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error sending message to AI assistant:', error);
            throw new Error('Failed to communicate with AI assistant');
        }
    }

    async clearSession(sessionId: string): Promise<void> {
        try {
            await axios.delete(`${this.baseURL}/session/${sessionId}`);
        } catch (error) {
            console.error('Error clearing session:', error);
            throw new Error('Failed to clear session');
        }
    }

    async checkHealth(): Promise<boolean> {
        try {
            const response = await axios.get(`${this.baseURL}/health`);
            return response.status === 200;
        } catch (error) {
            console.error('AI service health check failed:', error);
            return false;
        }
    }
}

export const aiAssistantService = new AIAssistantService();