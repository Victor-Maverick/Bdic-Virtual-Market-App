import { useRef, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface Message {
    id?: string;
    senderId: string;
    recipientId: string;
    content: string;
    timestamp?: string;
}

export function useStompChatSocket({
                                       wsUrl,
                                       userId,
                                       recipientId,
                                       onMessage,
                                   }: {
    wsUrl: string;
    userId: string;
    recipientId: string | null;
    onMessage: (msg: Message) => void;
}) {
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (!userId || !recipientId) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(wsUrl),
            reconnectDelay: 5000,
            debug: str => console.log("[STOMP]", str),
        });

        client.onConnect = () => {
            client.subscribe(`/topic/messages.${userId}`, (message) => {
                if (message.body) {
                    const msg = JSON.parse(message.body);
                    onMessage(msg);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("[STOMP] Error", frame);
        };

        client.activate();
        clientRef.current = client;
        return () => {
            client.deactivate();
        };
    }, [wsUrl, userId, recipientId, onMessage]);

    function sendMessage(message: Omit<Message, "id" | "timestamp">) {
        if (clientRef.current && clientRef.current.connected) {
            clientRef.current.publish({
                destination: "/app/chat.send",
                body: JSON.stringify(message),
            });
        }
    }

    return { sendMessage };
}
