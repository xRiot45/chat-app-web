import { User } from "@/features/users/interfaces";

export interface Contact {
    id: string;
    alias: string | null;
    userId: string;
    contactUser: User;
    createdAt: string;
    updatedAt: string;
}
