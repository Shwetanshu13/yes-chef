import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { createSessionToken, sessionCookie } from "@/lib/auth";

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body || {};
        if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

        const result = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
        const user = result[0];
        if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

        const ok = await compare(password, user.passwordHash);
        if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

        const token = await createSessionToken({ sub: user.id, email: user.email, name: user.name });
        const cookie = sessionCookie(token);
        const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
        res.cookies.set(cookie.name, cookie.value, cookie.options);
        return res;
    } catch (error) {
        console.error("login error", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
