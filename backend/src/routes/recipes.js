import { Router } from "express";
import { authMiddleware } from "../lib/server-auth.js";
import { createRecipe, deleteRecipe, listRecipes, updateRecipe } from "../controllers/recipesController.js";

const router = Router();

// GET /api/recipes
router.get("/", authMiddleware, listRecipes);

// POST /api/recipes
router.post("/", authMiddleware, createRecipe);

// PATCH /api/recipes/:id
router.patch("/:id", authMiddleware, updateRecipe);

// DELETE /api/recipes/:id
router.delete("/:id", authMiddleware, deleteRecipe);

export default router;
