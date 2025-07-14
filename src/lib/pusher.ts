// lib/pusher.ts
import Pusher from 'pusher-js';
import { getSession } from 'next-auth/react';

const createPusher = async (): Promise<Pusher> => {
    const session = await getSession();
    const email = session?.user?.email;

    if (!email) {
        throw new Error('User not authenticated');
    }

    if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
        throw new Error('Pusher environment variables not configured');
    }

    return new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
        authEndpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/auth`,
        auth: {
            params: { email },
        },
    });
};

export default createPusher;