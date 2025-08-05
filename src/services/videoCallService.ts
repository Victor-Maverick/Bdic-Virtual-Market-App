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
  async initiateCall(request: VideoCallRequest): Promise<VideoCallResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/video-calls/initiate`, request);
      return response.data;
    } catch (error) {
      console.error('Error initiating video call:', error);
      throw error;
    }
  }

  async joinCall(roomName: string, userEmail: string): Promise<TwilioTokenResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/video-calls/join/${roomName}?userEmail=${encodeURIComponent(userEmail)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error joining video call:', error);
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