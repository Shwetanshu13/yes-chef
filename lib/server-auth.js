import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function getSessionUser() {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
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
