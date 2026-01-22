export type UserStatus = "ONLINE" | "OFFLINE";

export interface CreateMessage {
    recipientId: string;
    content: string;
}

export interface User {
    id: string;
    username: string;
    fullName?: string;
    avatarUrl?: string;
    status?: UserStatus;
    lastSeenAt?: string;
    bio?: string;
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
