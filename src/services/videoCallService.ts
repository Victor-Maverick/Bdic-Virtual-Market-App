import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface VideoCallRequest {
  buyerEmail: string;
  vendorEmail: string;
  productId?: number;
  shopId?: number;
  productName?: string;
  shopName?: string;
}

export interface VideoCallResponse {
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

class VideoCallService {
  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/video-calls/health`);
      console.log('📞 Video call service health check:', response.status);
      return response.status === 200;
    } catch (error) {
      console.error('📞 Video call service not available:', error);
      return false;
    }
  }

  async initiateCall(request: VideoCallRequest): Promise<VideoCallResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/video-calls/initiate`, request);
      return response.data;
    } catch (error) {
      console.error('Error initiating video call:', error);
      throw error;
    }
  }

  async getAccessToken(roomName: string, userEmail: string): Promise<TwilioTokenResponse> {
    try {
      const url = `${API_BASE_URL}/video-calls/join/${roomName}?userEmail=${encodeURIComponent(userEmail)}`;
      console.log('🎥 Making request to:', url);
      
      // Join the call and get Twilio access token
      const response = await axios.post(url);
      console.log('🎥 Backend response for video call token:', response.data);
      console.log('🎥 Response status:', response.status);
      
      // Validate the response has the required token
      if (!response.data || !response.data.token) {
        console.error('🎥 Invalid token response - data:', response.data);
        throw new Error(`Invalid token response from backend: ${JSON.stringify(response.data)}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('🎥 Error getting video call access token:', error);
      if (axios.isAxiosError(error)) {
        console.error('🎥 Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method
        });
        
        // Provide more specific error messages
        if (error.response?.status === 404) {
          throw new Error('Video call service not available. Please ensure the call service is running.');
        } else if (error.response?.status === 400) {
          throw new Error(`Bad request: ${error.response?.data || 'Invalid request parameters'}`);
        } else {
          throw new Error('Server error. Please try again later.');
        }
      }
      throw error;
    }
  }

  async endCall(roomName: string, userEmail: string): Promise<VideoCallResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/video-calls/end/${roomName}?userEmail=${encodeURIComponent(userEmail)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error ending video call:', error);
      throw error;
    }
  }

  async declineCall(roomName: string, userEmail: string): Promise<VideoCallResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/video-calls/decline/${roomName}?userEmail=${encodeURIComponent(userEmail)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error declining video call:', error);
      throw error;
    }
  }

  async getCallHistory(userEmail: string): Promise<VideoCallResponse[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/video-calls/history?userEmail=${encodeURIComponent(userEmail)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting call history:', error);
      throw error;
    }
  }

  async getPendingCalls(vendorEmail: string): Promise<VideoCallResponse[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/video-calls/pending?vendorEmail=${encodeURIComponent(vendorEmail)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting pending calls:', error);
      throw error;
    }
  }

  async acceptCall(roomName: string): Promise<VideoCallResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/video-calls/accept/${roomName}`);
      return response.data;
    } catch (error) {
      console.error('Error accepting video call:', error);
      throw error;
    }
  }
}

export const videoCallService = new VideoCallService();
export default videoCallService;