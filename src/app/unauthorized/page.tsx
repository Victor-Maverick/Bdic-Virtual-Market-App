// app/unauthorized/page.tsx
'use client';
import { useRouter } from 'next/navigation';

const Unauthorized = () => {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Unauthorized Access</h1>
            <p>You do not have permission to access this page.</p>
            <button
                onClick={() => router.push('/')}
                className="mt-4 bg-[#033228] text-[#C6EB5F] px-4 py-2 rounded"
            >
                Go to Home
            </button>
        </div>
    );
};

export default Unauthorized;