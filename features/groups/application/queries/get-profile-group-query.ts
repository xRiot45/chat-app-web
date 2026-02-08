import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ApiResponse } from "@/types/api-response";
import { Group } from "../../interfaces/group";

export async function getProfileGroup(groupId: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}/profile`, {
        method: "GET",
        headers: headers,
    });
    const data = (await response.json()) as ApiResponse<Group>;
    return data;
}
