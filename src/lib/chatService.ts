// lib/chatService.ts
import { MessageDTO } from '@/app/types/chat';

export const sanitizeEmail = (email: string): string => {
    return email.replace(/[^a-zA-Z0-9_-]/g, '_');
};

// Frontend (TypeScript) - Must match Java backend
export const generateChannelName = (emailA: string, emailB: string): string => {
    const sanitizedA = sanitizeEmail(emailA);
    const sanitizedB = sanitizeEmail(emailB);
    const sorted = [sanitizedA, sanitizedB].sort();
    return `private-chat-${sorted.join('-')}`;
};

export const generateUserChannel = (email: string): string => {
    return `private-user-${sanitizeEmail(email)}`;
};

export const sendMessage = async (messageData: MessageDTO): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
    });

    if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
    }
};

export const sendNotification = async (fromEmail: string, toEmail: string): Promise<void> => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/notify?fromEmail=${encodeURIComponent(fromEmail)}&toEmail=${encodeURIComponent(toEmail)}`,
        { method: 'POST' }
    );

    if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.statusText}`);
    }
};