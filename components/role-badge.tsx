import { UserRoleGroup } from "@/enums/user-role-group-enum";

export const renderRoleBadge = (role: string) => {
    if (!role) return null;

    const normalizedRole = role.toUpperCase();

    const isOwner = normalizedRole === UserRoleGroup.OWNER;
    const isAdmin = normalizedRole === UserRoleGroup.ADMIN;

    const isMember = normalizedRole === "MEMBER" || (UserRoleGroup.MEMBER && normalizedRole === UserRoleGroup.MEMBER);

    if (isOwner) {
        return (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-500/30 uppercase">
                {role}
            </span>
        );
    }

    if (isAdmin) {
        return (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-300 font-bold border border-green-200 dark:border-green-500/30 uppercase">
                {role}
            </span>
        );
    }

    if (isMember) {
        return (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-300 font-bold border border-yellow-200 dark:border-yellow-500/30 uppercase">
                {role}
            </span>
        );
    }

    return null;
};
