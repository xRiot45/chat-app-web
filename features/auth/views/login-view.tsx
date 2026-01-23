"use client";

import { CompanyLogo } from "@/components/company-logo";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/providers/theme-provider";
import { initialActionState } from "@/types/action-state";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Eye, EyeOff, HelpCircle, Loader2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginAction } from "../application/actions/login-action";
import { LoginInput, loginSchema } from "../schemas/login-schema";

export default function LoginView() {
    const router = useRouter();
    const { isDarkMode } = useThemeContext();
    const [showPassword, setShowPassword] = useState(false);
    const [state, formAction, isPending] = useActionState(loginAction, initialActionState);

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        if (state.status === "success") {
            toast.success("Login Berhasil! Selamat datang kembali.");
            router.push("/");
        }
    }, [state, form, router]);

    const onSubmit = (data: LoginInput) => {
        startTransition(() => {
            const formData = new FormData();
            formData.append("email", data.email);
            formData.append("password", data.password);

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
            {/* Left Side */}
            <div className="hidden lg:flex w-[60%] p-6 relative flex-col justify-center">
                <div className="w-full h-full rounded-[2.5rem] bg-[#111318] relative overflow-hidden border border-white/5 shadow-2xl flex flex-col p-12 justify-between">
                    <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

                    <div className="relative z-10 max-w-xl space-y-6">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <MessageCircle className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-white">NexusChat</span>
                        </div>
                        <h1 className="text-5xl font-bold leading-[1.1] text-white tracking-tight">
                            Experience communication <br /> without the{" "}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
                                noise.
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                            The all-in-one workspace for teams who want to move fast.
                        </p>
                    </div>

                    <div className="relative z-10 mt-12 w-full max-w-2xl self-center transform -rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                                    P
                                </div>
                                <div className="h-2 w-24 bg-white/20 rounded"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-8 w-3/4 bg-white/10 rounded-r-xl rounded-bl-xl"></div>
                                <div className="h-8 w-1/2 bg-indigo-500/20 rounded-l-xl rounded-br-xl ml-auto"></div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-2 mt-8">
                        <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                        <p className="text-sm text-slate-400 font-medium">Trusted by 4,000+ teams worldwide</p>
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-white dark:bg-[#0a0a0c]">
                <div className="w-full max-w-100 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="lg:hidden flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl dark:text-white">NexusChat</span>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Welcome back
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold text-sm ml-1">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="name@company.com"
                                                className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 h-12 rounded-xl pl-4"
                                            />
                                        </FormControl>
                                        <FormMessage className="ml-1 text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <div className="flex justify-between items-center ml-1">
                                            <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                                                Password
                                            </FormLabel>
                                            <Link
                                                href="#"
                                                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 h-12 rounded-xl pl-4 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 p-1"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="w-4 h-4" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="ml-1 text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />

                            {/* Global Alert tetap ada sebagai backup */}
                            {state.status === "error" && !state.errors && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                    <HelpCircle className="w-4 h-4" />
                                    <span>{state.message}</span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-12 text-base font-semibold shadow-xl shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                                    </>
                                ) : (
                                    "Sign In to Workspace"
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/auth/register"
                                className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
                            >
                                Create a free account
                            </Link>
                        </p>
                    </div>

                    <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex justify-between px-2 opacity-70">
                        <CompanyLogo name="Acme Corp" />
                        <CompanyLogo name="Globex" />
                        <CompanyLogo name="Soylent" />
                    </div>
                </div>

                <div className="absolute bottom-6 text-xs text-slate-400 hidden lg:block">
                    © 2024 NexusChat Inc. •{" "}
                    <Link href="#" className="hover:text-slate-300">
                        Privacy
                    </Link>{" "}
                    •{" "}
                    <Link href="#" className="hover:text-slate-300">
                        Terms
                    </Link>
                </div>
            </div>
        </div>
    );
}
