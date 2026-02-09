import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { UserStatus } from "@/enums/user-status-enum";
import { ArrowLeft, MoreHorizontal, Phone, Video } from "lucide-react";
import React from "react";
import { ActivePrivateChat, ActiveSession, MobileViewType } from "../interfaces";
import { Message } from "../interfaces/message-interface";
import ChatInput from "./chat-input";
import ChatMessageList from "./chat-message-list";

interface PrivateChatViewProps {
    currentUserId: string;
    selectedChat: ActivePrivateChat; // Strict Type
    messages: Message[];
    inputText: string;
    showRightPanel: boolean;
    setMobileView: (view: MobileViewType) => void;
    setSelectedChat: (chat: ActiveSession | null) => void;
    setShowRightPanel: (show: boolean) => void;
    setInputText: (text: string) => void;
    onSendMessage: (e: React.FormEvent) => void;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function PrivateChatView({
    currentUserId,
    selectedChat,
    messages,
    inputText,
    showRightPanel,
    setMobileView,
    setSelectedChat,
    setShowRightPanel,
    setInputText,
    onSendMessage,
    messagesEndRef,
}: PrivateChatViewProps) {
    return (
        <>
            {/* Header Khusus Private Chat */}
            <header className="h-19 px-6 flex items-center justify-between border-b border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-[#0f1115]/60 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <button
                        className="md:hidden -ml-2 p-2 rounded-full hover:bg-white/10"
                        onClick={() => {
                            setMobileView("list");
                            setSelectedChat(null);
                        }}
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </button>

                    <div className="relative cursor-pointer" onClick={() => setShowRightPanel(!showRightPanel)}>
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={selectedChat.avatar} />
                            <AvatarFallback>{selectedChat.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="cursor-pointer" onClick={() => setShowRightPanel(!showRightPanel)}>
                        <h2 className="font-bold text-base text-slate-800 dark:text-slate-100 leading-tight hover:text-indigo-500 transition-colors">
                            {selectedChat.name}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            {selectedChat.status === UserStatus.ONLINE ? (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                                </>
                            ) : (
                                UserStatus.OFFLINE.charAt(0).toUpperCase() + UserStatus.OFFLINE.slice(1).toLowerCase()
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <button className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-all hover:text-indigo-500">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-all hover:text-indigo-500">
                        <Video className="w-5 h-5" />
                    </button>
                    <div className="h-6 w-px bg-slate-300 dark:bg-white/10 mx-1"></div>
                    <button
                        onClick={() => setShowRightPanel(!showRightPanel)}
                        className={cn(
                            "p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-all",
                            showRightPanel && "bg-indigo-500/10 text-indigo-500",
                        )}
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <ChatMessageList messages={messages} currentUserId={currentUserId} messagesEndRef={messagesEndRef} />

            <ChatInput value={inputText} onChange={setInputText} onSubmit={onSendMessage} />
        </>
    );
}
