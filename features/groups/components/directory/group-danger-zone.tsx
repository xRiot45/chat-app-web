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
import { AlertTriangle, Loader2, LogOut } from "lucide-react";
import React, { useState } from "react";

interface GroupDangerZoneProps {
    groupName: string;
    onLeaveGroup: () => Promise<void>;
}

export const GroupDangerZone: React.FC<GroupDangerZoneProps> = ({ groupName, onLeaveGroup }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleLeaveConfirm = async () => {
        setIsPending(true);
        try {
            await onLeaveGroup();
        } finally {
            setIsPending(false);
            setIsConfirmOpen(false);
        }
    };

    return (
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 pb-6 space-y-4">
            <div className="flex items-center gap-2 px-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Danger Zone</span>
            </div>

            <div className="space-y-2">
                {/* Leave Group Button */}
                <button
                    type="button"
                    onClick={() => setIsConfirmOpen(true)}
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

            {/* Alert Dialog UI */}
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent className="rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1115]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <LogOut className="w-5 h-5 text-red-500" />
                            Leave Group?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Are you sure you want to leave{" "}
                            <span className="font-bold text-slate-900 dark:text-white">{groupName}</span>? You will no
                            longer be able to send or receive messages in this group. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 gap-3">
                        <AlertDialogCancel
                            disabled={isPending}
                            className="rounded-lg border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleLeaveConfirm();
                            }}
                            disabled={isPending}
                            className="bg-red-500 hover:bg-red-700 text-white rounded-lg font-bold transition-all px-6 cursor-pointer"
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Leaving...</span>
                                </div>
                            ) : (
                                "Yes, Leave Group"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <p className="px-4 text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed italic text-center">
                Leaving this group will remove you from all current and future conversations in this thread.
            </p>
        </div>
    );
};
