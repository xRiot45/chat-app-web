"use server";

import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ActionState } from "@/types/action-state";
import { revalidatePath } from "next/cache";
import { updateProfileSchema } from "../../schemas/update-profile-schema";

export async function updateProfileAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const validatedFields = updateProfileSchema.safeParse({
        username: formData.get("username"),
        fullName: formData.get("fullName"),
        bio: formData.get("bio"),
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
        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
            method: "PATCH",
            headers: headers,
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                status: "error",
                message: result.message || "Failed to update profile",
            };
        }

        revalidatePath("/");

        return {
            status: "success",
            message: "Profile updated successfully!",
        };
    } catch (error) {
        console.error(error);
        return {
            status: "error",
            message: "Internal server error. Please try again later.",
        };
    }
}
