"use server";

import { API_BASE_URL } from "@/configs/api-base-url";
import { resendVerificationSchema } from "../schemas/resend-verification-schema";
import { ActionState } from "../types";

export async function resendVerificationAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const validatedFields = resendVerificationSchema.safeParse({
        email: formData.get("email"),
    });

    if (!validatedFields.success) {
        return {
            status: "error",
            message: "Format email tidak valid.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const payload = validatedFields.data;

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
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
                message: data.message || "Gagal mengirim verifikasi.",
            };
        }

        return {
            status: "success",
            message: data.message || "Link verifikasi baru telah dikirim ke email Anda.",
        };
    } catch (error) {
        console.error("Resend Verification Error:", error);
        return {
            status: "error",
            message: "Terjadi kesalahan server.",
        };
    }
}
