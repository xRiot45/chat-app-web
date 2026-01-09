import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    if (pathname === "/auth/verify-email") {
        const justRegistered = request.cookies.get("just_registered");
        const status = searchParams.get("status");

        if (!justRegistered && !status) {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/auth/verify-email", "/auth/login", "/auth/register"],
};
