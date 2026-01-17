"use client";

import AllChat from "@/components/all-chat";
import { Avatar } from "@/components/avatar";

import ButtonGrouping from "@/components/button-grouping";
import PinnedChat from "@/components/pinned-chat";
import SearchInput from "@/components/search-input";
import Stories from "@/components/stories";
import User from "@/components/user";
import { CONTACTS } from "@/constants/contacts";
import { INITIAL_MESSAGES } from "@/constants/initial-messages";
import { SHARED_MEDIA } from "@/constants/shared-media";
import { STORIES } from "@/constants/stories";
import ContactListsView from "@/features/contacts/views/contact-lists-view";
import { cn } from "@/lib/utils";
import {
    ArrowLeft,
    Bell,
    Check,
    CheckCheck,
    ChevronLeft,
    ChevronRight,
    Download,
    FileText,
    Globe,
    Heart,
    Image as ImageIcon,
    LogOut,
    MessageSquare,
    Mic,
    MoreHorizontal,
    Phone,
    Plus,
    Search,
    Send,
    Settings,
    Share2,
    Shield,
    Smile,
    UserPlus,
    Users,
    Video,
    X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";

export default function UltimateChatApp() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [selectedChat, setSelectedChat] = useState<null>(null);
    const [mobileView, setMobileView] = useState<"list" | "chat" | "details">("list");
    const [showRightPanel, setShowRightPanel] = useState(true);
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState("");

    // -- MODALS / SIDEBAR STATE --
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [storyIndex, setStoryIndex] = useState<number | null>(null);

    // -- SETTINGS SIDEBAR STATE --
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Toggle Dark Mode
    useEffect(() => {
        if (isDarkMode) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    }, [isDarkMode]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, selectedChat]);

    // --- LOGIC GROUPING CONTACTS ---
    const groupedContacts = useMemo(() => {
        const groups: Record<string, typeof CONTACTS> = {};
        // 1. Sort contacts A-Z
        const sorted = [...CONTACTS].sort((a, b) => a.name.localeCompare(b.name));

        // 2. Group by First Letter
        sorted.forEach((contact) => {
            const letter = contact.name.charAt(0).toUpperCase();
            if (!groups[letter]) groups[letter] = [];
            groups[letter].push(contact);
        });

        return groups;
    }, []);

    const sortedLetters = Object.keys(groupedContacts).sort();

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;

        setMessages([
            ...messages,
            {
                id: Date.now(),
                senderId: "me",
                text: inputText,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                read: false,
                type: "text",
            },
        ]);
        setInputText("");
    };

    const handleChatSelect = (chat: any) => {
        setSelectedChat(chat);
        setMobileView("chat");
    };

    // -- STORY HANDLERS --
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
                <SearchInput />

                {/* Chat Lists */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-6 pt-2 pb-4">
                    {/* Pinned Section */}
                    <PinnedChat handleChatSelect={handleChatSelect} selectedChat={selectedChat} />

                    {/* All Chats Section */}
                    <AllChat handleChatSelect={handleChatSelect} selectedChat={selectedChat} />
                </div>

                {/* Contact List View */}
                <ContactListsView isAddModalOpen={isAddModalOpen} setIsAddModalOpen={setIsAddModalOpen} />
            </aside>

            {/* === SETTINGS SIDEBAR (Full Overlay) === */}
            {isSettingsOpen && (
                <div className="absolute inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="flex-1 bg-black/20 backdrop-blur-sm animate-in fade-in"
                        onClick={() => setIsSettingsOpen(false)}
                    ></div>

                    {/* Sidebar Panel */}
                    <div className="w-125 h-full bg-white dark:bg-[#0f1115] border-r border-slate-200 dark:border-white/5 shadow-2xl flex flex-col absolute left-0 animate-in slide-in-from-left duration-300">
                        {/* Header */}
                        <div className="h-19 px-6 flex items-center justify-between border-b border-slate-200/50 dark:border-white/5">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h2>
                            <button
                                onClick={() => setIsSettingsOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                            {/* Profile Section */}
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                <Avatar src="https://i.pravatar.cc/150?u=me" className="w-16 h-16" />
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Gemini Dev</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">+62 812 3456 7890</p>
                                    <p className="text-xs text-indigo-500 mt-1 cursor-pointer hover:underline">
                                        Edit Profile
                                    </p>
                                </div>
                            </div>

                            {/* Settings Menu */}
                            <div className="space-y-1">
                                {[
                                    { icon: UserPlus, label: "Account", sub: "Privacy, Security, Change Number" },
                                    { icon: MessageSquare, label: "Chats", sub: "Theme, Wallpapers, Chat History" },
                                    { icon: Bell, label: "Notifications", sub: "Message, Group & Call Tones" },
                                    { icon: Globe, label: "App Language", sub: "English (device's language)" },
                                    { icon: FileText, label: "Storage and Data", sub: "Network usage, auto-download" },
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group"
                                    >
                                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-500/10 transition-colors">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                                                {item.label}
                                            </p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">{item.sub}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Others */}
                            <div className="space-y-1 pt-4 border-t border-slate-100 dark:border-white/5">
                                <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group">
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-500/10 transition-colors">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">Help</p>
                                </button>
                                <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left group">
                                    <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                                        <LogOut className="w-5 h-5" />
                                    </div>
                                    <p className="font-semibold text-sm text-red-500">Log Out</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* === CENTER MAIN CHAT === */}
            <main
                className={cn(
                    "flex-1 flex flex-col h-full relative z-10 bg-slate-50/50 dark:bg-[#0a0a0c]/50 backdrop-blur-xl transition-all",
                    mobileView === "list" ? "hidden md:flex" : "flex",
                    showRightPanel ? "lg:mr-0" : "", // Adjust if needed
                )}
            >
                {selectedChat ? (
                    <>
                        {/* Glassy Header */}
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

                                <div
                                    className="relative cursor-pointer"
                                    onClick={() => setShowRightPanel(!showRightPanel)}
                                >
                                    <Avatar src={selectedChat.avatar} className="w-10 h-10" />
                                    {selectedChat.type === "group" && (
                                        <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-0.5 border border-slate-700">
                                            <Users className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="cursor-pointer" onClick={() => setShowRightPanel(!showRightPanel)}>
                                    <h2 className="font-bold text-base text-slate-800 dark:text-slate-100 leading-tight hover:text-indigo-500 transition-colors">
                                        {selectedChat.name}
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                        {selectedChat.type === "group" ? (
                                            <>
                                                {selectedChat.members} members •{" "}
                                                <span className="text-green-500">5 Online</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>{" "}
                                                Online
                                            </>
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

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar scroll-smooth">
                            <div className="flex justify-center my-6">
                                <span className="px-4 py-1.5 rounded-full bg-slate-200/50 dark:bg-white/5 text-[11px] font-bold text-slate-500 dark:text-slate-400 border border-white/10 backdrop-blur-sm">
                                    YESTERDAY
                                </span>
                            </div>

                            {messages.map((msg, idx) => {
                                const isMe = msg.senderId === "me";
                                const showAvatar =
                                    !isMe &&
                                    (idx === messages.length - 1 || messages[idx + 1]?.senderId !== msg.senderId);

                                return (
                                    <div
                                        key={msg.id}
                                        className={cn("flex w-full group", isMe ? "justify-end" : "justify-start")}
                                    >
                                        <div
                                            className={cn(
                                                "flex max-w-[85%] lg:max-w-[65%] gap-3",
                                                isMe ? "flex-row-reverse" : "flex-row",
                                            )}
                                        >
                                            {/* Avatar placeholder to keep alignment */}
                                            <div className="w-8 shrink-0 flex flex-col justify-end">
                                                {showAvatar && <Avatar src={selectedChat.avatar} className="w-8 h-8" />}
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                {!isMe && showAvatar && (
                                                    <span className="text-[10px] text-slate-400 ml-1 mb-0.5">
                                                        Sarah Design
                                                    </span>
                                                )}

                                                <div
                                                    className={cn(
                                                        "relative px-4 py-3 shadow-sm text-[15px] leading-relaxed transition-all duration-200",
                                                        isMe
                                                            ? "bg-linear-to-br from-indigo-600 to-violet-600 text-white rounded-2xl rounded-tr-sm"
                                                            : "bg-white dark:bg-[#1c1f26] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-sm hover:border-slate-300 dark:hover:border-white/20",
                                                    )}
                                                >
                                                    {/* Image Attachment */}
                                                    {msg.type === "image" && msg.mediaUrl && (
                                                        <div className="mb-2 rounded-lg overflow-hidden relative group/img cursor-pointer">
                                                            <Image
                                                                height={500}
                                                                width={500}
                                                                src={msg.mediaUrl}
                                                                className="w-full h-auto object-cover max-h-60"
                                                                alt="attachment"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                                <Download className="w-6 h-6 text-white" />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* File Attachment */}
                                                    {msg.type === "file" && (
                                                        <div className="flex items-center gap-3 p-3 bg-black/20 rounded-xl mb-1 cursor-pointer hover:bg-black/30 transition-colors">
                                                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
                                                                <FileText className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-sm truncate">
                                                                    Project_File.zip
                                                                </p>
                                                                <p className="text-[10px] opacity-70">
                                                                    2.4 MB • ZIP Archive
                                                                </p>
                                                            </div>
                                                            <Download className="w-4 h-4 opacity-70" />
                                                        </div>
                                                    )}

                                                    <p>{msg.text}</p>

                                                    <div
                                                        className={cn(
                                                            "flex items-center justify-end gap-1 mt-1 text-[10px]",
                                                            isMe ? "text-indigo-200" : "text-slate-400",
                                                        )}
                                                    >
                                                        <span>{msg.time}</span>
                                                        {isMe &&
                                                            (msg.read ? (
                                                                <CheckCheck className="w-3.5 h-3.5" />
                                                            ) : (
                                                                <Check className="w-3.5 h-3.5" />
                                                            ))}
                                                    </div>
                                                </div>

                                                {/* Reaction Mockup */}
                                                {!isMe && Math.random() > 0.7 && (
                                                    <div className="self-start -mt-2 ml-2 bg-white dark:bg-slate-800 rounded-full px-1.5 py-0.5 border border-slate-200 dark:border-white/10 shadow-sm z-10 text-xs">
                                                        ❤️ 🔥
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action buttons on hover */}
                                            <div
                                                className={cn(
                                                    "opacity-0 group-hover:opacity-100 transition-opacity flex items-center self-center",
                                                    isMe ? "mr-2" : "ml-2",
                                                )}
                                            >
                                                <button className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                                    <Smile className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Floating Bar */}
                        <div className="p-4 md:px-6 md:pb-6 relative z-20">
                            <form
                                onSubmit={handleSendMessage}
                                className="relative flex items-end gap-2 p-1.5 bg-white/80 dark:bg-[#15171c]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl shadow-indigo-500/5"
                            >
                                <div className="flex items-center gap-1 pl-2 pb-2">
                                    <button
                                        type="button"
                                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors hidden md:block"
                                    >
                                        <ImageIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex-1 min-w-0 py-2">
                                    <input
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Type a message..."
                                        className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 px-2"
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="flex items-center gap-1 pr-1 pb-1">
                                    <button
                                        type="button"
                                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors"
                                    >
                                        <Smile className="w-5 h-5" />
                                    </button>
                                    {inputText.trim() ? (
                                        <button
                                            type="submit"
                                            className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/40 transition-all active:scale-95"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="p-3 bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-300 dark:hover:bg-white/20 transition-all"
                                        >
                                            <Mic className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </>
                ) : (
                    /* EMPTY STATE */
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-32 h-32 relative mb-6">
                            <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full animate-pulse"></div>
                            <div className="relative z-10 w-full h-full bg-linear-to-tr from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-3 transform hover:rotate-6 transition-transform duration-500">
                                <MessageSquare className="w-14 h-14 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold mb-3 text-slate-800 dark:text-white">
                            Selamat Datang di Gemini Chat
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-8">
                            Platform komunikasi Web3 yang aman, cepat, dan modern.
                            <br />
                            Mulai percakapan dengan memilih kontak di sebelah kiri.
                        </p>
                        <button className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white font-medium transition-all flex items-center gap-2">
                            <Settings className="w-4 h-4" /> Personalize Theme
                        </button>
                    </div>
                )}
            </main>

            {/* === RIGHT SIDEBAR (DETAILS PANEL) === */}
            {selectedChat && showRightPanel && (
                <aside
                    className={cn(
                        // Base Styles
                        "h-full z-50 flex flex-col transition-all duration-300 border-l border-slate-200 dark:border-white/5",

                        // MOBILE VIEW (Full Screen Overlay)
                        "fixed inset-0 w-full bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-xl",

                        // DESKTOP VIEW (Sidebar Mode)
                        // Menggunakan lg:w-[400px] agar pas dengan sidebar kiri yang sudah dilebarkan sebelumnya
                        "lg:relative lg:w-100 lg:bg-white/60 lg:dark:bg-[#0f1115]/80 lg:backdrop-blur-2xl",
                    )}
                >
                    {/* Header Right */}
                    <div className="h-19 flex items-center px-6 border-b border-slate-200/50 dark:border-white/5 font-bold text-lg shrink-0">
                        <span className="text-slate-800 dark:text-white">Directory</span>
                        {/* Tombol Close (Hanya muncul di Mobile karena ada lg:hidden) */}
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
                            <Avatar
                                src={selectedChat.avatar}
                                className="w-24 h-24 mb-4 ring-4 ring-slate-100 dark:ring-white/5 shadow-xl"
                                status={selectedChat.status}
                            />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                {selectedChat.name}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">@username_handle</p>
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
                                        {/* Menggunakan img standard jika Image component error, atau sesuaikan dengan Next/React Image */}
                                        <Image
                                            height={500}
                                            width={500}
                                            src={media.src}
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
                                <Avatar src={STORIES[storyIndex].img} className="w-10 h-10 border border-white/20" />
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
                        <div className="p-4 z-30 bg-linear-to-t from-black/80 to-transparent pb-8 md:pb-6">
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

            {/* Global Styles */}
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                    height: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(156, 163, 175, 0.2);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(99, 102, 241, 0.5);
                }

                .animate-pulse-slow {
                    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes pulse {
                    0%,
                    100% {
                        opacity: 0.1;
                    }
                    50% {
                        opacity: 0.3;
                    }
                }
            `}</style>
        </div>
    );
}
