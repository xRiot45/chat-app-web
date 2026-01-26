"use server";

import { cookies } from "next/headers";

export async function getAuthHeaders(isMultipart = false) {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const headers: Record<string, string> = {
        Authorization: `Bearer ${token || ""}`,
    };

    if (!isMultipart) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
}
