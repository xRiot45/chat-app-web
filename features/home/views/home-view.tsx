"use client";

import Application from "@/components/application";
import ButtonGrouping from "@/components/button-grouping";
import SearchInput from "@/components/search-input";
import { UserStatus } from "@/enums/user-status-enum";
import { useChatManager } from "@/features/chats/hooks/use-chat-manager";
import { ActiveGroupChat, ActivePrivateChat, ActiveSession, MobileViewType } from "@/features/chats/interfaces";
import AllPrivateChatList from "@/features/chats/views/all-private-chat-list";
import { ChatDirectoryView } from "@/features/chats/views/chat-directory-view";
import ChatMainView from "@/features/chats/views/chat-main-view";
import { getContacts } from "@/features/contacts/applications/queries/get-contact-query";
import { Contact } from "@/features/contacts/interfaces/contact";
import ContactListsView from "@/features/contacts/views/contact-lists-view";
import { GroupDirectoryView } from "@/features/groups/components/group-directory-view";
import MyGroupList from "@/features/groups/views/my-group-list";
import SettingView from "@/features/settings/views/setting-view";
import StoriesView from "@/features/stories/views/stories-view";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/providers/theme-provider";
import * as Tabs from "@radix-ui/react-tabs";
import { MessageSquare, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import HomeBackground from "../components/home-background";

interface ChatClientPageProps {
    token: string;
    currentUserId: string;
}

export default function HomeView({ token, currentUserId }: ChatClientPageProps) {
    const { isDarkMode } = useThemeContext();

    const [selectedPrivateChat, setSelectedPrivateChat] = useState<ActivePrivateChat | null>(null);
    const [selectedGroupChat, setSelectedGroupChat] = useState<ActiveGroupChat | null>(null);
    const [mobileView, setMobileView] = useState<MobileViewType>("list");
    const [showRightPanel, setShowRightPanel] = useState(true);
    const [inputText, setInputText] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);

    const activeSession: ActiveSession | null = selectedGroupChat || selectedPrivateChat;

    const { conversations, messages, onSendMessage, messagesEndRef } = useChatManager({
        token,
        currentUserId,
        selectedChat: activeSession as ActivePrivateChat,
    });

    useEffect(() => {
        getContacts().then((res) => {
            setContacts(res.data ?? []);
        });
    }, []);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;
        onSendMessage(inputText);
        setInputText("");
    };

    // --- 3. HANDLERS DENGAN LOGIC PEMISAHAN ---

    const handlePrivateChatSelect = (chat: any) => {
        let targetRecipientId = chat.id;
        let targetName = chat.name;
        let targetAvatar = chat.avatar;

        if (chat.creator && chat.recipient) {
            const isMeCreator = chat.creator.id === currentUserId;
            const targetUser = isMeCreator ? chat.recipient : chat.creator;

            targetRecipientId = targetUser.id;
            targetName = targetUser.fullName || targetUser.username;
            targetAvatar = targetUser.avatarUrl;
        } else if (chat.userId) {
            targetRecipientId = chat.userId;
        }

        const mappedChat: ActivePrivateChat = {
            id: chat.id,
            conversationId: chat.id,
            recipientId: targetRecipientId,
            name: targetName,
            avatar: targetAvatar,
            type: "private",
            status: chat.status || "OFFLINE",
        };

        // Set Private, dan KOSONGKAN Group
        setSelectedPrivateChat(mappedChat);
        setSelectedGroupChat(null);
        setMobileView("chat");
    };

    const handleGroupSelect = (group: any) => {
        const mappedGroup: ActiveGroupChat = {
            id: group.id,
            name: group.name,
            groupId: group.id,
            avatar: group.avatarUrl || "",
            type: "group",
            membersCount: group._count?.members || group.members?.length || 0,
            description: group.description,
        };

        // Set Group, dan KOSONGKAN Private
        setSelectedGroupChat(mappedGroup);
        setSelectedPrivateChat(null);
        setMobileView("chat");
    };

    const handleStartMessage = (contact: Contact) => {
        const newChatData: ActivePrivateChat = {
            id: contact.contactUser.id,
            conversationId: undefined,
            recipientId: contact.contactUser.id,
            name: contact.alias || contact.contactUser.fullName || contact.contactUser.username,
            avatar: contact.contactUser.avatarUrl || "",
            type: "private",
            status: UserStatus.ONLINE,
        };

        // Set Private, dan KOSONGKAN Group
        setSelectedPrivateChat(newChatData);
        setSelectedGroupChat(null);
        setMobileView("chat");
    };

    const handleClearSelection = () => {
        setSelectedPrivateChat(null);
        setSelectedGroupChat(null);
        setMobileView("list");
    };

    return (
        <div
            className={`h-screen w-screen overflow-hidden flex transition-colors duration-500 ${isDarkMode ? "dark bg-[#0a0a0c] text-slate-100" : "bg-slate-50 text-slate-900"} font-sans selection:bg-indigo-500/30`}
        >
            <HomeBackground />

            {/* === LEFT SIDEBAR === */}
            <aside
                className={cn(
                    "flex-col h-full z-20 transition-all duration-300 border-r border-slate-200 dark:border-white/5 bg-white/60 dark:bg-[#0f1115]/80 backdrop-blur-2xl relative overflow-hidden",
                    mobileView === "list" ? "flex w-full md:w-112.5 lg:w-125" : "hidden md:flex md:w-112.5 lg:w-125",
                )}
            >
                <div className="px-5 py-4 flex items-center justify-between shrink-0">
                    <Application />
                    <ButtonGrouping setIsAddModalOpen={setIsAddModalOpen} setIsSettingsOpen={setIsSettingsOpen} />
                </div>

                <SearchInput placeholder="Search or start a new chat" />
                <StoriesView />

                {/* Tabs Section */}
                <Tabs.Root defaultValue="chats" className="flex-1 flex flex-col min-h-0 mt-4">
                    <Tabs.List className="flex items-center px-5 border-b border-slate-200 dark:border-white/5 gap-6">
                        <Tabs.Trigger
                            value="chats"
                            className="group relative pb-3 pt-2 text-xs font-bold uppercase tracking-wider text-slate-500 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 outline-none cursor-pointer transition-colors w-full"
                        >
                            <div className="flex items-center gap-2 justify-center">
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Chats</span>
                            </div>

                            {/* Active Underline Indicator */}
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-200" />
                        </Tabs.Trigger>

                        <Tabs.Trigger
                            value="groups"
                            className="group relative pb-3 pt-2 text-xs font-bold uppercase tracking-wider text-slate-500 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 outline-none cursor-pointer transition-colors w-full"
                        >
                            <div className="flex items-center gap-2 justify-center">
                                <Users className="w-3.5 h-3.5" />
                                <span>Groups</span>
                            </div>

                            {/* Active Underline Indicator */}
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-200" />
                        </Tabs.Trigger>
                    </Tabs.List>

                    <div className="flex-1 overflow-hidden">
                        <Tabs.Content value="chats" className="h-full outline-none animate-in fade-in-50 duration-300">
                            <div className="h-full overflow-y-auto custom-scrollbar px-3 pt-4 pb-4">
                                <AllPrivateChatList
                                    data={conversations}
                                    currentUserId={currentUserId}
                                    contacts={contacts}
                                    handleChatSelect={handlePrivateChatSelect}
                                    selectedPrivateChat={selectedPrivateChat}
                                />
                            </div>
                        </Tabs.Content>

                        <Tabs.Content value="groups" className="h-full outline-none animate-in fade-in-50 duration-300">
                            <div className="h-full overflow-y-auto custom-scrollbar px-3 pt-4 pb-4">
                                <MyGroupList onSelect={handleGroupSelect} />
                            </div>
                        </Tabs.Content>
                    </div>
                </Tabs.Root>

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
                selectedChat={activeSession}
                mobileView={mobileView}
                showRightPanel={showRightPanel}
                messages={messages}
                inputText={inputText}
                setMobileView={setMobileView}
                setSelectedChat={(chat) => {
                    if (chat === null) handleClearSelection();
                }}
                setShowRightPanel={setShowRightPanel}
                setInputText={setInputText}
                onSendMessage={handleSendMessage}
                messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
            />

            {/* === RIGHT SIDEBAR (DETAILS) === */}
            {/* Logic Conditional Rendering berdasarkan State mana yang tidak null */}
            {showRightPanel && (
                <>
                    {selectedGroupChat && (
                        <GroupDirectoryView selectedChat={selectedGroupChat} onClose={() => setShowRightPanel(false)} />
                    )}

                    {selectedPrivateChat && (
                        <ChatDirectoryView
                            selectedChat={selectedPrivateChat}
                            onClose={() => setShowRightPanel(false)}
                        />
                    )}
                </>
            )}
        </div>
    );
}
