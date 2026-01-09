export interface IApiErrorResponse {
    success: boolean;
    statusCode: number;
    timestamp: Date;
    error: string;
    message: string;
    path: string;
    stack?: string;
}
