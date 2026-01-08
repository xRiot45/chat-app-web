import { IPinnedChat, PINNED_CHATS } from "@/constants/pinned-chat";
import { cn } from "@/lib/utils";
import { Pin } from "lucide-react";
import { Badge } from "./badge";
import { Avatar } from "./ui/avatar";

interface PinnedChatProps {
    handleChatSelect: (chat: IPinnedChat) => void;
    selectedChat: IPinnedChat | null;
}

export default function PinnedChat({ handleChatSelect, selectedChat }: PinnedChatProps) {
    return (
        <div>
            <div className="flex items-center gap-2 px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Pin className="w-3 h-3" /> Pinned
            </div>
            <div className="space-y-1">
                {PINNED_CHATS.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => handleChatSelect(chat)}
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border border-transparent group",
                            selectedChat?.id === chat.id
                                ? "bg-indigo-600 shadow-lg shadow-indigo-500/30 border-indigo-500/50"
                                : "hover:bg-slate-100 dark:hover:bg-white/5",
                        )}
                    >
                        <Avatar src={chat.avatar} className="w-12 h-12" status={chat.status} />
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <h3
                                    className={cn(
                                        "font-semibold text-sm truncate",
                                        selectedChat?.id === chat.id
                                            ? "text-white"
                                            : "text-slate-800 dark:text-slate-100",
                                    )}
                                >
                                    {chat.name}
                                </h3>
                                <span
                                    className={cn(
                                        "text-[10px]",
                                        selectedChat?.id === chat.id ? "text-indigo-200" : "text-slate-400",
                                    )}
                                >
                                    {chat.time}
                                </span>
                            </div>
                            <p
                                className={cn(
                                    "text-xs truncate mt-0.5",
                                    selectedChat?.id === chat.id
                                        ? "text-indigo-100"
                                        : "text-slate-500 dark:text-slate-400",
                                )}
                            >
                                {chat.lastMsg}
                            </p>
                        </div>
                        {chat.unread > 0 && <Badge count={chat.unread} />}
                    </div>
                ))}
            </div>
        </div>
    );
}
