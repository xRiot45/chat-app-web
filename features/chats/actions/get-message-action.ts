"use server";

import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ActionState } from "@/types/action-state";

export async function getMessagesAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
    const recipientId = formData.get("recipientId") as string;
    const limit = formData.get("limit") || "20";
    const offset = formData.get("offset") || "0";

    if (!recipientId) {
        return {
            status: "error",
            message: "Recipient ID is required.",
        };
    }

    try {
        const headers = await getAuthHeaders();
        const response = await fetch(
            `${API_BASE_URL}/api/chat/messages?recipientId=${recipientId}&limit=${limit}&offset=${offset}`,
            {
                method: "GET",
                headers,
                cache: "no-store",
            },
        );

        const responseData = await response.json();
        if (!response.ok) {
            return {
                status: "error",
                message: responseData.message || "Failed to fetch messages",
            };
        }

        const rawMessages = responseData.data || [];
        const messages = rawMessages.reverse();
        return {
            status: "success",
            message: "Messages loaded",
            data: messages,
        };
    } catch (error) {
        console.error("Error in getMessagesAction:", error);
        return {
            status: "error",
            message: "A system error occurred.",
        };
    }
}
