// Tambahkan "= null" di sini
export interface BaseResponse<T = null> {
    status: boolean;
    statusCode: number;
    message: string;
    data?: T;
}
