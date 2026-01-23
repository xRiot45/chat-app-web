"use client";

import { cn } from "@/lib/utils";
import React from "react";
import ChatHeader from "../components/chat-header";
import ChatInput from "../components/chat-input";
import ChatMessageList from "../components/chat-message-list";
import EmptyChatState from "../components/empty-chat-state";
import { ActiveChatSession, MobileViewType } from "../interfaces";
import { Message } from "../interfaces/message-interface";

interface ChatMainViewProps {
    currentUserId: string;
    selectedChat: ActiveChatSession | null;
    messages: Message[];
    inputText: string;
    mobileView: MobileViewType;
    showRightPanel: boolean;
    setMobileView: (view: MobileViewType) => void;
    setSelectedChat: (chat: ActiveChatSession | null) => void;
    setShowRightPanel: (show: boolean) => void;
    setInputText: (text: string) => void;
    onSendMessage: (e: React.FormEvent) => void;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatMainView({
    currentUserId,
    selectedChat,
    mobileView,
    showRightPanel,
    messages,
    inputText,
    setMobileView,
    setSelectedChat,
    setShowRightPanel,
    setInputText,
    onSendMessage,
    messagesEndRef,
}: ChatMainViewProps) {
    return (
        <main
            className={cn(
                "flex-1 flex flex-col h-full relative z-10 bg-slate-50/50 dark:bg-[#0a0a0c]/50 backdrop-blur-xl transition-all",
                mobileView === "list" ? "hidden md:flex" : "flex",
                showRightPanel ? "lg:mr-0" : "",
            )}
        >
            {selectedChat ? (
                <>
                    <ChatHeader
                        selectedChat={selectedChat}
                        showRightPanel={showRightPanel}
                        onToggleRightPanel={() => setShowRightPanel(!showRightPanel)}
                        onBackToMobileList={() => {
                            setMobileView("list");
                            setSelectedChat(null);
                        }}
                    />

                    <ChatMessageList
                        messages={messages}
                        currentUserId={currentUserId}
                        messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
                    />

                    <ChatInput value={inputText} onChange={setInputText} onSubmit={onSendMessage} />
                </>
            ) : (
                <EmptyChatState />
            )}
        </main>
    );
}
