"use client";

import { CompanyLogo } from "@/components/company-logo";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/providers/theme-provider";
import { initialActionState } from "@/types/action-state";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowRight,
    Eye,
    EyeOff,
    HelpCircle,
    Loader2,
    Lock,
    Mail,
    MessageCircle,
    ShieldCheck,
    User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { registerAction } from "../application/actions/register-action";
import { RegisterInput, registerSchema } from "../schemas/register-schema";

export default function RegisterView() {
    const router = useRouter();
    const { isDarkMode } = useThemeContext();
    const [showPassword, setShowPassword] = useState(false);
    const [state, formAction, isPending] = useActionState(registerAction, initialActionState);

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            username: "",
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        if (state.status === "success") {
            toast.success(state.message, {
                description: "Silahkan Verifikasi Email Anda",
            });
            router.push("/auth/verify-email");
        }
    }, [state, form, router]);

    const onSubmit = (data: RegisterInput) => {
        startTransition(() => {
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("username", data.username);
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
                    {/* Background Gradients */}
                    <div className="absolute top-[-20%] right-[-10%] w-150 h-150 bg-indigo-500/20 rounded-full blur-[130px] mix-blend-screen animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

                    {/* Header Text */}
                    <div className="relative z-10 max-w-xl space-y-6">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <MessageCircle className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-white">NexusChat</span>
                        </div>
                        <h1 className="text-5xl font-bold leading-[1.1] text-white tracking-tight">
                            Join the{" "}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">
                                fastest growing
                            </span>{" "}
                            community.
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                            Unlock the power of decentralized collaboration. Build, ship, and scale with tools designed
                            for modern engineering teams.
                        </p>
                    </div>

                    {/* VISUAL: Widget Grid (Bento Style) */}
                    <div className="relative z-10 mt-12 grid grid-cols-2 gap-4 w-full max-w-lg self-center opacity-90">
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-3">
                                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="text-white font-semibold">Enterprise Security</h3>
                            <p className="text-xs text-slate-400 mt-1">SOC2 Type II Certified</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors translate-y-4">
                            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center mb-3">
                                <User className="w-5 h-5 text-pink-400" />
                            </div>
                            <h3 className="text-white font-semibold">Real-time Collab</h3>
                            <p className="text-xs text-slate-400 mt-1">Multiplayer by default</p>
                        </div>
                    </div>

                    {/* Footer Quote */}
                    <div className="relative z-10 flex items-center gap-4 mt-8 pt-8 border-t border-white/5">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full border-2 border-[#111318] bg-slate-700 overflow-hidden relative"
                                >
                                    <Image
                                        src={`https://i.pravatar.cc/150?u=${i + 20}`}
                                        alt="User"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="text-sm">
                            <p className="text-white font-semibold">Join 10,000+ Developers</p>
                            <p className="text-slate-500">Building the future of web</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Right Side */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-white dark:bg-[#0a0a0c]">
                {/* Top Navigation */}
                <div className="absolute top-6 right-6 lg:top-12 lg:right-12 flex items-center gap-4 z-20">
                    <span className="text-sm text-slate-500 hidden sm:block">Already a member?</span>
                    <Link href="/auth/login">
                        <Button
                            variant="ghost"
                            className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                        >
                            Sign In
                        </Button>
                    </Link>
                </div>

                <div className="w-full max-w-110 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Header Mobile Brand */}
                    <div className="lg:hidden flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl dark:text-white">NexusChat</span>
                    </div>

                    {/* Greeting */}
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Create an account
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base">
                            Enter your details to get started with your free trial.
                        </p>
                    </div>

                    {/* FORM */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Group: Full Name & Username */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold text-sm ml-1">
                                                Full Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="John Doe"
                                                    className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 focus:bg-white dark:focus:bg-black/40 focus:border-indigo-500/50 h-11 rounded-xl shadow-sm transition-all"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs ml-1 text-red-500" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold text-sm ml-1">
                                                Username
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="johndoe123"
                                                    className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 focus:bg-white dark:focus:bg-black/40 focus:border-indigo-500/50 h-11 rounded-xl shadow-sm transition-all"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs ml-1 text-red-500" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold text-sm ml-1">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                                                <Input
                                                    type="email"
                                                    placeholder="name@company.com"
                                                    className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 focus:bg-white dark:focus:bg-black/40 focus:border-indigo-500/50 h-11 rounded-xl pl-10 shadow-sm transition-all"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs ml-1 text-red-500" />
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold text-sm ml-1">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Create a strong password"
                                                    className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 focus:bg-white dark:focus:bg-black/40 focus:border-indigo-500/50 h-11 rounded-xl pl-10 pr-10 shadow-sm transition-all"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 focus:outline-none p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="w-4 h-4" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs ml-1 text-red-500" />
                                    </FormItem>
                                )}
                            />

                            {/* Terms Text */}
                            <div className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                                By clicking continue, you agree to our{" "}
                                <Link href="#" className="underline hover:text-indigo-500">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="#" className="underline hover:text-indigo-500">
                                    Privacy Policy
                                </Link>
                                .
                            </div>

                            {/* Global Error Message */}
                            {state.status === "error" && !state.errors && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-3 animate-in fade-in">
                                    <HelpCircle className="w-4 h-4 shrink-0" />
                                    <span>{state.message}</span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-12 text-base font-semibold shadow-xl shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all hover:scale-[1.02] active:scale-95 group"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Trusted By Section */}
                    <div className="pt-6 border-t border-slate-200 dark:border-white/5">
                        <p className="text-xs text-center text-slate-400 uppercase tracking-widest font-semibold mb-4">
                            Trusted by modern teams
                        </p>
                        <div className="flex justify-between px-2 opacity-70">
                            <CompanyLogo name="Acme" />
                            <CompanyLogo name="Stark" />
                            <CompanyLogo name="Wayne" />
                            <CompanyLogo name="Cyber" />
                        </div>
                    </div>
                </div>

                {/* Footer text */}
                <div className="absolute bottom-6 text-xs text-slate-400 hidden lg:block">© 2026 NexusChat Inc.</div>
            </div>
        </div>
    );
}
