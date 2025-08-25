import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface WebRTCCallRequest {
  buyerEmail: string;
  vendorEmail: string;
  productId?: number;
  shopId?: number;
  productName?: string;
  shopName?: string;
}

export interface WebRTCCallResponse {
  id: number;
  roomName: string;
  buyerEmail: string;
  vendorEmail: string;
  productId?: number;
  shopId?: number;
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

export interface WebRTCSignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'user-joined' | 'user-left';
  roomName: string;
  fromUser: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  userEmail?: string;
}

export class WebRTCCallService {
  private stompClient: Client | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private currentCall: WebRTCCallResponse | null = null;
  private isInitiator = false;

  // Event handlers
  public onIncomingCall?: (call: WebRTCCallResponse) => void;
  public onCallStatusUpdate?: (status: string, call: WebRTCCallResponse) => void;
  public onRemoteStream?: (stream: MediaStream) => void;
  public onLocalStream?: (stream: MediaStream) => void;
  public onCallEnded?: () => void;
  public onConnectionStateChange?: (state: RTCPeerConnectionState) => void;

  constructor() {
    this.connectWebSocket();
  }

  private connectWebSocket() {
    const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ws`);
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('[WebRTC WebSocket]', str),
      onConnect: () => {
        console.log('WebRTC WebSocket connected');
        this.subscribeToMessages();
      },
      onDisconnect: () => {
        console.log('WebRTC WebSocket disconnected');
      },
      onStompError: (frame) => {
        console.error('WebRTC WebSocket error:', frame);
      }
    });

    this.stompClient.activate();
  }

  private subscribeToMessages() {
    if (!this.stompClient) return;

    // Subscribe to WebRTC signaling
    this.stompClient.subscribe('/user/queue/webrtc-signal', (message) => {
      const data: WebRTCSignalingMessage = JSON.parse(message.body);
      this.handleSignalingMessage(data);
    });

    // Subscribe to call notifications
    this.stompClient.subscribe('/user/queue/incoming-call', (message) => {
      const data = JSON.parse(message.body);
      if (data.callType === 'webrtc-video') {
        this.handleIncomingCall(data.call);
      }
    });

    this.stompClient.subscribe('/user/queue/incoming-voice-call', (message) => {
      const data = JSON.parse(message.body);
      if (data.callType === 'webrtc-voice') {
        this.handleIncomingCall(data.call);
      }
    });

    // Subscribe to call status updates
    this.stompClient.subscribe('/user/queue/call-status', (message) => {
      const data = JSON.parse(message.body);
      if (data.callType?.startsWith('webrtc-')) {
        this.handleCallStatusUpdate(data);
      }
    });

    this.stompClient.subscribe('/user/queue/voice-call-status', (message) => {
      const data = JSON.parse(message.body);
      if (data.callType?.startsWith('webrtc-')) {
        this.handleCallStatusUpdate(data);
      }
    });
  }

  // Public API methods
  async initiateVideoCall(request: WebRTCCallRequest): Promise<WebRTCCallResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webrtc/video-calls/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error('Failed to initiate video call');
    }

    const call = await response.json();
    this.currentCall = call;
    this.isInitiator = true;
    
    return call;
  }

  async initiateVoiceCall(request: WebRTCCallRequest): Promise<WebRTCCallResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webrtc/voice-calls/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error('Failed to initiate voice call');
    }

    const call = await response.json();
    this.currentCall = call;
    this.isInitiator = true;
    
    return call;
  }

  async joinCall(roomName: string, userEmail: string, callType: 'video' | 'voice'): Promise<WebRTCSessionResponse> {
    const endpoint = callType === 'video' ? 'video-calls' : 'voice-calls';
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webrtc/${endpoint}/join/${roomName}?userEmail=${userEmail}`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Failed to join call');
    }

    const sessionInfo = await response.json();
    await this.setupPeerConnection(sessionInfo);
    
    return sessionInfo;
  }

  async acceptCall(roomName: string, callType: 'video' | 'voice'): Promise<void> {
    const endpoint = callType === 'video' ? 'video-calls' : 'voice-calls';
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webrtc/${endpoint}/accept/${roomName}`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Failed to accept call');
    }
  }

  async declineCall(roomName: string, userEmail: string, callType: 'video' | 'voice'): Promise<void> {
    const endpoint = callType === 'video' ? 'video-calls' : 'voice-calls';
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webrtc/${endpoint}/decline/${roomName}?userEmail=${userEmail}`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Failed to decline call');
    }
  }

  async endCall(roomName: string, userEmail: string, callType: 'video' | 'voice'): Promise<void> {
    const endpoint = callType === 'video' ? 'video-calls' : 'voice-calls';
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webrtc/${endpoint}/end/${roomName}?userEmail=${userEmail}`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Failed to end call');
    }

    this.cleanup();
  }

  async startMedia(video: boolean = true): Promise<MediaStream> {
    try {
      const constraints = {
        video: video,
        audio: true
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (this.onLocalStream) {
        this.onLocalStream(this.localStream);
      }

      return this.localStream;
    } catch (error) {
      console.error('Error accessing media:', error);
      throw error;
    }
  }

  // Private methods
  private async setupPeerConnection(sessionInfo: WebRTCSessionResponse) {
    this.peerConnection = new RTCPeerConnection({
      iceServers: sessionInfo.iceServers
    });

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection!.addTrack(track, this.localStream!);
      });
    }

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      console.log('Received remote stream');
      if (this.onRemoteStream && event.streams[0]) {
        this.onRemoteStream(event.streams[0]);
      }
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.stompClient) {
        this.stompClient.publish({
          destination: '/app/webrtc/ice-candidate',
          body: JSON.stringify({
            roomName: sessionInfo.roomName,
            fromUser: sessionInfo.userEmail,
            toUser: sessionInfo.otherParticipant,
            candidate: event.candidate
          })
        });
      }
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', this.peerConnection!.connectionState);
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange(this.peerConnection!.connectionState);
      }
    };

    // If initiator, create and send offer
    if (this.isInitiator) {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      this.stompClient!.publish({
        destination: '/app/webrtc/offer',
        body: JSON.stringify({
          roomName: sessionInfo.roomName,
          fromUser: sessionInfo.userEmail,
          toUser: sessionInfo.otherParticipant,
          offer: offer
        })
      });
    }
  }

  private async handleSignalingMessage(message: WebRTCSignalingMessage) {
    if (!this.peerConnection) return;

    switch (message.type) {
      case 'offer':
        await this.handleOffer(message);
        break;
      case 'answer':
        await this.handleAnswer(message);
        break;
      case 'ice-candidate':
        await this.handleIceCandidate(message);
        break;
    }
  }

  private async handleOffer(message: WebRTCSignalingMessage) {
    if (!message.offer || !this.peerConnection) return;

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    this.stompClient!.publish({
      destination: '/app/webrtc/answer',
      body: JSON.stringify({
        roomName: message.roomName,
        fromUser: this.getCurrentUserEmail(),
        toUser: message.fromUser,
        answer: answer
      })
    });
  }

  private async handleAnswer(message: WebRTCSignalingMessage) {
    if (!message.answer || !this.peerConnection) return;

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
  }

  private async handleIceCandidate(message: WebRTCSignalingMessage) {
    if (!message.candidate || !this.peerConnection) return;

    await this.peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
  }

  private handleIncomingCall(call: WebRTCCallResponse) {
    this.currentCall = call;
    this.isInitiator = false;
    
    if (this.onIncomingCall) {
      this.onIncomingCall(call);
    }
  }

  private handleCallStatusUpdate(data: any) {
    if (this.onCallStatusUpdate) {
      this.onCallStatusUpdate(data.type, data.call);
    }

    if (data.type === 'CALL_ENDED' || data.type === 'CALL_DECLINED' || data.type === 'CALL_MISSED') {
      this.cleanup();
      if (this.onCallEnded) {
        this.onCallEnded();
      }
    }
  }

  private cleanup() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    this.currentCall = null;
    this.isInitiator = false;
  }

  private getCurrentUserEmail(): string {
    // Get user email from localStorage (based on your auth system)
    return localStorage.getItem('userEmail') || 'unknown@user.email';
  }

  // Getters
  get isCallActive(): boolean {
    return this.currentCall !== null;
  }

  get callInfo(): WebRTCCallResponse | null {
    return this.currentCall;
  }

  // Cleanup method
  disconnect() {
    this.cleanup();
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}