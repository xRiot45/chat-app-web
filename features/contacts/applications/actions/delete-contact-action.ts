"use server";

import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ActionState } from "@/types/action-state";
import { ApiErrorResponse } from "@/types/api-response";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function deleteContactAction(contactId: string): Promise<ActionState> {
    if (!contactId) {
        return {
            status: "error",
            message: "Invalid Contact ID provided.",
        };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        return {
            status: "error",
            message: "Unauthorized. Please log in again.",
        };
    }

    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/contacts/${contactId}`, {
            method: "DELETE",
            headers: headers,
        });

        if (!response.ok) {
            let errorMessage = "Failed to delete contact.";

            try {
                const errorData = (await response.json()) as ApiErrorResponse;
                errorMessage = errorData.message || errorMessage;
            } catch {
                console.warn("[DeleteContact] Failed to parse error response JSON");
            }

            return {
                status: "error",
                message: errorMessage,
            };
        }

        revalidatePath("/");
        return {
            status: "success",
            message: "Contact deleted successfully.",
        };
    } catch (error) {
        console.error("[DeleteContactAction] System Error:", error);
        return {
            status: "error",
            message: "A network or system error occurred.",
        };
    }
}
