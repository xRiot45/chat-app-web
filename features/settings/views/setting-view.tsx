"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAction } from "@/features/auth/application/actions/logout-action";
import { initialActionState } from "@/types/action-state";
import { ArrowLeft, Bell, FileText, Globe, Loader2, LogOut, MessageSquare, Shield, UserPlus } from "lucide-react";
import { startTransition, useActionState } from "react";

interface SettingViewProps {
    isSettingsOpen: boolean;
    setIsSettingsOpen: (value: boolean) => void;
}

export default function SettingView({ isSettingsOpen, setIsSettingsOpen }: SettingViewProps) {
    const [state, action, isPending] = useActionState(logoutAction, initialActionState);

    const handleLogout = () => {
        startTransition(() => {
            action(new FormData());
        });
    };

    return (
        <>
            {isSettingsOpen && (
                <div className="absolute inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="flex-1 bg-black/20 backdrop-blur-sm animate-in fade-in"
                        onClick={() => !isPending && setIsSettingsOpen(false)}
                    ></div>

                    {/* Sidebar Panel */}
                    <div className="w-125 h-full bg-white dark:bg-[#0f1115] border-r border-slate-200 dark:border-white/5 shadow-2xl flex flex-col absolute left-0 animate-in slide-in-from-left duration-300">
                        {/* Header */}
                        <div className="h-19 px-6 flex items-center justify-between border-b border-slate-200/50 dark:border-white/5">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h2>
                            <button
                                onClick={() => setIsSettingsOpen(false)}
                                disabled={isPending}
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors disabled:opacity-50"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                            {/* Profile Section */}
                            <div className="flex items-center gap-4 p-4 rounded-2xl pb-6">
                                <div className="relative p-1 rounded-full ">
                                    <Avatar className="w-16 h-16 border-2 border-white dark:border-[#0f1115]">
                                        <AvatarImage
                                            src="https://i.pravatar.cc/150?u=me"
                                            alt="Gemini Dev"
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-lg font-bold">
                                            GD
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
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
                                        disabled={isPending}
                                        className="w-full flex items-center gap-4 p-4 cursor-pointer rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group disabled:opacity-50"
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
                                <button
                                    disabled={isPending}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group disabled:opacity-50"
                                >
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-500/10 transition-colors">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">Help</p>
                                </button>

                                {/* Tombol Logout dengan status loading */}
                                <button
                                    onClick={handleLogout}
                                    disabled={isPending}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                                        {isPending ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <LogOut className="w-5 h-5" />
                                        )}
                                    </div>
                                    <p className="font-semibold text-sm text-red-500">
                                        {isPending ? "Logging out..." : "Log Out"}
                                    </p>
                                </button>

                                {/* Error Message */}
                                {state.status === "error" && (
                                    <p className="text-[10px] text-red-500 text-center mt-2 px-4 italic">
                                        {state.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
