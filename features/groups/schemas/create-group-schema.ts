import z from "zod";

export const createGroupSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Group name must be at least 3 characters" })
        .max(100, { message: "Group name cannot exceed 100 characters" }),
    description: z.string().max(255, { message: "Description cannot exceed 255 characters" }).optional(),
});

export type CreateGroupValues = z.infer<typeof createGroupSchema>;
