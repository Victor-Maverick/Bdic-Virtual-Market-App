// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/context/CartContext';
import { OnboardingProvider } from '@/context/LogisticsOnboardingContext';
import { VideoCallProvider } from '@/providers/VideoCallProvider';
import { UserPresenceProvider } from '@/providers/UserPresenceProvider';
import DraggableCartIndicator from "@/components/cartIndicator";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <OnboardingProvider>
                <CartProvider>
                    <VideoCallProvider>
                        <UserPresenceProvider>
                            {children}
                            <DraggableCartIndicator />
                        </UserPresenceProvider>
                    </VideoCallProvider>
                </CartProvider>
            </OnboardingProvider>
        </SessionProvider>
    );
}