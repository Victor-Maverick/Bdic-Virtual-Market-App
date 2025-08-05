'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Phone,  ChevronDown } from 'lucide-react';
import VideoCallButton from './VideoCallButton';
import VoiceCallButton from './VoiceCallButton';

interface CallDropdownProps {
  vendorEmail: string;
  shopId: number;
  shopName: string;
  productId?: number;
  productName?: string;
  className?: string;
  buttonText?: string;
}

const CallDropdown: React.FC<CallDropdownProps> = ({
  vendorEmail,
  shopId,
  shopName,
  productId,
  productName,
  className = '',
  buttonText = 'Call vendor'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        onClick={toggleDropdown}
        className={`inline-flex items-center justify-center px-4 py-2 bg-[#ffeebe] text-[#461602] hover:bg-[#ffd700] rounded-[14px] font-medium transition-colors ${className}`}
      >
        <Phone className="w-4 h-4 mr-2" />
        {buttonText}
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            {/* Voice Call Option */}
            <div className="px-3 py-2 hover:bg-gray-50">
              <VoiceCallButton
                vendorEmail={vendorEmail}
                shopId={shopId}
                shopName={shopName}
                productId={productId}
                productName={productName}
                variant="secondary"
                className="w-full justify-start bg-transparent border-0 text-gray-700 hover:bg-transparent hover:text-green-600 p-0"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-1"></div>

            {/* Video Call Option */}
            <div className="px-3 py-2 hover:bg-gray-50">
              <VideoCallButton
                vendorEmail={vendorEmail}
                shopId={shopId}
                shopName={shopName}
                productId={productId}
                productName={productName}
                variant="secondary"
                className="w-full justify-start bg-transparent border-0 text-gray-700 hover:bg-transparent hover:text-blue-600 p-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallDropdown;