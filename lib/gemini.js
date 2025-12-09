import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey && typeof window === "undefined") {
    console.warn("GEMINI_API_KEY missing. AI routes will fail until set.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const modelName = "gemini-2.5-flash-lite";

export async function structureRecipeText(rawText) {
    if (!genAI) throw new Error("Gemini client not configured");
    const model = genAI.getGenerativeModel({ model: modelName });
    const prompt = `You are a culinary data formatter. Cleanly structure the recipe text a user provides. Return JSON with fields: title, description, cuisine, type, course, nutrition {carbs,fats,protein,calories}, ingredients (array of strings), steps (array of strings), image(optional URL), link(optional). Do not add markdown. Respond with JSON only. Input: ${rawText}`;
    const res = await model.generateContent(prompt);
    const text = res.response.text();
    // console.log(text);
    return safeJson(text);
}

export async function generateRecipeFromPrompt(prompt) {
    if (!genAI) throw new Error("Gemini client not configured");
    const model = genAI.getGenerativeModel({ model: modelName });
    const systemPrompt = `You are a chef. Create a flavorful recipe from the prompt. Keep it concise but complete. Return JSON with fields: title, description, cuisine, type, course, nutrition {carbs,fats,protein,calories}, ingredients (array of strings), steps (array of strings). Include a short description.`;
    const res = await model.generateContent(`${systemPrompt}\nPrompt: ${prompt}`);
    const text = res.response.text();
    console.log(text);
    return safeJson(text);
}

function safeJson(text) {
    try {
        const cleaned = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleaned);
    } catch (error) {
        console.error("Failed to parse Gemini output", error, text);
        throw new Error("AI response could not be parsed");
    }
}
