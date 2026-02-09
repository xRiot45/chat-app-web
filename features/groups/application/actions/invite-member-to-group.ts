import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ActionState } from "@/types/action-state";
import { inviteMemberSchema } from "../../schemas/invite-member-to-group";

export async function inviteMemberToGroupAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const validatedFields = inviteMemberSchema.safeParse({
        groupId: formData.get("groupId"),
        memberIds: formData.getAll("memberIds"),
    });

    if (!validatedFields.success) {
        return {
            status: "error",
            message: "Validation failed",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/groups/invite`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                memberIds: validatedFields.data.memberIds,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                status: "error",
                message: result.message || "Failed to invite members to the group",
            };
        }

        return {
            status: "success",
            message: "Members invited successfully!",
        };
    } catch (error) {
        console.error(error);
        return {
            status: "error",
            message: "Internal server error. Please try again later.",
        };
    }
}
