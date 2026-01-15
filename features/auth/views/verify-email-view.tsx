"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import { CheckCircle2, LogIn, Mail, MessageCircle, Moon, RefreshCw, ShieldCheck, Sun, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { verifyEmailSchema } from "../schemas/verify-email-schema";

export const VerifyEmailView = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isDarkMode, toggleTheme } = useTheme();

    const rawStatus = searchParams.get("status") ?? undefined;
    const rawCode = searchParams.get("code") ?? undefined;

    const result = verifyEmailSchema.safeParse({
        status: rawStatus,
        code: rawCode,
    });

    const status = result.success ? result.data.status : null;
    const errorCode = result.success ? result.data.code : null;

    const getErrorMessage = (code: string | null | undefined) => {
        switch (code) {
            case "INVALID_TOKEN":
                return "Link verifikasi tidak valid atau sudah kedaluwarsa.";
            case "ALREADY_VERIFIED":
                return "Email Anda sudah diverifikasi sebelumnya. Silakan langsung login.";
            default:
                return "Terjadi kesalahan saat memverifikasi email Anda.";
        }
    };

    useEffect(() => {
        if (status === "success") {
            Cookies.remove("just_registered");
        }
    }, [status]);

    return (
        <div
            className={cn(
                "min-h-screen w-full flex font-sans",
                isDarkMode ? "dark bg-[#0a0a0c] text-slate-100" : "bg-slate-50 text-slate-900",
            )}
        >
            {/* Left Side */}
            <div className="hidden lg:flex w-[60%] p-6 relative flex-col justify-center">
                <div className="w-full h-full rounded-[2.5rem] bg-[#111318] relative overflow-hidden border border-white/5 shadow-2xl flex flex-col p-12 justify-between">
                    <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen" />
                    <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-white">NexusChat</span>
                    </div>

                    <div className="relative z-10 max-w-xl">
                        <h1 className="text-5xl font-bold leading-tight text-white tracking-tight mb-6">
                            Security is our <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
                                top priority.
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed max-w-sm">
                            Verification ensures that only you can access your account and keeps the community safe.
                        </p>
                    </div>

                    <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-fit">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold">Identity Verified</p>
                                <p className="text-xs text-slate-400">SOC2 Type II Compliant System</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-white dark:bg-[#0a0a0c]">
                {/* Theme Toggle */}
                <div className="absolute top-6 right-6 flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        className="rounded-full border-slate-200 dark:border-white/10"
                    >
                        {isDarkMode ? (
                            <Sun className="w-4 h-4 text-amber-400" />
                        ) : (
                            <Moon className="w-4 h-4 text-slate-600" />
                        )}
                    </Button>
                </div>

                <div className="w-full max-w-105 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Status Icon Animation */}
                    <div className="flex justify-center">
                        <div
                            className={cn(
                                "w-24 h-24 rounded-full flex items-center justify-center relative transition-all duration-500",
                                status === "success" &&
                                    "bg-emerald-500/10 text-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.1)]",
                                status === "failed" &&
                                    "bg-red-500/10 text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.1)]",
                                !status && "bg-amber-500/10 text-amber-500",
                            )}
                        >
                            {status === "success" && <CheckCircle2 className="w-12 h-12" />}
                            {status === "failed" && <XCircle className="w-12 h-12" />}
                            {!status && <Mail className="w-12 h-12" />}

                            <div
                                className={cn(
                                    "absolute inset-0 rounded-full border border-current opacity-20",
                                    !status && "animate-ping",
                                )}
                            />
                        </div>
                    </div>

                    {/* Status Text */}
                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {status === "success"
                                ? "Email Verified!"
                                : status === "failed"
                                  ? "Verification Failed"
                                  : "Check Your Email"}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base max-w-xs mx-auto">
                            {status === "success"
                                ? "Your account is now fully active. You can now access your workspace and start chatting."
                                : status === "failed"
                                  ? getErrorMessage(errorCode)
                                  : "We've sent a verification link to your inbox. Please click the link to activate your account."}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4 pt-4">
                        {status === "success" ? (
                            <Button
                                onClick={() => router.push("/auth/login")}
                                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20"
                            >
                                <LogIn className="mr-2 h-4 w-4" />
                                Sign In to Account
                            </Button>
                        ) : status === "failed" ? (
                            <div className="space-y-3">
                                <Button
                                    className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                                    onClick={() => router.push("/auth/register")}
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Try Registering Again
                                </Button>
                                <Link
                                    href="/auth/login"
                                    className="block text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                        Tip: If you don&apos;t see the email, check your spam or junk folder.
                                    </p>
                                </div>
                                <Link
                                    href="/auth/resend-verification"
                                    className="block text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 w-full py-2 rounded-lg transition-colors"
                                >
                                    Resend Verification Link
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute bottom-8 flex items-center gap-2 text-xs text-slate-400">
                    <MessageCircle className="w-3 h-3" />
                    <span>Need help? Contact support@nexuschat.io</span>
                </div>
            </div>
        </div>
    );
};
