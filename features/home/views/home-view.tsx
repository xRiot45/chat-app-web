"use client";

import AllChat from "@/components/all-chat";
import ButtonGrouping from "@/components/button-grouping";
import PinnedChat from "@/components/pinned-chat";
import SearchInput from "@/components/search-input";
import Stories from "@/components/stories";
import { Avatar } from "@/components/ui/avatar";
import User from "@/components/user";
import { SHARED_MEDIA } from "@/constants/shared-media";
import { STORIES } from "@/constants/stories";
import { getMessages } from "@/features/chats/application/actions/get-message-action";
import { getRecentMessages } from "@/features/chats/application/actions/get-recent-message-action";

// --- UPDATED IMPORTS (Menggunakan Queries, bukan Actions) ---

import { useChatSocket } from "@/features/chats/hooks/use-chat-socket";
import { ActiveChatSession, MobileViewType } from "@/features/chats/interfaces";
import ChatMainView from "@/features/chats/views/chat-main-view";
import ContactListsView from "@/features/contacts/views/contact-lists-view";
import SettingView from "@/features/settings/views/setting-view";
import { cn } from "@/lib/utils";

import { Bell, ChevronLeft, ChevronRight, Download, FileText, Heart, LogOut, Search, Send, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface ChatClientPageProps {
    token: string;
    currentUserId: string;
}

export default function HomeView({ token, currentUserId }: ChatClientPageProps) {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState<ActiveChatSession | null>(null);
    const [mobileView, setMobileView] = useState<MobileViewType>("list");
    const [showRightPanel, setShowRightPanel] = useState(true);
    const [inputText, setInputText] = useState("");

    // -- MODALS / SIDEBAR STATE --
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [storyIndex, setStoryIndex] = useState<number | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- Socket Integration ---
    const { messages, sendMessage, setMessages } = useChatSocket({
        token,
        currentUserId,
        activeRecipientId: selectedChat?.recipientId,
    });

    // --- 1. FETCH CONVERSATIONS (CHAT LIST) ---
    useEffect(() => {
        const fetchRecentMessages = async () => {
            try {
                const data = await getRecentMessages();
                setConversations(data || []);
            } catch (error) {
                console.error("Failed to load conversations:", error);
            }
        };
        fetchRecentMessages();
    }, []);

    // --- 2. FETCH MESSAGES SAAT CHAT DIPILIH (REPLACING useActionState) ---
    useEffect(() => {
        const loadMessages = async () => {
            if (!selectedChat?.recipientId) return;

            setMessages([]);

            try {
                const fetchedMessages = await getMessages(selectedChat.recipientId);
                setMessages(fetchedMessages);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        loadMessages();
    }, [selectedChat?.recipientId, setMessages]);

    // --- 3. Scroll to Bottom saat ada pesan baru ---
    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Toggle Dark Mode
    useEffect(() => {
        if (isDarkMode) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    }, [isDarkMode]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim() || !selectedChat) return;

        // Hook menangani Optimistic UI & Emit Socket
        sendMessage(inputText, selectedChat.recipientId);
        setInputText("");
    };

    // --- UPDATED HANDLER: Mapping Data API ke ActiveChatSession ---
    const handleChatSelect = (chat: any) => {
        let targetRecipientId = chat.id; // Default fallback
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

    const handleStartMessage = (contact: any) => {
        const newChatData: ActiveChatSession = {
            conversationId: undefined, // Belum ada ID percakapan
            recipientId: contact.contactUser.id,
            name: contact.alias || contact.contactUser.fullName || contact.contactUser.username,
            avatar: contact.contactUser.avatarUrl || "",
            type: "private",
            status: "ONLINE",
            members: 2,
        };

        setSelectedChat(newChatData);
        setMobileView("chat");
    };

    // -- STORY HANDLERS (TIDAK BERUBAH) --
    const openStory = (index: number) => setStoryIndex(index);
    const closeStory = () => setStoryIndex(null);

    const nextStory = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (storyIndex !== null && storyIndex < STORIES.length - 1) {
            setStoryIndex(storyIndex + 1);
        } else {
            closeStory();
        }
    };

    const prevStory = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (storyIndex !== null && storyIndex > 0) {
            setStoryIndex(storyIndex - 1);
        }
    };

    return (
        <div
            className={`h-screen w-screen overflow-hidden flex transition-colors duration-500 ${isDarkMode ? "dark bg-[#0a0a0c] text-slate-100" : "bg-slate-50 text-slate-900"} font-sans selection:bg-indigo-500/30`}
        >
            {/* === BACKGROUND AMBIENCE (WEB3 STYLE) === */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-600/10 dark:bg-violet-900/20 rounded-full blur-[180px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 dark:bg-indigo-900/20 rounded-full blur-[180px] animate-pulse-slow delay-1000" />
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                ></div>
            </div>

            {/* === LEFT SIDEBAR (CHAT LIST & NEW CHAT DRAWER) === */}
            <aside
                className={cn(
                    "flex-col h-full z-20 transition-all duration-300 border-r border-slate-200 dark:border-white/5 bg-white/60 dark:bg-[#0f1115]/80 backdrop-blur-2xl relative overflow-hidden",
                    mobileView === "list" ? "flex w-full md:w-112.5 lg:w-125" : "hidden md:flex md:w-112.5 lg:w-125",
                )}
            >
                {/* === STANDARD CHAT LIST CONTENT === */}
                {/* Header */}
                <div className="px-5 py-4 flex items-center justify-between shrink-0">
                    <User />
                    <ButtonGrouping
                        setIsAddModalOpen={setIsAddModalOpen}
                        setIsDarkMode={setIsDarkMode}
                        isDarkMode={isDarkMode}
                        setIsSettingsOpen={setIsSettingsOpen}
                    />
                </div>

                {/* Stories / Status Bar */}
                <Stories openStory={openStory} />

                {/* Search */}
                <SearchInput placeholder="Search or start a new chat" />

                {/* Chat Lists */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-6 pt-2 pb-4">
                    {/* Pinned Section */}
                    <PinnedChat handleChatSelect={handleChatSelect} selectedChat={selectedChat} />

                    <AllChat
                        data={conversations}
                        handleChatSelect={handleChatSelect}
                        selectedChat={selectedChat}
                        currentUserId={currentUserId}
                    />
                </div>

                {/* New Chat / Contact List Drawer */}
                <ContactListsView
                    isAddModalOpen={isAddModalOpen}
                    setIsAddModalOpen={setIsAddModalOpen}
                    onStartChat={handleStartMessage}
                />
            </aside>

            {/* === SETTINGS SIDEBAR (Full Overlay) === */}
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

            {/* === RIGHT SIDEBAR (DETAILS PANEL) === */}
            {selectedChat && showRightPanel && (
                <aside
                    className={cn(
                        // Base Styles
                        "h-full z-50 flex flex-col transition-all duration-300 border-l border-slate-200 dark:border-white/5",

                        // MOBILE VIEW (Full Screen Overlay)
                        "fixed inset-0 w-full bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-xl",

                        // DESKTOP VIEW (Sidebar Mode)
                        "lg:relative lg:w-100 lg:bg-white/60 lg:dark:bg-[#0f1115]/80 lg:backdrop-blur-2xl",
                    )}
                >
                    {/* Header Right */}
                    <div className="h-19 flex items-center px-6 border-b border-slate-200/50 dark:border-white/5 font-bold text-lg shrink-0">
                        <span className="text-slate-800 dark:text-white">Directory</span>
                        <button
                            onClick={() => setShowRightPanel(false)}
                            className="ml-auto lg:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <X className="w-6 h-6 text-slate-500 dark:text-slate-300" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                        {/* Profile Info */}
                        <div className="flex flex-col items-center text-center">
                            <div className="relative">
                                <Avatar className="w-24 h-24 mb-4 ring-4 ring-slate-100 dark:ring-white/5 shadow-xl">
                                    <Image
                                        className="rounded-full"
                                        width={96}
                                        height={96}
                                        src={selectedChat.avatar || "https://i.pravatar.cc/150"}
                                        alt={selectedChat.name}
                                    />
                                </Avatar>
                                {selectedChat.status === "ONLINE" && (
                                    <span className="absolute bottom-5 right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#0f1115] rounded-full"></span>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                {selectedChat.name}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                @{selectedChat.name.toLowerCase().replace(/\s/g, "")}
                            </p>
                            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                Building the future of web development with strict deadlines. 🚀
                            </p>

                            <div className="flex gap-4 mt-6 w-full">
                                <button className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex flex-col items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                                    <Bell className="w-5 h-5 mb-1" />
                                    Mute
                                </button>
                                <button className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex flex-col items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                                    <Search className="w-5 h-5 mb-1" />
                                    Search
                                </button>
                                <button className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex flex-col items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                                    <Heart className="w-5 h-5 mb-1" />
                                    Fav
                                </button>
                            </div>
                        </div>

                        {/* Shared Media */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider">
                                    Shared Media
                                </h4>
                                <button className="text-indigo-500 text-xs hover:underline">View All</button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {SHARED_MEDIA.filter((m) => m.type === "image").map((media) => (
                                    <div
                                        key={media.id}
                                        className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer bg-slate-100 dark:bg-white/5"
                                    >
                                        <Image
                                            height={200}
                                            width={200}
                                            src={media.src || ""}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                            alt="media"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shared Files */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider">Documents</h4>
                            </div>
                            <div className="space-y-3">
                                {SHARED_MEDIA.filter((m) => m.type === "file").map((file) => (
                                    <div
                                        key={file.id}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-colors group"
                                    >
                                        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-300">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate text-slate-800 dark:text-slate-200">
                                                {file.name}
                                            </p>
                                            <p className="text-[10px] text-slate-500">{file.size} • PDF</p>
                                        </div>
                                        <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-white/10 pb-6">
                            <button className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
                                <LogOut className="w-4 h-4" /> Block User
                            </button>
                        </div>
                    </div>
                </aside>
            )}

            {/* ================= STORY VIEWER MODAL ================= */}
            {storyIndex !== null && (
                <div className="fixed inset-0 z-60 bg-black flex items-center justify-center animate-in fade-in duration-300">
                    {/* Background Blur */}
                    <div
                        className="absolute inset-0 opacity-40 bg-center bg-cover blur-3xl scale-110"
                        style={{ backgroundImage: `url(${STORIES[storyIndex].img})` }}
                    ></div>

                    {/* Main Content Container */}
                    <div className="relative w-full h-full md:max-w-md md:h-[90vh] bg-black md:rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10 z-10">
                        {/* Progress Bars */}
                        <div className="absolute top-0 left-0 right-0 p-3 z-30 flex gap-1.5">
                            {STORIES.map((_, idx) => (
                                <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full bg-white transition-all duration-300",
                                            idx < storyIndex ? "w-full" : idx === storyIndex ? "w-1/2" : "w-0",
                                        )}
                                    ></div>
                                </div>
                            ))}
                        </div>

                        {/* Header Story */}
                        <div className="absolute top-4 left-0 right-0 p-4 z-30 flex items-center justify-between pt-6">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10 border border-white/20">
                                    <img src={STORIES[storyIndex].img} alt="story" />
                                </Avatar>
                                <div>
                                    <p className="text-white font-bold text-sm shadow-black drop-shadow-md">
                                        {STORIES[storyIndex].name}
                                    </p>
                                    <p className="text-white/70 text-xs shadow-black drop-shadow-md">
                                        {STORIES[storyIndex].time}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeStory}
                                className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Image / Content */}
                        <div className="flex-1 relative flex items-center justify-center bg-black">
                            <Image
                                fill
                                src={STORIES[storyIndex].img}
                                className="w-full h-auto max-h-full object-contain"
                                alt="Story Content"
                            />
                            <div
                                className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer"
                                onClick={prevStory}
                            ></div>
                            <div
                                className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer"
                                onClick={nextStory}
                            ></div>
                        </div>

                        {/* Footer Reply Input */}
                        <div className="p-4 z-30 bg-gradient-to-t from-black/80 to-transparent pb-8 md:pb-6">
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Kirim pesan..."
                                    className="flex-1 bg-transparent border border-white/30 rounded-full py-3 px-5 text-white placeholder:text-white/60 focus:border-white outline-none backdrop-blur-md text-sm"
                                />
                                <button className="p-3 rounded-full border border-white/30 text-white hover:bg-white/20 backdrop-blur-md">
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button className="p-3 rounded-full border border-white/30 text-white hover:bg-white/20 backdrop-blur-md">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation Buttons Outside */}
                    <button
                        onClick={prevStory}
                        className="hidden md:flex absolute left-8 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md disabled:opacity-0 transition-all z-20"
                        disabled={storyIndex === 0}
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={nextStory}
                        className="hidden md:flex absolute right-8 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md disabled:opacity-0 transition-all z-20"
                        disabled={storyIndex === STORIES.length - 1}
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>
            )}
        </div>
    );
}
