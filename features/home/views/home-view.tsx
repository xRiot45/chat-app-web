"use client";

import ButtonGrouping from "@/components/button-grouping";
import SearchInput from "@/components/search-input";
import User from "@/components/user";
import { UserStatus } from "@/enums/user-status-enum";
import { useChatManager } from "@/features/chats/hooks/use-chat-manager";
import { ActiveChatSession, MobileViewType } from "@/features/chats/interfaces";
import { ChatConversation } from "@/features/chats/interfaces/message-interface";
import AllChatView from "@/features/chats/views/all-chat-view";
import { ChatDirectoryView } from "@/features/chats/views/chat-directory-view";
import ChatMainView from "@/features/chats/views/chat-main-view";
import { Contact } from "@/features/contacts/interfaces/contact";
import ContactListsView from "@/features/contacts/views/contact-lists-view";
import SettingView from "@/features/settings/views/setting-view";
import StoriesView from "@/features/stories/views/stories-view";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/providers/theme-provider";
import React, { useState } from "react";
import HomeBackground from "../components/home-background";

interface ChatClientPageProps {
    token: string;
    currentUserId: string;
}

export default function HomeView({ token, currentUserId }: ChatClientPageProps) {
    const { isDarkMode } = useThemeContext();

    const [selectedChat, setSelectedChat] = useState<ActiveChatSession | null>(null);
    const [mobileView, setMobileView] = useState<MobileViewType>("list");
    const [showRightPanel, setShowRightPanel] = useState(true);
    const [inputText, setInputText] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const { conversations, messages, onSendMessage, messagesEndRef } = useChatManager({
        token,
        currentUserId,
        selectedChat,
    });

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;
        onSendMessage(inputText);
        setInputText("");
    };

    const handleChatSelect = (chat: ChatConversation) => {
        let targetRecipientId = chat.id;
        let targetName = chat.name;
        let targetAvatar = chat.avatar;

        // Logic Mapping dari DTO API ke ActiveChatSession
        if (chat.creator && chat.recipient) {
            const isMeCreator = chat.creator.id === currentUserId;
            const targetUser = isMeCreator ? chat.recipient : chat.creator;

            targetRecipientId = targetUser.id;
            targetName = targetUser.fullName || targetUser.username;
            targetAvatar = targetUser.avatarUrl;
        } else if (chat.userId) {
            targetRecipientId = chat.userId;
        }

        const mappedChat: ActiveChatSession = {
            conversationId: chat.id,
            recipientId: targetRecipientId,
            name: targetName,
            avatar: targetAvatar,
            type: chat.type || "private",
            status: chat.status || "OFFLINE",
            members: chat.members || 2,
        };

        setSelectedChat(mappedChat);
        setMobileView("chat");
    };

    const handleStartMessage = (contact: Contact) => {
        const newChatData: ActiveChatSession = {
            conversationId: undefined,
            recipientId: contact.contactUser.id,
            name: contact.alias || contact.contactUser.fullName || contact.contactUser.username,
            avatar: contact.contactUser.avatarUrl || "",
            type: "private",
            status: UserStatus.ONLINE,
            members: 2,
        };

        setSelectedChat(newChatData);
        setMobileView("chat");
    };

    return (
        <div
            className={`h-screen w-screen overflow-hidden flex transition-colors duration-500 ${isDarkMode ? "dark bg-[#0a0a0c] text-slate-100" : "bg-slate-50 text-slate-900"} font-sans selection:bg-indigo-500/30`}
        >
            <HomeBackground />

            {/* === LEFT SIDEBAR (CHAT LIST & NEW CHAT DRAWER) === */}
            <aside
                className={cn(
                    "flex-col h-full z-20 transition-all duration-300 border-r border-slate-200 dark:border-white/5 bg-white/60 dark:bg-[#0f1115]/80 backdrop-blur-2xl relative overflow-hidden",
                    mobileView === "list" ? "flex w-full md:w-112.5 lg:w-125" : "hidden md:flex md:w-112.5 lg:w-125",
                )}
            >
                {/* Header */}
                <div className="px-5 py-4 flex items-center justify-between shrink-0">
                    <User />
                    <ButtonGrouping setIsAddModalOpen={setIsAddModalOpen} setIsSettingsOpen={setIsSettingsOpen} />
                </div>

                {/* Stories / Status Bar */}
                <StoriesView />

                {/* Search */}
                <SearchInput placeholder="Search or start a new chat" />

                {/* Chat Lists */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-6 pt-2 pb-4">
                    <AllChatView
                        data={conversations}
                        currentUserId={currentUserId}
                        handleChatSelect={handleChatSelect}
                        selectedChat={selectedChat}
                    />
                </div>

                {/* New Chat / Contact List Drawer */}
                <ContactListsView
                    isAddModalOpen={isAddModalOpen}
                    setIsAddModalOpen={setIsAddModalOpen}
                    onStartChat={handleStartMessage}
                />
            </aside>

            {/* === SETTINGS SIDEBAR === */}
            <SettingView isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen} />

            {/* === CENTER MAIN CHAT === */}
            <ChatMainView
                currentUserId={currentUserId}
                selectedChat={selectedChat}
                mobileView={mobileView}
                showRightPanel={showRightPanel}
                messages={messages}
                inputText={inputText}
                setMobileView={setMobileView}
                setSelectedChat={setSelectedChat}
                setShowRightPanel={setShowRightPanel}
                setInputText={setInputText}
                onSendMessage={handleSendMessage}
                messagesEndRef={messagesEndRef}
            />

            {/* === RIGHT SIDEBAR (DETAILS OF CHAT) === */}
            {selectedChat && showRightPanel && (
                <ChatDirectoryView selectedChat={selectedChat} onClose={() => setShowRightPanel(false)} />
            )}
        </div>
    );
}
