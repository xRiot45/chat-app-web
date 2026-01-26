import { z } from "zod";

export const updateProfileSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(50, { message: "Username cannot exceed 50 characters" })
        .regex(/^[a-zA-Z0-9._]+$/, {
            message: "Only letters, numbers, dots, and underscores allowed",
        }),
    fullName: z
        .string()
        .min(1, { message: "Full name is required" })
        .max(100, { message: "Full name cannot exceed 100 characters" }),
    bio: z.string().optional(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
