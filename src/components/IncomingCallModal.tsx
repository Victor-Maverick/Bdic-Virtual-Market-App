'use client';

import React, { useEffect, useState } from 'react';
import { VideoCallResponse, videoCallService } from '@/services/videoCallService';
import { VoiceCallResponse, voiceCallService } from '@/services/voiceCallService';

interface IncomingCallModalProps {
  isOpen: boolean;
  call: VideoCallResponse | VoiceCallResponse | null;
  callType: 'video' | 'voice';
  productName?: string;
  shopName?: string;
  onAccept: () => void;
  onDecline: () => void;
  userEmail: string;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  isOpen,
  call,
  callType,
  productName,
  shopName,
  onAccept,
  onDecline,
  userEmail
}) => {
  const [isRinging, setIsRinging] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsRinging(true);
      // Skip ringtone for now to avoid 404 errors
      // TODO: Add ringtone file to public/sounds/ directory
      console.log('📞 Incoming call - ringtone skipped');
    }
  }, [isOpen]);

  const handleDecline = async () => {
    if (call) {
      try {
        console.log(`📞 IncomingCallModal: Declining ${callType} call:`, call.roomName);
        
        if (callType === 'video') {
          await videoCallService.declineCall(call.roomName, userEmail);
        } else {
          await voiceCallService.declineCall(call.roomName, userEmail);
        }
        
        console.log(`📞 IncomingCallModal: ${callType} call declined successfully, backend should notify both participants`);
        
        // Stop ringtone
        if (audioElement) {
          audioElement.pause();
          audioElement.currentTime = 0;
        }
        
        // Set a timeout to ensure modal closes even if WebSocket notification fails
        setTimeout(() => {
          console.log('📞 IncomingCallModal: Timeout reached, ensuring modal closes');
          onDecline();
        }, 2000);
        
      } catch (error) {
        console.error(`❌ IncomingCallModal: Error declining ${callType} call:`, error);
        // Call onDecline immediately if there was an error
        onDecline();
      }
    }
  };

  const handleAccept = async () => {
    if (call) {
      try {
        console.log(`📞 IncomingCallModal: Accepting ${callType} call:`, call.roomName);
        
        if (callType === 'video') {
          await videoCallService.acceptCall(call.roomName, userEmail);
        } else {
          await voiceCallService.acceptCall(call.roomName, userEmail);
        }
        
        console.log(`📞 IncomingCallModal: ${callType} call accepted successfully`);
        
        // Stop ringtone
        if (audioElement) {
          audioElement.pause();
          audioElement.currentTime = 0;
        }
        
        setIsRinging(false);
        onAccept();
        
      } catch (error) {
        console.error(`❌ IncomingCallModal: Error accepting ${callType} call:`, error);
        // Still proceed with onAccept to show the call modal
        setIsRinging(false);
        onAccept();
      }
    }
  };

  if (!isOpen || !call) return null;

  const callerEmail = call.buyerEmail === userEmail ? call.vendorEmail : call.buyerEmail;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-8 max-w-md w-full text-center">
        {/* Caller Avatar */}
        <div className="mb-4 sm:mb-6">
          <div className={`w-20 h-20 sm:w-24 sm:h-24 ${
            callType === 'video' ? 'bg-blue-500' : 'bg-green-500'
          } rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 ${
            isRinging ? 'animate-pulse' : ''
          }`}>
            {callType === 'video' ? (
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            ) : (
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Incoming {callType === 'video' ? 'Video' : 'Voice'} Call
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1 truncate">
            From: {callerEmail}
          </p>
        </div>

        {/* Call Details */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
          {productName && (
            <p className="text-xs sm:text-sm text-gray-700 mb-1 truncate">
              <span className="font-medium">Product:</span> {productName}
            </p>
          )}
          {shopName && (
            <p className="text-xs sm:text-sm text-gray-700 truncate">
              <span className="font-medium">Shop:</span> {shopName}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-6 sm:space-x-4 justify-center">
          <button
            onClick={handleDecline}
            className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
            title="Decline call"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={handleAccept}
            className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
            title="Accept call"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3 sm:mt-4">
          The call will automatically end if not answered within 30 seconds
        </p>
      </div>
    </div>
  );
};

export default IncomingCallModal;