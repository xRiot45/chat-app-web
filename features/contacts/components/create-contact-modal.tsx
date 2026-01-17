"use client";

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
import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";

interface CreateContactModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
}

export function CreateContactModal({ isOpen, onClose }: CreateContactModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulasi API Call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsLoading(false);
        onClose(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl bg-white dark:bg-[#181a20] border-slate-200 dark:border-white/10">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <DialogTitle className="text-xl">Add New Contact</DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Enter the Username to add them to your contacts list.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="userId" className="text-slate-700 dark:text-slate-300">
                            Username
                        </Label>
                        <Input
                            id="userId"
                            placeholder="e.g. @johndoe"
                            className="bg-slate-50 dark:bg-black/20 py-6 rounded-lg border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="alias" className="text-slate-700 dark:text-slate-300">
                            Alias
                        </Label>
                        <Input
                            id="alias"
                            placeholder="e.g. My Best Friend"
                            className="bg-slate-50 dark:bg-black/20 py-6 rounded-lg border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onClose(false)}
                            className="hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                "Add Contact"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
