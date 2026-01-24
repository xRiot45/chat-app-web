"use client";

import SearchInput from "@/components/search-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ArrowLeft, Loader2, MoreVertical, Pencil, RefreshCw, Send, Trash, UserPlus, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { deleteContactAction } from "../applications/actions/delete-contact-action";
import { getContacts } from "../applications/queries/get-contact-query";
import { DeleteContactAlert } from "../components/delete-contact-alert";
import { NewContactModal } from "../components/new-contact-modal";
import { NewGroupModal } from "../components/new-group-modal";
import { Contact } from "../interfaces/contact";

interface ContactListsViewProps {
    isAddModalOpen: boolean;
    setIsAddModalOpen: (open: boolean) => void;
    onStartChat: (contact: Contact) => void;
}

export default function ContactListsView({ isAddModalOpen, setIsAddModalOpen, onStartChat }: ContactListsViewProps) {
    const [isContactModalOpen, setContactModalOpen] = useState<boolean>(false);
    const [isGroupModalOpen, setGroupModalOpen] = useState<boolean>(false);

    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const [contactModalKey, setContactModalKey] = useState<number>(0);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

    const fetchContacts = useCallback(async () => {
        setIsLoading(true);
        await getContacts().then((res) => {
            if (res.data) {
                setContacts(res.data);
            }
            setIsLoading(false);
        });
    }, []);

    const handleCloseContactModal = useCallback(
        (open: boolean) => {
            setContactModalOpen(open);
            if (!open) {
                setSelectedContact(null);
                fetchContacts();
            }
        },
        [fetchContacts],
    );

    const handleOpenNewContactModal = () => {
        setSelectedContact(null);
        setContactModalKey((prev) => prev + 1);
        setContactModalOpen(true);
    };

    const handleEditContact = (contact: Contact) => {
        setSelectedContact(contact);
        setContactModalKey((prev) => prev + 1);
        setContactModalOpen(true);
    };

    const handleOpenDeleteAlert = (id: string) => {
        setDeleteId(id);
        setDeleteAlertOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            const result = await deleteContactAction(deleteId);

            if (result.status === "success") {
                toast.success("Successfully", {
                    description: result.message,
                });
                setDeleteAlertOpen(false);
                setDeleteId(null);
                fetchContacts();
            } else {
                toast.error("Gagal", {
                    description: result.message,
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Error", {
                description: "Gagal menghubungi server",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredContacts = useMemo(() => {
        if (!debouncedSearchQuery) return contacts;

        const lowerQuery = debouncedSearchQuery.toLowerCase();
        return contacts.filter((c) => {
            if (c.alias?.toLowerCase().includes(lowerQuery)) return true;
            if (c.contactUser.fullName?.toLowerCase().includes(lowerQuery)) return true;
            if (c.contactUser.username?.toLowerCase().includes(lowerQuery)) return true;

            return false;
        });
    }, [contacts, debouncedSearchQuery]);

    const groupedContacts = useMemo(() => {
        const groups: Record<string, Contact[]> = {};
        const getDisplayName = (c: Contact) => c.alias || c.contactUser.fullName || c.contactUser.username;

        const sorted = [...filteredContacts].sort((a, b) => {
            return getDisplayName(a).localeCompare(getDisplayName(b));
        });

        sorted.forEach((contact) => {
            const displayName = getDisplayName(contact);
            const letter = (displayName[0] || "?").toUpperCase();

            if (!groups[letter]) groups[letter] = [];
            groups[letter].push(contact);
        });

        return groups;
    }, [filteredContacts]);

    const sortedLetters = Object.keys(groupedContacts).sort();

    useEffect(() => {
        if (isAddModalOpen) {
            fetchContacts();
        }
    }, [isAddModalOpen, fetchContacts]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [searchQuery]);

    return (
        <>
            <div
                className={cn(
                    "absolute inset-0 z-30 bg-white dark:bg-[#0f1115] transition-transform duration-300 ease-in-out flex flex-col",
                    isAddModalOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                {/* Header */}
                <div className="p-4 flex items-end pb-0 shrink-0 shadow-md">
                    <div className="flex items-center gap-3 text-slate-800 dark:text-white mb-4 w-full">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-md font-bold flex-1">New Chat</h2>

                        <button
                            onClick={fetchContacts}
                            disabled={isLoading}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
                    <div className="pt-4">
                        <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search contact" />
                    </div>

                    {/* Actions Buttons */}
                    <div className="space-y-4 mb-6 mt-4">
                        <button
                            onClick={() => setGroupModalOpen(true)}
                            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group"
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-300 group-hover:scale-110 transition-transform">
                                <Users className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col cursor-pointer">
                                <span className="font-semibold text-slate-800 text-sm dark:text-slate-200">
                                    New Group
                                </span>
                                <p className="text-xs text-slate-500">Create a new group with multiple people</p>
                            </div>
                        </button>

                        <button
                            onClick={handleOpenNewContactModal}
                            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group"
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-300 group-hover:scale-110 transition-transform">
                                <UserPlus className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col cursor-pointer">
                                <span className="font-semibold text-slate-800 text-sm dark:text-slate-200">
                                    New Contact
                                </span>
                                <p className="text-xs text-slate-500">Create a new contact to start a conversation</p>
                            </div>
                        </button>
                    </div>

                    {/* Contact List */}
                    <div className="pb-8">
                        {isLoading && contacts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                <span className="text-xs">Syncing contacts...</span>
                            </div>
                        ) : contacts.length === 0 ? (
                            <div className="text-center py-10 text-slate-500 text-sm">
                                <p>No contacts found.</p>
                                <p className="text-xs mt-1">Add a new contact to start chatting.</p>
                            </div>
                        ) : (
                            sortedLetters.map((letter) => (
                                <div key={letter} className="mb-2">
                                    <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-sm px-5 py-2 text-xs font-bold text-indigo-500 dark:text-indigo-400 border-b border-indigo-50 dark:border-white/5 mb-2">
                                        {letter}
                                    </div>

                                    <div className="px-4 space-y-4 mt-4">
                                        {groupedContacts[letter].map((contact) => (
                                            <div
                                                key={contact.id}
                                                className="flex gap-4 cursor-pointer group items-center relative pr-8"
                                            >
                                                <Avatar className="w-10 h-10 shrink-0">
                                                    <AvatarImage src={contact.contactUser.avatarUrl || ""} />
                                                    <AvatarFallback>
                                                        {contact.contactUser.username.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 border-b border-slate-100 dark:border-white/5 pb-3 group-last:border-0 min-w-0">
                                                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">
                                                        {contact.alias ||
                                                            contact.contactUser.fullName ||
                                                            contact.contactUser.username}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                                        {contact.contactUser.bio ?? "Hi there! I'm using NexusChat."}
                                                    </p>
                                                </div>

                                                {/* Dropdown Menu Action */}
                                                <div
                                                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-62 bg-white dark:bg-[#181a20] border-slate-200 dark:border-white/10"
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onStartChat(contact);
                                                                    setIsAddModalOpen(false);
                                                                }}
                                                                className="cursor-pointer focus:bg-slate-100 dark:focus:bg-white/5 p-4"
                                                            >
                                                                <Send className="w-4 h-4 mr-2" />
                                                                Start Message
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleEditContact(contact)}
                                                                className="cursor-pointer focus:bg-slate-100 dark:focus:bg-white/5 p-4"
                                                            >
                                                                <Pencil className="w-4 h-4 mr-2" />
                                                                Edit Contact
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleOpenDeleteAlert(contact.id)}
                                                                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10 cursor-pointer p-4"
                                                            >
                                                                <Trash className="w-4 h-4 mr-2" />
                                                                Delete Contact
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Components */}
            <NewContactModal
                key={contactModalKey}
                isOpen={isContactModalOpen}
                onClose={handleCloseContactModal}
                selectedContact={selectedContact}
            />

            <NewGroupModal isOpen={isGroupModalOpen} onClose={setGroupModalOpen} />

            <DeleteContactAlert
                isOpen={isDeleteAlertOpen}
                onClose={setDeleteAlertOpen}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />
        </>
    );
}
