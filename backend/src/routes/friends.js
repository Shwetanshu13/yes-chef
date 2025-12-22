import { Router } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { friends, users } from "../db/schema.js";
import { authMiddleware } from "../lib/server-auth.js";

const router = Router();

// GET /api/friends
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const rows = await db.select().from(friends).where(eq(friends.ownerId, user.id));
        res.json({ data: rows });
    } catch (error) {
        console.error("friends GET", error);
        res.status(500).json({ error: "Internal error" });
    }
});

// POST /api/friends
router.post("/", authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email required" });
        }

        const targetRes = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
        const target = targetRes[0];
        if (!target) {
            return res.status(404).json({ error: "User not found" });
        }
        if (target.id === user.id) {
            return res.status(400).json({ error: "Cannot add yourself" });
        }

        const existing = await db
            .select()
            .from(friends)
            .where(and(eq(friends.ownerId, user.id), eq(friends.friendId, target.id)))
            .limit(1);
        if (existing.length) {
            return res.json({ data: existing[0] });
        }

        const inserted = await db
            .insert(friends)
            .values({ ownerId: user.id, friendId: target.id, friendName: target.name, friendEmail: target.email })
            .returning();
        res.json({ data: inserted[0] });
    } catch (error) {
        console.error("friends POST", error);
        res.status(500).json({ error: "Internal error" });
    }
});

export default router;
