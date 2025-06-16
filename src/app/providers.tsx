// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/context/CartContext';
import { OnboardingProvider } from '@/context/LogisticsOnboardingContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <OnboardingProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </OnboardingProvider>
        </SessionProvider>
    );
}