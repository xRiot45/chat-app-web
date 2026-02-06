"use server";

import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ActionState } from "@/types/action-state";
import { createGroupSchema } from "../../schemas/create-group-schema";

export async function createGroupAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const validatedFields = createGroupSchema.safeParse({
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
        const response = await fetch(`${API_BASE_URL}/api/groups`, {
            method: "POST",
            headers: headers,
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                status: "error",
                message: result.message || "Failed to create group",
            };
        }

        return {
            status: "success",
            message: "Group created successfully!",
        };
    } catch (error) {
        console.error(error);
        return {
            status: "error",
            message: "Internal server error. Please try again later.",
        };
    }
}
