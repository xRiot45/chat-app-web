import { UserStatus } from "@/enums/user-status-enum";
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

export interface ActiveChatSession {
    conversationId?: string;
    recipientId: string;
    name: string;
    avatar: string;
    type: "private" | "group";
    status: UserStatus;
    members?: number;
}

export type MobileViewType = "list" | "chat";
