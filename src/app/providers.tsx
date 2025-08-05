// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/context/CartContext';
import { OnboardingProvider } from '@/context/LogisticsOnboardingContext';
import { VideoCallProvider } from '@/providers/VideoCallProvider';
import { VoiceCallProvider } from '@/providers/VoiceCallProvider';
import { UserPresenceProvider } from '@/providers/UserPresenceProvider';
import { EmailVerificationProvider } from '@/providers/EmailVerificationProvider';
import DraggableCartIndicator from "@/components/cartIndicator";
import VendorCallNotifications from "@/components/VendorCallNotifications";
import VoiceCallNotifications from "@/components/VoiceCallNotifications";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <EmailVerificationProvider>
                <OnboardingProvider>
                    <CartProvider>
                        <VideoCallProvider>
                            <VoiceCallProvider>
                                <UserPresenceProvider>
                                    {children}
                                    <DraggableCartIndicator />
                                    <VendorCallNotifications />
                                    <VoiceCallNotifications />
                                </UserPresenceProvider>
                            </VoiceCallProvider>
                        </VideoCallProvider>
                    </CartProvider>
                </OnboardingProvider>
            </EmailVerificationProvider>
        </SessionProvider>
    );
}