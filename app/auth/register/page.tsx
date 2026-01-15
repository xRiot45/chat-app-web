import { RegisterForm } from "@/features/auth/components/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register - NexusChat",
    description: "Register to use NexusChat",
};

export default function RegisterPage() {
    return <RegisterForm />;
}
