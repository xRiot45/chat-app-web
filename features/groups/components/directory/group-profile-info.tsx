import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_BASE_URL } from "@/configs/api-base-url";
import { Bell, MoreVertical, UserPlus } from "lucide-react";
import React from "react";
import { Group } from "../../interfaces/group";

interface GroupProfileInfoProps {
    groupData: Group | null;
    selectedChatAvatar: string;
    membersCount: number;
    canAddMembers: boolean;
    onInviteClick: () => void;
}

export const GroupProfileInfo: React.FC<GroupProfileInfoProps> = ({
    groupData,
    selectedChatAvatar,
    membersCount,
    canAddMembers,
    onInviteClick,
}) => {
    // Fallback inisial nama group
    const groupInitial = groupData?.name?.substring(0, 2).toUpperCase() || "GR";

    return (
        <div className="flex flex-col items-center text-center">
            {/* Group Avatar Section */}
            <div className="relative group cursor-pointer">
                <Avatar className="w-24 h-24 mb-4 ring-4 ring-slate-100 dark:ring-white/5 shadow-xl transition-transform hover:scale-105">
                    <AvatarImage
                        src={
                            groupData?.iconUrl ? `${API_BASE_URL}/api/public/${groupData.iconUrl}` : selectedChatAvatar
                        }
                        className="object-cover"
                        alt={groupData?.name || "Group Icon"}
                    />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200 text-2xl font-bold">
                        {groupInitial}
                    </AvatarFallback>
                </Avatar>

                {/* Edit Icon Overlay (Hanya muncul jika user punya akses edit, bisa ditambah logic nantinya) */}
                <div className="absolute bottom-4 right-0 p-1.5 bg-slate-900 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-3 h-3" />
                </div>
            </div>

            {/* Group Name & Stats */}
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 leading-tight">
                {groupData?.name || "Loading Group..."}
            </h3>

            <p className="text-sm font-medium text-indigo-500 dark:text-indigo-400 mb-3">{membersCount} Members</p>

            {/* Group Description */}
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-[90%] min-h-5">
                {groupData?.description || "No description provided."}
            </p>

            {/* Quick Actions Grid */}
            <div className="flex gap-3 mt-6 w-full">
                <button
                    type="button"
                    className="flex-1 py-3 px-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex flex-col items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                    <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    Mute
                </button>

                {/* Conditional Rendering tombol Add Members */}
                {canAddMembers && (
                    <button
                        type="button"
                        onClick={onInviteClick}
                        className="flex-1 py-3 px-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors flex flex-col items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/20"
                    >
                        <UserPlus className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                        Add Members
                    </button>
                )}
            </div>
        </div>
    );
};
