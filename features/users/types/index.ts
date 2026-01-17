export type UserSearchResponse = {
    id: string;
    username: string;
    fullName: string;
    avatarUrl: string | null;
    bio: string | null;
    isVerified: boolean;
    status: string;
    lastSeenAt: string | Date;
    isContact?: boolean;
};

export type ActionState = {
    data?: UserSearchResponse[];
    error?: string;
    message?: string;
};
