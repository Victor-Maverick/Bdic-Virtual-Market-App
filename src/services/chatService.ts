import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ChatMessage {
  id: string;
  conversationId: string;
  fromEmail: string;
  toEmail: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  productId?: number;
  shopId?: number;
}

export interface ChatConversation {
  id: string;
  participantEmail: string;
  participantName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  buyerEmail: string;
  buyerName: string;
  buyerOnline: boolean;
}

export interface ChatInitiateRequest {
  buyerEmail: string;
  vendorEmail: string;
  productId?: number;
  shopId?: number;
  productName?: string;
  shopName?: string;
}

export interface ChatInitiateResponse {
  conversationId: string;
  buyerEmail: string;
  vendorEmail: string;
  productId?: number;
  shopId?: number;
  productName?: string;
  shopName?: string;
}

export interface SendMessageRequest {
  fromEmail: string;
  toEmail: string;
  message: string;
}

class ChatService {
  async initiateChat(request: ChatInitiateRequest): Promise<ChatInitiateResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/initiate`, request);
      return response.data;
    } catch (error) {
      console.error('Error initiating chat:', error);
      throw error;
    }
  }

  async sendMessage(request: SendMessageRequest): Promise<ChatMessage> {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/send`, request);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getMessages(user1Email: string, user2Email: string): Promise<ChatMessage[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/messages`, {
        params: { user1: user1Email, user2: user2Email }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  async getConversations(userEmail: string): Promise<ChatConversation[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/conversations/${userEmail}`);
      return response.data;
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw error;
    }
  }

  async markMessagesAsRead(fromEmail: string, toEmail: string): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/chat/mark-read`, {
        fromEmail,
        toEmail
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  generateConversationId(email1: string, email2: string): string {
    const safeEmail1 = email1.replace('@', '-at-').replace(/\./g, '-dot-');
    const safeEmail2 = email2.replace('@', '-at-').replace(/\./g, '-dot-');

    const emails = [safeEmail1, safeEmail2].sort();
    return `chat-${emails.join('_')}`;
  }

  async setUserOnline(userEmail: string, accessToken?: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/chat/user/${userEmail}/online`, {}, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      });
    } catch (error) {
      console.error('Error setting user online:', error);
      throw error;
    }
  }

  async setUserOffline(userEmail: string, accessToken?: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/chat/user/${userEmail}/offline`, {}, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      });
    } catch (error) {
      console.error('Error setting user offline:', error);
      throw error;
    }
  }

  async connect(userEmail: string): Promise<void> {
    // This would be implemented if we need WebSocket connection from frontend
    // For now, we'll use HTTP API calls
    console.log('Chat service connected for user:', userEmail);
  }
}

export const chatService = new ChatService();
export default chatService;