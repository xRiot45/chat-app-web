import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ActionState } from "@/types/action-state";

export async function kickMemberAction(groupId: string, memberId: string): Promise<ActionState> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}/members/${memberId}`, {
            method: "DELETE",
            headers: headers,
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                status: "error",
                message: result.message || "Failed to kick member from group",
            };
        }

        return {
            status: "success",
            message: "Member kicked from group successfully!",
        };
    } catch (error) {
        console.error(error);
        return {
            status: "error",
            message: "Internal server error. Please try again later.",
        };
    }
}
