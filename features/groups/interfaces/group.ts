import { UserRoleGroup } from "@/enums/user-role-group-enum";

export interface Group {
    id: string;
    name: string;
    description: string;
    iconUrl?: string;
}

export interface GroupMember {
    id: string;
    name: string;
    avatarUrl: string;
    role: UserRoleGroup;
    isOnline: boolean;
}

export interface SharedMediaItem {
    id: string;
    type: "image" | "file";
    src?: string;
    name?: string;
    size?: string;
}
