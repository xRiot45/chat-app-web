import { UserRoleGroup } from "@/enums/user-role-group-enum";
import { UserShortInfo } from "@/features/users/interfaces";

export interface Group {
    id: string;
    name: string;
    description: string;
    iconUrl?: string;
    owner?: UserShortInfo;
    membersCount: number;
    updatedAt: Date;
}

export interface GroupMember {
    role: UserRoleGroup;
    joinedAt: Date;
    user: UserShortInfo;
}

export interface SharedMediaItem {
    id: string;
    type: "image" | "file";
    src?: string;
    name?: string;
    size?: string;
}
