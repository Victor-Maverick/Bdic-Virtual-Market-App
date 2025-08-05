'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Phone } from 'lucide-react';
import { voiceCallService, VoiceCallRequest, VoiceCallResponse } from '@/services/voiceCallService';
import VoiceCallModal from './VoiceCallModal';

interface VoiceCallButtonProps {
  vendorEmail: string;
  shopId: number; // Required - the shop being called
  shopName: string; // Required - the shop name
  productId?: number; // Optional - for product-specific calls
  productName?: string; // Optional - for product-specific calls
  className?: string;
  variant?: 'primary' | 'secondary' | 'icon';
}

const VoiceCallButton: React.FC<VoiceCallButtonProps> = ({
  vendorEmail,
  shopId,
  shopName,
  productId,
  productName,
  className = '',
  variant = 'primary'
}) => {
  const { data: session } = useSession();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [currentCall, setCurrentCall] = useState<VoiceCallResponse | null>(null);
  const [isInitiating, setIsInitiating] = useState(false);

  const handleInitiateCall = async (): Promise<void> => {
    if (!session?.user?.email) {
      alert('Please log in to make a voice call');
      return;
    }

    if (session.user.email === vendorEmail) {
      alert('You cannot call yourself');
      return;
    }

    if (shopId <= 0) {
      alert('Shop information is required to make a call');
      return;
    }

    try {
      setIsInitiating(true);
      
      const request: VoiceCallRequest = {
        buyerEmail: session.user.email,
        vendorEmail,
        productId,
        shopId,
        productName,
        shopName
      };

      console.log('Buyer initiating voice call:', {
        from: session.user.email,
        to: vendorEmail,
        shopId: shopId
      });

      const call = await voiceCallService.initiateCall(request);
      setCurrentCall(call);
      setIsCallModalOpen(true);
    } catch (error) {
      console.error('Error initiating voice call:', error);
      alert('Failed to initiate voice call. Please try again.');
    } finally {
      setIsInitiating(false);
    }
  };

  const handleCloseCall = (): void => {
    setIsCallModalOpen(false);
    setCurrentCall(null);
  };

  const getButtonContent = (): React.ReactNode => {
    if (variant === 'icon') {
      return <Phone className="w-5 h-5" />;
    }

    return (
      <>
        <Phone className="w-4 h-4 mr-2" />
        {isInitiating ? 'Calling...' : 'Voice Call'}
      </>
    );
  };

  const getButtonClasses = (): string => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg`;
      case 'secondary':
        return `${baseClasses} px-4 py-2 bg-white border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-lg`;
      case 'icon':
        return `${baseClasses} p-2 bg-green-600 hover:bg-green-700 text-white rounded-full`;
      default:
        return baseClasses;
    }
  };

  return (
    <>
      <button
        onClick={handleInitiateCall}
        disabled={isInitiating}
        className={`${getButtonClasses()} ${className}`}
        title="Start voice call with vendor"
      >
        {getButtonContent()}
      </button>

      <VoiceCallModal
        isOpen={isCallModalOpen}
        onClose={handleCloseCall}
        call={currentCall}
        userEmail={session?.user?.email || ''}
        userType="buyer"
      />
    </>
  );
};

export default VoiceCallButton;