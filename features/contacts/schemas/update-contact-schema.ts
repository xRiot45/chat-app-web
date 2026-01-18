import z from "zod";

export const updateContactSchema = z.object({
    id: z.string().min(1, "Contact ID is required"),
    alias: z.string().optional(),
});

export type UpdateContactSchema = z.infer<typeof updateContactSchema>;
