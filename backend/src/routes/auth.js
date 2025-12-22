import { Router } from "express";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { createSessionToken, sessionCookie, SESSION_COOKIE_NAME } from "../lib/auth.js";
import { getSessionUser } from "../lib/server-auth.js";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const result = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
        const user = result[0];
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const ok = await compare(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = await createSessionToken({ sub: user.id, email: user.email, name: user.name });
        const cookie = sessionCookie(token);

        res.cookie(cookie.name, cookie.value, cookie.options);
        res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch (error) {
        console.error("login error", error);
        res.status(500).json({ error: "Internal error" });
    }
});

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
        if (existing.length) {
            return res.status(409).json({ error: "Email already in use" });
        }

        const passwordHash = await hash(password, 10);
        const inserted = await db
            .insert(users)
            .values({ name, email: email.toLowerCase(), passwordHash })
            .returning();

        const user = inserted[0];
        const token = await createSessionToken({ sub: user.id, email: user.email, name: user.name });
        const cookie = sessionCookie(token);

        res.cookie(cookie.name, cookie.value, cookie.options);
        res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch (error) {
        console.error("signup error", error);
        res.status(500).json({ error: "Internal error" });
    }
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
    try {
        const user = await getSessionUser(req);
        if (!user) {
            return res.json({ user: null });
        }
        res.json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        console.error("me error", error);
        res.status(500).json({ error: "Internal error" });
    }
});

// POST /api/auth/logout
router.post("/logout", (_req, res) => {
    res.cookie(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
    res.json({ ok: true });
});

export default router;
