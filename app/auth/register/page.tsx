import { RegisterView } from "@/features/auth/views/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register - NexusChat",
    description: "Register to use NexusChat",
};

export default function RegisterPage() {
    return <RegisterView />;
}
