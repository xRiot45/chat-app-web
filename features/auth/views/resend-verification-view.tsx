"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/providers/theme-provider";
import { initialActionState } from "@/types/action-state";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Loader2, Mail, MessageCircle, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { resendVerificationAction } from "../application/actions/resend-verification-action";
import { ResendVerificationInput, resendVerificationSchema } from "../schemas/resend-verification-schema";

export default function ResendVerificationView() {
    const router = useRouter();
    const { isDarkMode } = useThemeContext();

    const [state, formAction, isPending] = useActionState(resendVerificationAction, initialActionState);
    const form = useForm<ResendVerificationInput>({
        resolver: zodResolver(resendVerificationSchema),
        defaultValues: { email: "" },
    });

    useEffect(() => {
        if (state.status === "error") {
            toast.error("Gagal Mengirim", {
                description: state.message,
            });
            if (state.errors?.email) {
                form.setError("email", {
                    type: "server",
                    message: state.errors.email[0],
                });
            }
        }

        if (state.status === "success") {
            toast.success("Link Terkirim!", {
                description: state.message,
                icon: <CheckCircle2 className="text-emerald-500" />,
            });

            router.push("/auth/verify-email");
        }
    }, [state, form, router]);

    const onSubmit = (data: ResendVerificationInput) => {
        startTransition(() => {
            const formData = new FormData();
            formData.append("email", data.email);
            formAction(formData);
        });
    };

    return (
        <div
            className={cn(
                "min-h-screen w-full flex font-sans selection:bg-indigo-500/30",
                isDarkMode ? "dark bg-[#0a0a0c] text-slate-100" : "bg-slate-50 text-slate-900",
            )}
        >
            {/* --- LEFT SIDE (Visual Bento Concept) --- */}
            <div className="hidden lg:flex w-[60%] p-6 relative flex-col justify-center">
                <div className="w-full h-full rounded-[2.5rem] bg-[#111318] relative overflow-hidden border border-white/5 shadow-2xl flex flex-col p-12 justify-between">
                    {/* Background Gradients */}
                    <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen" />
                    <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />

                    {/* Brand */}
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-white">NexusChat</span>
                    </div>

                    {/* Content Middle */}
                    <div className="relative z-10 max-w-xl">
                        <h1 className="text-5xl font-bold leading-tight text-white tracking-tight mb-6">
                            Missing your <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
                                activation link?
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed max-w-sm">
                            Terkadang email membutuhkan waktu lebih lama. Masukkan email Anda dan kami akan mengirimkan
                            link verifikasi baru segera.
                        </p>
                    </div>

                    {/* Illustration */}
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                <Send className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold">Priority Delivery</p>
                                <p className="text-xs text-slate-400">Link baru akan segera tiba.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE (Form UI) --- */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-white dark:bg-[#0a0a0c]">
                <div className="w-full max-w-105 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="space-y-2">
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-4 group"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Login
                        </Link>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Kirim Ulang Verifikasi
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base">
                            Kami akan mengirimkan link aktivasi baru ke email Anda.
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                                            Alamat Email
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                <Input
                                                    placeholder="nama@perusahaan.com"
                                                    className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500 transition-all"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-12 text-base font-semibold shadow-xl shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all active:scale-95"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Mengirim Link...
                                    </>
                                ) : (
                                    "Kirim Link Verifikasi"
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="pt-6 border-t border-slate-200 dark:border-white/5 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Masih mengalami kendala?{" "}
                            <Link
                                href="#"
                                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                Hubungi Support
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-8 flex items-center gap-2 text-xs text-slate-400">
                    <MessageCircle className="w-3 h-3" />
                    <span>NexusChat Security Protocol v2.4</span>
                </div>
            </div>
        </div>
    );
}
