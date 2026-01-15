import { z } from "zod";

export const verifyEmailSchema = z.object({
    status: z.enum(["success", "failed"]).optional(),
    code: z.string().optional(),
});

export type VerifyEmailParams = z.infer<typeof verifyEmailSchema>;
