/* eslint-disable react-hooks/set-state-in-effect */
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
import { initialActionState } from "@/types/action-state";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createGroupAction } from "../application/actions/create-group-action";
import { createGroupSchema, CreateGroupValues } from "../schemas/create-group-schema";

interface NewGroupModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
}

export function NewGroupModal({ isOpen, onClose }: NewGroupModalProps) {
    // 1. Logic State & Form
    const [state, formAction, isPending] = useActionState(createGroupAction, initialActionState);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Ref untuk input file agar bisa di-trigger lewat div avatar
    const fileInputRef = useRef<HTMLInputElement>(null);
    const hasnotified = useRef(false);

    const form = useForm<CreateGroupValues>({
        resolver: zodResolver(createGroupSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    // 2. Reset form saat modal ditutup atau dibuka ulang
    useEffect(() => {
        if (!isOpen) {
            form.reset();
            setPreviewImage(null);
            setSelectedFile(null);
        }
    }, [isOpen, form]);

    // 3. Handle Response Server Action
    useEffect(() => {
        // Jika modal tertutup, reset tracker notification
        if (!isOpen) {
            hasnotified.current = false;
            return;
        }

        if (state.status === "success" && !hasnotified.current) {
            toast.success(state.message);
            hasnotified.current = true; // Tandai agar tidak muncul lagi

            // Berikan delay kecil sebelum menutup modal agar state stabil
            const timer = setTimeout(() => {
                onClose(true);
                hasnotified.current = false;
            }, 100);

            return () => clearTimeout(timer);
        }

        if (state.status === "error") {
            toast.error(state.message);
            hasnotified.current = true;
        }
    }, [state, onClose, isOpen]);

    // 4. Handle Image Upload & Preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    // 5. Submit Handler
    const onSubmit = async (data: CreateGroupValues) => {
        startTransition(() => {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description || "");
            if (selectedFile) {
                formData.append("icon", selectedFile);
            }
            formAction(formData);
        });
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose(false);
            }}
        >
            <DialogContent className="sm:max-w-2xl bg-white dark:bg-[#181a20] border-slate-200 dark:border-white/10 p-0 overflow-hidden gap-0">
                {/* --- HEADER --- */}
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle className="text-xl flex items-center gap-2">Create New Group</DialogTitle>
                    <DialogDescription>Create a space for your team, friends, or community.</DialogDescription>
                </DialogHeader>

                {/* --- FORM START --- */}
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {/* --- MAIN CONTENT --- */}
                    <div className="p-6 space-y-6">
                        {/* Avatar Upload UI */}
                        <div className="flex justify-center">
                            <div onClick={handleAvatarClick} className="relative group cursor-pointer">
                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />

                                <div
                                    className={`w-24 h-24 rounded-full bg-slate-100 dark:bg-white/5 border-2 ${previewImage ? "border-solid border-indigo-500" : "border-dashed border-slate-300 dark:border-slate-600"} flex items-center justify-center transition-colors group-hover:border-indigo-500 overflow-hidden`}
                                >
                                    {previewImage ? (
                                        <Image
                                            width={96}
                                            height={96}
                                            src={previewImage}
                                            alt="Group Preview"
                                            className="w-full h-full object-cover"
                                            crossOrigin="anonymous"
                                        />
                                    ) : (
                                        <Camera className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                    )}
                                </div>

                                {/* Overlay Text */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs text-white font-medium">
                                        {previewImage ? "Change" : "Upload"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="space-y-6">
                            {/* Group Name */}
                            <div className="space-y-2">
                                <Label htmlFor="group-name">Group Name</Label>
                                <Input
                                    id="group-name"
                                    placeholder="e.g. Weekend Plan"
                                    disabled={isPending}
                                    className={`bg-slate-50 dark:bg-black/20 py-5 border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500 ${form.formState.errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    {...form.register("name")}
                                />
                                {form.formState.errors.name && (
                                    <p className="text-xs text-red-500 font-medium">
                                        {form.formState.errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    placeholder="What is this group about?"
                                    disabled={isPending}
                                    className="bg-slate-50 dark:bg-black/20 py-5 border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500"
                                    {...form.register("description")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- FOOTER --- */}
                    <DialogFooter className="p-6 pt-4 sm:justify-end">
                        <Button type="button" variant="ghost" onClick={() => onClose(false)} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-30"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Group"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
