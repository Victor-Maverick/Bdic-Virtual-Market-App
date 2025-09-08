'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useTwilioCall } from '../hooks/useTwilioCall';
import CallNotificationBadge from './CallNotificationBadge';
import TwilioCallModal from './TwilioCallModal';
import { twilioCallService } from '../services/twilioCallService';

interface VendorVideoCallWrapperProps {
  children: React.ReactNode;
}

const VendorVideoCallWrapper: React.FC<VendorVideoCallWrapperProps> = ({ children }) => {
  const { data: session } = useSession();
  const {
    incomingCall,
    currentCall,
    isCallModalOpen,
    dismissIncomingCall,
    closeCallModal
  } = useTwilioCall();

  const handleAcceptCall = async () => {
    if (!incomingCall || !session?.user?.email) return;

    try {
      const response = await twilioCallService.answerCall(incomingCall.id, session.user.email);
      
      // Open call modal with vendor's access token
      window.dispatchEvent(new CustomEvent('openTwilioCall', {
        detail: {
          call: response,
          isInitiator: false
        }
      }));

      dismissIncomingCall();
    } catch (error) {
      console.error('Failed to answer call:', error);
      dismissIncomingCall();
    }
  };

  const handleRejectCall = async () => {
    if (!incomingCall || !session?.user?.email) return;

    try {
      await twilioCallService.rejectCall(incomingCall.id, session.user.email);
    } catch (error) {
      console.error('Failed to reject call:', error);
    }

    dismissIncomingCall();
  };

  return (
    <>
      {children}
      
      {/* Call Notifications - Show badge for vendor pages */}
      {incomingCall && (
        <CallNotificationBadge
          incomingCall={incomingCall}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}
      
      {/* Call Modal */}
      {isCallModalOpen && currentCall && (
        <TwilioCallModal
          call={currentCall}
          isInitiator={currentCall.isInitiator || false}
          onClose={closeCallModal}
        />
      )}
    </>
  );
};

export default VendorVideoCallWrapper;