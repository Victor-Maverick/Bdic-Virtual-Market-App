'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useWebRTCVideoCall } from '@/hooks/useWebRTCVideoCall';
import { useCallContext } from '@/contexts/CallContext';
import { videoCallService, VideoCallRequest } from '@/services/videoCallService';

interface WebRTCVideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorEmail: string;
  buyerEmail: string;
  productId?: number;
  productName?: string;
  shopId?: number;
  shopName?: string;
  isInitiator?: boolean; // true for buyer initiating, false for vendor receiving
}

const WebRTCVideoCallModal: React.FC<WebRTCVideoCallModalProps> = ({
  isOpen,
  onClose,
  vendorEmail,
  buyerEmail,
  productId,
  productName,
  shopId,
  shopName,
  isInitiator = true
}) => {
  const [callInitiated, setCallInitiated] = useState(false);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [callTimeout, setCallTimeout] = useState<NodeJS.Timeout | null>(null);

  const userEmail = isInitiator ? buyerEmail : vendorEmail;
  const otherUserEmail = isInitiator ? vendorEmail : buyerEmail;

  const {
    isConnected,
    isConnecting,
    participants,
    participantCount,
    localVideoRef,
    remoteVideoRef,
    isVideoEnabled,
    isAudioEnabled,
    joinRoom,
    leaveRoom,
    toggleVideo,
    toggleAudio
  } = useWebRTCVideoCall({
    userEmail,
    displayName: isInitiator ? 'Buyer' : 'Vendor',
    onCallEnd: () => {
      console.log('🎥 WebRTC call ended - closing modal');
      if (roomName) {
        endCall(roomName, 'ended');
      }
    },
    onError: (error) => {
      console.error('WebRTC Video call error:', error);
      setError(error);
    }
  });

  // Use CallContext for global call state management
  const { activeCall, setActiveCall, endCall, onCallStatusChange } = useCallContext();

  // Handle call ending states with messages
  const [endingMessage, setEndingMessage] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (activeCall && ['ended', 'declined', 'missed'].includes(activeCall.status)) {
      console.log('🎥 Call ended/declined/missed:', activeCall);
      
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
        console.log('🎥 WebRTCVideoCallModal: Call ended via global context, closing modal');
        onClose();
      }
    });

    return cleanup;
  }, [roomName, onClose, onCallStatusChange]);

  // Auto-initiate call when modal opens (only for initiator)
  useEffect(() => {
    if (isOpen && isInitiator && !callInitiated) {
      initiateCall();
    } else if (isOpen && !isInitiator && !callInitiated) {
      // For recipients, we should already have the room name from props or context
      // This modal should be opened with the room name already available
      console.log('🎥 Recipient joining call - room should be provided');
    }
  }, [isOpen, isInitiator]);

  const initiateCall = async () => {
    setError(null);
    
    try {
      const request: VideoCallRequest = {
        buyerEmail,
        vendorEmail,
        productId,
        productName,
        shopId,
        shopName
      };

      const response = await videoCallService.initiateCall(request);
      setRoomName(response.roomName);
      setCallInitiated(true);
      
      // Set the active call in global context
      setActiveCall({
        roomName: response.roomName,
        callType: 'video',
        status: 'initiating',
        participants: [userEmail]
      });
      
      // Set up call timeout (30 seconds) - if no one joins, mark as missed
      const timeout = setTimeout(async () => {
        console.log('🎥 Call timeout - marking as missed');
        endCall(response.roomName, 'missed', userEmail);
      }, 30000); // 30 seconds timeout
      
      setCallTimeout(timeout);
      
      // Join the WebRTC room
      await joinRoom(response.roomName);
      
    } catch (error) {
      console.error('Error initiating WebRTC video call:', error);
      setError(error instanceof Error ? error.message : 'Failed to initiate call');
    }
  };

  // For recipients, join the room directly
  const joinExistingCall = async (existingRoomName: string) => {
    setError(null);
    setRoomName(existingRoomName);
    setCallInitiated(true);
    
    try {
      // Set the active call in global context
      setActiveCall({
        roomName: existingRoomName,
        callType: 'video',
        status: 'active',
        participants: [userEmail]
      });
      
      // Join the WebRTC room
      await joinRoom(existingRoomName);
      
    } catch (error) {
      console.error('Error joining WebRTC video call:', error);
      setError(error instanceof Error ? error.message : 'Failed to join call');
    }
  };

  // Track call status and participants
  useEffect(() => {
    if (isConnected && participants.length > 0) {
      console.log('🎥 Both participants connected - WebRTC video call is now ACTIVE');
      
      // Clear call timeout since call is now active
      if (callTimeout) {
        clearTimeout(callTimeout);
        setCallTimeout(null);
      }
    }
  }, [isConnected, participants.length, callTimeout]);

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
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
    return () => {
      if (callTimeout) {
        clearTimeout(callTimeout);
      }
    };
  }, [callTimeout]);

  const handleEndCall = useCallback(async () => {
    try {
      console.log('🎥 Ending WebRTC call');
      
      if (roomName) {
        // End call in global context - this will close all modals for this room
        endCall(roomName, 'ended', userEmail);
        
        // Update backend call status
        try {
          await videoCallService.endCall(roomName, userEmail);
          console.log('🎥 Backend notified of WebRTC call end');
        } catch (error) {
          console.error('🎥 Error updating backend WebRTC call status:', error);
        }
      }
      
      // Leave the WebRTC room
      await leaveRoom();
      
    } catch (error) {
      console.error('🎥 Error ending call:', error);
      // Fallback: close modal directly
      onClose();
    }
  }, [roomName, userEmail, leaveRoom, onClose, endCall]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#808080]/40 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] sm:h-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b h-14 sm:h-16 flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            <h2 className="text-sm sm:text-lg font-semibold truncate">
              Video Call with {isInitiator ? (shopName || vendorEmail.split('@')[0]) : 'Buyer'}
            </h2>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <span className={`px-1 sm:px-2 py-1 rounded text-xs ${
              isConnected ? 'bg-green-100 text-green-800' :
              isConnecting ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              <span className="hidden sm:inline">
                {isConnected ? `Connected (${participantCount} participants)` :
                 isConnecting ? 'Connecting...' : 'Disconnected'}
              </span>
              <span className="sm:hidden">
                {isConnected ? 'Connected' :
                 isConnecting ? 'Connecting' : 'Disconnected'}
              </span>
            </span>
            <button
              onClick={handleEndCall}
              className="px-2 sm:px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors flex items-center space-x-1"
              title="End call"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                <path d="M4 4l12 12" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="hidden sm:inline">End Call</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && !endingMessage && (
          <div className="mx-4 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="text-sm">{error}</p>
            <button 
              onClick={onClose}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Close
            </button>
          </div>
        )}

        {/* Video Area */}
        <div className="flex-1 relative bg-black">
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-24 h-18 sm:w-48 sm:h-36 bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>

          {/* Ending Message Display */}
          {endingMessage && (
            <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-900 bg-opacity-90">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <p className="text-xl font-medium mb-2">{endingMessage}</p>
                {isClosing && activeCall?.autoCloseDelay && activeCall.autoCloseDelay > 0 && (
                  <p className="text-sm text-gray-400">Closing in a moment...</p>
                )}
              </div>
            </div>
          )}

          {/* Connection Status Overlay */}
          {!isConnected && !endingMessage && (
            <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-900 bg-opacity-75">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-lg font-medium">
                  {isConnecting ? 'Connecting to call...' : 
                   isInitiator ? 'Waiting for vendor to join...' : 'Waiting for buyer to join...'}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Call will start when both participants are connected
                </p>
                
                {/* Call Info */}
                {productName && (
                  <div className="bg-gray-800 bg-opacity-75 rounded-lg p-3 mt-4 max-w-sm mx-auto">
                    <p className="text-sm text-gray-300">Regarding:</p>
                    <p className="font-medium text-white">{productName}</p>
                    {shopName && (
                      <p className="text-sm text-gray-300">from {shopName}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-3 sm:p-4 bg-gray-100 flex items-center justify-center space-x-3 sm:space-x-4 h-16 sm:h-20 flex-shrink-0">
          {callInitiated && (
            <>
              <button
                onClick={toggleAudio}
                className={`p-2 sm:p-3 rounded-full ${
                  isAudioEnabled ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-500 hover:bg-red-600'
                } transition-colors`}
                title={isAudioEnabled ? 'Mute' : 'Unmute'}
              >
                <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${isAudioEnabled ? 'text-gray-700' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                  {isAudioEnabled ? (
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0L18.485 7.757a1 1 0 010 1.414L17.071 10.585a1 1 0 11-1.414-1.414L16.899 8 15.657 6.757a1 1 0 010-1.414z" clipRule="evenodd" />
                  )}
                </svg>
              </button>

              <button
                onClick={toggleVideo}
                className={`p-2 sm:p-3 rounded-full ${
                  isVideoEnabled ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-500 hover:bg-red-600'
                } transition-colors`}
                title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
              >
                <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${isVideoEnabled ? 'text-gray-700' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                  {isVideoEnabled ? (
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  ) : (
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A2 2 0 0017 14V6a2 2 0 00-2-2h-5.586l-.707-.707A1 1 0 008 3H4a2 2 0 00-2 2v6c0 .681.284 1.294.74 1.74L3.707 2.293zM4 5h1.586L4 6.586V5z" clipRule="evenodd" />
                  )}
                </svg>
              </button>
            </>
          )}

          <button
            onClick={handleEndCall}
            className="p-2 sm:p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            title="End call"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebRTCVideoCallModal;