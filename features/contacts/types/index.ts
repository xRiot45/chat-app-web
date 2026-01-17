export type ActionState<T = unknown> = {
    status: "idle" | "success" | "error";
    message: string;
    errors?: Record<string, string[]>;
    data?: T;
};
