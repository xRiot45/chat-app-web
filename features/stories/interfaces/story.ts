interface UserShort {
    id: string;
    username: string;
    fullName: string;
    avatarUrl: string;
}

export interface Story {
    id: string;
    imageUrl: string;
    videoUrl: string | null;
    caption: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
    user: UserShort;
}

export interface StoryViewer {
    seenAt: string;
    user: UserShort;
}
