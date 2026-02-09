import { cn } from "@/lib/utils";
import React from "react";
import EmptyChatState from "../components/empty-chat-state";
import GroupChatView from "../components/group-chat-view";
import PrivateChatView from "../components/private-chat-view";
import { ActiveSession, MobileViewType } from "../interfaces";
import { Message } from "../interfaces/message-interface";

interface ChatMainViewProps {
    currentUserId: string;
    selectedChat: ActiveSession | null;
    messages: Message[];
    inputText: string;
    mobileView: MobileViewType;
    showRightPanel: boolean;
    setMobileView: (view: MobileViewType) => void;
    setSelectedChat: (chat: ActiveSession | null) => void;
    setShowRightPanel: (show: boolean) => void;
    setInputText: (text: string) => void;
    onSendMessage: (e: React.FormEvent) => void;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function ChatMainView(props: ChatMainViewProps) {
    const { mobileView, showRightPanel, selectedChat } = props;

    const containerClasses = cn(
        "flex-1 flex flex-col h-full relative z-10 bg-slate-50/50 dark:bg-[#0a0a0c]/50 backdrop-blur-xl transition-all",
        mobileView === "list" ? "hidden md:flex" : "flex",
        showRightPanel ? "lg:mr-0" : "",
    );

    if (!selectedChat) {
        return (
            <main className={containerClasses}>
                <EmptyChatState />
            </main>
        );
    }

    return (
        <main className={containerClasses}>
            {selectedChat.type === "group" ? (
                <GroupChatView {...props} selectedChat={selectedChat} />
            ) : (
                <PrivateChatView {...props} selectedChat={selectedChat} />
            )}
        </main>
    );
}
