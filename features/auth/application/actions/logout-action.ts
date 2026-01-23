/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ActionState } from "@/types/action-state";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction(_prevState: ActionState, _formData: FormData): Promise<ActionState> {
    const authHeaders = await getAuthHeaders();

    try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: "POST",
            headers: authHeaders,
            cache: "no-store",
        });

        const cookieStore = await cookies();
        const tokens = ["accessToken", "refreshToken"];
        tokens.forEach((token) => cookieStore.delete(token));
    } catch {
        return {
            status: "error",
            message: "Terjadi kesalahan pada sistem. Silakan coba lagi.",
        };
    }

    revalidatePath("/", "layout");
    redirect("/auth/login");
}
