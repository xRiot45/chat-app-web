export interface IPinnedChat {
    id: number;
    type: string;
    name: string;
    avatar: string;
    status: "online" | "busy" | "offline";
    lastMsg: string;
    time: string;
    unread: number;
}

export const PINNED_CHATS: IPinnedChat[] = [
    {
        id: 1,
        type: "personal",
        name: "Sarah Design",
        avatar: "https://i.pravatar.cc/150?u=3",
        status: "online",
        lastMsg: "File revisi sudah dikirim ya 📁",
        time: "10:45",
        unread: 2,
    },
    {
        id: 2,
        type: "group",
        name: "Core Team Alpha 🚀",
        avatar: "https://ui-avatars.com/api/?name=Core+Team&background=6366f1&color=fff",
        status: "busy",
        lastMsg: "Meeting jam 2 siang nanti",
        time: "09:30",
        unread: 0,
    },
];
