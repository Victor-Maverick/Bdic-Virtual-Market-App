'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Phone } from 'lucide-react';
import SimpleVoiceCallModal from './SimpleVoiceCallModal';

interface VoiceCallButtonProps {
  vendorEmail: string;
  shopId?: number; // Optional - the shop being called
  shopName?: string; // Optional - the shop name
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
  const [showCallManager, setShowCallManager] = useState(false);

  // Don't show call button if user is calling themselves
  if (session?.user?.email === vendorEmail) {
    return null;
  }



  const handleVoiceCall = () => {
    setShowCallManager(true);
  };

  const buttonClassName = getButtonClassName(variant);

  return (
    <>
      <button
        onClick={handleVoiceCall}
        className={`${buttonClassName} ${className}`}
        title="Start Voice Call"
      >
        <Phone size={variant === 'icon' ? 20 : 16} />
        {variant !== 'icon' && <span>Voice Call</span>}
      </button>

      {showCallManager && (
        <SimpleVoiceCallModal
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
      return 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors';
    case 'secondary':
      return 'bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors';
    case 'icon':
      return 'p-2 hover:bg-gray-100 rounded-lg border border-gray-200 bg-white text-green-600 transition-colors';
    default:
      return 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors';
  }
};

export default VoiceCallButton;