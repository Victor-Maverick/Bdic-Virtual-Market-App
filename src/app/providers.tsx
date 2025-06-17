// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/context/CartContext';
import { OnboardingProvider } from '@/context/LogisticsOnboardingContext';
import DraggableCartIndicator from "@/components/cartIndicator";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <OnboardingProvider>
                <CartProvider>
                    {children}
                    <DraggableCartIndicator />
                </CartProvider>
            </OnboardingProvider>
        </SessionProvider>
    );
}