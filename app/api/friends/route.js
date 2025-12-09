import { NextResponse } from "next/server";
import { db } from "@/db";
import { friends, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { requireUser } from "@/lib/server-auth";

export async function GET() {
    try {
        const user = await requireUser();
        const rows = await db.select().from(friends).where(eq(friends.ownerId, user.id));
        return NextResponse.json({ data: rows });
    } catch (error) {
        if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        console.error("friends GET", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = await requireUser();
        const { email } = await request.json();
        if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

        const targetRes = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
        const target = targetRes[0];
        if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
        if (target.id === user.id) return NextResponse.json({ error: "Cannot add yourself" }, { status: 400 });

        const existing = await db
            .select()
            .from(friends)
            .where(and(eq(friends.ownerId, user.id), eq(friends.friendId, target.id)))
            .limit(1);
        if (existing.length) return NextResponse.json({ data: existing[0] });

        const inserted = await db
            .insert(friends)
            .values({ ownerId: user.id, friendId: target.id, friendName: target.name, friendEmail: target.email })
            .returning();
        return NextResponse.json({ data: inserted[0] });
    } catch (error) {
        if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        console.error("friends POST", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
