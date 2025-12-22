import { NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

const PROTECTED_PATHS = ["/recipes", "/friends"];
const AUTH_PAGES = ["/login", "/signup", "/"];

function extractBearerToken(headerValue) {
    if (!headerValue) return null;
    const parts = headerValue.split(" ");
    return parts.length === 2 ? parts[1] : headerValue;
}

function getTokenFromRequest(req) {
    const cookieToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (cookieToken) return cookieToken;
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    return extractBearerToken(authHeader) || req.headers.get("x-session-token") || null;
}

async function isAuthenticated(req) {
    const token = getTokenFromRequest(req);
    if (!token) return false;
    const payload = await verifySessionToken(token);
    return !!payload?.sub;
}

function isMobile(req) {
    const ua = req.headers.get("user-agent") || "";
    return ua.includes("Expo") || ua.includes("ReactNative");
}


export async function proxy(req) {
    const { pathname } = req.nextUrl;
    const authed = await isAuthenticated(req);
    const mobile = isMobile(req);

    const isProtected = PROTECTED_PATHS.some((path) =>
        pathname.startsWith(path)
    );

    if (isProtected && !authed) {
        if (mobile) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const url = new URL("/login", req.url);
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
    }

    const isAuthPage = AUTH_PAGES.includes(pathname);
    if (isAuthPage && authed && !mobile) {
        return NextResponse.redirect(new URL("/recipes", req.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: ["/", "/login", "/signup", "/recipes/:path*", "/friends/:path*"],
};
