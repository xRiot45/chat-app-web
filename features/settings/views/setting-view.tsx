"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAction } from "@/features/auth/application/actions/logout-action";
import { getCurrentUser } from "@/features/auth/application/queries/get-current-user-query";
import { User } from "@/features/users/interfaces";
import { initialActionState } from "@/types/action-state";
import { ArrowLeft, Bell, FileText, Globe, Loader2, LogOut, MessageSquare, Shield, UserPlus } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";

interface SettingViewProps {
    isSettingsOpen: boolean;
    setIsSettingsOpen: (value: boolean) => void;
}

export default function SettingView({ isSettingsOpen, setIsSettingsOpen }: SettingViewProps) {
    const [user, setUser] = useState<User | null>(null);
    const [state, action, isPending] = useActionState(logoutAction, initialActionState);

    useEffect(() => {
        getCurrentUser().then((response) => {
            if (response && response.success) {
                setUser(response.data);
            } else {
                setUser(response);
            }
        });
    }, []);

    const handleLogout = () => {
        startTransition(() => {
            action(new FormData());
        });
    };

    return (
        <>
            {isSettingsOpen && (
                <div className="absolute inset-0 z-50 flex">
                    <div
                        className="flex-1 bg-black/20 backdrop-blur-sm animate-in fade-in"
                        onClick={() => !isPending && setIsSettingsOpen(false)}
                    ></div>

                    <div className="w-125 h-full bg-white dark:bg-[#0f1115] border-r border-slate-200 dark:border-white/5 shadow-2xl flex flex-col absolute left-0 animate-in slide-in-from-left duration-300">
                        <div className="h-19 px-6 flex items-center justify-between border-b border-slate-200/50 dark:border-white/5">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h2>
                            <button
                                onClick={() => setIsSettingsOpen(false)}
                                disabled={isPending}
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                            {/* === PROFILE SECTION (Updated with JSON Data) === */}
                            <div className="flex items-center gap-4 p-4 rounded-2xl pb-6">
                                <div className="relative group">
                                    <Avatar className="w-20 h-20 border-2 border-indigo-500/20 dark:border-indigo-500/40">
                                        <AvatarImage
                                            src={user?.avatarUrl || ""}
                                            alt={user?.fullName || "User"}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-2xl font-bold">
                                            {user?.fullName?.charAt(0).toUpperCase() || "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* Status Indicator (Online/Offline) */}
                                    {user?.status === "online" && (
                                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#0f1115] rounded-full shadow-sm" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-xl text-slate-800 dark:text-white leading-tight">
                                        {user?.fullName || "Loading..."}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        @{user?.username || "username"}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 italic">
                                        {user?.email}
                                    </p>
                                    <button className="text-xs font-semibold text-indigo-500 mt-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                        Edit Profile
                                    </button>
                                </div>
                            </div>

                            {/* Bio Section (Optional dari JSON) */}
                            {user?.bio && (
                                <div className="px-4 pb-6">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                                        {user.bio}
                                    </p>
                                </div>
                            )}

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

                            <div className="space-y-1 pt-4 border-t border-slate-100 dark:border-white/5">
                                <button
                                    disabled={isPending}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group"
                                >
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-500/10 transition-colors">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">Help</p>
                                </button>

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
