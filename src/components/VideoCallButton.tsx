'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Video } from 'lucide-react';
import { videoCallService, VideoCallRequest, VideoCallResponse } from '@/services/videoCallService';
import VideoCallModal from './VideoCallModal';

interface VideoCallButtonProps {
  vendorEmail: string;
  shopId: number; // Required - the shop being called
  shopName: string; // Required - the shop name
  productId?: number; // Optional - for product-specific calls
  productName?: string; // Optional - for product-specific calls
  className?: string;
  variant?: 'primary' | 'secondary' | 'icon';
}

const VideoCallButton: React.FC<VideoCallButtonProps> = ({
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
  const [currentCall, setCurrentCall] = useState<VideoCallResponse | null>(null);
  const [isInitiating, setIsInitiating] = useState(false);

  const handleInitiateCall = async (): Promise<void> => {
    if (!session?.user?.email) {
      alert('Please log in to make a video call');
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
      
      const request: VideoCallRequest = {
        buyerEmail: session.user.email,
        vendorEmail,
        productId,
        shopId,
        productName,
        shopName
      };

      console.log('Buyer initiating video call:', {
        from: session.user.email,
        to: vendorEmail,
        shopId: shopId
      });

      const call = await videoCallService.initiateCall(request);
      setCurrentCall(call);
      setIsCallModalOpen(true);
    } catch (error) {
      console.error('Error initiating video call:', error);
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
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
      );
    }

    return (
      <>
        <Video className="w-4 h-4 mr-2" />
        {isInitiating ? 'Calling...' : 'Video Call'}
      </>
    );
  };

  const getButtonClasses = (): string => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg`;
      case 'secondary':
        return `${baseClasses} px-4 py-2 bg-white border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white rounded-[20px]`;
      case 'icon':
        return `${baseClasses} p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full`;
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
        title="Start video call with vendor"
      >
        {getButtonContent()}
      </button>

      <VideoCallModal
        isOpen={isCallModalOpen}
        onClose={handleCloseCall}
        call={currentCall}
        userEmail={session?.user?.email || ''}
        userType="buyer"
      />
    </>
  );
};

export default VideoCallButton;