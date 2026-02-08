import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ApiResponse } from "@/types/api-response";
import { GroupMember } from "../../interfaces/group";

export async function getMembersGroup(groupId: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}/members`, {
        method: "GET",
        headers: headers,
    });
    const data = (await response.json()) as ApiResponse<GroupMember[]>;
    return data;
}
