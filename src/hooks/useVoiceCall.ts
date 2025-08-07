import { useState, useEffect, useRef } from 'react';
import { connect, Room, LocalAudioTrack, RemoteParticipant, RemoteAudioTrack } from 'twilio-video';
import { voiceCallService } from '@/services/voiceCallService';

export interface UseVoiceCallProps {
  userEmail: string;
  displayName: string;
  onCallEnd?: () => void;
  onError?: (error: string) => void;
}

export const useVoiceCall = ({ userEmail, onCallEnd, onError }: UseVoiceCallProps) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [localAudioTrack, setLocalAudioTrack] = useState<LocalAudioTrack | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  const joinRoom = async (roomName: string) => {
    if (isConnecting || room) {
      console.log('🎤 Already connecting or connected, skipping join attempt');
      return;
    }

    try {
      setIsConnecting(true);
      console.log('🎤 Joining voice room:', roomName);

      // Get access token from backend
      const tokenResponse = await voiceCallService.getAccessToken(roomName, userEmail);
      console.log('🎤 Got access token for voice call:', tokenResponse);
      console.log('🎤 Token value:', tokenResponse.token);
      console.log('🎤 Token type:', typeof tokenResponse.token);

      // Validate token before using it
      if (!tokenResponse.token || typeof tokenResponse.token !== 'string') {
        throw new Error(`Invalid token received: ${tokenResponse.token} (type: ${typeof tokenResponse.token})`);
      }

      // Connect to Twilio room with audio only
      const twilioRoom = await connect(tokenResponse.token, {
        name: roomName,
        audio: true,
        video: false, // Disable video for voice calls
        dominantSpeaker: true,
        networkQuality: true,
      });

      console.log('🎤 Connected to Twilio voice room:', twilioRoom.name);
      setRoom(twilioRoom);
      setIsConnected(true);

      // Handle existing participants
      twilioRoom.participants.forEach(participant => {
        console.log('🎤 Existing participant in voice room:', participant.identity);
        setParticipants(prev => [...prev, participant]);
        subscribeToParticipant(participant);
      });

      // Handle new participants joining
      twilioRoom.on('participantConnected', (participant: RemoteParticipant) => {
        console.log('🎤 Participant joined voice room:', participant.identity);
        setParticipants(prev => [...prev, participant]);
        subscribeToParticipant(participant);
      });

      // Handle participants leaving
      twilioRoom.on('participantDisconnected', (participant: RemoteParticipant) => {
        console.log('🎤 Participant left voice room:', participant.identity);
        setParticipants(prev => prev.filter(p => p.identity !== participant.identity));
      });

      // Handle room disconnection
      twilioRoom.on('disconnected', (room: Room, error?: Error) => {
        console.log('🎤 Disconnected from voice room:', room.name);
        if (error) {
          console.error('🎤 Voice room disconnection error:', error);
        }
        setRoom(null);
        setIsConnected(false);
        setParticipants([]);
        onCallEnd?.();
      });

      // Handle local audio track
      const audioTracks = Array.from(twilioRoom.localParticipant.audioTracks.values());
      if (audioTracks.length > 0) {
        const audioTrack = audioTracks[0].track as LocalAudioTrack;
        setLocalAudioTrack(audioTrack);
        setIsAudioEnabled(audioTrack.isEnabled);
      }

    } catch (error) {
      console.error('🎤 Error joining voice room:', error);
      setIsConnecting(false);
      setIsConnected(false);
      onError?.(`Failed to join voice call: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const subscribeToParticipant = (participant: RemoteParticipant) => {
    // Subscribe to existing audio tracks
    participant.audioTracks.forEach(publication => {
      if (publication.isSubscribed && publication.track) {
        attachAudioTrack(publication.track as RemoteAudioTrack);
      }
    });

    // Subscribe to new audio tracks
    participant.on('trackSubscribed', (track) => {
      if (track.kind === 'audio') {
        console.log('🎤 Subscribed to audio track from:', participant.identity);
        attachAudioTrack(track as RemoteAudioTrack);
      }
    });

    // Handle track unsubscription
    participant.on('trackUnsubscribed', (track) => {
      if (track.kind === 'audio') {
        console.log('🎤 Unsubscribed from audio track from:', participant.identity);
        detachAudioTrack(track as RemoteAudioTrack);
      }
    });
  };

  const attachAudioTrack = (track: RemoteAudioTrack) => {
    if (audioRef.current) {
      track.attach(audioRef.current);
      console.log('🎤 Attached remote audio track');
    }
  };

  const detachAudioTrack = (track: RemoteAudioTrack) => {
    track.detach();
    console.log('🎤 Detached remote audio track');
  };

  const leaveRoom = async () => {
    if (room) {
      try {
        console.log('🎤 Leaving voice room:', room.name);
        
        // Notify backend that call is ending
        await voiceCallService.endCall(room.name, userEmail);
        
        // Disconnect from Twilio room
        room.disconnect();
        
        // Clean up local tracks
        if (localAudioTrack) {
          localAudioTrack.stop();
          setLocalAudioTrack(null);
        }
        
        setRoom(null);
        setIsConnected(false);
        setParticipants([]);
        console.log('🎤 Successfully left voice room');
      } catch (error) {
        console.error('🎤 Error leaving voice room:', error);
        // Force cleanup even if backend call fails
        room.disconnect();
        setRoom(null);
        setIsConnected(false);
        setParticipants([]);
      }
    }
  };

  const toggleAudio = () => {
    if (localAudioTrack) {
      if (isAudioEnabled) {
        localAudioTrack.disable();
        setIsAudioEnabled(false);
        console.log('🎤 Audio muted');
      } else {
        localAudioTrack.enable();
        setIsAudioEnabled(true);
        console.log('🎤 Audio unmuted');
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
      if (localAudioTrack) {
        localAudioTrack.stop();
      }
    };
  }, [room, localAudioTrack]);

  return {
    room,
    isConnected,
    isConnecting,
    participants,
    isAudioEnabled,
    joinRoom,
    leaveRoom,
    toggleAudio,
    audioRef
  };
};