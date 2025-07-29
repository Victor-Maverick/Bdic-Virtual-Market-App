'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useVideoCall } from '@/hooks/useVideoCall';
import { VideoCallResponse } from '@/services/videoCallService';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  call: VideoCallResponse | null;
  userEmail: string;
  userType: 'buyer' | 'vendor';
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         call,
                                                         userEmail,
                                                         userType
                                                       }) => {
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);

  const {
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
  } = useVideoCall({
    userEmail,
    onCallEnd: () => {
      console.log('🎥 VideoCallModal: onCallEnd triggered - Twilio room disconnected, closing modal');
      onClose();
    },
    onError: (error) => {
      console.error('Video call error:', error);
      alert('Video call error: ' + error);
      onClose();
    }
  });

  const hasJoinedRef = useRef<string | null>(null);
  
  const handleJoinRoom = useCallback(() => {
    if (isOpen && call && hasJoinedRef.current !== call.roomName) {
      hasJoinedRef.current = call.roomName;
      joinRoom(call.roomName);
    }
  }, [isOpen, call, joinRoom]);

  useEffect(() => {
    handleJoinRoom();
  }, [handleJoinRoom]);

  // Start timer only when both participants are connected (call becomes ACTIVE)
  useEffect(() => {
    if (isConnected && participants.length > 0 && !callStartTime) {
      console.log('⏱️ Starting call timer - both participants connected, call is now ACTIVE');
      setCallStartTime(new Date());
    }
  }, [isConnected, participants.length, callStartTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected && callStartTime && participants.length > 0) {
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime.getTime()) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected, callStartTime, participants.length]);

  // Handle when the call is no longer open - use ref to avoid dependency issues
  const prevIsOpenRef = useRef(isOpen);
  
  useEffect(() => {
    // Only cleanup when modal was open and is now closed
    if (prevIsOpenRef.current && !isOpen && call) {
      setCallDuration(0);
      setCallStartTime(null);
      leaveRoom();
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, call, leaveRoom]);

  const handleEndCall = async () => {
    console.log('🎥 VideoCallModal: User manually ending call');
    try {
      await leaveRoom();
      console.log('🎥 VideoCallModal: Call ended successfully, backend should notify both participants');
      
      // Set a timeout to ensure modal closes even if WebSocket notification fails
      setTimeout(() => {
        console.log('🎥 VideoCallModal: Timeout reached, ensuring modal closes');
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('🎥 VideoCallModal: Error ending call:', error);
      // Close immediately if there was an error
      onClose();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !call) return null;

  return (
      <div className="fixed inset-0 bg-[#808080]/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl h-[500px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b h-16 flex-shrink-0">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">
                Video Call with {userType === 'buyer' ? 'Vendor' : 'Buyer'}
              </h2>
              {isConnected && (
                  <span className="text-sm text-gray-600">
                Duration: {formatDuration(callDuration)}
              </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
            <span className={`px-2 py-1 rounded text-xs ${
                isConnected ? 'bg-green-100 text-green-800' :
                    isConnecting ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
            }`}>
              {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
            </span>
              <button
                  onClick={handleEndCall}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors flex items-center space-x-1"
                  title="End call"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  <path d="M4 4l12 12" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>End Call</span>
              </button>
            </div>
          </div>

          {/* Video Area */}
          <div className="flex-1 relative bg-black">
            {/* Remote Video */}
            <div className="w-full h-full relative">
              <div
                  ref={remoteVideoRef}
                  className="w-full h-full"
                  style={{ backgroundColor: '#000' }}
              />
              {participants.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-900">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium">Waiting for {userType === 'buyer' ? 'vendor' : 'buyer'} to join...</p>
                      <p className="text-sm text-gray-400 mt-2">Call will start when both participants are connected</p>
                    </div>
                  </div>
              )}
            </div>

            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-600">
              <div
                  ref={localVideoRef}
                  className="w-full h-full"
                  style={{ backgroundColor: '#1f2937' }}
              />
              {!isVideoEnabled && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A2 2 0 0017 14V6a2 2 0 00-2-2h-5.586l-.707-.707A1 1 0 008 3H4a2 2 0 00-2 2v6c0 .681.284 1.294.74 1.74L3.707 2.293zM4 5h1.586L4 6.586V5z" clipRule="evenodd" />
                    </svg>
                  </div>
              )}
              {/* Local video label */}
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                You
              </div>
            </div>

            {/* Remote video label */}
            {participants.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded">
                  {userType === 'buyer' ? 'Vendor' : 'Buyer'}
                </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-4 bg-gray-100 flex items-center justify-center space-x-4 h-20 flex-shrink-0">
            <button
                onClick={toggleAudio}
                className={`p-3 rounded-full ${
                    isAudioEnabled ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-500 hover:bg-red-600'
                } transition-colors`}
                title={isAudioEnabled ? 'Mute' : 'Unmute'}
            >
              <svg className={`w-6 h-6 ${isAudioEnabled ? 'text-gray-700' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                {isAudioEnabled ? (
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                ) : (
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0L18.485 7.757a1 1 0 010 1.414L17.071 10.585a1 1 0 11-1.414-1.414L16.899 8 15.657 6.757a1 1 0 010-1.414z" clipRule="evenodd" />
                )}
              </svg>
            </button>

            <button
                onClick={toggleVideo}
                className={`p-3 rounded-full ${
                    isVideoEnabled ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-500 hover:bg-red-600'
                } transition-colors`}
                title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
            >
              <svg className={`w-6 h-6 ${isVideoEnabled ? 'text-gray-700' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                {isVideoEnabled ? (
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                ) : (
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A2 2 0 0017 14V6a2 2 0 00-2-2h-5.586l-.707-.707A1 1 0 008 3H4a2 2 0 00-2 2v6c0 .681.284 1.294.74 1.74L3.707 2.293zM4 5h1.586L4 6.586V5z" clipRule="evenodd" />
                )}
              </svg>
            </button>

            <button
                onClick={handleEndCall}
                className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                title="End call"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                <path d="M4 4l12 12" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
  );
};

export default VideoCallModal;