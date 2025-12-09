import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { createSessionToken, sessionCookie } from "@/lib/auth";

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password } = body || {};
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
        if (existing.length) {
            return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }

        const passwordHash = await hash(password, 10);
        const inserted = await db
            .insert(users)
            .values({ name, email: email.toLowerCase(), passwordHash })
            .returning();

        const user = inserted[0];
        const token = await createSessionToken({ sub: user.id, email: user.email, name: user.name });
        const cookie = sessionCookie(token);

        const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
        res.cookies.set(cookie.name, cookie.value, cookie.options);
        return res;
    } catch (error) {
        console.error("signup error", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
