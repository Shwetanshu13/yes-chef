import cloudinary from "../lib/cloudinary.js";

export async function uploadImage(req, res) {
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
}
