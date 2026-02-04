import { authFetch } from "./auth";

export async function uploadImageFile(file) {
    if (!file) throw new Error("No file provided");
    const form = new FormData();
    form.append("file", file);
    const res = await authFetch("/api/uploads/image", {
        method: "POST",
        body: form,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Upload failed");
    return json.url;
}
