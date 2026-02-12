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
import { cn } from "@/lib/utils";
import { AlertTriangle, Loader2, LogOut, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface GroupDangerZoneProps {
    groupName: string;
    isAdminOrOwner: boolean;
    onLeaveGroup: () => Promise<void>;
    onRemoveGroup: () => Promise<void>;
}

export const GroupDangerZone: React.FC<GroupDangerZoneProps> = ({
    groupName,
    isAdminOrOwner,
    onLeaveGroup,
    onRemoveGroup,
}) => {
    const [isLeaveOpen, setIsLeaveOpen] = useState<boolean>(false);
    const [isRemoveOpen, setIsRemoveOpen] = useState<boolean>(false);
    const [isPending, setIsPending] = useState<boolean>(false);

    const handleLeaveConfirm = async () => {
        setIsPending(true);
        try {
            await onLeaveGroup();
        } finally {
            setIsPending(false);
            setIsLeaveOpen(false);
        }
    };

    const handleRemoveConfirm = async () => {
        setIsPending(true);
        try {
            await onRemoveGroup();
        } finally {
            setIsPending(false);
            setIsRemoveOpen(false);
        }
    };

    return (
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 pb-6 space-y-4">
            <div className="flex items-center gap-2 px-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Danger Zone</span>
            </div>

            <div className="space-y-2">
                {/* --- REMOVE GROUP BUTTON (Only for Admin/Owner) --- */}
                {isAdminOrOwner && (
                    <button
                        type="button"
                        onClick={() => setIsRemoveOpen(true)}
                        className={cn(
                            "w-full py-3 px-4 rounded-xl flex items-center gap-3 transition-all",
                            "text-red-600 bg-transparent border border-red-200 dark:border-red-900/30",
                            "hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-all font-bold text-sm",
                        )}
                    >
                        <Trash2 className="w-4.5 h-4.5" />
                        <span>Delete Group</span>
                    </button>
                )}

                {/* --- LEAVE GROUP BUTTON --- */}
                <button
                    type="button"
                    onClick={() => setIsLeaveOpen(true)}
                    className={cn(
                        "w-full py-3 px-4 rounded-xl flex items-center gap-3 transition-all",
                        "text-red-500 bg-red-50 dark:bg-red-500/10 font-bold text-sm",
                        "hover:bg-red-100 dark:hover:bg-red-500/20 border border-transparent hover:border-red-200 dark:hover:border-red-500/30",
                    )}
                >
                    <LogOut className="w-4.5 h-4.5" />
                    <span>Leave {groupName}</span>
                </button>
            </div>

            {/* --- ALERT DIALOG: LEAVE GROUP --- */}
            <AlertDialog open={isLeaveOpen} onOpenChange={setIsLeaveOpen}>
                <AlertDialogContent className="rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1115]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <LogOut className="w-5 h-5 text-red-500" />
                            Leave Group?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Are you sure you want to leave{" "}
                            <span className="font-bold text-slate-900 dark:text-white">{groupName}</span>? You will no
                            longer be able to send or receive messages in this group.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 gap-3">
                        <AlertDialogCancel disabled={isPending} className="rounded-lg">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleLeaveConfirm();
                            }}
                            disabled={isPending}
                            className="bg-red-500 hover:bg-red-700 text-white rounded-lg font-bold px-6 cursor-pointer"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Leave Group"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* --- ALERT DIALOG: DELETE GROUP --- */}
            <AlertDialog open={isRemoveOpen} onOpenChange={setIsRemoveOpen}>
                <AlertDialogContent className="rounded-2xl border-red-200 dark:border-red-900/30 bg-white dark:bg-[#0f1115]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-bold text-red-600 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" />
                            Delete Group Permanently?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            This action <span className="text-red-600 font-bold">CANNOT</span> be undone. All messages,
                            media, and data for{" "}
                            <span className="font-bold text-slate-900 dark:text-white">{groupName}</span> will be
                            permanently deleted for everyone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 gap-3">
                        <AlertDialogCancel disabled={isPending} className="rounded-lg">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleRemoveConfirm();
                            }}
                            disabled={isPending}
                            className="bg-red-600 hover:bg-red-800 text-white rounded-lg font-bold px-6 cursor-pointer"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Group"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <p className="px-4 text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed italic text-center">
                Action items here are destructive and permanent. Please proceed with caution.
            </p>
        </div>
    );
};
