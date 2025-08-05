'use client'
import dynamic from 'next/dynamic';
import VendorVideoCallWrapper from '@/components/VendorVideoCallWrapper';
import VendorShopGuard from '@/components/VendorShopGuard';

const OrderClient = dynamic(() => import('@/components/orderClient'), {
    ssr: false
});

export default function Orders() {
    return (
        <VendorShopGuard showSubHeader={false}>
            <VendorVideoCallWrapper>
                <OrderClient />
            </VendorVideoCallWrapper>
        </VendorShopGuard>
    );
}
