import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Contact } from "@/features/contacts/interfaces/contact";
import { initialActionState } from "@/types/action-state";
import { Check, Loader2, Search, UserPlus } from "lucide-react";
import React, { useActionState, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { inviteMemberToGroupAction } from "../../../application/actions/invite-member-to-group-action";
import { ContactSelectionItem } from "./contact-selection-item";

interface InviteMemberModalProps {
    groupId: string;
    groupName?: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    contacts: Contact[];
    existingMemberIds: Set<string>;
    onSuccess?: () => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
    groupId,
    groupName,
    isOpen,
    onOpenChange,
    contacts,
    existingMemberIds,
    onSuccess,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

    // Server Action Hook
    const [state, formAction, isPending] = useActionState(inviteMemberToGroupAction, initialActionState);

    // Filter logic: Hanya cari user yang belum jadi member
    const filteredContacts = useMemo(() => {
        return contacts.filter((contact) => {
            const user = contact.contactUser;
            if (existingMemberIds.has(user.id)) return false;

            return (
                (user.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (user.username || "").toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    }, [contacts, searchQuery, existingMemberIds]);

    // Cleanup & Feedback Effect
    useEffect(() => {
        if (state?.status === "success") {
            toast.success(state.message || "Members added successfully!");
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedContactIds([]);
            setSearchQuery("");
            onOpenChange(false);
            onSuccess?.();
        } else if (state?.status === "error") {
            toast.error(state.message || "An error occurred.");
        }
    }, [state, onOpenChange, onSuccess]);

    // Handlers
    const toggleSelection = (userId: string) => {
        setSelectedContactIds((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
        );
    };

    const toggleSelectAll = () => {
        const visibleIds = filteredContacts.map((c) => c.contactUser.id);
        const allSelected = visibleIds.every((id) => selectedContactIds.includes(id));

        if (allSelected) {
            setSelectedContactIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
        } else {
            setSelectedContactIds((prev) => [...new Set([...prev, ...visibleIds])]);
        }
    };

    const handleSubmit = () => {
        if (selectedContactIds.length === 0) return;

        const formData = new FormData();
        formData.append("groupId", groupId);
        selectedContactIds.forEach((id) => formData.append("memberIds", id));

        formAction(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-5xl bg-white dark:bg-[#0f1115] border-slate-200 dark:border-white/10 p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-indigo-500" />
                        Add Members to {groupName || "Group"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Search and select people from your contacts to join this conversation.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    {/* Search & Bulk Action Area */}
                    <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search name or username..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500"
                                disabled={isPending}
                            />
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto px-1">
                            <span className="text-xs text-slate-500 font-medium">
                                <b className="text-indigo-500">{selectedContactIds.length}</b> selected
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleSelectAll}
                                disabled={isPending || filteredContacts.length === 0}
                                className="text-xs text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                            >
                                Select All Visible
                            </Button>
                        </div>
                    </div>

                    {/* Contacts Grid */}
                    <div className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-slate-50/30 dark:bg-white/2">
                        <ScrollArea className="h-100">
                            <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                {filteredContacts.length > 0 ? (
                                    filteredContacts.map((contact) => (
                                        <ContactSelectionItem
                                            key={contact.id}
                                            contact={contact}
                                            isSelected={selectedContactIds.includes(contact.contactUser.id)}
                                            onToggle={toggleSelection}
                                            disabled={isPending}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                                        <div className="p-4 rounded-full bg-slate-100 dark:bg-white/5">
                                            <Search className="w-8 h-8 opacity-20" />
                                        </div>
                                        <p className="text-sm font-medium">No eligible contacts found</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-slate-50/50 dark:bg-white/2 border-t border-slate-200 dark:border-white/10">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                        className="rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 min-w-40 rounded-xl shadow-lg shadow-indigo-500/20"
                        disabled={selectedContactIds.length === 0 || isPending}
                        onClick={handleSubmit}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Add {selectedContactIds.length > 0 ? `${selectedContactIds.length} Members` : "Members"}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
