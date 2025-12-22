import { Router } from "express";
import multer from "multer";
import cloudinary from "../lib/cloudinary.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/uploads/image
router.post("/image", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "File missing" });
        }

        const buffer = req.file.buffer;
        const folder = process.env.CLOUDINARY_FOLDER || "yes-chef";

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder }, (error, uploadResult) => {
                if (error) return reject(error);
                resolve(uploadResult);
            });
            stream.end(buffer);
        });

        res.json({ url: result.secure_url, publicId: result.public_id });
    } catch (error) {
        console.error("upload error", error);
        res.status(500).json({ error: "Upload failed" });
    }
});

export default router;
