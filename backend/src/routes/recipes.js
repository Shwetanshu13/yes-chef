import { Router } from "express";
import { and, eq, ilike, inArray, or } from "drizzle-orm";
import { db } from "../db/index.js";
import { friends, recipes } from "../db/schema.js";
import { authMiddleware } from "../lib/server-auth.js";
import { courseOptions, cuisineOptions, typeOptions } from "../lib/enums.js";

const router = Router();

function normalizeEnum(value, options) {
    if (!value) return options[0];
    const cleaned = value.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    return options.find((opt) => opt === cleaned) || options[0];
}

function normalizeArray(value) {
    if (!Array.isArray(value)) return [];
    return value.map((v) => (v == null ? "" : String(v))).filter((v) => v.length > 0);
}

// GET /api/recipes
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const { cuisine, course, type, search, scope = "all" } = req.query;

        const friendRows = await db
            .select({ friendId: friends.friendId })
            .from(friends)
            .where(eq(friends.ownerId, user.id));
        const friendIds = friendRows.map((f) => f.friendId);

        let visibility;
        if (scope === "mine") {
            visibility = eq(recipes.ownerId, user.id);
        } else if (scope === "friends") {
            if (!friendIds.length) return res.json({ data: [] });
            visibility = inArray(recipes.ownerId, friendIds);
        } else {
            visibility = friendIds.length
                ? or(eq(recipes.ownerId, user.id), inArray(recipes.ownerId, friendIds))
                : eq(recipes.ownerId, user.id);
        }

        const conditions = [visibility];
        if (cuisine) conditions.push(eq(recipes.cuisine, cuisine));
        if (course) conditions.push(eq(recipes.course, course));
        if (type) conditions.push(eq(recipes.type, type));
        if (search) conditions.push(ilike(recipes.title, `%${search}%`));

        const whereClause = conditions.length ? and(...conditions) : undefined;
        const rows = await db.select().from(recipes).where(whereClause).orderBy(recipes.createdAt);

        res.json({ data: rows });
    } catch (error) {
        console.error("recipes GET", error);
        res.status(500).json({ error: "Internal error" });
    }
});

// POST /api/recipes
router.post("/", authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const body = req.body;
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
        res.json({ data: inserted[0] });
    } catch (error) {
        console.error("recipes POST", error);
        res.status(500).json({ error: "Internal error" });
    }
});

// Helper for normalizing enum with fallback
function normalizeEnumWithFallback(value, options, fallback) {
    if (!value) return fallback;
    const cleaned = value.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    return options.find((opt) => opt === cleaned) || fallback;
}

function normalizeArrayWithFallback(value, fallback = []) {
    if (!Array.isArray(value)) return fallback;
    return value.map((v) => (v == null ? "" : String(v))).filter((v) => v.length > 0);
}

// PATCH /api/recipes/:id
router.patch("/:id", authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const body = req.body;

        const existing = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
        const recipe = existing[0];
        if (!recipe) {
            return res.status(404).json({ error: "Not found" });
        }
        if (recipe.ownerId !== user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const payload = {
            title: body.title ?? recipe.title,
            description: body.description ?? recipe.description,
            cuisine: normalizeEnumWithFallback(body.cuisine ?? recipe.cuisine, cuisineOptions, recipe.cuisine),
            type: normalizeEnumWithFallback(body.type ?? recipe.type, typeOptions, recipe.type),
            course: normalizeEnumWithFallback(body.course ?? recipe.course, courseOptions, recipe.course),
            nutrition: body.nutrition ?? recipe.nutrition,
            ingredients: normalizeArrayWithFallback(body.ingredients ?? recipe.ingredients, recipe.ingredients ?? []),
            steps: normalizeArrayWithFallback(body.steps ?? recipe.steps, recipe.steps ?? []),
            image: body.image ?? recipe.image,
            link: body.link ?? recipe.link,
        };

        const updated = await db.update(recipes).set(payload).where(eq(recipes.id, id)).returning();
        res.json({ data: updated[0] });
    } catch (error) {
        console.error("recipes PATCH", error);
        res.status(500).json({ error: "Internal error" });
    }
});

// DELETE /api/recipes/:id
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const existing = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
        const recipe = existing[0];
        if (!recipe) {
            return res.status(404).json({ error: "Not found" });
        }
        if (recipe.ownerId !== user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        await db.delete(recipes).where(eq(recipes.id, id));
        res.json({ ok: true });
    } catch (error) {
        console.error("recipes DELETE", error);
        res.status(500).json({ error: "Internal error" });
    }
});

export default router;
