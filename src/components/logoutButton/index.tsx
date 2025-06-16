// app/components/LogoutButton.tsx
'use client';
import { signOut } from 'next-auth/react';

const LogoutButton = () => (
    <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="bg-red-500 text-white px-4 py-2 rounded"
    >
        Sign Out
    </button>
);

export default LogoutButton;