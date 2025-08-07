import { useState, useEffect, useRef } from 'react';
import { connect, Room, LocalVideoTrack, LocalAudioTrack, RemoteParticipant, RemoteVideoTrack, RemoteAudioTrack } from 'twilio-video';
import { videoCallService } from '@/services/videoCallService';

export interface UseVideoCallProps {
  userEmail: string;
  displayName: string;
  onCallEnd?: () => void;
  onError?: (error: string) => void;
}

export const useVideoCall = ({ userEmail, onCallEnd, onError }: UseVideoCallProps) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<LocalAudioTrack | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const joinRoom = async (roomName: string) => {
    if (isConnecting || room) {
      console.log('🎥 Already connecting or connected, skipping join attempt');
      return;
    }

    try {
      setIsConnecting(true);
      console.log('🎥 Joining video room:', roomName);

      // Get access token from backend
      const tokenResponse = await videoCallService.getAccessToken(roomName, userEmail);
      console.log('🎥 Got access token for video call:', tokenResponse);
      console.log('🎥 Token value:', tokenResponse.token);
      console.log('🎥 Token type:', typeof tokenResponse.token);

      // Validate token before using it
      if (!tokenResponse.token || typeof tokenResponse.token !== 'string') {
        throw new Error(`Invalid token received: ${tokenResponse.token} (type: ${typeof tokenResponse.token})`);
      }

      // Connect to Twilio room
      const twilioRoom = await connect(tokenResponse.token, {
        name: roomName,
        audio: true,
        video: true,
        dominantSpeaker: true,
        networkQuality: true,
      });

      console.log('🎥 Connected to Twilio video room:', twilioRoom.name);
      setRoom(twilioRoom);
      setIsConnected(true);

      // Handle local tracks
      const videoTracks = Array.from(twilioRoom.localParticipant.videoTracks.values());
      const audioTracks = Array.from(twilioRoom.localParticipant.audioTracks.values());

      if (videoTracks.length > 0) {
        const videoTrack = videoTracks[0].track as LocalVideoTrack;
        setLocalVideoTrack(videoTrack);
        setIsVideoEnabled(videoTrack.isEnabled);

        // Attach local video
        if (localVideoRef.current) {
          videoTrack.attach(localVideoRef.current);
        }
      }

      if (audioTracks.length > 0) {
        const audioTrack = audioTracks[0].track as LocalAudioTrack;
        setLocalAudioTrack(audioTrack);
        setIsAudioEnabled(audioTrack.isEnabled);
      }

      // Handle existing participants
      twilioRoom.participants.forEach(participant => {
        console.log('🎥 Existing participant in video room:', participant.identity);
        setParticipants(prev => [...prev, participant]);
        subscribeToParticipant(participant);
      });

      // Handle new participants joining
      twilioRoom.on('participantConnected', (participant: RemoteParticipant) => {
        console.log('🎥 Participant joined video room:', participant.identity);
        setParticipants(prev => [...prev, participant]);
        subscribeToParticipant(participant);
      });

      // Handle participants leaving
      twilioRoom.on('participantDisconnected', (participant: RemoteParticipant) => {
        console.log('🎥 Participant left video room:', participant.identity);
        setParticipants(prev => prev.filter(p => p.identity !== participant.identity));
      });

      // Handle room disconnection
      twilioRoom.on('disconnected', (room: Room, error?: Error) => {
        console.log('🎥 Disconnected from video room:', room.name);
        if (error) {
          console.error('🎥 Video room disconnection error:', error);
        }
        setRoom(null);
        setIsConnected(false);
        setParticipants([]);
        onCallEnd?.();
      });

    } catch (error) {
      console.error('🎥 Error joining video room:', error);
      setIsConnecting(false);
      setIsConnected(false);
      onError?.(`Failed to join video call: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const subscribeToParticipant = (participant: RemoteParticipant) => {
    // Subscribe to existing tracks
    participant.videoTracks.forEach(publication => {
      if (publication.isSubscribed && publication.track) {
        attachVideoTrack(publication.track as RemoteVideoTrack);
      }
    });

    participant.audioTracks.forEach(publication => {
      if (publication.isSubscribed && publication.track) {
        attachAudioTrack(publication.track as RemoteAudioTrack);
      }
    });

    // Subscribe to new tracks
    participant.on('trackSubscribed', (track) => {
      if (track.kind === 'video') {
        console.log('🎥 Subscribed to video track from:', participant.identity);
        attachVideoTrack(track as RemoteVideoTrack);
      } else if (track.kind === 'audio') {
        console.log('🎥 Subscribed to audio track from:', participant.identity);
        attachAudioTrack(track as RemoteAudioTrack);
      }
    });

    // Handle track unsubscription
    participant.on('trackUnsubscribed', (track) => {
      if (track.kind === 'video') {
        console.log('🎥 Unsubscribed from video track from:', participant.identity);
        detachVideoTrack(track as RemoteVideoTrack);
      } else if (track.kind === 'audio') {
        console.log('🎥 Unsubscribed from audio track from:', participant.identity);
        detachAudioTrack(track as RemoteAudioTrack);
      }
    });
  };

  const attachVideoTrack = (track: RemoteVideoTrack) => {
    if (remoteVideoRef.current) {
      track.attach(remoteVideoRef.current);
      console.log('🎥 Attached remote video track');
    }
  };

  const detachVideoTrack = (track: RemoteVideoTrack) => {
    track.detach();
    console.log('🎥 Detached remote video track');
  };

  const attachAudioTrack = (track: RemoteAudioTrack) => {
    track.attach();
    console.log('🎥 Attached remote audio track');
  };

  const detachAudioTrack = (track: RemoteAudioTrack) => {
    track.detach();
    console.log('🎥 Detached remote audio track');
  };

  const leaveRoom = async () => {
    if (room) {
      try {
        console.log('🎥 Leaving video room:', room.name);

        // Notify backend that call is ending
        await videoCallService.endCall(room.name, userEmail);

        // Disconnect from Twilio room
        room.disconnect();

        // Clean up local tracks
        if (localVideoTrack) {
          localVideoTrack.stop();
          setLocalVideoTrack(null);
        }

        if (localAudioTrack) {
          localAudioTrack.stop();
          setLocalAudioTrack(null);
        }

        setRoom(null);
        setIsConnected(false);
        setParticipants([]);
        console.log('🎥 Successfully left video room');
      } catch (error) {
        console.error('🎥 Error leaving video room:', error);
        // Force cleanup even if backend call fails
        room.disconnect();
        setRoom(null);
        setIsConnected(false);
        setParticipants([]);
      }
    }
  };

  const toggleVideo = () => {
    if (localVideoTrack) {
      if (isVideoEnabled) {
        localVideoTrack.disable();
        setIsVideoEnabled(false);
        console.log('🎥 Video disabled');
      } else {
        localVideoTrack.enable();
        setIsVideoEnabled(true);
        console.log('🎥 Video enabled');
      }
    }
  };

  const toggleAudio = () => {
    if (localAudioTrack) {
      if (isAudioEnabled) {
        localAudioTrack.disable();
        setIsAudioEnabled(false);
        console.log('🎥 Audio muted');
      } else {
        localAudioTrack.enable();
        setIsAudioEnabled(true);
        console.log('🎥 Audio unmuted');
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
      if (localVideoTrack) {
        localVideoTrack.stop();
      }
      if (localAudioTrack) {
        localAudioTrack.stop();
      }
    };
  }, [room, localVideoTrack, localAudioTrack]);

  return {
    room,
    isConnected,
    isConnecting,
    participants,
    localVideoRef,
    remoteVideoRef,
    isVideoEnabled,
    isAudioEnabled,
    joinRoom,
    leaveRoom,
    toggleVideo,
    toggleAudio
  };
};