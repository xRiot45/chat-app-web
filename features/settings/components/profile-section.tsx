"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserStatus } from "@/enums/user-status-enum";
import { getCurrentUser } from "@/features/auth/application/queries/get-current-user-query";
import { User } from "@/features/users/interfaces";
import { useEffect, useState } from "react";
import EditProfileModal from "./edit-profile-modal";

export default function ProfileSection() {
    const [user, setUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        getCurrentUser().then((response) => {
            if (response && response.success) {
                setUser(response.data);
            } else {
                setUser(response);
            }
        });
    }, []);

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl pb-6">
                <div className="relative group">
                    <Avatar className="w-17.5 h-17.5 border-2 border-indigo-500/20 dark:border-indigo-500/40">
                        <AvatarImage
                            src={user?.avatarUrl || ""}
                            alt={user?.fullName || "User"}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-2xl font-bold">
                            {user?.fullName?.charAt(0).toUpperCase() || "?"}
                        </AvatarFallback>
                    </Avatar>
                    {user?.status === UserStatus.ONLINE && (
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#0f1115] rounded-full shadow-sm" />
                    )}
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-xl text-slate-800 dark:text-white leading-tight">
                        {user?.fullName || "Loading..."}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        @{user?.username || "username"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 italic">{user?.email}</p>

                    {/* 2. Tambahkan onClick untuk membuka modal */}
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="text-xs font-semibold text-indigo-500 mt-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            {user?.bio && (
                <div className="px-4 pb-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                        {user?.bio}
                    </p>
                </div>
            )}

            {/* 3. Panggil Modal di sini */}
            <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={user} />
        </div>
    );
}
