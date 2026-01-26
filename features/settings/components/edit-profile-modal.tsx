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
import { initialActionState } from "@/types/action-state";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, User as UserIcon } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateProfileAction } from "../application/actions/update-profile-action";
import { updateProfileSchema, UpdateProfileValues } from "../schemas/update-profile-schema";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

export default function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
    const [state, formAction, isPending] = useActionState(updateProfileAction, initialActionState);

    const [previewImage, setPreviewImage] = useState<string | null>(user?.avatarUrl || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const form = useForm<UpdateProfileValues>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            username: "",
            fullName: "",
            bio: "",
        },
    });

    useEffect(() => {
        if (isOpen && user) {
            form.reset({
                username: user.username || "",
                fullName: user.fullName || "",
                bio: user.bio || "",
            });
            setPreviewImage(user.avatarUrl || null);
            setSelectedFile(null);
        }
    }, [isOpen, user, form]);

    useEffect(() => {
        if (state.status === "success") {
            onClose();
            toast.success(state.message);
        } else if (state.status === "error") {
            if (state.errors) {
                if (state.errors.username) {
                    form.setError("username", { message: state.errors.username[0] });
                }
            } else {
                if (state.message.toLowerCase().includes("username")) {
                    form.setError("username", { message: state.message });
                } else {
                    toast.error(state.message);
                    console.error(state.message);
                }
            }
        }
    }, [state, onClose, form]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = (values: UpdateProfileValues) => {
        startTransition(() => {
            const formData = new FormData();
            formData.append("username", values.username);
            formData.append("fullName", values.fullName);
            if (values.bio) formData.append("bio", values.bio);

            if (selectedFile) {
                formData.append("avatar", selectedFile);
            }

            formAction(formData);
        });
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

                {/* Form Container */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Global Error Message (Optional) */}
                        {state.status === "error" && !state.errors && !state.message.includes("username") && (
                            <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm font-medium">
                                {state.message}
                            </div>
                        )}

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
                                    accept="image/png, image/jpeg, image/webp"
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
                                                disabled={isPending}
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
                                                placeholder="thomas.alberto"
                                                className="bg-slate-50 dark:bg-white/5 border-none focus-visible:ring-indigo-500 rounded-md py-5"
                                                disabled={isPending}
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
                                                disabled={isPending}
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
                                disabled={isPending}
                                className="rounded-md hover:bg-slate-100 dark:hover:bg-white/5 py-5 cursor-pointer"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="bg-linear-to-tr from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity rounded-md cursor-pointer text-white py-5 min-w-35"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Simpan Perubahan"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
