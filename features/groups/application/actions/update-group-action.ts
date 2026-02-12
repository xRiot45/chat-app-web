import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ActionState } from "@/types/action-state";
import { updateGroupSchema } from "../../schemas/update-group-schema";

export async function updateGroupAction(
    prevState: ActionState,
    groupId: string,
    formData: FormData,
): Promise<ActionState> {
    const validatedFields = updateGroupSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
    });

    if (!validatedFields.success) {
        return {
            status: "error",
            message: "Validation failed",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const headers = await getAuthHeaders(true);
        const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}`, {
            method: "PATCH",
            headers: headers,
            body: formData,
        });

        const result = await response.json();
        console.log(response);

        if (!response.ok) {
            return {
                status: "error",
                message: result.message || "Failed to update group information",
            };
        }

        return {
            status: "success",
            message: "Group updated successfully!",
        };
    } catch (error) {
        console.error("UPDATE_GROUP_ERROR:", error);
        return {
            status: "error",
            message: "Internal server error. Please try again later.",
        };
    }
}
