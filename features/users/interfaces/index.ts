export interface User {
    id: string;
    username: string;
    fullName: string;
    email: string;
    avatarUrl: string;
    bio: string;
    status?: string;
    lastSeenAt?: string;
    emailVerifiedAt?: string;
    isVerified?: true;
    createdAt?: string;
    updatedAt?: string;
}
