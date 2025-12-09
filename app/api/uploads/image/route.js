import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        const form = await request.formData();
        const file = form.get("file");
        if (!file) return NextResponse.json({ error: "File missing" }, { status: 400 });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const folder = process.env.CLOUDINARY_FOLDER || "yes-chef";

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder }, (error, uploadResult) => {
                if (error) return reject(error);
                resolve(uploadResult);
            });
            stream.end(buffer);
        });

        return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
    } catch (error) {
        console.error("upload error", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
