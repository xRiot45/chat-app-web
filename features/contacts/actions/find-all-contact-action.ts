/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ActionState } from "@/types/action-state";
import { ApiResponse } from "@/types/api-response";
import { cookies } from "next/headers";
import { Contact } from "../interfaces/contact";

export async function findAllContactAction(_prevState: ActionState, _formData: FormData): Promise<ActionState> {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        return {
            status: "error",
            message: "You are not authenticated. Please log in again.",
        };
    }

    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/contacts`, {
            method: "GET",
            headers: headers,
            cache: "no-store",
        });

        const responseData = (await response.json()) as ApiResponse<Contact[]>;

        if (!response.ok) {
            return {
                status: "error",
                message: responseData.message || "Failed to fetch contact list.",
            };
        }

        const contacts = responseData.data || [];
        return {
            status: "success",
            message: "Contact list loaded successfully.",
            data: contacts,
        };
    } catch (error) {
        console.error("[FindAllContactAction] System Error:", error);
        return {
            status: "error",
            message: "A system error occurred while fetching data.",
        };
    }
}
