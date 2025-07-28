'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import VendorCallNotifications from './VendorCallNotifications';

interface VendorVideoCallWrapperProps {
  children: React.ReactNode;
}

const VendorVideoCallWrapper: React.FC<VendorVideoCallWrapperProps> = ({ children }) => {
  const { data: session } = useSession();

  // Only show for vendors
  const isVendor = session?.user?.roles?.includes('VENDOR');

  // Debug logging
  React.useEffect(() => {
    if (session?.user) {
      console.log('👤 User session:', {
        email: session.user.email,
        roles: session.user.roles,
        isVendor: isVendor
      });
    }
  }, [session, isVendor]);

  return (
    <>
      {children}
      {isVendor && <VendorCallNotifications />}
    </>
  );
};

export default VendorVideoCallWrapper;