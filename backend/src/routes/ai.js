import { Router } from "express";
import { structureRecipeText, generateRecipeFromPrompt } from "../lib/gemini.js";

const router = Router();

// POST /api/ai/structure
router.post("/structure", async (req, res) => {
    try {
        const { rawText } = req.body;
        if (!rawText) {
            return res.status(400).json({ error: "rawText required" });
        }
        const data = await structureRecipeText(rawText);
        res.json({ data });
    } catch (error) {
        console.error("structure AI error", error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/ai/generate
router.post("/generate", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "prompt required" });
        }
        const data = await generateRecipeFromPrompt(prompt);
        res.json({ data });
    } catch (error) {
        console.error("generate AI error", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
