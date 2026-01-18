import { z } from "zod";

export const SearchUsersSchema = z.object({
    query: z.string().trim().min(1, {
        message: "Query pencarian tidak boleh kosong.",
    }),
});
