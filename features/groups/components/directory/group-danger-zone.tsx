import { cn } from "@/lib/utils";
import { AlertTriangle, LogOut, ShieldAlert } from "lucide-react";
import React from "react";

interface GroupDangerZoneProps {
    groupName: string;
    onLeaveGroup: () => void;
    onReportGroup: () => void;
}

export const GroupDangerZone: React.FC<GroupDangerZoneProps> = ({ groupName, onLeaveGroup, onReportGroup }) => {
    return (
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 pb-6 space-y-4">
            {/* Section Label */}
            <div className="flex items-center gap-2 px-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Danger Zone</span>
            </div>

            <div className="space-y-2">
                {/* Action: Report Group */}
                <button
                    type="button"
                    onClick={onReportGroup}
                    className={cn(
                        "w-full py-3 px-4 rounded-xl flex items-center gap-3 transition-all",
                        "text-slate-600 dark:text-slate-400 font-medium text-sm",
                        "hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200",
                    )}
                >
                    <ShieldAlert className="w-4.5 h-4.5" />
                    <span>Report Group</span>
                </button>

                {/* Action: Leave Group */}
                <button
                    type="button"
                    onClick={onLeaveGroup}
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

            {/* Hint text */}
            <p className="px-4 text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed italic text-center">
                Leaving this group will remove you from all current and future conversations in this thread.
            </p>
        </div>
    );
};
