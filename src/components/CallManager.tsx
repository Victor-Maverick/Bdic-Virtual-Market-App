'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import IncomingCallModal from './IncomingCallModal';
import SimpleVideoCallModal from './SimpleVideoCallModal';
import SimpleVoiceCallModal from './SimpleVoiceCallModal';
import { VideoCallResponse } from '@/services/videoCallService';
import { VoiceCallResponse } from '@/services/voiceCallService';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface CallManagerProps {
  children: React.ReactNode;
}

const CallManager: React.FC<CallManagerProps> = ({ children }) => {
  const { data: session } = useSession();
  const [incomingCall, setIncomingCall] = useState<VideoCallResponse | VoiceCallResponse | null>(null);
  const [incomingCallType, setIncomingCallType] = useState<'video' | 'voice' | null>(null);
  const [activeCall, setActiveCall] = useState<VideoCallResponse | VoiceCallResponse | null>(null);
  const [activeCallType, setActiveCallType] = useState<'video' | 'voice' | null>(null);
  const [isInitiator, setIsInitiator] = useState(false);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  // Poll for incoming calls (simplified approach)
  useEffect(() => {
    if (!session?.user?.email) return;

    const pollForCalls = async () => {
      try {
        // Check for pending voice calls
        const voiceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/webrtc/voice-calls/pending?vendorEmail=${encodeURIComponent(session.user.email)}`);
        if (voiceResponse.ok) {
          const voiceCalls = await voiceResponse.json();
          if (voiceCalls.length > 0 && !incomingCall && !activeCall) {
            console.log('📞 Found pending voice call:', voiceCalls[0]);
            setIncomingCall(voiceCalls[0]);
            setIncomingCallType('voice');
          }
        }

        // Check for pending video calls
        const videoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/webrtc/video-calls/pending?vendorEmail=${encodeURIComponent(session.user.email)}`);
        if (videoResponse.ok) {
          const videoCalls = await videoResponse.json();
          if (videoCalls.length > 0 && !incomingCall && !activeCall) {
            console.log('📞 Found pending video call:', videoCalls[0]);
            setIncomingCall(videoCalls[0]);
            setIncomingCallType('video');
          }
        }
      } catch (error) {
        console.error('📞 Error polling for calls:', error);
      }
    };

    // Poll every 3 seconds
    const interval = setInterval(pollForCalls, 3000);
    
    // Initial poll
    pollForCalls();

    return () => {
      clearInterval(interval);
    };
  }, [session?.user?.email, incomingCall, activeCall]);

  // Handle accepting incoming call
  const handleAcceptCall = () => {
    if (incomingCall && incomingCallType) {
      console.log(`📞 Accepting ${incomingCallType} call:`, incomingCall.roomName);
      setActiveCall(incomingCall);
      setActiveCallType(incomingCallType);
      setIsInitiator(false); // Recipient
      setIncomingCall(null);
      setIncomingCallType(null);
    }
  };

  // Handle declining incoming call
  const handleDeclineCall = () => {
    console.log('📞 Declining incoming call');
    setIncomingCall(null);
    setIncomingCallType(null);
  };

  // Handle closing active call
  const handleCloseCall = () => {
    console.log('📞 Closing active call');
    setActiveCall(null);
    setActiveCallType(null);
    setIsInitiator(false);
  };

  // Public methods for initiating calls (to be used by other components)
  const initiateVideoCall = (callData: {
    vendorEmail: string;
    buyerEmail: string;
    productId?: number;
    productName?: string;
    shopId?: number;
    shopName?: string;
  }) => {
    console.log('📞 Initiating video call:', callData);
    // Create a mock call object for the modal
    const mockCall: VideoCallResponse = {
      id: 0,
      roomName: '', // Will be set by the modal
      buyerEmail: callData.buyerEmail,
      vendorEmail: callData.vendorEmail,
      productId: callData.productId,
      productName: callData.productName,
      shopId: callData.shopId,
      shopName: callData.shopName,
      status: 'INITIATED',
      createdAt: new Date().toISOString(),
      buyerJoined: false,
      vendorJoined: false
    };
    
    setActiveCall(mockCall);
    setActiveCallType('video');
    setIsInitiator(true);
  };

  const initiateVoiceCall = (callData: {
    vendorEmail: string;
    buyerEmail: string;
    productId?: number;
    productName?: string;
    shopId?: number;
    shopName?: string;
  }) => {
    console.log('📞 Initiating voice call:', callData);
    // Create a mock call object for the modal
    const mockCall: VoiceCallResponse = {
      id: 0,
      roomName: '', // Will be set by the modal
      buyerEmail: callData.buyerEmail,
      vendorEmail: callData.vendorEmail,
      productId: callData.productId,
      productName: callData.productName,
      shopId: callData.shopId,
      shopName: callData.shopName,
      status: 'INITIATED',
      createdAt: new Date().toISOString(),
      buyerJoined: false,
      vendorJoined: false
    };
    
    setActiveCall(mockCall);
    setActiveCallType('voice');
    setIsInitiator(true);
  };

  // Expose call methods globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).callManager = {
        initiateVideoCall,
        initiateVoiceCall
      };
    }
  }, []);

  if (!session?.user?.email) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      
      {/* Incoming Call Modal */}
      {incomingCall && incomingCallType && (
        <IncomingCallModal
          isOpen={true}
          call={incomingCall}
          callType={incomingCallType}
          productName={incomingCall.productName}
          shopName={incomingCall.shopName}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
          userEmail={session.user.email}
        />
      )}

      {/* Active Video Call Modal */}
      {activeCall && activeCallType === 'video' && (
        <SimpleVideoCallModal
          isOpen={true}
          onClose={handleCloseCall}
          vendorEmail={activeCall.vendorEmail}
          buyerEmail={activeCall.buyerEmail}
          productId={activeCall.productId}
          productName={activeCall.productName}
          shopId={activeCall.shopId}
          shopName={activeCall.shopName}
        />
      )}

      {/* Active Voice Call Modal */}
      {activeCall && activeCallType === 'voice' && (
        <SimpleVoiceCallModal
          isOpen={true}
          onClose={handleCloseCall}
          vendorEmail={activeCall.vendorEmail}
          buyerEmail={activeCall.buyerEmail}
          productId={activeCall.productId}
          productName={activeCall.productName}
          shopId={activeCall.shopId}
          shopName={activeCall.shopName}
        />
      )}
    </>
  );
};

export default CallManager;