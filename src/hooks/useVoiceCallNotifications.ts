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
  const [callStatus, setCallStatus] = useState<{ type: string; roomName?: string; forceClose?: boolean } | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;

    // Remove /api from the end of API_BASE_URL and add the WebSocket endpoint
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '');
    const wsUrl = `${baseUrl}/ws`;
    console.log('🎤 Attempting to connect to voice call WebSocket:', wsUrl);
    console.log('🎤 Base URL:', baseUrl);
    console.log('🎤 User email:', session.user.email);
    
    const socket = new SockJS(wsUrl);
    const client = Stomp.over(() => socket); // Fix: Provide factory function for auto-reconnect

    // Enable debug logging for troubleshooting
    client.debug = (str) => {
      console.log('🎤 STOMP Debug:', str);
    };

    client.connect({}, () => {
      console.log('✅ Connected to voice call WebSocket');
      console.log('📧 User email:', session.user.email);
      console.log('🔗 WebSocket URL:', wsUrl);
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
          
          // Handle specific call status types that should close modals
          if (data.type === 'CALL_ENDED' || data.type === 'CALL_DECLINED' || data.type === 'CALL_MISSED') {
            console.log(`🎤 useVoiceCallNotifications: ${data.type} - will trigger modal close`);
            // Add forceClose flag to ensure modal closes
            setCallStatus({ ...data, forceClose: true });
          }
        } catch (error) {
          console.error('❌ useVoiceCallNotifications: Error parsing call status message:', error);
        }
      });

    }, (error: Error) => {
      console.error('❌ Voice call WebSocket connection error:', error);
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