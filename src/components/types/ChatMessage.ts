export interface ChatMessage {
    sender: string;
    content: string;
    type: string; // not optional
    timestamp?: string; // optional
}
