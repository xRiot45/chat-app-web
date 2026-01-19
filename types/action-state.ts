export type ActionState<TData = unknown, TErrors = Record<string, string[] | undefined>> = {
    status: "idle" | "success" | "error";
    message: string;
    data?: TData;
    errors?: TErrors;
};
