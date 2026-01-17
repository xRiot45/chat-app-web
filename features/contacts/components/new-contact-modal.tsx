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
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, UserPlus, XCircle } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createContactAction } from "../actions/create-contact-action";
import { CreateContactSchema, createContactSchema } from "../schemas/create-contact-schema";
import { ActionState } from "../types";

interface NewContactModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
}

type SearchStatus = "idle" | "searching" | "found" | "not-found" | "error";

const initialState: ActionState = {
    status: "idle",
    message: "",
};

export function NewContactModal({ isOpen, onClose }: NewContactModalProps) {
    const [state, formAction, isPending] = useActionState(createContactAction, initialState);

    const form = useForm<z.infer<typeof createContactSchema>>({
        resolver: zodResolver(createContactSchema),
        defaultValues: {
            contactUserId: "",
            alias: "",
        },
    });

    const [usernameQuery, setUsernameQuery] = useState<string>("");
    const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");
    const [searchMessage, setSearchMessage] = useState<string>("");

    useEffect(() => {
        if (!isOpen) {
            form.reset();
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUsernameQuery("");
            setSearchStatus("idle");
            setSearchMessage("");
        }
    }, [isOpen, form]);

    useEffect(() => {
        if (state.status === "success" && isOpen) {
            toast.success("Kontak Ditambahkan", {
                description: state.message || "User berhasil ditambahkan.",
            });
            onClose(false);
        } else if (state.status === "error" && isOpen) {
            toast.error("Gagal Menambahkan", {
                description: state.message || "Terjadi kesalahan.",
            });

            if (state.errors) {
                if (state.errors.alias) {
                    form.setError("alias", { message: state.errors.alias[0] });
                }
                if (state.errors.contactUserId) {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setSearchStatus("error");
                    setSearchMessage(state.errors.contactUserId[0]);
                }
            }
        }
    }, [state, onClose, isOpen, form]);

    useEffect(() => {
        if (!usernameQuery.trim()) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSearchStatus("idle");
            setSearchMessage("");
            form.setValue("contactUserId", "");
            return;
        }

        setSearchStatus("searching");
        form.setValue("contactUserId", "");

        const timer = setTimeout(async () => {
            try {
                const formData = new FormData();
                formData.append("query", usernameQuery);

                const response = await searchUsersAction({}, formData);

                if (response.error) {
                    setSearchStatus("error");
                    setSearchMessage(response.message || "Error check.");
                } else if (response.data && response.data.length > 0) {
                    setSearchStatus("found");
                    setSearchMessage("Username exists");
                    form.setValue("contactUserId", response.data[0].id, { shouldValidate: true });
                } else {
                    setSearchStatus("not-found");
                    setSearchMessage("Username not registered");
                }
            } catch (error) {
                console.error(error);
                setSearchStatus("error");
                setSearchMessage("Connection failed.");
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [usernameQuery, form]);

    const onSubmit = (values: CreateContactSchema) => {
        startTransition(() => {
            const formData = new FormData();
            formData.append("contactUserId", values.contactUserId);
            if (values.alias) formData.append("alias", values.alias);

            formAction(formData);
        });
    };

    const isSubmitDisabled = isPending || searchStatus !== "found" || !form.getValues("contactUserId");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl bg-white dark:bg-[#181a20] border-slate-200 dark:border-white/10">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <DialogTitle className="text-xl">Add New Contact</DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Enter the Username to add them to your contacts list.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="username-search" className="text-slate-700 dark:text-slate-300">
                                Username
                            </Label>
                            <Input
                                id="username-search"
                                placeholder="e.g. johndoe"
                                className={`bg-slate-50 dark:bg-black/20 py-6 rounded-lg border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500 ${
                                    searchStatus === "found"
                                        ? "border-green-500 focus-visible:ring-green-500"
                                        : searchStatus === "not-found"
                                          ? "border-red-500 focus-visible:ring-red-500"
                                          : ""
                                }`}
                                value={usernameQuery}
                                onChange={(e) => setUsernameQuery(e.target.value)}
                                autoComplete="off"
                                disabled={isPending}
                            />

                            <div className="h-6 text-sm">
                                {searchStatus === "searching" && (
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Checking...
                                    </div>
                                )}
                                {searchStatus === "found" && (
                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 animate-in fade-in slide-in-from-top-1">
                                        <CheckCircle2 className="h-4 w-4" /> {searchMessage}
                                    </div>
                                )}
                                {searchStatus === "not-found" && (
                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1">
                                        <XCircle className="h-4 w-4" /> {searchMessage}
                                    </div>
                                )}
                                {searchStatus === "error" && (
                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1">
                                        <AlertCircle className="h-4 w-4" /> {searchMessage}
                                    </div>
                                )}
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="alias"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 dark:text-slate-300">
                                        Alias (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g. My Best Friend"
                                            className="bg-slate-50 dark:bg-black/20 py-6 rounded-lg border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactUserId"
                            render={({ field }) => <input type="hidden" {...field} />}
                        />
                        <FormMessage className="text-red-500" />

                        {state.status === "error" && !state.errors && (
                            <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2 animate-in fade-in">
                                <AlertCircle className="w-4 h-4" />
                                {state.message}
                            </div>
                        )}

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onClose(false)}
                                className="hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
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
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    "Add Contact"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
