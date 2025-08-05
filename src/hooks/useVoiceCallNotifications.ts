import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SockJS from 'sockjs-client';
import { Stomp, CompatClient } from '@stomp/stompjs';
import { VoiceCallResponse } from '@/services/voiceCallService';

interface IncomingVoiceCallData {
  call: VoiceCallResponse;
  productName?: string;
  shopName?: string;
  type: string;
}

export const useVoiceCallNotifications = () => {
  const { data: session } = useSession();
  const [, setStompClient] = useState<CompatClient | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingVoiceCallData | null>(null);
  const [callStatus, setCallStatus] = useState<{ type: string; roomName?: string } | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;

    // Remove /api from the end of API_BASE_URL and add the WebSocket endpoint
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '');
    const socket = new SockJS(`${baseUrl}/api/ws/voice-call`);
    const client = Stomp.over(socket);

    // Disable debug logging
    client.debug = () => {};

    client.connect({}, () => {
      console.log('✅ Connected to voice call WebSocket');
      console.log('📧 User email:', session.user.email);
      console.log('🔗 WebSocket URL:', `${baseUrl}/api/ws/voice-call`);
      setIsConnected(true);
      setStompClient(client);

      // Subscribe to incoming voice calls
      const incomingCallSubscription = `/user/${session.user.email}/queue/incoming-voice-call`;
      console.log('🎤 Subscribing to incoming voice calls:', incomingCallSubscription);
      client.subscribe(incomingCallSubscription, (message) => {
        try {
          const data: IncomingVoiceCallData = JSON.parse(message.body);
          console.log('🔔 Received incoming voice call:', data);
          setIncomingCall(data);
        } catch (error) {
          console.error('❌ Error parsing incoming voice call message:', error);
        }
      });

      // Subscribe to voice call status updates
      client.subscribe(`/user/${session.user.email}/queue/voice-call-status`, (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log('🎤 useVoiceCallNotifications: Received call status update:', data);
          setCallStatus(data);
          
          // Handle specific call status types
          if (data.type === 'CALL_ENDED') {
            console.log('🎤 useVoiceCallNotifications: Voice call ended by other participant');
          } else if (data.type === 'CALL_DECLINED') {
            console.log('🎤 useVoiceCallNotifications: Voice call declined');
          } else if (data.type === 'CALL_MISSED') {
            console.log('🎤 useVoiceCallNotifications: Voice call missed');
          }
        } catch (error) {
          console.error('❌ useVoiceCallNotifications: Error parsing call status message:', error);
        }
      });

    }, (error: Error) => {
      console.error('❌ Voice call WebSocket connection error:', error);
      console.error('🔗 Failed to connect to:', `${baseUrl}/api/ws/voice-call`);
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
    console.log('🎤 useVoiceCallNotifications: Clearing call status');
    setCallStatus(null);
  };

  return {
    isConnected,
    incomingCall,
    callStatus,
    clearIncomingCall,
    clearCallStatus
  };
};