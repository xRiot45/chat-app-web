import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";

export async function getRecentMessagesQuery() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/api/chat/recent-messages`, {
        headers,
        next: { tags: ["recent-chats"] },
    });

    if (!res.ok) throw new Error("Failed to load chats");
    const json = await res.json();
    return json.data;
}
