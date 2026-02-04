import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadsController.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/uploads/image
router.post("/image", upload.single("file"), uploadImage);

export default router;
