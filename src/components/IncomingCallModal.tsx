'use client';

import React, { useEffect, useState } from 'react';
import { VideoCallResponse, videoCallService } from '@/services/videoCallService';

interface IncomingCallModalProps {
  isOpen: boolean;
  call: VideoCallResponse | null;
  productName?: string;
  shopName?: string;
  onAccept: () => void;
  onDecline: () => void;
  userEmail: string;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  isOpen,
  call,
  productName,
  shopName,
  onAccept,
  onDecline,
  userEmail
}) => {
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRinging(true);
      // Play ringtone (you can add audio here)
      const audio = new Audio('/sounds/ringtone.mp3');
      audio.loop = true;
      audio.play().catch(console.error);

      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [isOpen]);

  const handleDecline = async () => {
    if (call) {
      try {
        console.log('📞 IncomingCallModal: Declining call:', call.roomName);
        await videoCallService.declineCall(call.roomName, userEmail);
        console.log('📞 IncomingCallModal: Call declined successfully, backend should notify both participants');
        
        // Set a timeout to ensure modal closes even if WebSocket notification fails
        setTimeout(() => {
          console.log('📞 IncomingCallModal: Timeout reached, ensuring modal closes');
          onDecline();
        }, 2000);
        
      } catch (error) {
        console.error('❌ IncomingCallModal: Error declining call:', error);
        // Call onDecline immediately if there was an error
        onDecline();
      }
    }
  };

  const handleAccept = () => {
    setIsRinging(false);
    onAccept();
  };

  if (!isOpen || !call) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        {/* Caller Avatar */}
        <div className="mb-6">
          <div className={`w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isRinging ? 'animate-pulse' : ''
          }`}>
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Incoming Video Call
          </h2>
          <p className="text-gray-600 mt-1">
            From: {call.buyerEmail}
          </p>
        </div>

        {/* Call Details */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          {productName && (
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Product:</span> {productName}
            </p>
          )}
          {shopName && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Shop:</span> {shopName}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 justify-center">
          <button
            onClick={handleDecline}
            className="flex items-center justify-center w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
            title="Decline call"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={handleAccept}
            className="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
            title="Accept call"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          The call will automatically end if not answered within 30 seconds
        </p>
      </div>
    </div>
  );
};

export default IncomingCallModal;