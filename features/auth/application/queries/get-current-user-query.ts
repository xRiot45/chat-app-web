import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";

export async function getCurrentUser() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers,
        cache: "no-store",
    });
    const data = await response.json();
    return data.data;
}
