import { useState, useEffect, useRef } from 'react';
import { connect, Room, LocalVideoTrack, LocalAudioTrack, RemoteParticipant, RemoteTrack } from 'twilio-video';
import { videoCallService } from '@/services/videoCallService';

export interface UseVideoCallProps {
  userEmail: string;
  onCallEnd?: () => void;
  onError?: (error: string) => void;
}

export const useVideoCall = ({ userEmail, onCallEnd, onError }: UseVideoCallProps) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
  const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<LocalAudioTrack | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  const joinRoom = async (roomName: string) => {
    // Prevent multiple join attempts
    if (isConnecting || room) {
      console.log('📞 Already connecting or connected, skipping join attempt');
      return;
    }

    try {
      setIsConnecting(true);

      // Get Twilio access token
      const tokenResponse = await videoCallService.joinCall(roomName, userEmail);

      // Connect to Twilio Video room
      const connectedRoom = await connect(tokenResponse.token, {
        name: roomName,
        audio: true,
        video: { width: 640, height: 480 }
      });

      setRoom(connectedRoom);
      setIsConnected(true);
      console.log('📞 Successfully connected to Twilio room:', roomName);

      // Handle local tracks
      connectedRoom.localParticipant.videoTracks.forEach(publication => {
        if (publication.track && localVideoRef.current) {
          localVideoRef.current.innerHTML = '';
          const videoElement = publication.track.attach();
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';
          videoElement.style.objectFit = 'cover';
          localVideoRef.current.appendChild(videoElement);
          setLocalVideoTrack(publication.track as LocalVideoTrack);
          console.log('📹 Local video attached');
        }
      });

      connectedRoom.localParticipant.audioTracks.forEach(publication => {
        if (publication.track) {
          setLocalAudioTrack(publication.track as LocalAudioTrack);
        }
      });

      // Handle existing remote participants
      connectedRoom.participants.forEach(participant => {
        handleParticipantConnected(participant);
      });

      // Handle new remote participants
      connectedRoom.on('participantConnected', handleParticipantConnected);
      connectedRoom.on('participantDisconnected', handleParticipantDisconnected);

      // Handle room disconnection
      connectedRoom.on('disconnected', (room, error) => {
        console.log('📞 Room disconnected:', room.name, error ? `Error: ${error.message}` : 'Normal disconnect');
        setIsConnected(false);
        setRoom(null);
        setParticipants([]);
        
        // Always call onCallEnd when room disconnects - this ensures both participants are notified
        console.log('📞 Room disconnected - calling onCallEnd to ensure both participants are notified');
        onCallEnd?.();
      });

    } catch (error) {
      console.error('Error joining room:', error);
      onError?.('Failed to join video call');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleParticipantConnected = (participant: RemoteParticipant) => {
    console.log('📞 Participant connected:', participant.identity);
    setParticipants(prev => [...prev, participant]);

    // Handle existing tracks
    participant.tracks.forEach(publication => {
      if (publication.isSubscribed && publication.track) {
        handleTrackSubscribed(publication.track);
      }
    });

    participant.on('trackSubscribed', handleTrackSubscribed);
    participant.on('trackUnsubscribed', handleTrackUnsubscribed);
  };

  const handleParticipantDisconnected = (participant: RemoteParticipant) => {
    setParticipants(prev => prev.filter(p => p.sid !== participant.sid));
  };

  const handleTrackSubscribed = (track: RemoteTrack) => {
    console.log('📹 Track subscribed:', track.kind);
    if (track.kind === 'video' && remoteVideoRef.current) {
      remoteVideoRef.current.innerHTML = '';
      const videoElement = track.attach();
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      videoElement.style.objectFit = 'cover';
      remoteVideoRef.current.appendChild(videoElement);
      console.log('📹 Remote video attached');
    }
    if (track.kind === 'audio') {
      // Attach audio track to the DOM to enable sound
      const audioElement = track.attach();
      audioElement.autoplay = true;
      audioElement.volume = 1.0;
      // Append to document body (audio elements don't need to be visible)
      document.body.appendChild(audioElement);
      console.log('🔊 Remote audio attached and playing');
    }
  };

  const handleTrackUnsubscribed = (track: RemoteTrack) => {
    console.log('📹 Track unsubscribed:', track.kind);
    if ('detach' in track && typeof track.detach === 'function') {
      track.detach().forEach((element: HTMLElement) => {
        // Stop audio/video playback before removing
        if (element instanceof HTMLMediaElement) {
          element.pause();
          element.srcObject = null;
        }
        element.remove();
        console.log(`🔇 ${track.kind} track detached and removed`);
      });
    }
  };

  const leaveRoom = async () => {
    if (room) {
      try {
        console.log('📞 Ending call for room:', room.name);
        await videoCallService.endCall(room.name, userEmail);
        room.disconnect();
        console.log('📞 Call ended and room disconnected');
      } catch (error) {
        console.error('Error ending call:', error);
        room.disconnect();
      }
    }
  };

  const toggleVideo = () => {
    if (localVideoTrack) {
      if (isVideoEnabled) {
        localVideoTrack.disable();
      } else {
        localVideoTrack.enable();
      }
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localAudioTrack) {
      if (isAudioEnabled) {
        localAudioTrack.disable();
      } else {
        localAudioTrack.enable();
      }
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

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