export type ApiResponse<T = unknown> = {
    success: boolean;
    statusCode: number;
    timestamp: Date;
    message: string;
    data?: T;
};

export type ApiErrorResponse = {
    success: boolean;
    statusCode: number;
    error: string;
    message: string;
    path: string;
    timestamp: Date;
    stack?: string;
};
