import { UserRoleGroup } from "@/enums/user-role-group-enum";
import { UserShortInfo } from "@/features/users/interfaces";

export interface Group {
    id: string;
    name: string;
    description: string;
    iconUrl?: string;
    owner?: UserShortInfo;
    membersCount: number;
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
