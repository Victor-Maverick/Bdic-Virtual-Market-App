//hooks/useTwillioCall.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { CallResponse } from '../services/twilioCallService';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import AudioUtils from "@/utils/audioUtils";

export const useTwilioCall = () => {
  const { data: session } = useSession();
  const [incomingCall, setIncomingCall] = useState<CallResponse | null>(null);
  const [currentCall, setCurrentCall] = useState<CallResponse | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  // WebSocket connection for real-time call notifications
  // hooks/useTwilioCall.tsx - Updated WebSocket connection
  useEffect(() => {
    if (!session?.user?.email) {
      console.log('No user email, skipping WebSocket connection');
      return;
    }

    console.log('Establishing WebSocket connection for user:', session.user.email);

    const connectWebSocket = () => {
      // Use the correct WebSocket endpoint (try both)
      const endpoints = [
        `https://digitalmarket.benuestate.gov.ng/ws`,
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ws`
      ];

      let socket: any = null;
      let connected = false;

      // Try each endpoint until one works
      for (const endpoint of endpoints) {
        try {
          socket = new SockJS(endpoint);
          console.log('Trying WebSocket endpoint:', endpoint);
          break;
        } catch (error) {
          console.log('Failed to connect to:', endpoint, error);
        }
      }

      if (!socket) {
        console.error('All WebSocket endpoints failed');
        return;
      }

      const client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log('STOMP:', str),
        connectHeaders: {
          'userEmail': session.user.email,
          'X-User-Email': session.user.email
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          connected = true;
          console.log('✅ WebSocket connected successfully for user:', session.user.email);

          // Subscribe to incoming call notifications
          const userQueue = `/user/${session.user.email}/queue/incoming-call`;

          client.subscribe(userQueue, (message) => {
            console.log('📞 Incoming call notification received:', message.body);
            try {
              const call: CallResponse = JSON.parse(message.body);
              setIncomingCall(call);

              // Play notification sound
              AudioUtils.playIncomingCallSound();
            } catch (error) {
              console.error('Error parsing call notification:', error);
            }
          });

          // Subscribe to call status updates
          const statusQueues = [
            '/user/queue/call-answered',
            '/user/queue/call-rejected',
            '/user/queue/call-missed',
            '/user/queue/call-ended'
          ];

          statusQueues.forEach(queue => {
            client.subscribe(queue, (message) => {
              console.log(`Call status update from ${queue}:`, message.body);
              // Handle call status changes
              const callData = JSON.parse(message.body);

              switch (queue) {
                case '/user/queue/call-answered':
                  // Call was answered by the other party
                  break;
                case '/user/queue/call-rejected':
                  // Call was rejected
                  setIncomingCall(null);
                  break;
                case '/user/queue/call-missed':
                  // Call was missed
                  setIncomingCall(null);
                  break;
                case '/user/queue/call-ended':
                  // Call ended
                  setCurrentCall(null);
                  setIsCallModalOpen(false);
                  break;
              }
            });
          });
        },
        onDisconnect: () => {
          connected = false;
          console.log('❌ WebSocket disconnected');
        },
        onStompError: (frame) => {
          console.error('STOMP Error:', frame);
        },
        onWebSocketError: (event) => {
          console.error('WebSocket Error:', event);
        }
      });

      client.activate();
      setStompClient(client);

      // Test connection
      setTimeout(() => {
        if (!connected) {
          console.log('WebSocket connection timeout, trying to reconnect...');
          client.deactivate();
          setTimeout(connectWebSocket, 2000);
        }
      }, 5000);

      return client;
    };

    const client = connectWebSocket();

    return () => {
      console.log('Cleaning up WebSocket connection');
      if (client) {
        try {
          client.deactivate();
        } catch (error) {
          console.log('Error during WebSocket cleanup:', error);
        }
      }
    };
  }, [session?.user?.email]);

  // Handle custom events for opening call modal
  useEffect(() => {
    const handleOpenTwilioCall = (event: CustomEvent) => {
      const { call, isInitiator } = event.detail;
      const callWithInitiator = { ...call, isInitiator };
      setCurrentCall(callWithInitiator);
      setIsCallModalOpen(true);
    };

    window.addEventListener('openTwilioCall', handleOpenTwilioCall as EventListener);
    
    return () => {
      window.removeEventListener('openTwilioCall', handleOpenTwilioCall as EventListener);
    };
  }, []);

  const dismissIncomingCall = useCallback(() => {
    setIncomingCall(null);
  }, []);

  const closeCallModal = useCallback(() => {
    setIsCallModalOpen(false);
    setCurrentCall(null);
  }, []);

  return {
    incomingCall,
    currentCall,
    isCallModalOpen,
    dismissIncomingCall,
    closeCallModal
  };
};