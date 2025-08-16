'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useVoiceCall } from '@/hooks/useVoiceCall';
import { useVoiceCallNotifications } from '@/hooks/useVoiceCallNotifications';
import { VoiceCallResponse } from '@/services/voiceCallService';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  call: VoiceCallResponse | null;
  userEmail: string;
  userType: 'buyer' | 'vendor';
}

const VoiceCallModal: React.FC<VoiceCallModalProps> = ({
  isOpen,
  onClose,
  call,
  userEmail,
  userType
}) => {
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);

  const {
    isConnected,
    isConnecting,
    participants,
    isAudioEnabled,
    joinRoom,
    leaveRoom,
    toggleAudio,
    audioRef
  } = useVoiceCall({
    userEmail,
    displayName: userType === 'buyer' ? 'Buyer' : 'Vendor',
    onCallEnd: () => {
      console.log('🎤 VoiceCallModal: onCallEnd triggered - Twilio voice call ended, closing modal');
      onClose();
    },
    onError: (error) => {
      console.error('Voice call error:', error);
      alert('Voice call error: ' + error);
      onClose();
    }
  });

  const { callStatus, clearCallStatus } = useVoiceCallNotifications();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasJoinedRef = useRef<string | null>(null);

  // Handle joining the room when modal opens
  const handleJoinRoom = useCallback(() => {
    if (isOpen && call && hasJoinedRef.current !== call.roomName) {
      hasJoinedRef.current = call.roomName;
      joinRoom(call.roomName);
    }
  }, [isOpen, call, joinRoom]);

  useEffect(() => {
    handleJoinRoom();
  }, [handleJoinRoom]);

  // Track call status and participants
  useEffect(() => {
    if (isConnected && participants.length > 0) {
      console.log('🎤 Both participants connected - voice call is now ACTIVE');
      setIsInCall(true);
      if (!callStartTime) {
        setCallStartTime(new Date());
      }
    } else {
      setIsInCall(false);
    }
  }, [isConnected, participants.length, callStartTime]);

  // Call duration timer
  useEffect(() => {
    if (isInCall && callStartTime) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - callStartTime.getTime()) / 1000);
        setCallDuration(duration);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isInCall, callStartTime]);

  // Handle call status changes from backend - enhanced to ensure modal closes
  useEffect(() => {
    if (callStatus && call) {
      console.log('🎤 VoiceCallModal: Received call status:', callStatus);
      
      // Check if this status update is for the current call
      const isForCurrentCall = !callStatus.roomName || callStatus.roomName === call.roomName;
      
      if (isForCurrentCall) {
        // Handle call termination events
        if (callStatus.type === 'CALL_ENDED' || callStatus.forceClose) {
          console.log('🎤 VoiceCallModal: Call ended by other party, force closing modal');
          clearCallStatus();
          // Force leave room and close modal
          leaveRoom();
          onClose();
        } else if (callStatus.type === 'CALL_DECLINED') {
          console.log('🎤 VoiceCallModal: Call declined, closing modal');
          clearCallStatus();
          onClose();
        } else if (callStatus.type === 'CALL_MISSED') {
          console.log('🎤 VoiceCallModal: Call missed, closing modal');
          clearCallStatus();
          onClose();
        }
      }
    }
  }, [callStatus, call, onClose, clearCallStatus, leaveRoom]);

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen && call) {
      setIsInCall(false);
      setCallDuration(0);
      setCallStartTime(null);
      leaveRoom();
    }
  }, [isOpen, call, leaveRoom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleEndCall = useCallback(async () => {
    try {
      console.log('🎤 VoiceCallModal: Ending call');
      
      // Update backend call status
      if (call) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/voice-calls/end/${call.roomName}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userEmail: userEmail,
              endReason: 'USER_ENDED'
            }),
          });
        } catch (error) {
          console.error('🎤 VoiceCallModal: Error updating backend call status:', error);
        }
      }
      
      // Leave the Twilio room
      await leaveRoom();
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error('🎤 VoiceCallModal: Error ending call:', error);
      onClose();
    }
  }, [call, userEmail, leaveRoom, onClose]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !call) return null;

  return (
    <div className="fixed inset-0 bg-[#808080]/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md h-[500px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b h-16 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">
              Voice Call with {userType === 'buyer' ? 'Vendor' : 'Buyer'}
            </h2>
            {isInCall && (
              <span className="text-sm text-green-600 font-medium">
                {formatDuration(callDuration)}
              </span>
            )}
          </div>
        </div>

        {/* Voice Call UI */}
        <div className="flex-1 relative bg-gray-50 flex flex-col items-center justify-center">
          {/* Hidden audio element for remote audio */}
          <audio ref={audioRef} autoPlay playsInline style={{ display: 'none' }} />
          
          {/* Voice Call Visual UI */}
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {userType === 'buyer' ? 'Vendor' : 'Buyer'}
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              {isConnected ? 
                (participants.length > 0 ? 'In call' : 'Connected, waiting for other participant') :
                isConnecting ? 'Connecting...' : 'Waiting to connect'
              }
            </p>

            {/* Connection Status */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500' : 
                isConnecting ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 
                  `Connected (${participants.length + 1} participants)` : 
                  isConnecting ? 'Connecting...' : 'Disconnected'
                }
              </span>
            </div>

            {/* Audio Status Indicator */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className={`w-3 h-3 rounded-full ${isAudioEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isAudioEnabled ? 'Microphone On' : 'Microphone Off'}
              </span>
            </div>

            {/* Call Info */}
            {call.productName && (
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600">Regarding:</p>
                <p className="font-medium text-gray-900">{call.productName}</p>
                {call.shopName && (
                  <p className="text-sm text-gray-600">from {call.shopName}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 bg-gray-100 flex items-center justify-center space-x-6 h-20 flex-shrink-0">
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full ${
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
            onClick={handleEndCall}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            title="End call"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceCallModal;