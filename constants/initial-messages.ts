interface InitialMesages {
    id: number;
    senderId: string;
    mediaUrl?: string;
    text: string;
    time: string;
    read: boolean;
    type: string;
}

export const INITIAL_MESSAGES: InitialMesages[] = [
    {
        id: 1,
        senderId: "other",
        text: "Hey! How is the new design coming along?",
        time: "09:41 AM",
        read: true,
        type: "text",
    },
    {
        id: 2,
        senderId: "me",
        text: "Almost done! Just tweaking the dark mode colors. 🎨",
        time: "09:42 AM",
        read: true,
        type: "text",
    },
    {
        id: 3,
        senderId: "other",
        text: "Great! Send me a preview when you can.",
        time: "09:45 AM",
        read: true,
        type: "text",
    },
    {
        id: 4,
        senderId: "me",
        text: "Sure, here is the landing page hero section.",
        time: "09:50 AM",
        read: true,
        type: "text",
    },
    {
        id: 5,
        senderId: "me",
        text: "",
        time: "09:50 AM",
        read: true,
        type: "image",
    },
];
