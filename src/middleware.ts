// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type JwtPayload = {
    role?: string;
    exp?: number;
    [key: string]: unknown;
};

export function middleware(req: NextRequest) {
    const token = req.cookies.get("refreshToken")?.value;
    const pathname = req.nextUrl.pathname;
    
    console.log({ 
        pathname, 
        token: token ? 'Token exists' : 'No token',
        url: req.url,
        cookies: req.cookies.getAll().map(c => c.name)
    }, '🔒 Middleware Debug')

    // No token - redirect to unauthorized
    if (!token) {
        console.log('❌ No token found, redirecting to unauthorized');
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    try {
        const payload = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString()
        ) as JwtPayload;

        const { role, exp } = payload;

        // Expired → cookie delete + redirect
        if (exp && Date.now() >= exp * 1000) {
            const res = NextResponse.redirect(new URL("/unauthorized", req.url));
            res.cookies.delete("refreshToken");
            return res;
        }

        // RBAC check
        if (req.nextUrl.pathname.startsWith("/dashboard/admin") && role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (req.nextUrl.pathname.startsWith("/dashboard/student") && role !== "student") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (req.nextUrl.pathname.startsWith("/dashboard/super-admin") && role !== "super-admin") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    } catch (error) {
        const res = NextResponse.redirect(new URL("/login", req.url));
        res.cookies.delete("refreshToken");
        return res;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/dashboard/admin/:path*",
        "/dashboard/student/:path*",
        "/dashboard/super-admin/:path*"
    ],
};