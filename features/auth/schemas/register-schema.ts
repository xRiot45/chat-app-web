import { z } from "zod";

export const registerSchema = z.object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
