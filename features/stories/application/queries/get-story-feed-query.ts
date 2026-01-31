import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ApiResponse } from "@/types/api-response";
import { Story } from "../../interfaces/story";

export async function getStoryFeed() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/story/feed`, {
        method: "GET",
        headers: headers,
        cache: "no-store",
    });

    const data = (await response.json()) as ApiResponse<Story[]>;
    return data;
}
