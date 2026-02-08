import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_BASE_URL } from "@/configs/api-base-url";
import { cn } from "@/lib/utils";
import { Loader2, MoreVertical, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getMyGroups } from "../application/queries/get-my-groups-query";
import { Group } from "../interfaces/group";

interface MyGroupListProps {
    onSelect?: (group: Group) => void;
}

export default function MyGroupList({ onSelect }: MyGroupListProps) {
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

    const fetchGroups = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getMyGroups();
            if (res.success === true && res.data) {
                setGroups(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch groups:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const handleGroupClick = (group: Group) => {
        setSelectedGroupId(group.id);
        if (onSelect) {
            onSelect(group);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header Section consistent with Chat View */}
            <div className="flex items-center gap-2 px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" /> My Groups
            </div>

            <div className="space-y-1">
                {/* Loading State */}
                {isLoading && groups.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin mb-2" />
                        <span className="text-[10px] uppercase tracking-tighter">Syncing groups...</span>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && groups.length === 0 && (
                    <div className="px-3 py-10 text-center flex flex-col items-center justify-center gap-2">
                        <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-full">
                            <Users className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">No groups found.</p>
                    </div>
                )}

                {/* List Content */}
                {groups.map((group) => {
                    const isSelected = selectedGroupId === group.id;

                    return (
                        <div
                            key={group.id}
                            onClick={() => handleGroupClick(group)}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border border-transparent group relative",
                                isSelected
                                    ? "bg-indigo-600 shadow-lg shadow-indigo-500/30"
                                    : "hover:bg-slate-100 dark:hover:bg-white/5",
                            )}
                        >
                            <Avatar className="w-12 h-12 border-2 border-transparent group-hover:border-indigo-500/20 transition-all">
                                <AvatarImage
                                    src={group.iconUrl ? `${API_BASE_URL}/api/public/${group.iconUrl}` : ""}
                                    className="object-cover"
                                    alt={group.name}
                                    crossOrigin="anonymous"
                                />
                                <AvatarFallback
                                    className={cn(
                                        "font-bold",
                                        isSelected
                                            ? "bg-indigo-500 text-white"
                                            : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
                                    )}
                                >
                                    {group.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3
                                        className={cn(
                                            "font-semibold text-sm truncate flex items-center gap-2",
                                            isSelected ? "text-white" : "text-slate-800 dark:text-slate-100",
                                        )}
                                    >
                                        {group.name}
                                        {!isSelected && (
                                            <span className="text-[9px] px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-sm text-indigo-500 dark:text-indigo-400 font-medium">
                                                Group
                                            </span>
                                        )}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-1">
                                    <p
                                        className={cn(
                                            "text-xs truncate flex-1 leading-tight",
                                            isSelected ? "text-indigo-100" : "text-slate-500 dark:text-slate-400",
                                        )}
                                    >
                                        {group.description || "No description provided."}
                                    </p>
                                </div>
                            </div>

                            {/* Action Button (Visible on hover if not selected) */}
                            {!isSelected && (
                                <button className="absolute right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-slate-400">
                                    <MoreVertical className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
