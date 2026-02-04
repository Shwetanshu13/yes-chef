import { Router } from "express";
import { generateRecipe, structureRecipe } from "../controllers/aiController.js";

const router = Router();

// POST /api/ai/structure
router.post("/structure", structureRecipe);

// POST /api/ai/generate
router.post("/generate", generateRecipe);

export default router;
