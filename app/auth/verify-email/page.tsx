import { VerifyEmailView } from "@/features/auth";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Verify Email - NexusChat",
    description: "Verify your email",
};

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-[#0a0a0c]">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            }
        >
            <VerifyEmailView />
        </Suspense>
    );
}
