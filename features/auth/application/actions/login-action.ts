"use server";

import { API_BASE_URL } from "@/configs/api-base-url";
import { ActionState } from "@/types/action-state";
import { cookies } from "next/headers";
import { loginSchema } from "../../schemas/login-schema";

export async function loginAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const validatedFields = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            status: "error",
            message: "Input tidak valid",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const payload = validatedFields.data;

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
                message: data.message || "Email or password invalid",
            };
        }

        if (!data?.data.accessToken) {
            return {
                status: "error",
                message: "Failed to take access token from the server",
            };
        }

        const cookieStore = await cookies();

        cookieStore.set("accessToken", data?.data?.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24,
            sameSite: "lax",
        });

        cookieStore.set("refreshToken", data?.data?.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24,
            sameSite: "lax",
        });

        return {
            status: "success",
            message: "Login successfully, redirecting...",
        };
    } catch (error) {
        console.error("Login Error:", error);
        return {
            status: "error",
            message: "Failed to login",
        };
    }
}
