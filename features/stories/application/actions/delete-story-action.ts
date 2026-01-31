import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ActionState } from "@/types/action-state";

export async function deleteStoryAction(storyId: string): Promise<ActionState> {
    if (!storyId) {
        return {
            status: "error",
            message: "Invalid Story ID provided.",
        };
    }

    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/story/${storyId}`, {
            method: "DELETE",
            headers: headers,
        });

        if (response.ok) {
            return {
                status: "success",
                message: "Story deleted successfully.",
            };
        } else {
            return {
                status: "error",
                message: "Failed to delete story.",
            };
        }
    } catch (error) {
        console.error("Failed to delete story:", error);
        return {
            status: "error",
            message: "Failed to delete story.",
        };
    }
}
