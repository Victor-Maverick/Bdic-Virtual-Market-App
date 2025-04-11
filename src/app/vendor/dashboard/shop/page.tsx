'use client'
import dynamic from 'next/dynamic';

const ShopClient = dynamic(() => import('@/components/shopClient'), {
    ssr: false
});

export default function Shop() {
    return <ShopClient />;
}
