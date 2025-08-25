import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SockJS from 'sockjs-client';
import { Stomp, CompatClient } from '@stomp/stompjs';
import { VideoCallResponse } from '@/services/videoCallService';

interface IncomingCallData {
  call: VideoCallResponse;
  productName?: string;
  shopName?: string;
  type: string;
}

export const useVideoCallNotifications = () => {
  const { data: session } = useSession();
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
  const [callStatus, setCallStatus] = useState<{ type: string; roomName?: string; forceClose?: boolean } | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;

    // Remove /api from the end of API_BASE_URL and add the WebSocket endpoint
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '');
    const wsUrl = `${baseUrl}/ws`;
    console.log('📞 Attempting to connect to video call WebSocket:', wsUrl);
    console.log('📞 Base URL:', baseUrl);
    console.log('📞 User email:', session.user.email);
    
    const socket = new SockJS(wsUrl);
    const client = Stomp.over(() => socket); // Fix: Provide factory function for auto-reconnect

    // Enable debug logging for troubleshooting
    client.debug = (str) => {
      console.log('📞 STOMP Debug:', str);
    };

    client.connect({}, () => {
      console.log('✅ Connected to video call WebSocket');
      console.log('📧 User email:', session.user.email);
      console.log('🔗 WebSocket URL:', wsUrl);
      setIsConnected(true);
      setStompClient(client);

      // Subscribe to incoming calls
      const incomingCallSubscription = `/user/${session.user.email}/queue/incoming-call`;
      console.log('📞 Subscribing to incoming calls:', incomingCallSubscription);
      client.subscribe(incomingCallSubscription, (message) => {
        try {
          const data: IncomingCallData = JSON.parse(message.body);
          console.log('🔔 Received incoming call:', data);
          setIncomingCall(data);
        } catch (error) {
          console.error('❌ Error parsing incoming call message:', error);
        }
      });

      // Subscribe to call status updates
      client.subscribe(`/user/${session.user.email}/queue/call-status`, (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log('📞 useVideoCallNotifications: Received call status update:', data);
          setCallStatus(data);
          console.log("Status: ", data)
          
          // Handle specific call status types that should close modals
          if (data.type === 'CALL_ENDED' || data.type === 'CALL_DECLINED' || data.type === 'CALL_MISSED') {
            console.log(`📞 useVideoCallNotifications: ${data.type} - will trigger modal close`);
            // Add forceClose flag to ensure modal closes
            setCallStatus({ ...data, forceClose: true });
          }
        } catch (error) {
          console.error('❌ useVideoCallNotifications: Error parsing call status message:', error);
        }
      });

      // Subscribe to WebRTC signaling
      client.subscribe(`/user/queue/webrtc-signal`, (message) => {
        try {
          const signal = JSON.parse(message.body);
          console.log('Received WebRTC signal:', signal);
          // Handle WebRTC signaling if needed
        } catch (error) {
          console.error('Error parsing WebRTC signal:', error);
        }
      });
    }, (error: Error) => {
      console.error('❌ Video call WebSocket connection error:', error);
      console.error('🔗 Failed to connect to:', `${baseUrl}/ws`);
      console.log('ℹ️ This is expected if the call service is not running or WebSocket endpoints are not available');
      setIsConnected(false);
    });

    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
      setIsConnected(false);
      setStompClient(null);
    };
  }, [session?.user?.email]);

  const clearIncomingCall = () => {
    setIncomingCall(null);
  };

  const clearCallStatus = () => {
    console.log('📞 useVideoCallNotifications: Clearing call status');
    setCallStatus(null);
  };

  const sendSignal = (targetUser: string, signal: { type: string; [key: string]: unknown }) => {
    if (stompClient && stompClient.connected) {
      stompClient.send('/app/webrtc/offer', {}, JSON.stringify({
        ...signal,
        targetUser,
        fromUser: session?.user?.email
      }));
    }
  };

  const sendIceCandidate = (targetUser: string, candidate: RTCIceCandidate) => {
    if (stompClient && stompClient.connected) {
      stompClient.send('/app/webrtc/ice-candidate', {}, JSON.stringify({
        ...candidate,
        targetUser,
        fromUser: session?.user?.email
      }));
    }
  };

  return {
    isConnected,
    incomingCall,
    callStatus,
    clearIncomingCall,
    clearCallStatus,
    sendSignal,
    sendIceCandidate
  };
};