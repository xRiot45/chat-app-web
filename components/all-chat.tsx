import { ActiveChatSession } from "@/features/chats/interfaces";
import { cn } from "@/lib/utils";
import { CheckCheck, MessageSquare } from "lucide-react";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// --- 1. DEFINISI TIPE DATA (Updated sesuai JSON) ---

interface UserInfo {
    id: string;
    username: string;
    fullName: string;
    avatarUrl: string | null;
    status?: string;
}

interface LastMessage {
    id: string;
    content: string;
    createdAt: string | Date;
    senderId: string; // Wajib ada untuk logic centang
    isRead: boolean; // Wajib ada untuk logic warna centang (Blue/Grey)
}

// Tipe data untuk satu item percakapan dari API
export interface ChatConversation {
    id: string;
    creator: UserInfo;
    recipient: UserInfo;
    lastMessage: LastMessage | null;
    type?: "private" | "group";
    unreadCount?: number;
}

// --- 2. DEFINISI PROPS COMPONENT ---

interface AllChatProps {
    data: ChatConversation[];
    currentUserId: string;
    handleChatSelect: (chat: ChatConversation) => void;
    selectedChat: ActiveChatSession | null;
}

export default function AllChat({ data, currentUserId, handleChatSelect, selectedChat }: AllChatProps) {
    // Helper untuk memformat waktu
    const formatTime = (dateInput: string | Date | undefined): string => {
        if (!dateInput) return "";
        const date = new Date(dateInput);
        const now = new Date();

        if (isNaN(date.getTime())) return "";

        const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

        return isToday
            ? date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
            : date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    };

    return (
        <div>
            <div className="flex items-center gap-2 px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <MessageSquare className="w-3 h-3" /> Recent Messages
            </div>

            <div className="space-y-1">
                {/* Empty State */}
                {data.length === 0 && (
                    <div className="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400 italic">
                        No conversations yet.
                    </div>
                )}

                {data.map((chat) => {
                    // Type Safety Logic: Menentukan Partner
                    const isMeCreator = chat.creator.id === currentUserId;
                    const partner = isMeCreator ? chat.recipient : chat.creator;

                    // Safety Check
                    if (!partner) return null;

                    const partnerName = partner.fullName || partner.username || "Unknown User";
                    const partnerAvatar = partner.avatarUrl || undefined;

                    // Message Logic
                    const lastMessageContent = chat.lastMessage?.content || "No message";
                    const lastMessageTime = formatTime(chat.lastMessage?.createdAt);

                    // --- LOGIC CENTANG (WHATSAPP STYLE) ---
                    // Cek apakah pesan terakhir dikirim oleh saya (Current User)
                    const isOwnMessage = chat.lastMessage?.senderId === currentUserId;
                    // Cek status read
                    const isMessageRead = chat.lastMessage?.isRead;

                    const unreadCount = chat.unreadCount ?? 0;
                    const isSelected = selectedChat?.conversationId === chat.id;

                    return (
                        <div
                            key={chat.id}
                            onClick={() => handleChatSelect(chat)}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border border-transparent group",
                                isSelected
                                    ? "bg-indigo-600 shadow-lg shadow-indigo-500/30"
                                    : "hover:bg-slate-100 dark:hover:bg-white/5",
                            )}
                        >
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={partnerAvatar} className="object-cover" />
                                <AvatarFallback>{partnerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <h3
                                        className={cn(
                                            "font-semibold text-sm truncate",
                                            isSelected ? "text-white" : "text-slate-800 dark:text-slate-100",
                                        )}
                                    >
                                        {partnerName}
                                    </h3>
                                    <span
                                        className={cn("text-[10px]", isSelected ? "text-indigo-200" : "text-slate-400")}
                                    >
                                        {lastMessageTime}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 mt-0.5">
                                    {/* --- TAMPILKAN ICON CENTANG --- */}
                                    {/* Hanya muncul jika SAYA yang mengirim pesan terakhir */}
                                    {isOwnMessage &&
                                        (isMessageRead ? (
                                            // Jika sudah dibaca (Blue Ticks)
                                            <CheckCheck
                                                className={cn(
                                                    "w-3.5 h-3.5",
                                                    isSelected ? "text-indigo-200" : "text-blue-500",
                                                )}
                                            />
                                        ) : (
                                            // Jika belum dibaca (Grey Ticks)
                                            <CheckCheck
                                                className={cn(
                                                    "w-3.5 h-3.5",
                                                    isSelected ? "text-indigo-300" : "text-slate-400",
                                                )}
                                            />
                                        ))}

                                    <p
                                        className={cn(
                                            "text-xs truncate flex-1",
                                            isSelected ? "text-indigo-100" : "text-slate-500 dark:text-slate-400",
                                        )}
                                    >
                                        {chat.type === "group" && (
                                            <span className="font-bold text-indigo-400 mr-1">User:</span>
                                        )}
                                        {lastMessageContent}
                                    </p>
                                </div>
                            </div>

                            {unreadCount > 0 && <Badge count={unreadCount} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
