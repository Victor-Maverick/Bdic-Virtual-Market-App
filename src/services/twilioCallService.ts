import axios from 'axios';

export interface CallRequest {
  callerEmail: string;
  callerName: string;
  vendorEmail: string;
  vendorName: string;
  shopName: string;
  productId?: number;
  productName?: string;
  shopId?: number;
  callType: 'VOICE' | 'VIDEO';
}

export interface CallResponse {
  id: number;
  callerEmail: string;
  callerName: string;
  vendorEmail: string;
  vendorName: string;
  shopName: string;
  productId?: number;
  productName?: string;
  shopId?: number;
  callType: 'VOICE' | 'VIDEO';
  status: 'INITIATED' | 'RINGING' | 'ANSWERED' | 'REJECTED' | 'MISSED' | 'ENDED';
  twilioRoomSid: string;
  twilioRoomName: string;
  accessToken?: string;
  createdAt: string;
  answeredAt?: string;
  endedAt?: string;
  isInitiator?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const twilioCallService = {
  async initiateCall(request: CallRequest): Promise<CallResponse> {
    const response = await axios.post(`${API_BASE_URL}/calls/initiate`, request);
    return response.data;
  },

  async answerCall(callId: number, vendorEmail: string): Promise<CallResponse> {
    const response = await axios.post(`${API_BASE_URL}/calls/${callId}/answer`, null, {
      params: { vendorEmail }
    });
    return response.data;
  },

  async rejectCall(callId: number, vendorEmail: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/calls/${callId}/reject`, null, {
      params: { vendorEmail }
    });
  },

  async endCall(callId: number, userEmail: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/calls/${callId}/end`, null, {
      params: { userEmail }
    });
  },

  async getCallHistory(userEmail: string): Promise<CallResponse[]> {
    const response = await axios.get(`${API_BASE_URL}/calls/history`, {
      params: { userEmail }
    });
    return response.data;
  },

  async getVendorCalls(vendorEmail: string, status?: string): Promise<CallResponse[]> {
    const response = await axios.get(`${API_BASE_URL}/calls/vendor`, {
      params: { vendorEmail, status }
    });
    return response.data;
  }
};