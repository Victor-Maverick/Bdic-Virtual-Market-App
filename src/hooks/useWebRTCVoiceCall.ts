import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { voiceCallService, WebRTCSessionResponse } from '@/services/voiceCallService';

export interface UseWebRTCVoiceCallProps {
  userEmail: string;
  displayName: string;
  onCallEnd?: () => void;
  onError?: (error: string) => void;
}

export const useWebRTCVoiceCall = ({ userEmail, onCallEnd, onError }: UseWebRTCVoiceCallProps) => {
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [sessionInfo, setSessionInfo] = useState<WebRTCSessionResponse | null>(null);
  const [participantCount, setParticipantCount] = useState(1);

  const audioRef = useRef<HTMLAudioElement>(null);
  const stompClientRef = useRef<Client | null>(null);
  const isInitiatorRef = useRef(false);

  // Helper functions for WebSocket message handling (no useCallback to avoid dependency issues)
  const handleWebRTCSignaling = async (message: any) => {
    if (!peerConnection) return;

    console.log('🎤 Received signaling message:', message.type);

    try {
      switch (message.type) {
        case 'offer':
          await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          
          // Send answer back
          stompClientRef.current?.publish({
            destination: '/app/webrtc/answer',
            body: JSON.stringify({
              roomName: sessionInfo?.roomName,
              fromUser: userEmail,
              toUser: message.fromUser,
              answer: answer
            })
          });
          break;

        case 'answer':
          await peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
          break;

        case 'ice-candidate':
          await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
          break;
      }
    } catch (error) {
      console.error('🎤 Error handling signaling message:', error);
      onError?.(`Signaling error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleWebRTCCallStatus = (data: any) => {
    console.log('🎤 Call status update:', data.type);
    
    if (data.type === 'CALL_ENDED' || data.type === 'CALL_DECLINED' || data.type === 'CALL_MISSED') {
      cleanup();
      onCallEnd?.();
    }
  };

  // Handle signaling messages (kept for compatibility)
  const handleSignalingMessage = useCallback(async (message: any) => {
    if (!peerConnection) return;

    console.log('🎤 Received signaling message:', message.type);

    try {
      switch (message.type) {
        case 'offer':
          await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          
          // Send answer back
          stompClientRef.current?.publish({
            destination: '/app/webrtc/answer',
            body: JSON.stringify({
              roomName: sessionInfo?.roomName,
              fromUser: userEmail,
              toUser: message.fromUser,
              answer: answer
            })
          });
          break;

        case 'answer':
          await peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
          break;

        case 'ice-candidate':
          await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
          break;
      }
    } catch (error) {
      console.error('🎤 Error handling signaling message:', error);
      onError?.(`Signaling error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [peerConnection, sessionInfo, userEmail, onError]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    if (remoteStream) {
      setRemoteStream(null);
    }

    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }

    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    setSessionInfo(null);
  }, [peerConnection, localStream, remoteStream]);

  // Handle call status updates
  const handleCallStatusUpdate = useCallback((data: any) => {
    console.log('🎤 Call status update:', data.type);
    
    if (data.type === 'CALL_ENDED' || data.type === 'CALL_DECLINED' || data.type === 'CALL_MISSED') {
      cleanup();
      onCallEnd?.();
    }
  }, [cleanup, onCallEnd]);

  // Initialize WebSocket connection
  const initializeWebSocket = useCallback(() => {
    try {
      const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ws`);
      const client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log('[WebRTC Voice WebSocket]', str),
        onConnect: () => {
          console.log('🎤 WebRTC Voice WebSocket connected');
          
          // Subscribe to WebRTC signaling
          client.subscribe('/user/queue/webrtc-signal', (message) => {
            const data = JSON.parse(message.body);
            // Call the helper function directly without dependency
            handleWebRTCSignaling(data);
          });

          // Subscribe to call notifications
          client.subscribe('/user/queue/incoming-voice-call', (message) => {
            const data = JSON.parse(message.body);
            console.log('🎤 Incoming voice call:', data);
          });

          // Subscribe to call status updates
          client.subscribe('/user/queue/voice-call-status', (message) => {
            const data = JSON.parse(message.body);
            handleWebRTCCallStatus(data);
          });
        },
        onDisconnect: () => {
          console.log('🎤 WebRTC Voice WebSocket disconnected');
        },
        onStompError: (frame) => {
          console.error('🎤 WebRTC Voice WebSocket error:', frame);
        }
      });

      client.activate();
      stompClientRef.current = client;
    } catch (error) {
      console.error('🎤 Failed to initialize WebSocket:', error);
    }
  }, []);

  // Create peer connection
  const createPeerConnection = useCallback((iceServers: any[]) => {
    const pc = new RTCPeerConnection({ iceServers });

    // Add local stream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log('🎤 Received remote audio stream');
      if (event.streams[0]) {
        setRemoteStream(event.streams[0]);
        if (audioRef.current) {
          audioRef.current.srcObject = event.streams[0];
        }
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && stompClientRef.current) {
        stompClientRef.current.publish({
          destination: '/app/webrtc/ice-candidate',
          body: JSON.stringify({
            roomName: sessionInfo?.roomName,
            fromUser: userEmail,
            toUser: sessionInfo?.otherParticipant,
            candidate: event.candidate
          })
        });
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('🎤 Connection state:', pc.connectionState);
      setIsConnected(pc.connectionState === 'connected');
      
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        cleanup();
        onCallEnd?.();
      }
    };

    setPeerConnection(pc);
    return pc;
  }, [localStream, sessionInfo, userEmail, onCallEnd]);

  // Start local media (audio only)
  const startLocalMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
      });
      
      setLocalStream(stream);
      console.log('🎤 Local audio stream started:', stream.getAudioTracks().length, 'audio tracks');
      return stream;
    } catch (error) {
      console.error('🎤 Error accessing microphone:', error);
      onError?.(`Microphone access error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }, [onError]);

  // Join room with real WebRTC
  const joinRoom = useCallback(async (roomName: string) => {
    if (isConnecting) {
      console.log('🎤 Already connecting, skipping join attempt');
      return;
    }

    try {
      setIsConnecting(true);
      console.log('🎤 Joining WebRTC voice room:', roomName);

      // Initialize WebSocket connection
      initializeWebSocket();

      // Get session info from backend
      const session = await voiceCallService.getSessionInfo(roomName, userEmail);
      setSessionInfo(session);
      console.log('🎤 Got WebRTC session info:', session);

      // Start local media
      const stream = await startLocalMedia();
      
      // Create peer connection
      const pc = createPeerConnection(session.iceServers);
      
      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Join the room via WebSocket
      if (stompClientRef.current) {
        stompClientRef.current.publish({
          destination: '/app/webrtc/join-room',
          body: JSON.stringify({
            roomName: roomName,
            userEmail: userEmail
          })
        });
      }

      setIsConnecting(false);
      console.log('🎤 Successfully joined WebRTC voice room');

    } catch (error) {
      console.error('🎤 Error joining WebRTC voice room:', error);
      setIsConnecting(false);
      setIsConnected(false);
      onError?.(`Failed to join voice call: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [isConnecting, userEmail, startLocalMedia, onError, initializeWebSocket, createPeerConnection]);

  // Leave room
  const leaveRoom = useCallback(async () => {
    console.log('🎤 Leaving WebRTC voice room');
    
    // Leave the room via WebSocket
    if (stompClientRef.current && sessionInfo?.roomName) {
      stompClientRef.current.publish({
        destination: '/app/webrtc/leave-room',
        body: JSON.stringify({
          roomName: sessionInfo.roomName,
          userEmail: userEmail
        })
      });
    }
    
    // Stop local media
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    // Close peer connection
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    
    // Disconnect WebSocket
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
    
    setIsConnected(false);
    setIsConnecting(false);
    setRemoteStream(null);
    setSessionInfo(null);
    setParticipantCount(1);
  }, [localStream, peerConnection, sessionInfo, userEmail]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        console.log('🎤 Audio', audioTrack.enabled ? 'enabled' : 'disabled');
      }
    }
  }, [localStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    peerConnection,
    isConnected,
    isConnecting,
    participants: remoteStream ? [{ identity: sessionInfo?.otherParticipant || 'Remote User' }] : [],
    participantCount,
    isAudioEnabled,
    joinRoom,
    leaveRoom,
    toggleAudio,
    audioRef
  };
};