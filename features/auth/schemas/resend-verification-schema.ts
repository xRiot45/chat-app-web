import { z } from "zod";

export const resendVerificationSchema = z.object({
    email: z.string().email({ message: "Masukkan alamat email yang valid" }),
});

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
