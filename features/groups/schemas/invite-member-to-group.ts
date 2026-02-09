import { z } from "zod";

export const inviteMemberSchema = z.object({
    groupId: z.string().uuid({ message: "Group ID must be a valid UUID" }),
    memberIds: z
        .array(z.string().uuid({ message: "Each Member ID must be a valid UUID" }))
        .min(1, { message: "Select at least one member to add" }),
});

export type InviteMemberValues = z.infer<typeof inviteMemberSchema>;
