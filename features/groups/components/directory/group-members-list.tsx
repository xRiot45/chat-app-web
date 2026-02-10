import { renderRoleBadge } from "@/components/role-badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_BASE_URL } from "@/configs/api-base-url";
import { UserRoleGroup } from "@/enums/user-role-group-enum";
import { cn } from "@/lib/utils";
import { initialActionState } from "@/types/action-state";
import { Check, Loader2, MoreVertical, ShieldCheck, UserMinus, Users } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { changeRoleMemberAction } from "../../application/actions/change-role-member-action";
import { kickMemberAction } from "../../application/actions/kick-member-action";
import { GroupMember } from "../../interfaces/group";

interface GroupMembersListProps {
    groupId: string;
    members: GroupMember[];
    onRefresh: () => void;
    currentUserId: string;
}

export const GroupMembersList: React.FC<GroupMembersListProps> = ({ groupId, members, onRefresh, currentUserId }) => {
    const currentUserRole = members.find((m) => m.user.id === currentUserId)?.role || UserRoleGroup.MEMBER;

    return (
        <div className="space-y-4">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                <Users className="w-3.5 h-3.5" />
                Members ({members.length})
            </h4>

            <ScrollArea className="h-72 w-full pr-3">
                <div className="space-y-1">
                    {members.length > 0 ? (
                        members.map((member, idx) => (
                            <MemberItem
                                key={`${member.user.id}-${idx}`}
                                member={member}
                                groupId={groupId}
                                onRefresh={onRefresh}
                                currentUserRole={currentUserRole}
                                currentUserId={currentUserId}
                            />
                        ))
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
    groupId: string;
    onRefresh: () => void;
    currentUserRole: UserRoleGroup | string;
    currentUserId: string;
}

const MemberItem: React.FC<MemberItemProps> = ({ member, groupId, onRefresh, currentUserRole, currentUserId }) => {
    const { user, role } = member;
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
    const [isKicking, setIsKicking] = useState<boolean>(false);
    const [isUpdatingRole, setIsUpdatingRole] = useState<boolean>(false);
    const [selectedRole, setSelectedRole] = useState<string>(role.toUpperCase());

    const isAdminOrOwner =
        currentUserRole.toUpperCase() === UserRoleGroup.OWNER || currentUserRole.toUpperCase() === UserRoleGroup.ADMIN;

    const isNotSelf = user.id !== currentUserId;
    const showActionMenu = isAdminOrOwner && isNotSelf;

    const handleKick = async () => {
        setIsKicking(true);
        try {
            const res = await kickMemberAction(groupId, user.id);
            if (res.status === "success") {
                toast.success(res.message);
                onRefresh();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsKicking(false);
            setIsConfirmOpen(false);
        }
    };

    const handleUpdateRole = async () => {
        setIsUpdatingRole(true);

        const formData = new FormData();
        formData.append("groupId", groupId);
        formData.append("memberId", user.id);
        formData.append("role", selectedRole);

        try {
            const res = await changeRoleMemberAction(initialActionState, formData);

            if (res.status === "success") {
                toast.success(res.message);
                onRefresh(); // Refresh list member agar badge berubah
                setIsRoleModalOpen(false);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error("UPDATE_ROLE_ERROR:", error);
            toast.error("Failed to connect to server");
        } finally {
            setIsUpdatingRole(false);
        }
    };

    return (
        <div
            className={cn(
                "flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 group transition-all",
                isKicking && "opacity-50 grayscale pointer-events-none",
            )}
        >
            <Avatar className="w-10 h-10 border border-slate-200 dark:border-white/10 shrink-0">
                <AvatarImage
                    src={user.avatarUrl ? `${API_BASE_URL}/api/public/${user.avatarUrl}` : ""}
                    className="object-cover"
                />
                <AvatarFallback className="bg-slate-100 dark:bg-white/10">
                    {user.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user.fullName}</p>
                    {renderRoleBadge(role)}
                    {isKicking && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
                </div>
                <p className="text-[11px] text-slate-500 truncate lowercase">@{user.username}</p>
            </div>

            {/* CONDITIONAL RENDERING: Hanya tampil jika user adalah ADMIN/OWNER */}
            {showActionMenu && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-indigo-500 transition-all rounded-lg hover:bg-white dark:hover:bg-white/10 outline-none"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl">
                        <DropdownMenuLabel className="text-xs text-slate-500">Member Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={() => setIsRoleModalOpen(true)}
                            className="flex items-center gap-2 cursor-pointer py-2.5"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Change Role</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setIsConfirmOpen(true)}
                            className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10 py-2.5"
                        >
                            <UserMinus className="w-4 h-4" />
                            <span>Kick Member</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
                <DialogContent className="sm:max-w-xl rounded-2xl dark:bg-[#0D0D0F]">
                    <DialogHeader>
                        <DialogTitle>Change Member Role</DialogTitle>
                        <DialogDescription>
                            Select a new role for <span className="font-bold">@{user.username}</span>. Roles define what
                            permissions the user has in this group.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Select defaultValue={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="w-full rounded-md border-slate-200 dark:border-white/10 h-12 py-5">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>

                            <SelectContent className="rounded-md bg-white dark:bg-[#0f1115] border-slate-200 dark:border-white/10 shadow-xl">
                                {/* Mapping Enum UserRoleGroup */}
                                {Object.values(UserRoleGroup).map((roleValue) => (
                                    <SelectItem
                                        key={roleValue}
                                        value={roleValue}
                                        className="rounded-lg focus:bg-indigo-50 p-4 dark:focus:bg-indigo-500/10 focus:text-indigo-600 dark:focus:text-indigo-400 cursor-pointer"
                                    >
                                        <span className="capitalize">{roleValue.toLowerCase()}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsRoleModalOpen(false)}
                            className="rounded-md"
                            disabled={isUpdatingRole}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateRole}
                            disabled={isUpdatingRole || selectedRole === role.toUpperCase()}
                            className="rounded-md bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                        >
                            {isUpdatingRole ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-0" />
                            ) : (
                                <Check className="w-4 h-4 mr-0" />
                            )}
                            Update Role
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ALERT DIALOG (Tetap di luar agar tidak terpengaruh menu) */}
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove <span className="font-bold">@{user.username}</span> from the group.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleKick();
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-xl gap-2"
                        >
                            {isKicking ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <UserMinus className="w-4 h-4" />
                            )}
                            Kick Member
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
