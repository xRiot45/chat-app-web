"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CONTACTS } from "@/constants/contacts";
import { Camera, Search } from "lucide-react";
import { useState } from "react";

interface NewGroupModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
}

export function NewGroupModal({ isOpen, onClose }: NewGroupModalProps) {
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

    const toggleMember = (id: number) => {
        setSelectedMembers((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl bg-white dark:bg-[#181a20] border-slate-200 dark:border-white/10 p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-2 bg-slate-50/50 dark:bg-white/5">
                    <DialogTitle className="text-xl flex items-center gap-2">Create New Group</DialogTitle>
                    <DialogDescription>Create a space for your team, friends, or community.</DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="details" className="w-full">
                    <div className="px-6 pt-2">
                        <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-white/5">
                            <TabsTrigger value="details">Group Details</TabsTrigger>
                            <TabsTrigger value="members">Add Members ({selectedMembers.length})</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="p-6">
                        {/* --- TAB 1: DETAILS --- */}
                        <TabsContent value="details" className="mt-0 space-y-6">
                            <div className="flex justify-center">
                                <div className="relative group cursor-pointer">
                                    <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                                        <Camera className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs text-white font-medium">Upload</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Group Name</Label>
                                <Input
                                    placeholder="e.g. Weekend Plan"
                                    className="bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description (Optional)</Label>
                                <Input
                                    placeholder="What is this group about?"
                                    className="bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10"
                                />
                            </div>
                        </TabsContent>

                        {/* --- TAB 2: MEMBERS --- */}
                        <TabsContent value="members" className="mt-0">
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search contacts..."
                                    className="pl-9 bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10"
                                />
                            </div>
                            <ScrollArea className="h-60 pr-4">
                                <div className="space-y-1">
                                    {CONTACTS.map((contact) => {
                                        const isSelected = selectedMembers.includes(contact.id);
                                        return (
                                            <div
                                                key={contact.id}
                                                onClick={() => toggleMember(contact.id)}
                                                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                                                    isSelected
                                                        ? "bg-indigo-50 dark:bg-indigo-500/20"
                                                        : "hover:bg-slate-50 dark:hover:bg-white/5"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarImage src={contact.avatar} />
                                                        <AvatarFallback>{contact.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium dark:text-slate-200">
                                                            {contact.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {contact.about?.slice(0, 30)}...
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                                        isSelected
                                                            ? "bg-indigo-600 border-indigo-600 text-white"
                                                            : "border-slate-300 dark:border-slate-600"
                                                    }`}
                                                >
                                                    {isSelected && <span className="text-[10px]">✓</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </div>

                    <DialogFooter className="p-6 pt-2 bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5">
                        <Button variant="ghost" onClick={() => onClose(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Create Group</Button>
                    </DialogFooter>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
