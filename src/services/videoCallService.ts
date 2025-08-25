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

export interface WebRTCSessionResponse {
  roomName: string;
  userEmail: string;
  otherParticipant: string;
  callType: 'video' | 'voice';
  iceServers: Array<{
    urls: string;
    username?: string;
    credential?: string;
  }>;
}

class VideoCallService {
  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/webrtc/video-calls/health`);
      console.log('📞 WebRTC video call service health check:', response.status);
      return response.status === 200;
    } catch (error) {
      console.error('📞 WebRTC video call service not available:', error);
      return false;
    }
  }

  async initiateCall(request: VideoCallRequest): Promise<VideoCallResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/webrtc/video-calls/initiate`, request);
      return response.data;
    } catch (error) {
      console.error('Error initiating WebRTC video call:', error);
      throw error;
    }
  }

  async getSessionInfo(roomName: string, userEmail: string): Promise<WebRTCSessionResponse> {
    try {
      const url = `${API_BASE_URL}/webrtc/video-calls/join/${roomName}?userEmail=${encodeURIComponent(userEmail)}`;
      console.log('🎥 Making WebRTC request to:', url);
      
      // Join the call and get WebRTC session info
      const response = await axios.post(url);
      console.log('🎥 Backend response for WebRTC video call session:', response.data);
      console.log('🎥 Response status:', response.status);
      
      // Validate the response has the required session info
      if (!response.data || !response.data.roomName) {
        console.error('🎥 Invalid session response - data:', response.data);
        throw new Error(`Invalid session response from backend: ${JSON.stringify(response.data)}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('🎥 Error getting WebRTC video call session:', error);
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
          throw new Error('WebRTC video call service not available. Please ensure the call service is running.');
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
        `${API_BASE_URL}/webrtc/video-calls/end/${roomName}?userEmail=${encodeURIComponent(userEmail)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error ending WebRTC video call:', error);
      throw error;
    }
  }

  async declineCall(roomName: string, userEmail: string): Promise<VideoCallResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/webrtc/video-calls/decline/${roomName}?userEmail=${encodeURIComponent(userEmail)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error declining WebRTC video call:', error);
      throw error;
    }
  }

  async getCallHistory(userEmail: string): Promise<VideoCallResponse[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/webrtc/video-calls/history?userEmail=${encodeURIComponent(userEmail)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting WebRTC video call history:', error);
      throw error;
    }
  }

  async getPendingCalls(vendorEmail: string): Promise<VideoCallResponse[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/webrtc/video-calls/pending?vendorEmail=${encodeURIComponent(vendorEmail)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting pending WebRTC video calls:', error);
      throw error;
    }
  }

  async acceptCall(roomName: string, userEmail: string): Promise<VideoCallResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/webrtc/video-calls/accept/${roomName}?userEmail=${encodeURIComponent(userEmail)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error accepting WebRTC video call:', error);
      throw error;
    }
  }
}

export const videoCallService = new VideoCallService();
export default videoCallService;