export interface ChatMessage {
    id?: number;
    chatId: number;
    senderId: number;
    recipientId: number;
    senderName: string;
    recipientName: string;
    content: string;
    timestamp?: Date;
    status?: MessageStatus;
}

export enum MessageStatus {
    RECEIVED = 'RECEIVED',
    DELIVERED = 'DELIVERED'
}

export interface ChatUser {
    id: number;
    name: string;
    lastMessage?: string;
    lastMessageTime?: Date;
    unreadCount?: number;
}