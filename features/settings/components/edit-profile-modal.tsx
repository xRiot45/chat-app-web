/* eslint-disable react-hooks/set-state-in-effect */
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/features/users/interfaces";
import { Camera, User as UserIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

export default function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(user?.avatarUrl || null);

    const form = useForm({
        defaultValues: {
            username: user?.username || "",
            fullName: user?.fullName || "",
            bio: user?.bio || "",
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                username: user.username || "",
                fullName: user.fullName || "",
                bio: user.bio || "",
            });
            setPreviewImage(user.avatarUrl || null);
        }
    }, [user, form]);

    const onSubmit = async (values: any) => {
        console.log("Updated Values:", values);
        // Tambahkan logic API Update di sini
        onClose();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl rounded-3xl border-none shadow-2xl dark:bg-[#0f1115]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your profile information so that others know who you are
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* --- AVATAR UPLOAD SECTION --- */}
                        <div className="flex flex-col items-center justify-center space-y-3 py-4">
                            <div className="relative group cursor-pointer">
                                <Avatar className="w-24 h-24 border-4 border-indigo-500/10 group-hover:opacity-80 transition-opacity">
                                    <AvatarImage src={previewImage || ""} className="object-cover" />
                                    <AvatarFallback className="bg-slate-100 dark:bg-white/5">
                                        <UserIcon className="w-10 h-10 text-slate-400" />
                                    </AvatarFallback>
                                </Avatar>
                                <label
                                    htmlFor="avatar-upload"
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <Camera className="text-white w-6 h-6" />
                                </label>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                Klik untuk ganti foto
                            </span>
                        </div>

                        {/* --- FORM FIELDS --- */}
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold uppercase tracking-tight text-slate-500">
                                            Full Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Thomas Alberto"
                                                className="bg-slate-50 dark:bg-white/5 border-none focus-visible:ring-indigo-500 rounded-md py-5"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold uppercase tracking-tight text-slate-500">
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-slate-50 dark:bg-white/5 border-none focus-visible:ring-indigo-500 rounded-md py-5"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold uppercase tracking-tight text-slate-500">
                                            Bio
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us a little about yourself..."
                                                className="bg-slate-50 dark:bg-white/5 border-none focus-visible:ring-indigo-500 rounded-md resize-none h-26 p-3"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={onClose}
                                className="rounded-md hover:bg-slate-100 dark:hover:bg-white/5 py-5 cursor-pointer "
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-linear-to-tr from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity rounded-md cursor-pointer text-white py-5"
                            >
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
