// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/context/CartContext';
import { OnboardingProvider } from '@/context/LogisticsOnboardingContext';
import { VideoCallProvider } from '@/providers/VideoCallProvider';
import { VoiceCallProvider } from '@/providers/VoiceCallProvider';
import { UserPresenceProvider } from '@/providers/UserPresenceProvider';
import { EmailVerificationProvider } from '@/providers/EmailVerificationProvider';
import { LogoutProvider } from '@/contexts/LogoutContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import DraggableCartIndicator from "@/components/cartIndicator";
import VendorCallNotifications from "@/components/VendorCallNotifications";
import VoiceCallNotifications from "@/components/VoiceCallNotifications";
import LogoutSpinner from "@/components/LogoutSpinner";
import NavigationSpinner from "@/components/NavigationSpinner";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LogoutProvider>
                <NavigationProvider>
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
                                            <LogoutSpinner />
                                            <NavigationSpinner />
                                        </UserPresenceProvider>
                                    </VoiceCallProvider>
                                </VideoCallProvider>
                            </CartProvider>
                        </OnboardingProvider>
                    </EmailVerificationProvider>
                </NavigationProvider>
            </LogoutProvider>
        </SessionProvider>
    );
}