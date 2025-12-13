import { NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

const PROTECTED_PATHS = ["/recipes", "/friends"];
const AUTH_PAGES = ["/login", "/signup", "/"];

async function isAuthenticated(req) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return false;
    const payload = await verifySessionToken(token);
    return !!payload?.sub;
}

export async function proxy(req) {
    const { pathname } = req.nextUrl;
    const authed = await isAuthenticated(req);

    const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
    if (isProtected && !authed) {
        const url = new URL("/login", req.url);
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
    }

    const isAuthPage = AUTH_PAGES.includes(pathname);
    if (isAuthPage && authed) {
        return NextResponse.redirect(new URL("/recipes", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/login", "/signup", "/recipes/:path*", "/friends/:path*"],
};
