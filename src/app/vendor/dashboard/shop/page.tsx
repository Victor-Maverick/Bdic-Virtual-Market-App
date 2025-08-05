'use client'
import dynamic from 'next/dynamic';
import VendorVideoCallWrapper from '@/components/VendorVideoCallWrapper';
import VendorShopGuard from '@/components/VendorShopGuard';

const ShopClient = dynamic(() => import('@/components/shopClient'), {
    ssr: false
});

export default function Shop() {
    return (
        <VendorShopGuard showSubHeader={false}>
            <VendorVideoCallWrapper>
                <ShopClient />
            </VendorVideoCallWrapper>
        </VendorShopGuard>
    );
}