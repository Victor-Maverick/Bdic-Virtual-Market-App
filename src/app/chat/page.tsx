'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import MarketPlaceHeader from '@/components/marketPlaceHeader';
import BackButton from '@/components/BackButton';
import VideoCallButton from '@/components/VideoCallButton';
import VoiceCallButton from '@/components/VoiceCallButton';
import ImprovedChatInterface from '@/components/ImprovedChatInterface';

const ChatPage: React.FC = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  // Extract URL parameters
  const vendorEmail = searchParams.get('vendor') || '';
  const vendorName = searchParams.get('vendorName') || vendorEmail;
  const shopId = parseInt(searchParams.get('shopId') || '0');
  const shopName = searchParams.get('shopName') || vendorName;
  const productId = searchParams.get('productId') ? parseInt(searchParams.get('productId')!) : undefined;
  const productName = searchParams.get('productName') || undefined;

  if (!session?.user?.email || !vendorEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access chat.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MarketPlaceHeader />
      
      {/* Breadcrumb - Hidden on mobile */}
      <div className="hidden sm:block h-[48px] w-full border-b-[0.5px] border-[#EDEDED]">
        <div className="h-[48px] px-4 sm:px-25 gap-[8px] items-center flex">
          <BackButton variant="default" text="Go back" />
          <p className="text-[14px] text-[#3F3E3E]">
            Home // <span className="font-medium text-[#022B23]">Chat with {vendorName}</span>
          </p>
        </div>
      </div>

      {/* Mobile Back Button */}
      <div className="sm:hidden p-4 border-b border-gray-200">
        <BackButton variant="default" text="Back" />
      </div>

      {/* Chat Container */}
      <div className="px-4 sm:px-25 py-4 sm:py-6 h-screen sm:h-auto">
        <ImprovedChatInterface
          otherUserEmail={vendorEmail}
          otherUserName={vendorName}
          className="h-[calc(100vh-120px)] sm:h-[calc(100vh-200px)]"
          headerActions={
            <div className="flex items-center gap-2">
              <VideoCallButton
                vendorEmail={vendorEmail}
                shopId={shopId}
                shopName={shopName}
                productId={productId}
                productName={productName}
                variant="icon"
                className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200 bg-white text-blue-600"
              />
              <VoiceCallButton
                vendorEmail={vendorEmail}
                shopId={shopId}
                shopName={shopName}
                productId={productId}
                productName={productName}
                variant="icon"
                className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200 bg-white text-green-600"
              />
            </div>
          }
        />
      </div>
    </>
  );
};

export default ChatPage;