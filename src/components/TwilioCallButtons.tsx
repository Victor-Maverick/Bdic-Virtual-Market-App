'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { Phone, Video } from 'lucide-react';
import { twilioCallService } from '../services/twilioCallService';
import { toast } from 'react-toastify';

interface TwilioCallButtonsProps {
  vendorEmail: string;
  vendorName?: string;
  shopName: string;
  productId?: number;
  productName?: string;
  shopId?: number;
  className?: string;
}

const TwilioCallButtons: React.FC<TwilioCallButtonsProps> = ({
  vendorEmail,
  vendorName,
  shopName,
  productId,
  productName,
  shopId,
  className = ''
}) => {
  const { data: session } = useSession();

  const initiateCall = async (callType: 'VOICE' | 'VIDEO') => {
    if (!session?.user?.email) {
      toast.error('Please login to make a call');
      return;
    }

    if (session.user.email === vendorEmail) {
      toast.error('You cannot call yourself');
      return;
    }

    try {
      const callRequest = {
        callerEmail: session.user.email,
        callerName: session.user.name || 'Customer',
        vendorEmail,
        vendorName: vendorName || 'Vendor',
        shopName,
        productId,
        productName,
        shopId,
        callType
      };

      const response = await twilioCallService.initiateCall(callRequest);
      
      // Open call modal with Twilio token
      window.dispatchEvent(new CustomEvent('openTwilioCall', {
        detail: {
          call: response,
          isInitiator: true
        }
      }));

    } catch (error) {
      console.error('Failed to initiate call:', error);
      toast.error('Failed to initiate call. Please try again.');
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-2 w-full ${className}`}>
      <button
        onClick={() => initiateCall('VOICE')}
        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg transition-colors duration-200 w-full sm:w-auto sm:min-w-[100px] text-sm sm:text-base font-medium touch-manipulation"
        title="Voice Call"
      >
        <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="sm:hidden md:inline">Voice Call</span>
        <span className="hidden sm:inline md:hidden">Voice</span>
      </button>
      
      <button
        onClick={() => initiateCall('VIDEO')}
        className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg transition-colors duration-200 w-full sm:w-auto sm:min-w-[100px] text-sm sm:text-base font-medium touch-manipulation"
        title="Video Call"
      >
        <Video className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="sm:hidden md:inline">Video Call</span>
        <span className="hidden sm:inline md:hidden">Video</span>
      </button>
    </div>
  );
};

export default TwilioCallButtons;