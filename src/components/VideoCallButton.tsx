'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Video } from 'lucide-react';
import SimpleVideoCallModal from './SimpleVideoCallModal';

interface VideoCallButtonProps {
  vendorEmail: string;
  shopId?: number; // Optional - the shop being called
  shopName?: string; // Optional - the shop name
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
  const [showCallManager, setShowCallManager] = useState(false);

  // Don't show call button if user is calling themselves
  if (session?.user?.email === vendorEmail) {
    return null;
  }



  const handleVideoCall = () => {
    // Use the global CallManager
    if (typeof window !== 'undefined' && (window as any).callManager) {
      (window as any).callManager.initiateVideoCall({
        vendorEmail,
        buyerEmail: session?.user?.email || '',
        productId,
        productName,
        shopId,
        shopName
      });
    } else {
      // Fallback to old modal system
      setShowCallManager(true);
    }
  };

  const buttonClassName = getButtonClassName(variant);

  return (
    <>
      <button
        onClick={handleVideoCall}
        className={`${buttonClassName} ${className}`}
        title="Start Video Call"
      >
        <Video size={variant === 'icon' ? 20 : 16} />
        {variant !== 'icon' && <span>Video Call</span>}
      </button>

      {showCallManager && (
        <SimpleVideoCallModal
          isOpen={showCallManager}
          onClose={() => setShowCallManager(false)}
          vendorEmail={vendorEmail}
          buyerEmail={session?.user?.email || ''}
          productId={productId}
          productName={productName}
          shopId={shopId}
          shopName={shopName}
        />
      )}
    </>
  );
};

const getButtonClassName = (variant: 'primary' | 'secondary' | 'icon'): string => {
  switch (variant) {
    case 'primary':
      return 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors';
    case 'secondary':
      return 'bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors';
    case 'icon':
      return 'p-2 hover:bg-gray-100 rounded-lg border border-gray-200 bg-white text-blue-600 transition-colors';
    default:
      return 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors';
  }
};

export default VideoCallButton;