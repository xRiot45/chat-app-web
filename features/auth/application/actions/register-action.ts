"use server";

import { API_BASE_URL } from "@/configs/api-base-url";
import { ActionState } from "@/types/action-state";
import { cookies } from "next/headers";
import { registerSchema } from "../../schemas/register-schema";

export async function registerAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const validatedFields = registerSchema.safeParse({
        fullName: formData.get("fullName"),
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            status: "error",
            message: "Input validation failed",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const payload = validatedFields.data;

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                status: "error",
                message: data.message || "Registration failed",
            };
        }

        const cookieStore = await cookies();
        cookieStore.set("just_registered", "true", {
            path: "/",
            maxAge: 60 * 10,
        });

        return {
            status: "success",
            message: "Akun Berhasil Dibuat",
        };
    } catch (error) {
        console.error("Register Error:", error);
        return {
            status: "error",
            message: "Terjadi kesalahan koneksi server",
        };
    }
}
