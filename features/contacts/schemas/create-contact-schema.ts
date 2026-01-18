import z from "zod";

export const createContactSchema = z.object({
    contactUserId: z.string(),
    alias: z.string().min(2, { message: "Alias must be at least 2 characters" }),
});

export type CreateContactSchema = z.infer<typeof createContactSchema>;
