import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";

interface GetMessagesOptions {
    recipientId?: string;
    groupId?: string;
    limit?: number;
    offset?: number;
}

export async function getMessagesQuery({ recipientId, groupId, limit = 20, offset = 0 }: GetMessagesOptions) {
    try {
        const headers = await getAuthHeaders();
        const params = new URLSearchParams();

        if (recipientId) params.append("recipientId", recipientId);
        if (groupId) params.append("groupId", groupId);

        params.append("limit", limit.toString());
        params.append("offset", offset.toString());

        const response = await fetch(`${API_BASE_URL}/api/chat/messages?${params.toString()}`, {
            method: "GET",
            headers,
            cache: "no-store",
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || "Failed to fetch messages");
        }

        // Pastikan return array kosong jika data null/undefined
        // Reverse array agar pesan terbaru ada di paling bawah (chronological order)
        return (responseData.data || []).reverse();
    } catch (error) {
        console.error("Query Error [getMessages]:", error);
        return [];
    }
}
