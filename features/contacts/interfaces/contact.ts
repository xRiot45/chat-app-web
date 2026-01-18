export interface ContactUser {
    id: string;
    username: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
    bio: string | null;
    isVerified: boolean;
}

export interface Contact {
    id: string;
    alias: string | null;
    userId: string;
    contactUser: ContactUser;
    createdAt: string;
    updatedAt: string;
}
