"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { fetchRecipes } from "@/lib/recipes";
import RecipeCard from "@/components/RecipeCard";
import RecipeFilters from "@/components/RecipeFilters";

export default function RecipesPage() {
    const { user, loading } = useAuth();
    const [filters, setFilters] = useState({ search: "", cuisine: "", course: "", type: "" });
    const [recipes, setRecipes] = useState([]);
    const [status, setStatus] = useState("idle");
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
                    <p className="text-sm uppercase tracking-[0.2em] text-emerald-300 dark:text-emerald-700">Your kitchen</p>
                    <h1 className="text-3xl font-semibold text-white dark:text-neutral-900">Recipes</h1>
                </div>
            </div>
            <RecipeFilters filters={filters} onChange={setFilters} />
            {status === "error" && <p className="text-red-400">Failed to load recipes.</p>}
            {status === "loading" && <p className="text-neutral-400">Loading recipes...</p>}
            {recipes.length === 0 && status === "done" && <p className="text-neutral-400">No recipes yet.</p>}
            <div className="grid gap-4 md:grid-cols-2">
                {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>
        </div>
    );
}
