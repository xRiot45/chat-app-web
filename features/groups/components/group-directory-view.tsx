import { renderRoleBadge } from "@/components/role-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API_BASE_URL } from "@/configs/api-base-url";
import { ActiveGroupChat } from "@/features/chats/interfaces";
import { cn } from "@/lib/utils";
import {
    Bell,
    Download,
    FileText,
    Image as ImageIcon,
    Loader2,
    LogOut,
    MoreVertical,
    ShieldAlert,
    UserPlus,
    Users,
    X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getMembersGroup } from "../application/queries/get-members-group-query";
import { getProfileGroup } from "../application/queries/get-profile-group-query";
import { Group, GroupMember, SharedMediaItem } from "../interfaces/group";

interface GroupDirectoryViewProps {
    selectedChat: ActiveGroupChat;
    onClose: () => void;
}

const MOCK_MEDIA: SharedMediaItem[] = [
    { id: "1", type: "image", src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80" },
    { id: "2", type: "image", src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80" },
    { id: "3", type: "image", src: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=500&q=80" },
    { id: "4", type: "file", name: "System_Architecture_v2.pdf", size: "2.4 MB" },
    { id: "5", type: "file", name: "Backend_Roadmap_2026.docx", size: "1.1 MB" },
];

export const GroupDirectoryView: React.FC<GroupDirectoryViewProps> = ({ selectedChat, onClose }) => {
    const [groupData, setGroupData] = useState<Group | null>(null);
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const currentGroupId = selectedChat.groupId;
        if (!currentGroupId) return;

        const loadData = async () => {
            setIsLoading(true);
            try {
                const [profileRes, membersRes] = await Promise.all([
                    getProfileGroup(currentGroupId),
                    getMembersGroup(currentGroupId),
                ]);

                if (profileRes.success) setGroupData(profileRes?.data || null);
                if (membersRes.success) setMembers(membersRes?.data || []);
            } catch (error) {
                console.error("Failed to load group directory data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [selectedChat.groupId]);

    if (isLoading) {
        return (
            <aside className="h-full w-full lg:w-100 bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-xl flex items-center justify-center border-l border-slate-200 dark:border-white/5">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    <span className="text-xs font-medium uppercase tracking-wider">Loading Profile...</span>
                </div>
            </aside>
        );
    }

    return (
        <aside
            className={cn(
                "h-full z-50 flex flex-col transition-all duration-300 border-l border-slate-200 dark:border-white/5",
                "fixed inset-0 w-full bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-xl",
                "lg:relative lg:w-120 lg:bg-white/60 lg:dark:bg-[#0f1115]/80 lg:backdrop-blur-2xl",
            )}
        >
            {/* Header Right */}
            <div className="h-19 flex items-center px-6 border-b border-slate-200/50 dark:border-white/5 font-bold text-lg shrink-0">
                <span className="text-slate-800 dark:text-white flex items-center gap-2">Group Info</span>
                <button
                    onClick={onClose}
                    className="ml-auto lg:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                    <X className="w-6 h-6 text-slate-500 dark:text-slate-300" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {/* Group Profile Info */}
                <div className="flex flex-col items-center text-center">
                    <div className="relative group cursor-pointer">
                        <Avatar className="w-24 h-24 mb-4 ring-4 ring-slate-100 dark:ring-white/5 shadow-xl transition-transform hover:scale-105">
                            <AvatarImage
                                src={
                                    groupData?.iconUrl
                                        ? `${API_BASE_URL}/api/public/${groupData.iconUrl}`
                                        : selectedChat.avatar
                                }
                                className="object-cover"
                            />
                            <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200 text-2xl font-bold">
                                {groupData?.name?.substring(0, 2).toUpperCase() || "GR"}
                            </AvatarFallback>
                        </Avatar>

                        {/* Edit Icon Overlay */}
                        <div className="absolute bottom-4 right-0 p-1.5 bg-slate-900 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-3 h-3" />
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 leading-tight">
                        {groupData?.name || selectedChat.name}
                    </h3>

                    <p className="text-sm font-medium text-indigo-500 dark:text-indigo-400 mb-3">
                        {groupData?.membersCount || 0} Members
                    </p>

                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-[90%]">
                        {groupData?.description || "No description provided."}
                    </p>

                    {/* Quick Actions */}
                    <div className="flex gap-3 mt-6 w-full">
                        <button className="flex-1 py-3 px-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex flex-col items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                            Mute
                        </button>
                        {/* <button className="flex-1 py-3 px-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex flex-col items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <Search className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                            Search
                        </button> */}
                        <button className="flex-1 py-3 px-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors flex flex-col items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                            <UserPlus className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                            Add Members
                        </button>
                    </div>
                </div>

                <hr className="border-slate-100 dark:border-white/5" />

                {/* Members List Section */}
                <div>
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                        <Users className="w-3.5 h-3.5" /> Members
                    </h4>

                    <ScrollArea className="h-72 w-full pr-3">
                        <div className="space-y-1">
                            {members.map((item, idx) => (
                                <div
                                    key={item.user.id + idx}
                                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 group transition-colors"
                                >
                                    <Avatar className="w-10 h-10 border border-slate-200 dark:border-white/10">
                                        <AvatarImage
                                            src={
                                                item.user.avatarUrl
                                                    ? `${API_BASE_URL}/api/public/${item.user.avatarUrl}`
                                                    : ""
                                            }
                                            className="object-cover"
                                        />
                                        <AvatarFallback>{item.user.fullName.charAt(0)}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                                {item.user.fullName}
                                            </p>
                                            {renderRoleBadge(item.role)}
                                        </div>
                                        <p className="text-[11px] text-slate-500 truncate">@{item.user.username}</p>
                                    </div>

                                    <button className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Shared Media Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <ImageIcon className="w-3.5 h-3.5" /> Shared Media
                        </h4>
                        <button className="text-indigo-500 text-xs hover:underline font-medium">View All</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {MOCK_MEDIA.filter((m) => m.type === "image").map((media) => (
                            <div
                                key={media.id}
                                className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer bg-slate-100 dark:bg-white/5"
                            >
                                <Image
                                    src={media.src || ""}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    alt="media"
                                    width={200}
                                    height={200}
                                    crossOrigin="anonymous"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Files Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5" /> Documents
                        </h4>
                    </div>
                    <div className="space-y-2.5">
                        {MOCK_MEDIA.filter((m) => m.type === "file").map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-white/10 cursor-pointer transition-colors group border border-transparent hover:border-indigo-100 dark:hover:border-white/5"
                            >
                                <div className="p-2.5 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-300">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                                        {file.name}
                                    </p>
                                    <p className="text-[10px] text-slate-500">{file.size} • PDF</p>
                                </div>
                                <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Danger Zone / Footer */}
                <div className="pt-4 border-t border-slate-200 dark:border-white/10 pb-6 space-y-3">
                    <button className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-medium text-sm">
                        <ShieldAlert className="w-4 h-4" /> Report Group
                    </button>
                    <button className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors font-medium text-sm">
                        <LogOut className="w-4 h-4" /> Leave Group
                    </button>
                </div>
            </div>
        </aside>
    );
};
