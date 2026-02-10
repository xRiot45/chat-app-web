import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { API_BASE_URL } from "@/configs/api-base-url";
import { Contact } from "@/features/contacts/interfaces/contact";
import { cn } from "@/lib/utils";
import React from "react";

interface ContactSelectionItemProps {
    contact: Contact;
    isSelected: boolean;
    onToggle: (userId: string) => void;
    disabled?: boolean;
}

export const ContactSelectionItem: React.FC<ContactSelectionItemProps> = ({
    contact,
    isSelected,
    onToggle,
    disabled = false,
}) => {
    const { contactUser: user } = contact;

    return (
        <div
            onClick={() => !disabled && onToggle(user.id)}
            className={cn(
                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none",
                isSelected
                    ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30"
                    : "bg-white dark:bg-white/5 border-transparent hover:border-slate-200 dark:hover:border-white/10",
                disabled && "opacity-50 pointer-events-none",
            )}
        >
            <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggle(user.id)}
                disabled={disabled}
                className="data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
            />

            <Avatar className="w-10 h-10 border border-slate-100 dark:border-white/10">
                <AvatarImage
                    src={user.avatarUrl ? `${API_BASE_URL}/api/public/${user.avatarUrl}` : ""}
                    alt={user.fullName || user.username}
                />
                <AvatarFallback>{user.fullName ? user.fullName.charAt(0).toUpperCase() : "?"}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {user.fullName || user.username}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate lowercase">@{user.username}</p>
            </div>

            {/* Indikator terpilih (Opsional) */}
            {isSelected && <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />}
        </div>
    );
};
