import { LoginView } from "@/features/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login - NexusChat",
    description: "Sign in to your account",
};

export default function LoginPage() {
    return <LoginView />;
}
