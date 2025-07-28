'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
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

  const handleInitiateCall = async () => {
    if (!session?.user?.email) {
      alert('Please log in to make a video call');
      return;
    }

    if (session.user.email === vendorEmail) {
      alert('You cannot call yourself');
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

      const call = await videoCallService.initiateCall(request);
      setCurrentCall(call);
      setIsCallModalOpen(true);
    } catch (error) {
      console.error('Error initiating video call:', error);
      alert('Failed to initiate video call. Please try again.');
    } finally {
      setIsInitiating(false);
    }
  };

  const handleCloseCall = () => {
    setIsCallModalOpen(false);
    setCurrentCall(null);
  };

  const getButtonContent = () => {
    if (variant === 'icon') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
      );
    }

    return (
      <>
        {isInitiating ? 'Calling...' : 'Call vendor'}
      </>
    );
  };

  const getButtonClasses = () => {
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