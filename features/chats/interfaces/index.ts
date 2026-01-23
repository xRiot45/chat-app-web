import { UserStatus } from "@/enums/user-status-enum";

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
