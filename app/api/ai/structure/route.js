import { NextResponse } from "next/server";
import { structureRecipeText } from "@/lib/gemini";

export async function POST(request) {
    try {
        const { rawText } = await request.json();
        if (!rawText) return NextResponse.json({ error: "rawText required" }, { status: 400 });
        const data = await structureRecipeText(rawText);
        return NextResponse.json({ data });
    } catch (error) {
        console.error("structure AI error", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
