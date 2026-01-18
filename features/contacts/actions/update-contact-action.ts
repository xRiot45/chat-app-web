"use server";

import { getAuthHeaders } from "@/helpers/get-auth-headers";
import { revalidatePath } from "next/cache";
import { updateContactSchema } from "../schemas/update-contact-schema";
import { ActionState } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export async function updateContactAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const validatedFields = updateContactSchema.safeParse({
        id: formData.get("id"),
        alias: formData.get("alias"),
    });

    if (!validatedFields.success) {
        return {
            status: "error",
            message: "Input tidak valid",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { id, alias } = validatedFields.data;

    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_URL}/api/contacts/${id}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({ alias }),
        });

        const responseJson = await response.json();

        if (!response.ok) {
            return {
                status: "error",
                message: responseJson.message || "Gagal memperbarui kontak di server.",
            };
        }

        revalidatePath("/");

        return {
            status: "success",
            message: "Nama kontak berhasil diperbarui.",
        };
    } catch (error) {
        console.error("Update Contact Error:", error);
        return {
            status: "error",
            message: "Terjadi kesalahan jaringan atau server.",
        };
    }
}
