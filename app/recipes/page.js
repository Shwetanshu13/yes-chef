"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { deleteRecipe, fetchRecipes } from "@/lib/recipes";
import RecipeCard from "@/components/RecipeCard";
import RecipeDetail from "@/components/RecipeDetail";
import RecipeFilters from "@/components/RecipeFilters";

export default function RecipesPage() {
    const { user, loading } = useAuth();
    const { toast } = useToast();
    const [filters, setFilters] = useState({ search: "", cuisine: "", course: "", type: "" });
    const [recipes, setRecipes] = useState([]);
    const [status, setStatus] = useState("idle");
    const [selected, setSelected] = useState(null);
    useEffect(() => {
        if (!user) return;
        const load = async () => {
            setStatus("loading");
            try {
                const res = await fetchRecipes(filters);
                setRecipes(res || []);
                setStatus("done");
            } catch (error) {
                console.error(error);
                setStatus("error");
            }
        };
        load();
    }, [user, JSON.stringify(filters)]);

    if (loading) return <p>Loading...</p>;
    if (!user)
        return (
            <div className="rounded-2xl border border-neutral-800/60 bg-neutral-900/70 p-6 text-neutral-100 dark:border-neutral-200 dark:bg-white">
                <p>Please sign in to view recipes.</p>
            </div>
        );

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-emerald-500">Your kitchen</p>
                    <h1 className="text-3xl font-semibold">Recipes</h1>
                </div>
            </div>
            <RecipeFilters filters={filters} onChange={setFilters} />
            {status === "error" && <p className="text-red-400">Failed to load recipes.</p>}
            {status === "loading" && <p className="text-neutral-400">Loading recipes...</p>}
            {recipes.length === 0 && status === "done" && <p className="text-neutral-400">No recipes yet.</p>}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} onSelect={setSelected} />
                ))}
            </div>
            {selected && (
                <RecipeDetail
                    recipe={selected}
                    onClose={() => setSelected(null)}
                    onDelete={async () => {
                        try {
                            await deleteRecipe(selected.id);
                            setRecipes((list) => list.filter((r) => r.id !== selected.id));
                            setSelected(null);
                            toast({ title: "Recipe deleted", description: "Removed from your cookbook." });
                        } catch (error) {
                            toast({ title: "Delete failed", description: error.message, type: "error" });
                        }
                    }}
                    onUpdate={(updated) => {
                        setRecipes((list) => list.map((r) => (r.id === updated.id ? updated : r)));
                        setSelected(updated);
                    }}
                />
            )}
        </div>
    );
}
