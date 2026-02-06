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
import { Camera } from "lucide-react";

interface NewGroupModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
}

export function NewGroupModal({ isOpen, onClose }: NewGroupModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl bg-white dark:bg-[#181a20] border-slate-200 dark:border-white/10 p-0 overflow-hidden gap-0">
                {/* --- HEADER --- */}
                <DialogHeader className="p-6 pb-4 ">
                    <DialogTitle className="text-xl flex items-center gap-2">Create New Group</DialogTitle>
                    <DialogDescription>Create a space for your team, friends, or community.</DialogDescription>
                </DialogHeader>

                {/* --- MAIN CONTENT (FORM) --- */}
                <div className="p-6 space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex justify-center">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center transition-colors group-hover:border-indigo-500">
                                <Camera className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-white font-medium">Upload</span>
                            </div>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="group-name">Group Name</Label>
                            <Input
                                id="group-name"
                                placeholder="e.g. Weekend Plan"
                                className="bg-slate-50 dark:bg-black/20 py-5 border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input
                                id="description"
                                placeholder="What is this group about?"
                                className="bg-slate-50 dark:bg-black/20 py-5 border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* --- FOOTER --- */}
                <DialogFooter className="p-6 pt-4  sm:justify-end">
                    <Button variant="ghost" onClick={() => onClose(false)}>
                        Cancel
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Create Group</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
