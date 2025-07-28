'use client';

import React, { createContext, useContext, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useVideoCallNotifications } from '@/hooks/useVideoCallNotifications';
import { VideoCallResponse } from '@/services/videoCallService';
import IncomingCallModal from '@/components/IncomingCallModal';
import VideoCallModal from '@/components/VideoCallModal';

interface VideoCallContextType {
  isConnected: boolean;
  hasIncomingCall: boolean;
  acceptPendingCall: (call: VideoCallResponse) => void;
}

const VideoCallContext = createContext<VideoCallContextType>({
  isConnected: false,
  hasIncomingCall: false,
  acceptPendingCall: () => {}
});

export const useVideoCallContext = () => {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error('useVideoCallContext must be used within VideoCallProvider');
  }
  return context;
};

interface VideoCallProviderProps {
  children: React.ReactNode;
}

export const VideoCallProvider: React.FC<VideoCallProviderProps> = ({ children }) => {
  const { data: session } = useSession();
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [currentCall, setCurrentCall] = useState<VideoCallResponse | null>(null);

  const {
    isConnected,
    incomingCall,
    callStatus,
    clearIncomingCall,
    clearCallStatus
  } = useVideoCallNotifications();

  const handleAcceptCall = () => {
    if (incomingCall) {
      setCurrentCall(incomingCall.call);
      setIsVideoCallOpen(true);
      clearIncomingCall();
    }
  };

  const handleDeclineCall = () => {
    clearIncomingCall();
  };

  const handleCloseVideoCall = () => {
    setIsVideoCallOpen(false);
    setCurrentCall(null);
  };

  const acceptPendingCall = (call: VideoCallResponse) => {
    console.log('🎯 VideoCallProvider: Accepting pending call', call);
    setCurrentCall(call);
    setIsVideoCallOpen(true);
    console.log('🎯 VideoCallProvider: Modal should be open now');
  };

  // Handle call status updates
  React.useEffect(() => {
    if (callStatus) {
      switch (callStatus.type) {
        case 'CALL_ENDED':
          setIsVideoCallOpen(false);
          setCurrentCall(null);
          // Show a brief notification that the call ended
          setTimeout(() => {
            // Create a temporary toast notification
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            toast.textContent = 'Call ended by other participant';
            document.body.appendChild(toast);
            
            // Remove toast after 3 seconds
            setTimeout(() => {
              if (document.body.contains(toast)) {
                document.body.removeChild(toast);
              }
            }, 3000);
          }, 100);
          break;
        case 'CALL_DECLINED':
          console.log('📞 VideoCallProvider: Call declined by vendor');
          alert('The vendor declined your call');
          setIsVideoCallOpen(false);
          setCurrentCall(null);
          break;
      }
      clearCallStatus();
    }
  }, [callStatus, clearCallStatus]);

  const contextValue: VideoCallContextType = {
    isConnected,
    hasIncomingCall: !!incomingCall,
    acceptPendingCall
  };

  return (
    <VideoCallContext.Provider value={contextValue}>
      {children}
      
      {/* Incoming Call Modal */}
      <IncomingCallModal
        isOpen={!!incomingCall}
        call={incomingCall?.call || null}
        productName={incomingCall?.productName}
        shopName={incomingCall?.shopName}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
        userEmail={session?.user?.email || ''}
      />

      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={isVideoCallOpen}
        onClose={handleCloseVideoCall}
        call={currentCall}
        userEmail={session?.user?.email || ''}
        userType="vendor"
      />
    </VideoCallContext.Provider>
  );
};