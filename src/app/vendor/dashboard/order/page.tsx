'use client'
import dynamic from 'next/dynamic';
import VendorVideoCallWrapper from '@/components/VendorVideoCallWrapper';

const OrderClient = dynamic(() => import('@/components/orderClient'), {
    ssr: false
});

export default function Orders() {
    return (
        <VendorVideoCallWrapper>
            <OrderClient />
        </VendorVideoCallWrapper>
    );
}
