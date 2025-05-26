import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../types/ChatMessage';

let stompClient: Client | null = null;

export const connect = (
    onMessageReceived: (message: ChatMessage) => void,
    onError: (error: string) => void
) => {
    const socket = new SockJS('https://api.digitalmarke.bdic.ng/ws-chat');

    stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
            'Accept-Version': '1.2',
            'Heart-Beat': '10000,10000' // 10s heartbeat
        },
        debug: (str) => console.log('STOMP:', str),
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,

        onConnect: () => {
            stompClient?.subscribe('/topic/public', (message) => {
                onMessageReceived(JSON.parse(message.body) as ChatMessage);
            });
        },

        onStompError: (frame) => {
            onError(`Broker reported error: ${frame.headers.message}`);
        }
    });

    stompClient.onWebSocketError = (error) => {
        onError('WebSocket error: ' + error.toString());
    };

    stompClient.activate();
};

export const disconnect = () => {
    stompClient?.deactivate();
};

export const sendMessage = (message: ChatMessage) => {
    if (stompClient?.connected) {
        stompClient.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify(message),
            headers: { 'content-type': 'application/json' }
        });
    } else {
        console.error('Cannot send message - not connected');
    }
};