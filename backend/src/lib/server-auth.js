import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./auth.js";
import { eq } from "drizzle-orm";

function extractBearerToken(headerValue) {
    if (!headerValue) return null;
    const parts = headerValue.split(" ");
    return parts.length === 2 ? parts[1] : headerValue;
}

function getSessionToken(req) {
    // Try cookie first (web clients)
    const tokenFromCookie = req.cookies?.[SESSION_COOKIE_NAME];
    if (tokenFromCookie) return tokenFromCookie;

    // Try Authorization header (mobile clients)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const headerToken = extractBearerToken(authHeader) || req.headers["x-session-token"];
    return headerToken || null;
}

export async function getSessionUser(req) {
    const token = getSessionToken(req);
    if (!token) return null;
    const payload = await verifySessionToken(token);
    if (!payload?.sub) return null;
    const result = await db.select().from(users).where(eq(users.id, payload.sub)).limit(1);
    return result[0] || null;
}

export async function requireUser(req) {
    const user = await getSessionUser(req);
    if (!user) throw new Error("Unauthorized");
    return user;
}

// Express middleware for protected routes
export function authMiddleware(req, res, next) {
    getSessionUser(req)
        .then((user) => {
            if (!user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            req.user = user;
            next();
        })
        .catch((err) => {
            console.error("Auth middleware error:", err);
            res.status(500).json({ error: "Internal error" });
        });
}
