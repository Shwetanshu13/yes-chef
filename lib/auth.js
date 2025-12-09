import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");
const cookieName = "yc_session";

export async function createSessionToken(payload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(secret);
}

export async function verifySessionToken(token) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (err) {
        return null;
    }
}

export function sessionCookie(token) {
    return {
        name: cookieName,
        value: token,
        options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
        },
    };
}

export const SESSION_COOKIE_NAME = cookieName;
