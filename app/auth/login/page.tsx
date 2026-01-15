import { LoginView } from "@/features/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login - NexusChat",
    description: "Login to your workspace",
};

export default function LoginPage() {
    return <LoginView />;
}
