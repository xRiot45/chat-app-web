import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken");

    if (pathname === "/") {
        if (!accessToken) {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    const isVerifyPage = pathname === "/auth/verify-email";
    const isResendPage = pathname === "/auth/resend-verification";

    if (isVerifyPage || isResendPage) {
        const justRegistered = request.cookies.get("just_registered");
        const status = searchParams.get("status");

        if (!justRegistered && !status) {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/auth/verify-email", "/auth/login", "/auth/register", "/auth/resend-verification"],
};
