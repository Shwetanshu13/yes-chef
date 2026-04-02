import { NextResponse } from "next/server";

function getApiBaseUrl() {
    return process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:5000";
}

async function proxyJson(req, path) {
    const apiBaseUrl = getApiBaseUrl();

    const headers = new Headers();
    const auth = req.headers.get("authorization");
    const session = req.headers.get("x-session-token");

    if (auth) headers.set("authorization", auth);
    if (session) headers.set("x-session-token", session);

    const upstream = await fetch(`${apiBaseUrl}${path}`, {
        method: req.method,
        headers,
        cache: "no-store",
    });

    const text = await upstream.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = { error: text || "Upstream returned non-JSON" };
    }

    return NextResponse.json(data, { status: upstream.status });
}

export async function POST(req) {
    return proxyJson(req, "/api/auth/logout");
}
