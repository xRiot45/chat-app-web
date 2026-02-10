// application/actions/change-role-member.ts
"use server";

import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ActionState } from "@/types/action-state";
import { changeRoleMemberSchema } from "../../schemas/change-role-member-schema";

export async function changeRoleMemberAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const validatedFields = changeRoleMemberSchema.safeParse({
        groupId: formData.get("groupId"),
        memberId: formData.get("memberId"),
        role: formData.get("role"),
    });

    if (!validatedFields.success) {
        return {
            status: "error",
            message: "Validation failed",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { groupId, memberId, role } = validatedFields.data;

    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}/members/${memberId}/role`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({ role }),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                status: "error",
                message: result.message || "Failed to update member role",
            };
        }

        return {
            status: "success",
            message: "Member role updated successfully!",
        };
    } catch (error) {
        console.error("CHANGE_ROLE_ERROR:", error);
        return {
            status: "error",
            message: "Internal server error. Please try again later.",
        };
    }
}
