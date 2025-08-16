'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useVoiceCall } from '@/hooks/useVoiceCall';
import { useCallContext } from '@/contexts/CallContext';
import { voiceCallService, VoiceCallRequest } from '@/services/voiceCallService';

interface SimpleVoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorEmail: string;
  buyerEmail: string;
  productId?: number;
  productName?: string;
  shopId?: number;
  shopName?: string;
}

const SimpleVoiceCallModal: React.FC<SimpleVoiceCallModalProps> = ({
  isOpen,
  onClose,
  vendorEmail,
  buyerEmail,
  productId,
  productName,
  shopId,
  shopName
}) => {
  const [isInitiating, setIsInitiating] = useState(false);
  const [callInitiated, setCallInitiated] = useState(false);
  const [roomName, setRoomName] = useState<string | null>(null);

  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [callTimeout, setCallTimeout] = useState<NodeJS.Timeout | null>(null);

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
    userEmail: buyerEmail,
    displayName: 'Buyer',
    onCallEnd: () => {
      console.log('🎤 Twilio room disconnected - ending call in global context');
      if (roomName) {
        endCall(roomName, 'ended');
      }
    },
    onError: (error) => {
      console.error('Voice call error:', error);
      setError(error);
    }
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use CallContext for global call state management
  const { activeCall, setActiveCall, endCall, onCallStatusChange } = useCallContext();

  // Handle call ending states with messages
  const [endingMessage, setEndingMessage] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (activeCall && ['ended', 'declined', 'missed'].includes(activeCall.status)) {
      console.log('🎤 Call ended/declined/missed:', activeCall);
      
      if (activeCall.message) {
        setEndingMessage(activeCall.message);
        setIsClosing(true);
        
        // Auto-close after delay if specified
        if (activeCall.autoCloseDelay && activeCall.autoCloseDelay > 0) {
          setTimeout(() => {
            onClose();
          }, activeCall.autoCloseDelay);
        } else {
          // Close immediately
          onClose();
        }
      } else {
        onClose();
      }
    }
  }, [activeCall, onClose]);

  // Listen for call status changes from the global context
  useEffect(() => {
    const cleanup = onCallStatusChange((call) => {
      if (!call || (roomName && call.roomName === roomName && 
          ['ended', 'declined', 'missed'].includes(call.status))) {
        console.log('🎤 SimpleVoiceCallModal: Call ended via global context, closing modal');
        onClose();
      }
    });

    return cleanup;
  }, [roomName, onClose, onCallStatusChange]);

  // Manual call initiation - removed auto-initiation to prevent unwanted calls

  const initiateCall = async () => {
    setIsInitiating(true);
    setError(null);
    
    try {
      const request: VoiceCallRequest = {
        buyerEmail,
        vendorEmail,
        productId,
        productName,
        shopId,
        shopName
      };

      const response = await voiceCallService.initiateCall(request);
      setRoomName(response.roomName);
      setCallInitiated(true);
      
      // Set the active call in global context
      setActiveCall({
        roomName: response.roomName,
        callType: 'voice',
        status: 'initiating',
        participants: [buyerEmail]
      });
      
      // Set up call timeout (30 seconds) - if no one joins, mark as missed
      const timeout = setTimeout(async () => {
        console.log('🎤 Call timeout - marking as missed');
        endCall(response.roomName, 'missed', buyerEmail);
      }, 30000); // 30 seconds timeout
      
      setCallTimeout(timeout);
      
      // Join the Twilio room
      await joinRoom(response.roomName);
      
    } catch (error) {
      console.error('Error initiating voice call:', error);
      setError(error instanceof Error ? error.message : 'Failed to initiate call');
    } finally {
      setIsInitiating(false);
    }
  };

  // Track call status and participants
  useEffect(() => {
    if (isConnected && participants.length > 0) {
      console.log('🎤 Both participants connected - voice call is now ACTIVE');
      if (!callStartTime) {
        setCallStartTime(new Date());
      }
      
      // Clear call timeout since call is now active
      if (callTimeout) {
        clearTimeout(callTimeout);
        setCallTimeout(null);
      }
    }
  }, [isConnected, participants.length, callStartTime, callTimeout]);

  // Call duration timer removed - no longer displaying duration

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCallStartTime(null);
      setCallInitiated(false);
      setRoomName(null);
      setError(null);
      
      // Clear call timeout
      if (callTimeout) {
        clearTimeout(callTimeout);
        setCallTimeout(null);
      }
      
      leaveRoom();
    }
  }, [isOpen, leaveRoom, callTimeout]);

  // Cleanup on unmount
  useEffect(() => {
    const currentInterval = intervalRef.current;
    return () => {
      if (currentInterval) {
        clearInterval(currentInterval);
      }
      if (callTimeout) {
        clearTimeout(callTimeout);
      }
    };
  }, [callTimeout]);

  const handleEndCall = useCallback(async () => {
    try {
      console.log('🎤 Ending call');
      
      if (roomName) {
        // End call in global context - this will close all modals for this room
        endCall(roomName, 'ended', buyerEmail);
        
        // Update backend call status
        try {
          await voiceCallService.endCall(roomName, buyerEmail);
          console.log('🎤 Backend notified of call end');
        } catch (error) {
          console.error('🎤 Error updating backend call status:', error);
        }
      }
      
      // Leave the Twilio room
      await leaveRoom();
      
    } catch (error) {
      console.error('🎤 Error ending call:', error);
      // Fallback: close modal directly
      onClose();
    }
  }, [roomName, buyerEmail, leaveRoom, onClose, endCall]);

  const handleDeclineCall = useCallback(async () => {
    try {
      console.log('🎤 Declining call');
      
      if (roomName) {
        // Decline call in global context - this will close all modals for this room
        endCall(roomName, 'declined', buyerEmail);
        
        // Update backend call status
        try {
          await voiceCallService.declineCall(roomName, buyerEmail);
          console.log('🎤 Backend notified of call decline');
        } catch (error) {
          console.error('🎤 Error updating backend call status:', error);
        }
      }
      
      // Leave the Twilio room if connected
      await leaveRoom();
      
    } catch (error) {
      console.error('🎤 Error declining call:', error);
      // Fallback: close modal directly
      onClose();
    }
  }, [roomName, buyerEmail, leaveRoom, onClose, endCall]);

  // formatDuration function removed - no longer displaying duration

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#808080]/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md h-[500px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b h-16 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">Voice Call</h2>
          </div>
        </div>

        {/* Voice Call UI */}
        <div className="flex-1 relative bg-gray-50 flex flex-col items-center justify-center">
          {/* Hidden audio element for remote audio */}
          <audio ref={audioRef} autoPlay playsInline style={{ display: 'none' }} />
          
          {/* Error Display */}
          {error && !endingMessage && (
            <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="text-sm">{error}</p>
              <button 
                onClick={onClose}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Close
              </button>
            </div>
          )}

          {/* Ending Message Display */}
          {endingMessage && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
              <div className="bg-white rounded-lg p-6 text-center max-w-sm mx-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">{endingMessage}</p>
                {isClosing && activeCall?.autoCloseDelay && activeCall.autoCloseDelay > 0 && (
                  <p className="text-sm text-gray-600">Closing in a moment...</p>
                )}
              </div>
            </div>
          )}
          
          {/* Voice Call Visual UI */}
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {shopName || vendorEmail.split('@')[0]}
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              {isInitiating ? 'Initiating call...' :
               !callInitiated ? 'Ready to call' :
               isConnected ? 
                (participants.length > 0 ? 'In call' : 'Connected, waiting for vendor') :
                isConnecting ? 'Connecting...' : 'Waiting to connect'
              }
            </p>

            {/* Start Call Button */}
            {!callInitiated && !isInitiating && (
              <button
                onClick={initiateCall}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg mb-4 transition-colors"
              >
                Start Voice Call
              </button>
            )}

            {/* Decline Call Button - shown when call is initiated but not yet connected */}
            {callInitiated && !isConnected && !isConnecting && (
              <button
                onClick={handleDeclineCall}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg mb-4 transition-colors"
              >
                Decline Call
              </button>
            )}

            {/* Connection Status */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500' : 
                isConnecting || isInitiating ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 
                  `Connected (${participants.length + 1} participants)` : 
                  isConnecting || isInitiating ? 'Connecting...' : 'Disconnected'
                }
              </span>
            </div>

            {/* Audio Status Indicator */}
            {callInitiated && (
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className={`w-3 h-3 rounded-full ${isAudioEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isAudioEnabled ? 'Microphone On' : 'Microphone Off'}
                </span>
              </div>
            )}

            {/* Call Info */}
            {productName && (
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600">Regarding:</p>
                <p className="font-medium text-gray-900">{productName}</p>
                {shopName && (
                  <p className="text-sm text-gray-600">from {shopName}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 bg-gray-100 flex items-center justify-center space-x-6 h-20 flex-shrink-0">
          {callInitiated && (
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
          )}

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

export default SimpleVoiceCallModal;