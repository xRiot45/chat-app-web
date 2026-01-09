"use client";

import { CompanyLogo } from "@/components/company-logo";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/useTheme";
import { IApiErrorResponse } from "@/interfaces/api-error-response";
import { BaseResponse } from "@/interfaces/base-response";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
    CheckCircle2,
    Eye,
    EyeOff,
    FileText,
    Github,
    HelpCircle,
    Loader2,
    MessageCircle,
    Mic,
    Moon,
    Phone,
    Sun,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const loginSchema = z.object({
    email: z.string().email({ message: "Email tidak valid" }),
    password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const { isDarkMode, toggleTheme, mounted } = useTheme();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const loginMutation = useMutation<BaseResponse<LoginResponse>, AxiosError<IApiErrorResponse>, LoginFormValues>({
        mutationFn: async (data) => {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, data);
            return response.data;
        },
        onSuccess: (data) => {
            console.log(data);
            toast.success("Login Berhasil");
            localStorage.setItem("accessToken", data?.data?.accessToken);
            router.push("/");
        },
        onError: (error) => {
            console.log(error);
            toast.error("Email & Password Salah");
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        loginMutation.mutate(data);
    };

    if (!mounted) return null;

    return (
        <div
            className={cn(
                "min-h-screen w-full flex font-sans selection:bg-indigo-500/30",
                isDarkMode ? "dark bg-[#0a0a0c] text-slate-100" : "bg-slate-50 text-slate-900",
            )}
        >
            {/* --- LEFT SIDE (Bento Grid Visuals) --- */}
            <div className="hidden lg:flex w-[60%] p-6 relative flex-col justify-center">
                {/* Main Container Card */}
                <div className="w-full h-full rounded-[2.5rem] bg-[#111318] relative overflow-hidden border border-white/5 shadow-2xl flex flex-col p-12 justify-between">
                    {/* Background Gradients */}
                    <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen" />
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
                            Experience communication <br /> without the{" "}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
                                noise.
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                            The all-in-one workspace for teams who want to move fast. Threaded conversations, crystal
                            clear audio, and zero clutter.
                        </p>
                    </div>

                    {/* VISUAL: Mock Chat Interface (Glassmorphism) */}
                    <div className="relative z-10 mt-12 w-full max-w-2xl self-center transform -rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                            {/* Mock Header */}
                            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                        P
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-sm">Product Launch 🚀</h3>
                                        <p className="text-xs text-slate-400">24 members • 5 online</p>
                                    </div>
                                </div>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded-full border-2 border-[#1a1d24] bg-slate-700 flex items-center justify-center text-[10px] text-white"
                                        >
                                            <Image
                                                width={32}
                                                height={32}
                                                src={`https://i.pravatar.cc/150?u=${i + 10}`}
                                                alt="User"
                                                className="rounded-full"
                                            />
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-[#1a1d24] bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                                        +5
                                    </div>
                                </div>
                            </div>

                            {/* Mock Messages */}
                            <div className="space-y-4">
                                {/* Msg 1 */}
                                <div className="flex gap-3">
                                    <Image
                                        width={32}
                                        height={32}
                                        src="https://i.pravatar.cc/150?u=5"
                                        className="w-8 h-8 rounded-full mt-1"
                                        alt="User"
                                    />
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-indigo-300">Alex Chen</span>
                                            <span className="text-[10px] text-slate-500">10:42 AM</span>
                                        </div>
                                        <div className="bg-white/10 text-slate-200 text-sm py-2 px-4 rounded-r-xl rounded-bl-xl">
                                            The Q3 roadmap is finalized. Check it out 👇
                                        </div>
                                        {/* File Attachment Widget */}
                                        <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 w-fit">
                                            <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center">
                                                <FileText className="w-4 h-4 text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-white">Q3_Roadmap_Final.pdf</p>
                                                <p className="text-[10px] text-slate-400">2.4 MB</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Msg 2 (Right) */}
                                <div className="flex gap-3 flex-row-reverse">
                                    <Image
                                        width={32}
                                        height={32}
                                        src="https://i.pravatar.cc/150?u=8"
                                        className="w-8 h-8 rounded-full mt-1"
                                        alt="Me"
                                    />
                                    <div className="space-y-1 text-right">
                                        <div className="bg-indigo-600 text-white text-sm py-2 px-4 rounded-l-xl rounded-br-xl shadow-lg shadow-indigo-500/20">
                                            Looks amazing! Let&apos;s sync at 2 PM.
                                        </div>
                                        <span className="text-[10px] text-slate-500">Read 10:45 AM</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Call Widget */}
                        <div className="absolute -right-8 top-1/2 bg-[#1a1d24] border border-white/10 p-3 rounded-2xl shadow-xl animate-bounce duration-3000 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
                                <Phone className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Incoming call...</p>
                                <p className="text-sm font-bold text-white">Design Team</p>
                            </div>
                            <div className="flex gap-1 ml-2">
                                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center cursor-pointer hover:bg-red-500/30">
                                    <Phone className="w-4 h-4 text-red-400 rotate-135" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center cursor-pointer hover:bg-green-500/30">
                                    <Mic className="w-4 h-4 text-green-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Quote */}
                    <div className="relative z-10 flex items-center gap-2 mt-8">
                        <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                        <p className="text-sm text-slate-400 font-medium">Trusted by 4,000+ teams worldwide</p>
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE (Clean Form) --- */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-white dark:bg-[#0a0a0c]">
                {/* Top Navigation */}
                <div className="absolute top-6 right-6 lg:top-12 lg:right-12 flex items-center gap-4 z-20">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        className="rounded-full w-10 h-10 border-slate-200 dark:border-white/10 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                    >
                        {isDarkMode ? (
                            <Sun className="w-4 h-4 text-amber-400" />
                        ) : (
                            <Moon className="w-4 h-4 text-slate-600" />
                        )}
                    </Button>
                </div>

                <div className="w-full max-w-100 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                            Welcome back
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    {/* Social Logins (Dummy) */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            className="h-11 rounded-xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </Button>
                        <Button
                            variant="outline"
                            className="h-11 rounded-xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
                        >
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200 dark:border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-50 dark:bg-[#0a0a0c] px-2 text-slate-400">Or continue with</span>
                        </div>
                    </div>

                    {/* FORM */}
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
                                            {/* Soft UI Input: Grey Background, No Border until focus */}
                                            <div className="relative">
                                                <Input
                                                    placeholder="name@company.com"
                                                    className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 focus:bg-white dark:focus:bg-black/40 focus:border-indigo-500/50 h-12 rounded-xl pl-4 shadow-sm transition-all"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="ml-1" />
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
                                                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 focus:bg-white dark:focus:bg-black/40 focus:border-indigo-500/50 h-12 rounded-xl pl-4 pr-10 shadow-sm transition-all"
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
                                        <FormMessage className="ml-1" />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-2">
                                {/* Global Error */}
                                {loginMutation.isError && (
                                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="w-8 h-8 rounded-full bg-red-500/20 shrink-0 flex items-center justify-center">
                                            <HelpCircle className="w-4 h-4" />
                                        </div>
                                        <span>
                                            {loginMutation.error?.response?.data?.message ||
                                                "Invalid credentials. Please try again."}
                                        </span>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loginMutation.isPending}
                                    className="w-full h-12 text-base font-semibold shadow-xl shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    {loginMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Sign In to Workspace"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/auth/register"
                                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline"
                            >
                                Create a free account
                            </Link>
                        </p>
                    </div>

                    {/* Trusted By Section (New Content) */}
                    <div className="pt-8 border-t border-slate-200 dark:border-white/5">
                        <p className="text-xs text-center text-slate-400 uppercase tracking-widest font-semibold mb-6">
                            Trusted by innovators
                        </p>
                        <div className="flex justify-between px-2 opacity-70">
                            <CompanyLogo name="Acme Corp" />
                            <CompanyLogo name="Globex" />
                            <CompanyLogo name="Soylent" />
                            <CompanyLogo name="Initech" />
                        </div>
                    </div>
                </div>

                {/* Footer text */}
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
