import { NextResponse } from "next/server";
import { db } from "@/db";
import { friends, recipes } from "@/db/schema";
import { and, eq, ilike, inArray, or } from "drizzle-orm";
import { requireUser } from "@/lib/server-auth";
import { courseOptions, cuisineOptions, typeOptions } from "@/lib/enums";

function normalizeEnum(value, options) {
    if (!value) return options[0];
    const cleaned = value.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    return options.find((opt) => opt === cleaned) || options[0];
}

function normalizeArray(value) {
    if (!Array.isArray(value)) return [];
    return value.map((v) => (v == null ? "" : String(v))).filter((v) => v.length > 0);
}

export async function GET(req) {
    try {
        const user = await requireUser();
        const { searchParams } = new URL(req.url);
        const cuisine = searchParams.get("cuisine") || undefined;
        const course = searchParams.get("course") || undefined;
        const type = searchParams.get("type") || undefined;
        const search = searchParams.get("search") || undefined;

        const friendRows = await db
            .select({ friendId: friends.friendId })
            .from(friends)
            .where(eq(friends.ownerId, user.id));
        const friendIds = friendRows.map((f) => f.friendId);

        const visibility = friendIds.length
            ? or(eq(recipes.ownerId, user.id), inArray(recipes.ownerId, friendIds))
            : eq(recipes.ownerId, user.id);

        const conditions = [visibility];
        if (cuisine) conditions.push(eq(recipes.cuisine, cuisine));
        if (course) conditions.push(eq(recipes.course, course));
        if (type) conditions.push(eq(recipes.type, type));
        if (search) conditions.push(ilike(recipes.title, `%${search}%`));

        const whereClause = conditions.length ? and(...conditions) : undefined;
        const rows = await db.select().from(recipes).where(whereClause).orderBy(recipes.createdAt);

        return NextResponse.json({ data: rows });
    } catch (error) {
        if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        console.error("recipes GET", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = await requireUser();
        const body = await request.json();
        const payload = {
            title: body.title,
            description: body.description || null,
            cuisine: normalizeEnum(body.cuisine, cuisineOptions),
            type: normalizeEnum(body.type, typeOptions),
            course: normalizeEnum(body.course, courseOptions),
            nutrition: body.nutrition || null,
            ingredients: normalizeArray(body.ingredients),
            steps: normalizeArray(body.steps),
            image: body.image || null,
            link: body.link || null,
            ownerId: user.id,
        };

        const inserted = await db.insert(recipes).values(payload).returning();
        return NextResponse.json({ data: inserted[0] });
    } catch (error) {
        if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        console.error("recipes POST", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
