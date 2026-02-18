"use client";

import { Badge } from "@/components/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_BASE_URL } from "@/configs/api-base-url";
import { ActivePrivateChat } from "@/features/chats/interfaces";
import { Contact } from "@/features/contacts/interfaces/contact";
import { formatTime } from "@/helpers/format-time";
import { cn } from "@/lib/utils";
import { CheckCheck, MessageSquare } from "lucide-react";
import { useMemo } from "react";
import { ChatConversation } from "../interfaces/message-interface";

interface AllPrivateChatListProps {
    data: ChatConversation[];
    contacts: Contact[];
    currentUserId: string;
    handleChatSelect: (chat: ChatConversation) => void;
    selectedPrivateChat: ActivePrivateChat | null;
}

export default function AllPrivateChatList({
    data,
    contacts,
    currentUserId,
    handleChatSelect,
    selectedPrivateChat,
}: AllPrivateChatListProps) {
    const processedChats = useMemo(() => {
        return data
            .filter((chat) => {
                if (chat.type === "private" || !chat.type) {
                    return chat.creator.id !== chat.recipient.id;
                }
                return true;
            })
            .map((chat) => {
                const isMeCreator = chat.creator.id === currentUserId;
                const partner = isMeCreator ? chat.recipient : chat.creator;

                const contactMatch = contacts.find((c) => c.contactUser.id === partner?.id);
                const partnerName = contactMatch?.alias || partner?.fullName || partner?.username || "Unknown User";

                return {
                    ...chat,
                    partner,
                    partnerName,
                    isContact: !!contactMatch?.alias,
                };
            });
    }, [data, contacts, currentUserId]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5" /> Recent Messages
            </div>

            <div className="space-y-1">
                {processedChats.length === 0 && (
                    <div className="px-3 py-10 text-center flex flex-col items-center justify-center gap-2">
                        <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-full">
                            <MessageSquare className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">No conversations yet.</p>
                    </div>
                )}

                {processedChats.map((chat) => {
                    const lastMessageContent = chat.lastMessage?.content || "No messages yet";
                    const lastMessageTime = formatTime(chat.lastMessage?.createdAt);
                    const isOwnMessage = chat.lastMessage?.senderId === currentUserId;
                    const isMessageRead = chat.lastMessage?.isRead;
                    const unreadCount = chat.unreadCount ?? 0;
                    const isSelected = selectedPrivateChat?.conversationId === chat.id;

                    console.log(chat?.partner?.avatarUrl);

                    return (
                        <div
                            key={chat.id}
                            onClick={() => handleChatSelect(chat)}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border border-transparent group relative",
                                isSelected
                                    ? "bg-indigo-600 shadow-lg shadow-indigo-500/30"
                                    : "hover:bg-slate-100 dark:hover:bg-white/5",
                            )}
                        >
                            <Avatar className="w-12 h-12 border-2 border-transparent group-hover:border-indigo-500/20 transition-all">
                                <AvatarImage
                                    src={`${API_BASE_URL}/api/public${chat?.partner?.avatarUrl}` || ""}
                                    className="object-cover"
                                    crossOrigin="anonymous"
                                />
                                <AvatarFallback
                                    className={cn(
                                        isSelected ? "bg-indigo-500 text-white" : "bg-slate-200 dark:bg-slate-800",
                                    )}
                                >
                                    {chat.partnerName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3
                                        className={cn(
                                            "font-semibold text-sm truncate flex items-center gap-2",
                                            isSelected ? "text-white" : "text-slate-800 dark:text-slate-100",
                                        )}
                                    >
                                        {chat.partnerName}
                                        {chat.isContact && !isSelected && (
                                            <span className="ml-2 text-[9px] px-1.5 py-0.5 bg-slate-100 dark:bg-white/10 rounded-sm text-slate-400 font-normal">
                                                {chat.type === "group" ? "Group" : "Contact"}
                                            </span>
                                        )}
                                    </h3>
                                    <span
                                        className={cn(
                                            "text-[10px] font-medium",
                                            isSelected ? "text-indigo-200" : "text-slate-400",
                                        )}
                                    >
                                        {lastMessageTime}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    {/* Read Status Icon */}
                                    {isOwnMessage && chat.lastMessage && (
                                        <CheckCheck
                                            className={cn(
                                                "w-3.5 h-3.5 shrink-0",
                                                isSelected
                                                    ? "text-indigo-200"
                                                    : isMessageRead
                                                      ? "text-blue-500"
                                                      : "text-slate-400",
                                            )}
                                        />
                                    )}

                                    <p
                                        className={cn(
                                            "text-xs truncate flex-1 leading-tight",
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

                            {/* Unread Badge */}
                            {unreadCount > 0 && !isSelected && <Badge count={unreadCount} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
