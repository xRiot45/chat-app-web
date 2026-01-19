export type ApiResponse<T = unknown> = {
    status: boolean;
    statusCode: number;
    timestamp: Date;
    message: string;
    data?: T;
};
