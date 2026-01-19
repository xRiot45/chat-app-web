"use server";

import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ApiResponse } from "@/types/api-response";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Contact } from "../interfaces/contact";
import { createContactSchema } from "../schemas/create-contact-schema";
import { ActionState } from "../types";

export async function createContactAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const validatedFields = createContactSchema.safeParse({
        contactUserId: formData.get("contactUserId"),
        alias: formData.get("alias"),
    });

    if (!validatedFields.success) {
        return {
            status: "error",
            message: "Validation failed. Please check your input fields.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        return {
            status: "error",
            message: "Authentication failed. Please log in again.",
        };
    }

    try {
        const payload = validatedFields.data;
        const authHeaders = await getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}/api/contacts`, {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify(payload),
        });

        const responseData = (await response.json()) as ApiResponse<Contact[]>;
        if (!response.ok) {
            return {
                status: "error",
                message: responseData.message || "Server refused the request.",
            };
        }

        revalidatePath("/");
        return {
            status: "success",
            message: "Contact has been added successfully.",
        };
    } catch (error) {
        console.error("[CreateContactAction] Error:", error);
        return {
            status: "error",
            message: "A system error occurred. Please try again later.",
        };
    }
}
