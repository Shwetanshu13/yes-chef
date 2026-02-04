import { authFetch } from "./auth";

export async function saveManualRecipe(data) {
    const res = await authFetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to save recipe");
    return json.data;
}

export async function saveStructuredRecipe(data) {
    return saveManualRecipe(data);
}

export async function updateRecipe(id, data) {
    const res = await authFetch(`/api/recipes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to update recipe");
    return json.data;
}

export async function deleteRecipe(id) {
    const res = await authFetch(`/api/recipes/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to delete recipe");
    return json;
}

export async function fetchRecipes(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
        if (v) params.set(k, v);
    });
    const res = await authFetch(`/api/recipes?${params.toString()}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to load recipes");
    return json.data;
}

export async function fetchFriends() {
    const res = await authFetch("/api/friends");
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to load friends");
    return json.data;
}

export async function addFriend(email) {
    const res = await authFetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to add friend");
    return json.data;
}
