import { ResendVerificationView } from "@/features/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Resend Verification - NexusChat",
};

export default function ResendVerificationPage() {
    return <ResendVerificationView />;
}
