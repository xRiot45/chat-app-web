import { renderRoleBadge } from "@/components/role-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API_BASE_URL } from "@/configs/api-base-url";
import { MoreVertical, ShieldCheck, UserMinus, Users } from "lucide-react";
import React from "react";
import { GroupMember } from "../../interfaces/group";

interface GroupMembersListProps {
    members: GroupMember[];
}

export const GroupMembersList: React.FC<GroupMembersListProps> = ({ members }) => {
    return (
        <div className="space-y-4">
            {/* Section Header */}
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                <Users className="w-3.5 h-3.5" />
                Members ({members.length})
            </h4>

            {/* Scrollable Area */}
            <ScrollArea className="h-72 w-full pr-3">
                <div className="space-y-1">
                    {members.length > 0 ? (
                        members.map((member, idx) => <MemberItem key={`${member.user.id}-${idx}`} member={member} />)
                    ) : (
                        <div className="text-center py-8 text-slate-400 text-sm italic">No members found.</div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

interface MemberItemProps {
    member: GroupMember;
}

const MemberItem: React.FC<MemberItemProps> = ({ member }) => {
    const { user, role } = member;

    return (
        <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 group transition-colors">
            {/* Avatar Section */}
            <Avatar className="w-10 h-10 border border-slate-200 dark:border-white/10 shrink-0">
                <AvatarImage
                    src={user.avatarUrl ? `${API_BASE_URL}/api/public/${user.avatarUrl}` : ""}
                    className="object-cover"
                    alt={user.fullName || user.username}
                />
                <AvatarFallback className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                    {(user.fullName || user.username).charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            {/* Name and Role Section */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {user.fullName || user.username}
                    </p>
                    {renderRoleBadge(role)}
                </div>
                <p className="text-[11px] text-slate-500 truncate lowercase">@{user.username}</p>
            </div>

            {/* Action Menu Trigger menggunakan Dropdown Shadcn */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-indigo-500 transition-all rounded-lg hover:bg-white dark:hover:bg-white/10 outline-none"
                        aria-label="Member Options"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="w-62 px-4 rounded-xl bg-white dark:bg-[#0f1115] border-slate-200 dark:border-white/10 shadow-xl"
                >
                    <DropdownMenuLabel className="text-xs text-slate-500 font-medium">Member Options</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5" />

                    {/* Menu: Change Role */}
                    <DropdownMenuItem
                        onClick={() => console.log("Change role logic for:", user.id)}
                        className="flex items-center gap-2 cursor-pointer focus:bg-indigo-50 dark:focus:bg-indigo-500/10 focus:text-indigo-600 dark:focus:text-indigo-400 py-2.5"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        <span className="font-medium">Change Role</span>
                    </DropdownMenuItem>

                    {/* Menu: Kick Member */}
                    <DropdownMenuItem
                        onClick={() => console.log("Kick member logic for:", user.id)}
                        className="flex items-center gap-2 cursor-pointer focus:bg-red-50 dark:focus:bg-red-500/10 text-red-500 focus:text-red-600 py-2.5"
                    >
                        <UserMinus className="w-4 h-4" />
                        <span className="font-medium">Kick Member</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
