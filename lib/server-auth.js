import { cookies, headers } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { eq } from "drizzle-orm";

function extractBearerToken(headerValue) {
    if (!headerValue) return null;
    const parts = headerValue.split(" ");
    return parts.length === 2 ? parts[1] : headerValue;
}

async function getSessionToken() {
    const cookieStore = cookies();
    const tokenFromCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (tokenFromCookie) return tokenFromCookie;

    const headerStore = headers();
    const authHeader = headerStore.get("authorization") || headerStore.get("Authorization");
    const headerToken = extractBearerToken(authHeader) || headerStore.get("x-session-token");
    return headerToken || null;
}

export async function getSessionUser() {
    const token = await getSessionToken();
    if (!token) return null;
    const payload = await verifySessionToken(token);
    if (!payload?.sub) return null;
    const result = await db.select().from(users).where(eq(users.id, payload.sub)).limit(1);
    return result[0] || null;
}

export async function requireUser() {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");
    return user;
}
