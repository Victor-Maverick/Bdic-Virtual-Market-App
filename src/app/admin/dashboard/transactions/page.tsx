'use client'
import dynamic from 'next/dynamic';

const AdminTransactionClient = dynamic(() => import('@/components/adminTransactionClient'), {
    ssr: false
});

export default function Transactions() {
    return <AdminTransactionClient />;
}
