import { User } from "@/features/users/interfaces";

export interface CreateMessage {
    recipientId: string;
    content: string;
}

export interface Message {
    id: string;
    content: string;
    senderId: string;
    sender: User;
    conversationId: string;
    createdAt: string;
    updatedAt: string;
    readAt?: string;
    isPending?: boolean;
    isRead?: boolean;
}

export interface LastMessage {
    id: string;
    content: string;
    createdAt: string | Date;
    senderId: string;
    isRead: boolean;
}

export interface ChatConversation {
    id: string;
    creator: User;
    recipient: User;
    lastMessage: LastMessage | null;
    type?: "private" | "group";
    unreadCount?: number;
}
