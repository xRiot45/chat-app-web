"use server";

import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ActionState } from "@/types/action-state";
import { revalidatePath } from "next/cache";
import { createStorySchema } from "../../schemas/create-story-schema";

export async function createStoryAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const validatedFields = createStorySchema.safeParse({
        image: formData.get("image"),
        video: formData.get("video"),
        caption: formData.get("caption"),
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
        const response = await fetch(`${API_BASE_URL}/api/story`, {
            method: "POST",
            headers: headers,
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                status: "error",
                message: result.message || "Failed to create story",
            };
        }

        revalidatePath("/");

        return {
            status: "success",
            message: "Story created successfully",
        };
    } catch (error) {
        console.error(error);
        return {
            status: "error",
            message: "Failed to create story",
        };
    }
}
