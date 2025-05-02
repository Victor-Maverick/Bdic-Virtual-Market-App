'use client'
import dynamic from 'next/dynamic';

const OrderClient = dynamic(() => import('@/components/orderClient'), {
    ssr: false
});

export default function Shop() {
    return <OrderClient />;
}
