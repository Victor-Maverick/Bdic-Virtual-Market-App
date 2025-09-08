// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/context/CartContext';
import { OnboardingProvider } from '@/context/LogisticsOnboardingContext';

import { UserPresenceProvider } from '@/providers/UserPresenceProvider';
import { EmailVerificationProvider } from '@/providers/EmailVerificationProvider';

import { LogoutProvider } from '@/contexts/LogoutContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import DraggableCartIndicator from "@/components/cartIndicator";

import LogoutSpinner from "@/components/LogoutSpinner";
import NavigationSpinner from "@/components/NavigationSpinner";
import CallManager from "@/components/CallManager";

import { GlobalLoadingOverlay } from "@/components/GlobalLoadingOverlay";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LoadingProvider>
                <LogoutProvider>
                    <NavigationProvider>
                        <EmailVerificationProvider>
                            <OnboardingProvider>
                                    <CartProvider>
                                        <UserPresenceProvider>
                                            {children}
                                            <DraggableCartIndicator />
                                            <LogoutSpinner />
                                            <NavigationSpinner />
                                            <GlobalLoadingOverlay />
                                            <CallManager />
                                        </UserPresenceProvider>
                                    </CartProvider>
                            </OnboardingProvider>
                        </EmailVerificationProvider>
                    </NavigationProvider>
                </LogoutProvider>
            </LoadingProvider>
        </SessionProvider>
    );
}