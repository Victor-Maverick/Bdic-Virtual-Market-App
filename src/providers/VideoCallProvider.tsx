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
  forceCloseModals?: () => void;
}

const VideoCallContext = createContext<VideoCallContextType>({
  isConnected: false,
  hasIncomingCall: false,
  acceptPendingCall: () => { },
  forceCloseModals: () => { }
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
    console.log('📞 VideoCallProvider: handleDeclineCall called - clearing incoming call');
    clearIncomingCall();
  };

  const handleCloseVideoCall = () => {
    console.log('📞 VideoCallProvider: handleCloseVideoCall called');
    setIsVideoCallOpen(false);
    setCurrentCall(null);
  };

  const forceCloseAllModals = () => {
    console.log('📞 VideoCallProvider: Force closing all modals');
    setIsVideoCallOpen(false);
    setCurrentCall(null);
    clearIncomingCall();
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
      console.log('📞 VideoCallProvider: Received call status:', callStatus);
      console.log('📞 VideoCallProvider: Current state - isVideoCallOpen:', isVideoCallOpen, 'currentCall:', currentCall, 'incomingCall:', incomingCall);
      
      // Create a copy of the status to avoid stale closure issues
      const statusType = callStatus.type;
      
      switch (statusType) {
        case 'STATUS_UPDATE':
          console.log('📞 VideoCallProvider: Call status updated:', callStatus);
          break;
        case 'CALL_ENDED':
          console.log('📞 VideoCallProvider: CALL_ENDED received - closing modal for both participants');
          forceCloseAllModals();
          break;
        case 'CALL_DECLINED':
          console.log('📞 VideoCallProvider: Call declined - closing modals for both participants');
          forceCloseAllModals();
          break;
        case 'CALL_MISSED':
          console.log('📞 VideoCallProvider: Call missed after 45 seconds - closing modals');
          forceCloseAllModals();
          break;
        default:
          console.log('📞 VideoCallProvider: Unknown call status type:', statusType);
      }
      
      // Clear the status after handling
      setTimeout(() => {
        clearCallStatus();
      }, 100);
    }
  }, [callStatus]);

  // Debug effect to monitor state changes
  React.useEffect(() => {
    console.log('📞 VideoCallProvider: State changed - isVideoCallOpen:', isVideoCallOpen, 'currentCall:', currentCall?.roomName, 'incomingCall:', incomingCall?.call?.roomName);
  }, [isVideoCallOpen, currentCall, incomingCall]);

  const contextValue: VideoCallContextType = {
    isConnected,
    hasIncomingCall: !!incomingCall,
    acceptPendingCall,
    forceCloseModals: forceCloseAllModals
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
        userType={currentCall?.vendorEmail === session?.user?.email ? 'vendor' : 'buyer'}
      />
    </VideoCallContext.Provider>
  );
};