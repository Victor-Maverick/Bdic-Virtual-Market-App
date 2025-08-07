'use client';

import React, { createContext, useContext, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useVoiceCallNotifications } from '@/hooks/useVoiceCallNotifications';
import { VoiceCallResponse, voiceCallService } from '@/services/voiceCallService';
import VoiceCallModal from '@/components/VoiceCallModal';
import AudioUtils from '@/utils/audioUtils';

interface VoiceCallContextType {
  isConnected: boolean;
  hasIncomingCall: boolean;
  acceptPendingCall: (call: VoiceCallResponse) => void;
  forceCloseModals?: () => void;
}

const VoiceCallContext = createContext<VoiceCallContextType>({
  isConnected: false,
  hasIncomingCall: false,
  acceptPendingCall: () => { },
  forceCloseModals: () => { }
});

export const useVoiceCallContext = () => {
  const context = useContext(VoiceCallContext);
  if (!context) {
    throw new Error('useVoiceCallContext must be used within VoiceCallProvider');
  }
  return context;
};

interface VoiceCallProviderProps {
  children: React.ReactNode;
}

export const VoiceCallProvider: React.FC<VoiceCallProviderProps> = ({ children }) => {
  const { data: session } = useSession();
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false);
  const [currentCall, setCurrentCall] = useState<VoiceCallResponse | null>(null);

  // Test service connection on mount
  React.useEffect(() => {
    if (session?.user?.email) {
      voiceCallService.testConnection().then(isAvailable => {
        console.log('🎤 Voice call service available:', isAvailable);
      });
    }
  }, [session?.user?.email]);

  const {
    isConnected,
    incomingCall,
    callStatus,
    clearIncomingCall,
    clearCallStatus
  } = useVoiceCallNotifications();

  const handleAcceptCall = async () => {
    if (incomingCall) {
      try {
        // Accept the call via API first
        await voiceCallService.acceptCall(incomingCall.call.roomName);
        
        // Then open the modal
        setCurrentCall(incomingCall.call);
        setIsVoiceCallOpen(true);
        clearIncomingCall();
      } catch (error) {
        console.error('Error accepting voice call:', error);
        clearIncomingCall();
      }
    }
  };

  const handleDeclineCall = async () => {
    if (incomingCall) {
      try {
        // Decline the call via API first
        await voiceCallService.declineCall(incomingCall.call.roomName, session?.user?.email || '');
        console.log('🎤 VoiceCallProvider: handleDeclineCall called - clearing incoming call');
        clearIncomingCall();
      } catch (error) {
        console.error('Error declining voice call:', error);
        clearIncomingCall();
      }
    }
  };

  const handleCloseVoiceCall = () => {
    console.log('🎤 VoiceCallProvider: handleCloseVoiceCall called');
    setIsVoiceCallOpen(false);
    setCurrentCall(null);
  };

  const forceCloseAllModals = () => {
    console.log('🎤 VoiceCallProvider: Force closing all modals');
    setIsVoiceCallOpen(false);
    setCurrentCall(null);
    clearIncomingCall();
  };

  const acceptPendingCall = (call: VoiceCallResponse) => {
    console.log('🎯 VoiceCallProvider: Accepting pending call', call);
    setCurrentCall(call);
    setIsVoiceCallOpen(true);
    console.log('🎯 VoiceCallProvider: Modal should be open now');
  };

  // Handle call status updates
  React.useEffect(() => {
    if (callStatus) {
      console.log('🎤 VoiceCallProvider: Received call status:', callStatus);
      console.log('🎤 VoiceCallProvider: Current state - isVoiceCallOpen:', isVoiceCallOpen, 'currentCall:', currentCall, 'incomingCall:', incomingCall);
      
      // Create a copy of the status to avoid stale closure issues
      const statusType = callStatus.type;
      
      switch (statusType) {
        case 'STATUS_UPDATE':
          console.log('🎤 VoiceCallProvider: Call status updated:', callStatus);
          break;
        case 'CALL_ENDED':
          console.log('🎤 VoiceCallProvider: CALL_ENDED received - FORCE closing modal for both participants');
          // Play call end sound
          AudioUtils.playCallEndSound();
          // Force close immediately without any conditions
          setIsVoiceCallOpen(false);
          setCurrentCall(null);
          clearIncomingCall();
          // Also trigger a page refresh to ensure clean state
          setTimeout(() => {
            window.location.reload();
          }, 500);
          break;
        case 'CALL_DECLINED':
          console.log('🎤 VoiceCallProvider: Call declined - FORCE closing modals for both participants');
          AudioUtils.playCallEndSound();
          setIsVoiceCallOpen(false);
          setCurrentCall(null);
          clearIncomingCall();
          break;
        case 'CALL_MISSED':
          console.log('🎤 VoiceCallProvider: Call missed after 30 seconds - FORCE closing modals');
          AudioUtils.playCallEndSound();
          setIsVoiceCallOpen(false);
          setCurrentCall(null);
          clearIncomingCall();
          break;
        default:
          console.log('🎤 VoiceCallProvider: Unknown call status type:', statusType);
      }
      
      // Clear the status after handling
      setTimeout(() => {
        clearCallStatus();
      }, 100);
    }
  }, [callStatus, isVoiceCallOpen, currentCall, incomingCall, clearIncomingCall, clearCallStatus]);

  // Handle incoming call notifications
  React.useEffect(() => {
    if (incomingCall) {
      console.log('🎤 VoiceCallProvider: New incoming call detected, playing notification sound');
      AudioUtils.playIncomingCallSound();
    }
  }, [incomingCall]);

  // Debug effect to monitor state changes
  React.useEffect(() => {
    console.log('🎤 VoiceCallProvider: State changed - isVoiceCallOpen:', isVoiceCallOpen, 'currentCall:', currentCall?.roomName, 'incomingCall:', incomingCall?.call?.roomName);
  }, [isVoiceCallOpen, currentCall, incomingCall]);

  const contextValue: VoiceCallContextType = {
    isConnected,
    hasIncomingCall: !!incomingCall,
    acceptPendingCall,
    forceCloseModals: forceCloseAllModals
  };

  return (
    <VoiceCallContext.Provider value={contextValue}>
      {children}

      {/* Incoming Voice Call Modal - Simple notification style */}
      {incomingCall && (
        <div className="fixed top-4 left-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl animate-bounce">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <div>
                <div className="font-bold text-sm">Incoming Voice Call</div>
                <div className="text-xs opacity-90">{incomingCall.call.buyerEmail}</div>
              </div>
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                onClick={handleAcceptCall}
                className="bg-white text-green-500 px-3 py-1 rounded text-xs font-bold hover:bg-gray-100"
              >
                Accept
              </button>
              <button
                onClick={handleDeclineCall}
                className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-600"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Call Modal */}
      <VoiceCallModal
        isOpen={isVoiceCallOpen}
        onClose={handleCloseVoiceCall}
        call={currentCall}
        userEmail={session?.user?.email || ''}
        userType={currentCall?.vendorEmail === session?.user?.email ? 'vendor' : 'buyer'}
      />
    </VoiceCallContext.Provider>
  );
};