import z from "zod";

export const createStorySchema = z.object({
    caption: z.string().optional(),
});

export type CreateStoryValues = z.infer<typeof createStorySchema>;
