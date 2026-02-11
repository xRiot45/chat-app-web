/* eslint-disable react-hooks/refs */
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
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/configs/api-base-url";
import { cn } from "@/lib/utils";
import { initialActionState } from "@/types/action-state";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Check, Loader2, Settings2, Users } from "lucide-react";
import Image from "next/image";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createGroupAction } from "../application/actions/create-group-action";
import { updateGroupAction } from "../application/actions/update-group-action";
import { Group } from "../interfaces/group";
import { createGroupSchema, CreateGroupValues } from "../schemas/create-group-schema";

interface NewGroupModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    data: Group | null;
}

export function NewGroupModal({ isOpen, onClose, data }: NewGroupModalProps) {
    const isEditMode = !!data;

    const handleAction = async (prevState: typeof initialActionState, formData: FormData) => {
        if (isEditMode) {
            return updateGroupAction(prevState, data?.id || "", formData);
        } else {
            return createGroupAction(prevState, formData);
        }
    };

    const [state, formAction, isPending] = useActionState(handleAction, initialActionState);

    // 2. States
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const hasNotified = useRef(false);

    // 3. Form Definition
    const form = useForm<CreateGroupValues>({
        resolver: zodResolver(createGroupSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    // 4. Pre-fill & Reset Effect
    useEffect(() => {
        if (isOpen && isEditMode && data) {
            form.reset({
                name: data.name,
                description: data.description || "",
            });
            if (data.iconUrl) {
                setPreviewImage(`${API_BASE_URL}/api/public/${data.iconUrl}`);
            }
        } else if (!isOpen) {
            form.reset({ name: "", description: "" });
            setPreviewImage(null);
            setSelectedFile(null);
            hasNotified.current = false;
        }
    }, [isOpen, isEditMode, data, form]);

    // 5. Action Response Handler
    useEffect(() => {
        if (!isOpen) return;

        if (state.status === "success" && !hasNotified.current) {
            toast.success(state.message);
            hasNotified.current = true;

            const timer = setTimeout(() => {
                onClose(true); // Trigger refresh di parent
            }, 100);
            return () => clearTimeout(timer);
        }

        if (state.status === "error" && !hasNotified.current) {
            toast.error(state.message);
            hasNotified.current = true;
        }
    }, [state, isOpen, onClose]);

    // 6. Handlers
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

    const onSubmit = async (values: CreateGroupValues) => {
        hasNotified.current = false;

        startTransition(() => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description || "");

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
                if (!open && !isPending) onClose(false);
            }}
        >
            <DialogContent className="sm:max-w-2xl bg-white dark:bg-[#181a20] border-slate-200 dark:border-white/10 p-0 overflow-hidden gap-0 shadow-2xl">
                {/* --- HEADER --- */}
                <DialogHeader className="p-6 pb-4 border-b border-slate-100 dark:border-white/5">
                    <DialogTitle className="text-xl flex items-center gap-2">
                        {isEditMode ? (
                            <Settings2 className="w-5 h-5 text-indigo-500" />
                        ) : (
                            <Users className="w-5 h-5 text-indigo-500" />
                        )}
                        {isEditMode ? "Update Group Settings" : "Create New Group"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        {isEditMode
                            ? "Update your group identity, icon, and description."
                            : "Create a space for your team, friends, or community."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="p-6 space-y-8">
                        {/* Avatar Upload UI */}
                        <div className="flex justify-center">
                            <div
                                onClick={() => !isPending && fileInputRef.current?.click()}
                                className="relative group cursor-pointer"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />

                                <div
                                    className={cn(
                                        "w-28 h-28 rounded-full bg-slate-100 dark:bg-white/5 border-2 flex items-center justify-center transition-all group-hover:border-indigo-500 overflow-hidden shadow-inner",
                                        previewImage
                                            ? "border-solid border-indigo-500"
                                            : "border-dashed border-slate-300 dark:border-slate-600",
                                    )}
                                >
                                    {previewImage ? (
                                        <Image
                                            width={112}
                                            height={112}
                                            src={previewImage}
                                            alt="Group Icon"
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <Camera className="w-10 h-10 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                    )}
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                    <span className="text-[10px] text-white font-bold uppercase tracking-wider">
                                        {previewImage ? "Change Icon" : "Upload Icon"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Input Fields */}
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="group-name"
                                    className="text-sm font-bold text-slate-700 dark:text-slate-300"
                                >
                                    Group Name
                                </Label>
                                <Input
                                    id="group-name"
                                    placeholder="e.g. Backend Engineering"
                                    disabled={isPending}
                                    className={cn(
                                        "bg-slate-50 dark:bg-black/20 h-12 border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500 transition-all",
                                        form.formState.errors.name && "border-red-500 focus-visible:ring-red-500",
                                    )}
                                    {...form.register("name")}
                                />
                                {form.formState.errors.name && (
                                    <p className="text-[11px] text-red-500 font-bold uppercase tracking-tight">
                                        {form.formState.errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="description"
                                    className="text-sm font-bold text-slate-700 dark:text-slate-300"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Tell members what this group is about..."
                                    disabled={isPending}
                                    className="bg-slate-50 dark:bg-black/20 min-h-25 border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500 resize-none custom-scrollbar"
                                    {...form.register("description")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- FOOTER --- */}
                    <DialogFooter className="p-6 pt-4 bg-slate-50/50 dark:bg-white/2 border-t border-slate-100 dark:border-white/5 sm:justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onClose(false)}
                            disabled={isPending}
                            className="font-bold rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-40 font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isEditMode ? "Saving Changes..." : "Creating Group..."}
                                </>
                            ) : isEditMode ? (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Save Changes
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
