"use server";

import { cookies } from "next/headers";
import { ActionState } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export async function findAllContactAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
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
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        const responseData = await response.json();

        if (!response.ok) {
            return {
                status: "error",
                message: responseData.message || "Gagal mengambil daftar kontak.",
            };
        }

        const contacts = responseData.data || [];

        return {
            status: "success",
            message: "Daftar kontak berhasil dimuat.",
            data: contacts, 
        };
    } catch (error) {
        console.error("Find All Contact Error:", error);
        return {
            status: "error",
            message: "Terjadi kesalahan sistem saat menghubungi server.",
        };
    }
}
