'use client'
import dynamic from 'next/dynamic';
import VendorVideoCallWrapper from '@/components/VendorVideoCallWrapper';

const ShopClient = dynamic(() => import('@/components/shopClient'), {
    ssr: false
});

export default function Shop() {
    return (
        <VendorVideoCallWrapper>
            <ShopClient />
        </VendorVideoCallWrapper>
    );
}