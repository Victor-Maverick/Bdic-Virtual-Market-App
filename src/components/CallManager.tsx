import React from 'react';
import { useSession } from 'next-auth/react';
import { useTwilioCall } from '../hooks/useTwilioCall';
import IncomingCallNotification from './IncomingCallNotification';
import CallNotificationBadge from './CallNotificationBadge';
import TwilioCallModal from './TwilioCallModal';
import { twilioCallService } from '../services/twilioCallService';

const CallManager: React.FC = () => {
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

  // Check if user is on vendor pages to show badge instead of full notification
  const [isVendorPage, setIsVendorPage] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsVendorPage(window.location.pathname.includes('/vendor/'));
      
      // Listen for route changes
      const handleRouteChange = () => {
        setIsVendorPage(window.location.pathname.includes('/vendor/'));
      };
      
      window.addEventListener('popstate', handleRouteChange);
      return () => window.removeEventListener('popstate', handleRouteChange);
    }
  }, []);

  return (
    <>
      {incomingCall && (
        <>
          {isVendorPage ? (
            <CallNotificationBadge
              incomingCall={incomingCall}
              onAccept={handleAcceptCall}
              onReject={handleRejectCall}
            />
          ) : (
            <IncomingCallNotification 
              incomingCall={incomingCall}
              onDismiss={dismissIncomingCall}
            />
          )}
        </>
      )}
      
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

export default CallManager;