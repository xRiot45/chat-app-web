export interface ActionState {
    status: "idle" | "success" | "error";
    message?: string;
    errors?: {
        email?: string[];
        password?: string[];
    };
}
