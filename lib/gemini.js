import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey && typeof window === "undefined") {
    console.warn("GEMINI_API_KEY missing. AI routes will fail until set.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const modelName = "gemini-2.5-flash-lite";

const cuisineMap = {
    french: "continental",
    italian: "continental",
    spanish: "continental",
    german: "continental",
    greek: "mediterranean",
    lebanese: "mediterranean",
    korean: "chinese",
    vietnamese: "thai",
    indian: "north_indian",
};

const courseMap = {
    breakfast: "appetizer",
    lunch: "main_course",
    dinner: "main_course",
};

function normalizeEnum(value, options, map = {}) {
    if (!value) return options[0];
    const cleaned = value.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    const mapped = map[cleaned];
    const candidate = mapped || cleaned;
    return options.find((opt) => opt === candidate) ? candidate : options[0];
}

export async function structureRecipeText(rawText) {
    if (!genAI) throw new Error("Gemini client not configured");
    const model = genAI.getGenerativeModel({ model: modelName });
    const prompt = `You are a culinary data formatter. Cleanly structure the recipe text a user provides. Return JSON with fields: title, description, cuisine, type, course, nutrition {carbs,fats,protein,calories}, ingredients (array of strings), steps (array of strings), image(optional URL), link(optional). Do not add markdown. Respond with JSON only. Input: ${rawText}`;
    const res = await model.generateContent(prompt);
    const text = res.response.text();
    // console.log(text);
    const data = safeJson(text);
    return normalizeRecipe(data);
}

export async function generateRecipeFromPrompt(prompt) {
    if (!genAI) throw new Error("Gemini client not configured");
    const model = genAI.getGenerativeModel({ model: modelName });
    const systemPrompt = `You are a chef. Create a flavorful recipe from the prompt. Keep it concise but complete. Return JSON with fields: title, description, cuisine, type, course, nutrition {carbs,fats,protein,calories}, ingredients (array of strings), steps (array of strings). Include a short description.`;
    const res = await model.generateContent(`${systemPrompt}\nPrompt: ${prompt}`);
    const text = res.response.text();
    // console.log(text);
    const data = safeJson(text);
    return normalizeRecipe(data);
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

function normalizeRecipe(data) {
    const cuisineOptions = [
        "continental",
        "north_indian",
        "south_indian",
        "english",
        "american",
        "chinese",
        "japanese",
        "mediterranean",
        "mexican",
        "thai",
    ];
    const typeOptions = ["veg", "non_veg", "vegan"];
    const courseOptions = ["starter", "appetizer", "main_course", "beverage", "dessert", "snack"];

    return {
        ...data,
        cuisine: normalizeEnum(data.cuisine, cuisineOptions, cuisineMap),
        type: normalizeEnum(data.type, typeOptions),
        course: normalizeEnum(data.course, courseOptions, courseMap),
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
        steps: Array.isArray(data.steps) ? data.steps : [],
    };
}
