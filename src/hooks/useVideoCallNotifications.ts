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
  const [callStatus, setCallStatus] = useState<{ type: string; roomName?: string } | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;

    // Remove /api from the end of API_BASE_URL and add the WebSocket endpoint
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '');
    const socket = new SockJS(`${baseUrl}/api/ws/video-call`);
    const client = Stomp.over(socket);

    // Disable debug logging
    client.debug = () => {};

    client.connect({}, () => {
      console.log('✅ Connected to video call WebSocket');
      console.log('📧 User email:', session.user.email);
      console.log('🔗 WebSocket URL:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ws/video-call`);
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
          
          // Handle specific call status types
          if (data.type === 'CALL_ENDED') {
            console.log('📞 useVideoCallNotifications: Call ended by other participant');
          } else if (data.type === 'CALL_DECLINED') {
            console.log('📞 useVideoCallNotifications: Call declined');
          } else if (data.type === 'CALL_MISSED') {
            console.log('📞 useVideoCallNotifications: Call missed');
          }
        } catch (error) {
          console.error('❌ useVideoCallNotifications: Error parsing call status message:', error);
        }
      });

      // Subscribe to video signaling
      client.subscribe(`/user/${session.user.email}/queue/video-signal`, (message) => {
        try {
          const signal = JSON.parse(message.body);
          console.log('Received video signal:', signal);
          // Handle WebRTC signaling if needed
        } catch (error) {
          console.error('Error parsing video signal:', error);
        }
      });

      // Subscribe to ICE candidates
      client.subscribe(`/user/${session.user.email}/queue/ice-candidate`, (message) => {
        try {
          const candidate = JSON.parse(message.body);
          console.log('Received ICE candidate:', candidate);
          // Handle ICE candidate if needed
        } catch (error) {
          console.error('Error parsing ICE candidate:', error);
        }
      });
    }, (error: Error) => {
      console.error('❌ WebSocket connection error:', error);
      console.error('🔗 Failed to connect to:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ws/video-call`);
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
      stompClient.send('/app/video-call/signal', {}, JSON.stringify({
        ...signal,
        targetUser,
        fromUser: session?.user?.email
      }));
    }
  };

  const sendIceCandidate = (targetUser: string, candidate: RTCIceCandidate) => {
    if (stompClient && stompClient.connected) {
      stompClient.send('/app/video-call/ice-candidate', {}, JSON.stringify({
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