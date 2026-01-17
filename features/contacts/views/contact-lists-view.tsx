"use client";

import SearchInput from "@/components/search-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CONTACTS } from "@/constants/contacts";
import { cn } from "@/lib/utils";
import { ArrowLeft, UserPlus, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { NewContactModal } from "../components/new-contact-modal";
import { NewGroupModal } from "../components/new-group-modal";

interface ContactListsViewProps {
    isAddModalOpen: boolean;
    setIsAddModalOpen: (value: boolean) => void;
}

export default function ContactListsView({ isAddModalOpen, setIsAddModalOpen }: ContactListsViewProps) {
    const [isContactModalOpen, setContactModalOpen] = useState(false);
    const [isGroupModalOpen, setGroupModalOpen] = useState(false);

    const groupedContacts = useMemo(() => {
        const groups: Record<string, typeof CONTACTS> = {};
        const sorted = [...CONTACTS].sort((a, b) => a.name.localeCompare(b.name));

        sorted.forEach((contact) => {
            const letter = contact.name.charAt(0).toUpperCase();
            if (!groups[letter]) groups[letter] = [];
            groups[letter].push(contact);
        });

        return groups;
    }, []);

    const sortedLetters = Object.keys(groupedContacts).sort();

    return (
        <>
            <div
                className={cn(
                    "absolute inset-0 z-30 bg-white dark:bg-[#0f1115] transition-transform duration-300 ease-in-out flex flex-col",
                    isAddModalOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                {/* Drawer Header */}
                <div className="p-4 flex items-end pb-0 shrink-0 shadow-md">
                    <div className="flex items-center gap-3 text-slate-800 dark:text-white mb-4">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-md font-bold">New Chat</h2>
                    </div>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
                    {/* Search in Drawer */}
                    <div className="pt-4">
                        <SearchInput />
                    </div>

                    {/* Main Actions */}
                    <div className="space-y-4 mb-6 mt-4">
                        {/* Tombol New Group - Memicu Modal Group */}
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

                        {/* Tombol New Contact - Memicu Modal Contact */}
                        <button
                            onClick={() => setContactModalOpen(true)}
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

                    {/* Contact List Grouped */}
                    <div className="pb-8">
                        {sortedLetters.map((letter) => (
                            <div key={letter} className="mb-2">
                                <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-sm px-5 py-2 text-xs font-bold text-indigo-500 dark:text-indigo-400 border-b border-indigo-50 dark:border-white/5 mb-2">
                                    {letter}
                                </div>

                                <div className="px-4 space-y-4">
                                    {groupedContacts[letter].map((contact) => (
                                        <div key={contact.id} className="flex items-center gap-4 cursor-pointer group">
                                            {/* Update ke komponen Avatar shadcn agar konsisten */}
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage src={contact.avatar} />
                                                <AvatarFallback>{contact.name[0]}</AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 border-b border-slate-100 dark:border-white/5 pb-3 group-last:border-0">
                                                <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                                                    {contact.name}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {contact.about}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Render Modals */}
            <NewContactModal isOpen={isContactModalOpen} onClose={setContactModalOpen} />

            <NewGroupModal isOpen={isGroupModalOpen} onClose={setGroupModalOpen} />
        </>
    );
}
