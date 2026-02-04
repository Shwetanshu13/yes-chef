import { Router } from "express";
import { authMiddleware } from "../lib/server-auth.js";
import { addFriend, listFriends } from "../controllers/friendsController.js";

const router = Router();

// GET /api/friends
router.get("/", authMiddleware, listFriends);

// POST /api/friends
router.post("/", authMiddleware, addFriend);

export default router;
