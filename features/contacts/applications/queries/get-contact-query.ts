"use server";

import { API_BASE_URL } from "@/configs/api-base-url";
import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { ApiResponse } from "@/types/api-response";
import { Contact } from "../../interfaces/contact";

export async function getContacts() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: "GET",
        headers: headers,
    });
    const data = (await response.json()) as ApiResponse<Contact[]>;
    return data;
}
