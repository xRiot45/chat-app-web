import RegisterView from "@/features/auth/views/register-view";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register - NexusChat",
    description: "Create a new account",
};

export default function RegisterPage() {
    return <RegisterView />;
}
