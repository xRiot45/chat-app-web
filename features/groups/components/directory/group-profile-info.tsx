import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_BASE_URL } from "@/configs/api-base-url";
import { cn } from "@/lib/utils";
import { Settings2, UserPlus } from "lucide-react";
import React from "react";
import { Group } from "../../interfaces/group";

interface GroupProfileInfoProps {
    groupData: Group | null;
    selectedChatAvatar: string;
    membersCount: number;
    canAddMembers: boolean;
    onInviteClick: () => void;
    onUpdateClick: () => void;
}

export const GroupProfileInfo: React.FC<GroupProfileInfoProps> = ({
    groupData,
    membersCount,
    canAddMembers,
    onInviteClick,
    onUpdateClick,
}) => {
    const groupInitial = groupData?.name?.substring(0, 2).toUpperCase() || "GR";

    return (
        <div className="flex flex-col items-center text-center">
            {/* Group Avatar Section dengan Overlay Edit */}
            <div className={cn("relative group", canAddMembers ? "cursor-pointer" : "cursor-default")}>
                <Avatar className="w-24 h-24 mb-4 ring-4 ring-slate-100 dark:ring-white/5 shadow-xl transition-transform group-hover:scale-105">
                    <AvatarImage
                        src={`${API_BASE_URL}/api/public${groupData?.iconUrl}`}
                        className="object-cover"
                        alt="Group Icon"
                        crossOrigin="anonymous"
                    />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200 text-2xl font-bold">
                        {groupInitial}
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Group Name & Stats */}
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 leading-tight">
                {groupData?.name || "Loading Group..."}
            </h3>

            <p className="text-sm font-medium text-indigo-500 dark:text-indigo-400 mb-3">{membersCount} Members</p>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-[90%] min-h-5 mb-2">
                {groupData?.description || "No description provided."}
            </p>

            {/* Quick Actions Grid yang Diperbarui */}
            <div className="flex gap-2 mt-4 w-full">
                {/* Tombol Edit Profile Baru */}
                {canAddMembers && (
                    <button
                        type="button"
                        onClick={onUpdateClick}
                        className="flex-1 py-3 px-1 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex flex-col items-center gap-1.5 text-xs cursor-pointer font-bold text-slate-700 dark:text-slate-300"
                    >
                        <Settings2 className="w-4 h-4 text-slate-500" />
                        Settings
                    </button>
                )}

                {canAddMembers && (
                    <button
                        type="button"
                        onClick={onInviteClick}
                        className="flex-1 py-3 px-1 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors flex flex-col items-center gap-1.5 text-xs cursor-pointer font-bold text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/20"
                    >
                        <UserPlus className="w-4 h-4 text-indigo-500" />
                        Invite
                    </button>
                )}
            </div>
        </div>
    );
};
