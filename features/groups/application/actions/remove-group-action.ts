import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ActionState } from "@/types/action-state";

export async function removeGroupAction(groupId: string): Promise<ActionState> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}`, {
            method: "DELETE",
            headers: headers,
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                status: "error",
                message: result.message || "Failed to remove group",
            };
        }

        return {
            status: "success",
            message: "Group removed successfully!",
        };
    } catch (error) {
        console.error("REMOVE_GROUP_ERROR:", error);
        return {
            status: "error",
            message: "Internal server error. Please try again later.",
        };
    }
}
