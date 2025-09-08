//TwillioCallModal.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { connect, Room, LocalVideoTrack, LocalAudioTrack, RemoteParticipant, LocalTrackPublication } from 'twilio-video';
import { CallResponse, twilioCallService } from '../services/twilioCallService';

interface TwilioCallModalProps {
  call: CallResponse;
  isInitiator: boolean;
  onClose: () => void;
}

const TwilioCallModal: React.FC<TwilioCallModalProps> = ({
  call,
  isInitiator,
  onClose
}) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(call.callType === 'VIDEO');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [remoteParticipant, setRemoteParticipant] = useState<RemoteParticipant | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoTrack = useRef<LocalVideoTrack | null>(null);
  const localAudioTrack = useRef<LocalAudioTrack | null>(null);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);

  // Connect to Twilio room
  useEffect(() => {
    if (!call.accessToken) return;

    const connectToRoom = async () => {
      try {
        setConnectionStatus('Connecting...');
        
        const room = await connect(call.accessToken!, {
          name: call.twilioRoomName,
          audio: true,
          video: call.callType === 'VIDEO'
        });

        setRoom(room);
        setConnectionStatus('Connected');

        // Handle local tracks
        room.localParticipant.tracks.forEach((publication: LocalTrackPublication) => {
          if (publication.track) {
            if (publication.track.kind === 'video' && localVideoRef.current) {
              const videoTrack = publication.track as LocalVideoTrack;
              localVideoTrack.current = videoTrack;
              videoTrack.attach(localVideoRef.current);
            } else if (publication.track.kind === 'audio') {
              localAudioTrack.current = publication.track as LocalAudioTrack;
            }
          }
        });

        // Handle remote participants
        room.participants.forEach(participant => {
          handleParticipantConnected(participant);
        });

        room.on('participantConnected', handleParticipantConnected);
        room.on('participantDisconnected', handleParticipantDisconnected);

        setIsConnected(true);

      } catch (error) {
        console.error('Failed to connect to room:', error);
        setConnectionStatus('Connection failed');
        setTimeout(onClose, 2000);
      }
    };

    connectToRoom();

    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [call.accessToken, call.twilioRoomName, call.callType, onClose]);

  const handleParticipantConnected = (participant: RemoteParticipant) => {
    setRemoteParticipant(participant);
    
    participant.tracks.forEach(publication => {
      if (publication.isSubscribed && publication.track) {
        handleTrackSubscribed(publication.track);
      }
    });

    participant.on('trackSubscribed', handleTrackSubscribed);
    participant.on('trackUnsubscribed', handleTrackUnsubscribed);
  };

  const handleParticipantDisconnected = (participant: RemoteParticipant) => {
    if (participant === remoteParticipant) {
      setRemoteParticipant(null);
    }
  };

  const handleTrackSubscribed = (track: any) => {
    if (track.kind === 'video' && remoteVideoRef.current) {
      track.attach(remoteVideoRef.current);
    }
  };

  const handleTrackUnsubscribed = (track: any) => {
    track.detach();
  };

  const toggleVideo = () => {
    if (localVideoTrack.current) {
      if (isVideoEnabled) {
        localVideoTrack.current.disable();
      } else {
        localVideoTrack.current.enable();
      }
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localAudioTrack.current) {
      if (isAudioEnabled) {
        localAudioTrack.current.disable();
      } else {
        localAudioTrack.current.enable();
      }
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const endCall = async () => {
    try {
      // End call on backend
      const userEmail = isInitiator ? call.callerEmail : call.vendorEmail;
      await twilioCallService.endCall(call.id, userEmail);
    } catch (error) {
      console.error('Failed to end call on backend:', error);
    }
    
    if (room) {
      room.disconnect();
    }
    onClose();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg p-3 sm:p-6 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-3 sm:mb-4 flex-shrink-0">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold truncate">
              {call.callType} Call with {isInitiator ? call.vendorName : call.callerName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              {call.shopName} {call.productName && `- ${call.productName}`}
            </p>
            <p className="text-xs text-gray-500">
              {connectionStatus} {isConnected && `• ${formatDuration(callDuration)}`}
            </p>
          </div>
        </div>

        {/* Video Container */}
        <div 
          className="relative bg-gray-900 rounded-lg overflow-hidden mb-3 sm:mb-4 flex-1"
          style={{ 
            minHeight: '200px',
            maxHeight: 'calc(100vh - 200px)'
          }}
        >
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Local Video (Picture-in-Picture) */}
          {call.callType === 'VIDEO' && (
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-20 h-16 sm:w-32 sm:h-24 bg-gray-800 rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* No video placeholder */}
          {(!remoteParticipant || call.callType === 'VOICE') && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Phone className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <p className="text-sm sm:text-lg">
                  {remoteParticipant ? 'Audio Call' : 'Waiting for participant...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 sm:gap-4 flex-shrink-0">
          {call.callType === 'VIDEO' && (
            <button
              onClick={toggleVideo}
              className={`p-3 sm:p-4 rounded-full transition-colors touch-manipulation ${
                isVideoEnabled ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-red-500 text-white hover:bg-red-600'
              }`}
              title={isVideoEnabled ? 'Turn off video' : 'Turn on video'}
            >
              {isVideoEnabled ? <Video className="w-5 h-5 sm:w-6 sm:h-6" /> : <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          )}
          
          <button
            onClick={toggleAudio}
            className={`p-3 sm:p-4 rounded-full transition-colors touch-manipulation ${
              isAudioEnabled ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-red-500 text-white hover:bg-red-600'
            }`}
            title={isAudioEnabled ? 'Mute' : 'Unmute'}
          >
            {isAudioEnabled ? <Mic className="w-5 h-5 sm:w-6 sm:h-6" /> : <MicOff className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
          
          <button
            onClick={endCall}
            className="p-3 sm:p-4 rounded-full bg-red-500 text-white hover:bg-red-600 active:bg-red-700 transition-colors touch-manipulation"
            title="End call"
          >
            <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwilioCallModal;