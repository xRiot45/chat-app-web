"use server";

import { cookies } from "next/headers";
import { SearchUsersSchema } from "../schemas/search-users-schema";
import { ActionState, UserSearchResponse } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function searchUsersAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const query = formData.get("query");
    const validatedFields = SearchUsersSchema.safeParse({
        query: query,
    });

    if (!validatedFields.success) {
        return {
            error: "Validasi Gagal",
            message: validatedFields.error.flatten().fieldErrors.query?.[0],
        };
    }

    const searchQuery = validatedFields.data.query;

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        if (!token) {
            return { error: "Unauthorized", message: "Anda harus login terlebih dahulu." };
        }

        const response = await fetch(`${API_URL}/api/users/search?q=${encodeURIComponent(searchQuery)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                error: `Error ${response.status}`,
                message: errorData.message || "Gagal mengambil data user.",
            };
        }

        const responseBody = await response.json();
        const users: UserSearchResponse[] = responseBody.data || [];

        return {
            data: users,
            message: `Ditemukan ${users.length} pengguna.`,
        };
    } catch (error) {
        console.error("Search Action Error:", error);
        return {
            error: "Server Error",
            message: "Terjadi kesalahan saat menghubungkan ke server.",
        };
    }
}
