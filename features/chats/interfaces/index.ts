import { UserStatus } from "@/enums/user-status-enum";

export interface ActivePrivateChat {
    id: string;
    name: string;
    avatar: string;
    type: "private";
    recipientId: string;
    conversationId?: string;
    status: UserStatus | string;
}

export interface ActiveGroupChat {
    id: string;
    name: string;
    avatar: string;
    type: "group";
    groupId: string;
    membersCount: number;
    description?: string;
}

export type ActiveSession = ActivePrivateChat | ActiveGroupChat;

export type MobileViewType = "list" | "chat";
