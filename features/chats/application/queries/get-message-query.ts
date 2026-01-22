import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";

export async function getMessagesQuery(recipientId: string, limit = 20, offset = 0) {
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
            throw new Error(responseData.message || "Failed to fetch messages");
        }

        return (responseData.data || []).reverse();
    } catch (error) {
        console.error("Query Error [getMessages]:", error);
        return [];
    }
}
