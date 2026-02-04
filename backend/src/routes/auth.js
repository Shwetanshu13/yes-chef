import { Router } from "express";
import { login, logout, me, signup } from "../controllers/authController.js";

const router = Router();

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/signup
router.post("/signup", signup);

// GET /api/auth/me
router.get("/me", me);

// POST /api/auth/logout
router.post("/logout", logout);

export default router;
