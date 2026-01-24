"use server";

import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ActionState } from "@/types/action-state";
import { ApiResponse } from "@/types/api-response";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Contact } from "../../interfaces/contact";
import { updateContactSchema } from "../../schemas/update-contact-schema";

export async function updateContactAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const validatedFields = updateContactSchema.safeParse({
        id: formData.get("id"),
        alias: formData.get("alias"),
    });

    if (!validatedFields.success) {
        return {
            status: "error",
            message: "Validation failed. Please check your input.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        return {
            status: "error",
            message: "Unauthorized. Please log in again.",
        };
    }

    try {
        const { id, alias } = validatedFields.data;
        const headers = await getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({ alias }),
        });

        const responseData = (await response.json()) as ApiResponse<Contact>;
        if (!response.ok) {
            return {
                status: "error",
                message: responseData.message || "Failed to update contact on server.",
            };
        }

        revalidatePath("/");
        return {
            status: "success",
            message: "Contact name updated successfully.",
        };
    } catch (error) {
        console.error("[UpdateContactAction] System Error:", error);
        return {
            status: "error",
            message: "A system error occurred. Please try again later.",
        };
    }
}
