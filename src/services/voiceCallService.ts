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

export interface TwilioVoiceTokenResponse {
    token: string;
    roomName: string;
    identity: string;
}

class VoiceCallService {
    async initiateCall(request: VoiceCallRequest): Promise<VoiceCallResponse> {
        try {
            const response = await axios.post(`${API_BASE_URL}/voice-calls/initiate`, request);
            return response.data;
        } catch (error) {
            console.error('Error initiating voice call:', error);
            throw error;
        }
    }

    async joinCall(roomName: string, userEmail: string): Promise<TwilioVoiceTokenResponse> {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/voice-calls/join/${roomName}?userEmail=${encodeURIComponent(userEmail)}`
            );
            return response.data;
        } catch (error) {
            console.error('Error joining voice call:', error);
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

    async getPendingCalls(userEmail: string): Promise<VoiceCallResponse[]> {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/voice-calls/pending-user?userEmail=${encodeURIComponent(userEmail)}`
            );
            return response.data;
        } catch (error) {
            console.error('Error getting pending calls:', error);
            throw error;
        }
    }

    async acceptCall(callId: string): Promise<VoiceCallResponse> {
        try {
            const response = await axios.post(`${API_BASE_URL}/voice-calls/accept/${callId}`);
            return response.data;
        } catch (error) {
            console.error('Error accepting voice call:', error);
            throw error;
        }
    }

    async rejectCall(callId: string): Promise<void> {
        try {
            await axios.post(`${API_BASE_URL}/voice-calls/reject/${callId}`);
        } catch (error) {
            console.error('Error rejecting voice call:', error);
            throw error;
        }
    }
}

export const voiceCallService = new VoiceCallService();
export default voiceCallService;