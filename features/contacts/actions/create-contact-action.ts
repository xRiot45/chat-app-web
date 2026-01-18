"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createContactSchema } from "../schemas/create-contact-schema";
import { ActionState } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export async function createContactAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const validatedFields = createContactSchema.safeParse({
        contactUserId: formData.get("contactUserId"),
        alias: formData.get("alias"),
    });

    if (!validatedFields.success) {
        return {
            status: "error",
            message: "Validasi gagal, silakan periksa input Anda.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const payload = validatedFields.data;

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        if (!token) {
            return {
                status: "error",
                message: "Anda tidak terautentikasi. Silakan login kembali.",
            };
        }

        const response = await fetch(`${API_BASE_URL}/api/contacts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });

        const responseData = await response.json();

        if (!response.ok) {
            const errorMessage = responseData.message || "Gagal menambahkan kontak.";

            return {
                status: "error",
                message: errorMessage,
            };
        }

        revalidatePath("/");

        return {
            status: "success",
            message: "Kontak berhasil ditambahkan!",
        };
    } catch (error) {
        console.error("Create Contact Error:", error);
        return {
            status: "error",
            message: "Terjadi kesalahan sistem saat menghubungi server.",
        };
    }
}
