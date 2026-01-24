"use client";

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
import { Label } from "@/components/ui/label";
import { searchUsersAction } from "@/features/users/actions/search-user-action";
import { UserSearchResponse } from "@/features/users/types";
import { ActionState, initialActionState } from "@/types/action-state";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Pencil, UserPlus, XCircle } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { createContactAction } from "../applications/actions/create-contact-action";
import { updateContactAction } from "../applications/actions/update-contact-action";
import { Contact } from "../interfaces/contact";

const formSchema = z.object({
    alias: z.string().max(50, "Alias too long").optional(),
});

interface NewContactModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    selectedContact?: Contact | null;
}

type SearchStatus = "idle" | "searching" | "found" | "not-found" | "error";

export function NewContactModal({ isOpen, onClose, selectedContact }: NewContactModalProps) {
    const isEditMode = !!selectedContact;

    const actionDispatcher = async (
        prevState: ActionState<unknown>,
        formData: FormData,
    ): Promise<ActionState<unknown>> => {
        if (isEditMode && selectedContact) {
            return await updateContactAction(prevState, formData);
        } else {
            return await createContactAction(prevState, formData);
        }
    };

    const [state, formAction, isPending] = useActionState(actionDispatcher, initialActionState);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { alias: "" },
    });

    const [usernameQuery, setUsernameQuery] = useState<string>("");
    const [foundUserId, setFoundUserId] = useState<string>("");
    const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");
    const [searchMessage, setSearchMessage] = useState<string>("");

    useEffect(() => {
        if (!isOpen) return;

        if (isEditMode && selectedContact) {
            form.setValue("alias", selectedContact.alias || "");
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUsernameQuery(selectedContact.contactUser.username);
            setSearchStatus("found");
            setSearchMessage("Editing contact");
        } else {
            form.reset();
            setUsernameQuery("");
            setFoundUserId("");
            setSearchStatus("idle");
            setSearchMessage("");
        }
    }, [isOpen, isEditMode, selectedContact, form]);

    useEffect(() => {
        if (!isOpen) return;
        if (state.status === "success") {
            toast.success(isEditMode ? "Berhasil Diperbarui" : "Berhasil Ditambahkan", {
                description: state.message,
            });
            onClose(false);
        } else if (state.status === "error") {
            toast.error("Gagal", { description: state.message });
            if (state.errors?.alias) {
                form.setError("alias", { message: state.errors.alias[0] });
            }
        }
    }, [state, onClose, isEditMode, form, isOpen]);

    useEffect(() => {
        if (isEditMode) return;
        if (!usernameQuery.trim()) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSearchStatus("idle");
            setSearchMessage("");
            setFoundUserId("");
            return;
        }

        setSearchStatus("searching");
        setFoundUserId("");

        const timer = setTimeout(async () => {
            const formData = new FormData();
            formData.append("query", usernameQuery);

            try {
                const response = (await searchUsersAction({}, formData)) as ActionState<UserSearchResponse[]>;

                if (response.data && response.data.length > 0) {
                    setSearchStatus("found");
                    setSearchMessage("User found");
                    setFoundUserId(response.data[0].id);
                } else {
                    setSearchStatus(response.status === "error" ? "error" : "not-found");
                    setSearchMessage(response.message || "User not found");
                }
            } catch {
                setSearchStatus("error");
                setSearchMessage("Connection error");
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [usernameQuery, isEditMode]);

    const isSubmitDisabled = isPending || (!isEditMode && (!foundUserId || searchStatus !== "found"));

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl bg-white dark:bg-[#181a20] border-slate-200 dark:border-white/10">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                            {isEditMode ? <Pencil className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                        </div>
                        <DialogTitle className="text-xl">{isEditMode ? "Edit Contact" : "Add New Contact"}</DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        {isEditMode ? "Update the alias for this contact." : "Enter the Username to add them."}
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-4 py-4">
                    {/* Hidden Inputs untuk ID */}
                    {isEditMode && selectedContact ? (
                        <input type="hidden" name="id" value={selectedContact.id} />
                    ) : (
                        <input type="hidden" name="contactUserId" value={foundUserId} />
                    )}

                    {/* Username Input (Search / Readonly) */}
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-slate-700 dark:text-slate-300">
                            Username
                        </Label>
                        <Input
                            id="username"
                            value={usernameQuery}
                            onChange={(e) => setUsernameQuery(e.target.value)}
                            disabled={isEditMode || isPending}
                            placeholder="e.g. johndoe"
                            className={`bg-slate-50 dark:bg-black/20 py-6 rounded-lg border-slate-200 dark:border-white/10 ${
                                !isEditMode && searchStatus === "found" ? "border-green-500" : ""
                            }`}
                            autoComplete="off"
                        />

                        {!isEditMode && (
                            <div className="h-6 text-sm">
                                {searchStatus === "searching" && (
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Checking...
                                    </div>
                                )}
                                {searchStatus === "found" && (
                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                        <CheckCircle2 className="h-4 w-4" /> {searchMessage}
                                    </div>
                                )}
                                {(searchStatus === "not-found" || searchStatus === "error") && (
                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                        <XCircle className="h-4 w-4" /> {searchMessage}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Alias Input dengan React Hook Form untuk UI Error */}
                    <Form {...form}>
                        <FormField
                            control={form.control}
                            name="alias"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 dark:text-slate-300">Alias</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            // Name wajib ada agar terbaca oleh FormData
                                            name="alias"
                                            placeholder="e.g. My Best Friend"
                                            className="bg-slate-50 dark:bg-black/20 py-6 rounded-lg border-slate-200 dark:border-white/10"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                    </Form>

                    {/* Global Error Message */}
                    {state.status === "error" && !state.errors && (
                        <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> {state.message}
                        </div>
                    )}

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onClose(false)}
                            className="hover:bg-slate-100 dark:hover:bg-white/5"
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className={`text-white transition-all ${
                                !isSubmitDisabled
                                    ? "bg-indigo-600 hover:bg-indigo-700"
                                    : "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
                            }`}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                    {isEditMode ? "Saving..." : "Adding..."}
                                </>
                            ) : isEditMode ? (
                                "Save Changes"
                            ) : (
                                "Add Contact"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
