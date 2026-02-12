"use client";

import { UserRoleGroup } from "@/enums/user-role-group-enum";
import { ActiveGroupChat } from "@/features/chats/interfaces";
import { getContacts } from "@/features/contacts/applications/queries/get-contact-query";
import { Contact } from "@/features/contacts/interfaces/contact";
import { cn } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { leaveGroupAction } from "../../application/actions/leave-group-action";
import { removeGroupAction } from "../../application/actions/remove-group-action";
import { getMembersGroup } from "../../application/queries/get-members-group-query";
import { getProfileGroup } from "../../application/queries/get-profile-group-query";
import { Group, GroupMember, SharedMediaItem } from "../../interfaces/group";
import { InviteMemberModal } from "../modals/invite-member-modal/invite-member-modal";
import { NewGroupModal } from "../new-group-modal";
import { GroupDangerZone } from "./group-danger-zone";
import { GroupMembersList } from "./group-members-list";
import { GroupProfileInfo } from "./group-profile-info";
import { GroupSharedMedia } from "./group-shared-media";

interface GroupDirectoryViewProps {
    currentUserId: string;
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

export const GroupDirectoryView: React.FC<GroupDirectoryViewProps> = ({ currentUserId, selectedChat, onClose }) => {
    // --- Data State ---
    const [groupData, setGroupData] = useState<Group | null>(null);
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    // --- UI State ---
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isOpenModalUpdate, setIsOpenModalUpdate] = useState<boolean>(false);

    // --- Fetching Logic ---
    useEffect(() => {
        const currentGroupId = selectedChat.groupId;
        if (!currentGroupId) return;

        const loadData = async () => {
            if (refreshTrigger === 0) setIsLoading(true);

            try {
                const [profileRes, membersRes, contactsRes] = await Promise.all([
                    getProfileGroup(currentGroupId),
                    getMembersGroup(currentGroupId),
                    getContacts(),
                ]);

                if (profileRes.success) setGroupData(profileRes.data || null);
                if (membersRes.success) setMembers(membersRes.data || []);
                if (contactsRes.success) setContacts(contactsRes.data || []);
            } catch (error) {
                console.error("Failed to load group directory data:", error);
                toast.error("Failed to refresh group information");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [selectedChat.groupId, refreshTrigger]);

    // --- Derived State (Memoized) ---
    const canAddMembers = useMemo(() => {
        const currentUserMember = members.find((m) => m.user.id === currentUserId);
        if (!currentUserMember) return false;

        const role = currentUserMember.role.toUpperCase();
        return role === UserRoleGroup.OWNER || role === UserRoleGroup.ADMIN;
    }, [members, currentUserId]);

    const existingMemberIds = useMemo(() => {
        return new Set(members.map((m) => m.user.id));
    }, [members]);

    // --- Handlers ---
    const handleLeaveGroup = async () => {
        const currentGroupId = selectedChat.groupId;
        if (!currentGroupId) return;

        try {
            await leaveGroupAction(currentGroupId);
            onClose();
            setRefreshTrigger((prev) => prev + 1);
            toast.success("You have left the group");
        } catch (error) {
            console.error("Failed to leave group:", error);
            toast.error("Failed to leave group. Please try again.");
        }
    };

    const handleRemoveGroup = async () => {
        const currentGroupId = selectedChat.groupId;
        if (!currentGroupId) return;

        try {
            await removeGroupAction(currentGroupId);
            onClose();
            setRefreshTrigger((prev) => prev + 1);
            toast.success("Delete group successfully");
        } catch (error) {
            console.error("Failed to delete group:", error);
            toast.error("Failed to delete group. Please try again.");
        }
    };

    const isAdminOrOwner = useMemo(() => {
        const currentUserMember = members.find((m) => m.user.id === currentUserId);
        if (!currentUserMember) return false;

        const role = currentUserMember.role.toUpperCase();
        return role === UserRoleGroup.OWNER || role === UserRoleGroup.ADMIN;
    }, [members, currentUserId]);

    // --- Loading View ---
    if (isLoading && refreshTrigger === 0) {
        return (
            <aside className="h-full w-full lg:w-120 bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-xl flex items-center justify-center border-l border-slate-200 dark:border-white/5">
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
            {/* Header Sticky */}
            <div className="h-19 flex items-center px-6 border-b border-slate-200/50 dark:border-white/5 font-bold text-lg shrink-0">
                <span className="text-slate-800 dark:text-white flex items-center gap-2">Group Info</span>
                <button
                    onClick={onClose}
                    className="ml-auto p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                    <X className="w-6 h-6 text-slate-500" />
                </button>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                <GroupProfileInfo
                    groupData={groupData}
                    selectedChatAvatar={selectedChat.avatar}
                    membersCount={members.length}
                    canAddMembers={canAddMembers}
                    onInviteClick={() => setIsAddModalOpen(true)}
                    onUpdateClick={() => setIsOpenModalUpdate(true)}
                />

                <hr className="border-slate-100 dark:border-white/5" />

                <GroupMembersList
                    groupId={selectedChat.groupId}
                    members={members}
                    onRefresh={() => setRefreshTrigger((p) => p + 1)}
                    currentUserId={currentUserId}
                />

                <GroupSharedMedia mediaItems={MOCK_MEDIA} />

                <GroupDangerZone
                    groupName={groupData?.name || selectedChat.name}
                    isAdminOrOwner={isAdminOrOwner}
                    onLeaveGroup={handleLeaveGroup}
                    onRemoveGroup={handleRemoveGroup}
                />
            </div>

            {/* Modals */}
            <InviteMemberModal
                groupId={selectedChat.groupId}
                groupName={groupData?.name}
                isOpen={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                contacts={contacts}
                existingMemberIds={existingMemberIds}
                onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
            />

            <NewGroupModal isOpen={isOpenModalUpdate} onClose={() => setIsOpenModalUpdate(false)} data={groupData} />
        </aside>
    );
};
