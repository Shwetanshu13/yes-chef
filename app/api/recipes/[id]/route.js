import { NextResponse } from "next/server";
import { db } from "@/db";
import { recipes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/server-auth";

export async function PATCH(request, { params }) {
    try {
        const user = await requireUser();
        const { id } = params;
        const body = await request.json();

        const existing = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
        const recipe = existing[0];
        if (!recipe) return NextResponse.json({ error: "Not found" }, { status: 404 });
        if (recipe.ownerId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const payload = {
            title: body.title ?? recipe.title,
            description: body.description ?? recipe.description,
            cuisine: body.cuisine ?? recipe.cuisine,
            type: body.type ?? recipe.type,
            course: body.course ?? recipe.course,
            nutrition: body.nutrition ?? recipe.nutrition,
            ingredients: body.ingredients ?? recipe.ingredients,
            steps: body.steps ?? recipe.steps,
            image: body.image ?? recipe.image,
            link: body.link ?? recipe.link,
        };

        const updated = await db.update(recipes).set(payload).where(eq(recipes.id, id)).returning();
        return NextResponse.json({ data: updated[0] });
    } catch (error) {
        if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        console.error("recipes PATCH", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function DELETE(_req, { params }) {
    try {
        const user = await requireUser();
        const { id } = params;
        const existing = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
        const recipe = existing[0];
        if (!recipe) return NextResponse.json({ error: "Not found" }, { status: 404 });
        if (recipe.ownerId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        await db.delete(recipes).where(eq(recipes.id, id));
        return NextResponse.json({ ok: true });
    } catch (error) {
        if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        console.error("recipes DELETE", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
