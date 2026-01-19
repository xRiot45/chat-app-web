export type ApiResponse<T = unknown> = {
    status: boolean;
    statusCode: number;
    timestamp: Date;
    message: string;
    data?: T;
};

export type ApiErrorResponse = {
    status: boolean;
    statusCode: number;
    error: string;
    message: string;
    path: string;
    timestamp: Date;
    stack?: string;
};
