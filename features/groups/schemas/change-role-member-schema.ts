import { UserRoleGroup } from "@/enums/user-role-group-enum";
import { z } from "zod";

export const changeRoleMemberSchema = z.object({
    groupId: z.string().uuid("Invalid Group ID"),
    memberId: z.string().uuid("Invalid Member ID"),
    role: z.nativeEnum(UserRoleGroup),
});

export type ChangeRoleMemberValues = z.infer<typeof changeRoleMemberSchema>;
