"use server";

import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ActionState } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function deleteContactAction(contactId: string): Promise<ActionState> {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        return {
            status: "error",
            message: "Unauthorized",
        };
    }

    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_URL}/api/contacts/${contactId}`, {
            method: "DELETE",
            headers: headers,
        });

        if (!response.ok) {
            const json = await response.json().catch(() => ({}));
            return {
                status: "error",
                message: json.message || "Gagal menghapus kontak.",
            };
        }

        revalidatePath("/");
        return {
            status: "success",
            message: "Kontak berhasil dihapus.",
        };
    } catch (error) {
        console.error(error);
        return {
            status: "error",
            message: "Terjadi kesalahan jaringan.",
        };
    }
}
