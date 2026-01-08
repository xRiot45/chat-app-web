export interface IAllChat {
    id: string;
    type: string;
    name: string;
    avatar: string;
    status?: "online" | "busy" | "offline";
    lastMsg: string;
    time: string;
    unread: number;
    members?: number;
}

export const ALL_CHATS: IAllChat[] = [
    {
        id: "u2",
        type: "personal",
        name: "Dev Borneo",
        avatar: "https://i.pravatar.cc/150?u=2",
        status: "offline",
        lastMsg: "Siap, nanti saya cek PR-nya.",
        time: "Kemarin",
        unread: 0,
    },
    {
        id: "g2",
        type: "group",
        name: "Crypto Signal VIP 💎",
        avatar: "https://ui-avatars.com/api/?name=Crypto+VIP&background=10b981&color=fff",
        members: 420,
        lastMsg: "BTC forming a bullish flag pattern!",
        time: "08:15",
        unread: 15,
    },
    {
        id: "u3",
        type: "personal",
        name: "John Crypto",
        avatar: "https://i.pravatar.cc/150?u=4",
        status: "online",
        lastMsg: "Gas project NFT baru?",
        time: "08:00",
        unread: 0,
    },
    {
        id: "u4",
        type: "personal",
        name: "Maya PM",
        avatar: "https://i.pravatar.cc/150?u=6",
        status: "busy",
        lastMsg: "Timeline geser ke minggu depan.",
        time: "Kemarin",
        unread: 0,
    },
    {
        id: "u5",
        type: "personal",
        name: "Eko Backend",
        avatar: "https://i.pravatar.cc/150?u=5",
        status: "online",
        lastMsg: "API Gateway aman terkendali.",
        time: "Senin",
        unread: 0,
    },
    {
        id: "g3",
        type: "group",
        name: "Weekend Gamers 🎮",
        avatar: "https://ui-avatars.com/api/?name=Weekend+Gamers&background=ec4899&color=fff",
        members: 12,
        lastMsg: "Malam ini mabar Valorant?",
        time: "Minggu",
        unread: 5,
    },
    {
        id: "u6",
        type: "personal",
        name: "Client: TokoMaju",
        avatar: "https://ui-avatars.com/api/?name=Toko+Maju&background=f59e0b&color=fff",
        status: "offline",
        lastMsg: "Invoice sudah cair pak.",
        time: "Minggu",
        unread: 0,
    },
    {
        id: "u7",
        type: "personal",
        name: "HRD Recruitment",
        avatar: "https://ui-avatars.com/api/?name=HRD&background=ef4444&color=fff",
        status: "online",
        lastMsg: "Jadwal interview besok pagi.",
        time: "Jumat",
        unread: 0,
    },
];
