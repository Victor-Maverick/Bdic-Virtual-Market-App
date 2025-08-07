import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface VoiceCallRequest {
  buyerEmail: string;
  vendorEmail: string;
  productId?: number;
  shopId?: number;
  productName?: string;
  shopName?: string;
}

export interface VoiceCallResponse {
  id: number;
  roomName: string;
  buyerEmail: string;
  vendorEmail: string;
  productId?: number;
  shopId?: number;
  productName?: string;
  shopName?: string;
  status: 'INITIATED' | 'RINGING' | 'ACTIVE' | 'ENDED' | 'DECLINED' | 'MISSED';
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  durationSeconds?: number;
  buyerJoined: boolean;
  vendorJoined: boolean;
}

export interface TwilioTokenResponse {
  token: string;
  roomName: string;
  identity: string;
}

class VoiceCallService {
  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/voice-calls/health`);
      console.log('🎤 Voice call service health check:', response.status);
      return response.status === 200;
    } catch (error) {
      console.error('🎤 Voice call service not available:', error);
      return false;
    }
  }

  async initiateCall(request: VoiceCallRequest): Promise<VoiceCallResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/voice-calls/initiate`, request);
      return response.data;
    } catch (error) {
      console.error('Error initiating voice call:', error);
      throw error;
    }
  }

  async getAccessToken(roomName: string, userEmail: string): Promise<TwilioTokenResponse> {
    try {
      const url = `${API_BASE_URL}/voice-calls/join/${roomName}?userEmail=${encodeURIComponent(userEmail)}`;
      console.log('🎤 Making request to:', url);
      
      // Join the call and get Twilio access token
      const response = await axios.post(url);
      console.log('🎤 Backend response for voice call token:', response.data);
      console.log('🎤 Response status:', response.status);
      
      // Validate the response has the required token
      if (!response.data || !response.data.token) {
        console.error('🎤 Invalid token response - data:', response.data);
        throw new Error(`Invalid token response from backend: ${JSON.stringify(response.data)}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('🎤 Error getting voice call access token:', error);
      if (axios.isAxiosError(error)) {
        console.error('🎤 Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method
        });
        
        // Provide more specific error messages
        if (error.response?.status === 404) {
          throw new Error('Voice call service not available. Please ensure the call service is running.');
        } else if (error.response?.status === 400) {
          throw new Error(`Bad request: ${error.response?.data || 'Invalid request parameters'}`);
        } else  {
          throw new Error('Server error. Please try again later.');
        }
      }
      throw error;
    }
  }

  async endCall(roomName: string, userEmail: string): Promise<VoiceCallResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/voice-calls/end/${roomName}?userEmail=${encodeURIComponent(userEmail)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error ending voice call:', error);
      throw error;
    }
  }

  async declineCall(roomName: string, userEmail: string): Promise<VoiceCallResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/voice-calls/decline/${roomName}?userEmail=${encodeURIComponent(userEmail)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error declining voice call:', error);
      throw error;
    }
  }

  async getCallHistory(userEmail: string): Promise<VoiceCallResponse[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/voice-calls/history?userEmail=${encodeURIComponent(userEmail)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting call history:', error);
      throw error;
    }
  }

  async getPendingCalls(vendorEmail: string): Promise<VoiceCallResponse[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/voice-calls/pending?vendorEmail=${encodeURIComponent(vendorEmail)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting pending calls:', error);
      throw error;
    }
  }

  async acceptCall(roomName: string): Promise<VoiceCallResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/voice-calls/accept/${roomName}`);
      return response.data;
    } catch (error) {
      console.error('Error accepting voice call:', error);
      throw error;
    }
  }
}

export const voiceCallService = new VoiceCallService();
export default voiceCallService;