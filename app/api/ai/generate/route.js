import { NextResponse } from "next/server";
import { generateRecipeFromPrompt } from "@/lib/gemini";

export async function POST(request) {
    try {
        const { prompt } = await request.json();
        if (!prompt) return NextResponse.json({ error: "prompt required" }, { status: 400 });
        const data = await generateRecipeFromPrompt(prompt);
        return NextResponse.json({ data });
    } catch (error) {
        console.error("generate AI error", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
