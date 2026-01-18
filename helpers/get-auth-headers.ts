"use server";

import { cookies } from "next/headers";

export async function getAuthHeaders() {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
    };
}
