import ResendVerificationView from "@/features/auth/views/resend-verification-view";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Resend Verification - NexusChat",
    description: "Resend verification email",
};

export default function ResendVerificationPage() {
    return <ResendVerificationView />;
}
