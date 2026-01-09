import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    const isVerifyPage = pathname === "/auth/verify-email";
    const isResendPage = pathname === "/auth/resend-verification";

    if (isVerifyPage || isResendPage) {
        const justRegistered = request.cookies.get("just_registered");
        const status = searchParams.get("status");

        /**
         * Izinkan akses jika:
         * 1. Ada cookie 'just_registered' (Baru saja registrasi)
         * 2. ATAU ada param 'status' (Redirect hasil verifikasi dari backend)
         */
        if (!justRegistered && !status) {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/auth/verify-email", "/auth/login", "/auth/register", "/auth/resend-verification"],
};
