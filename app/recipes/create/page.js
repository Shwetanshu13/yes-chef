"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import RecipeForm from "@/components/RecipeForm";
import { recipeDefaults } from "@/lib/enums";
import { saveManualRecipe, saveStructuredRecipe } from "@/lib/recipes";
import { useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";

export default function CreateRecipePage() {
    const { user } = useAuth();
    const [manualBusy, setManualBusy] = useState(false);
    const [aiBusy, setAiBusy] = useState(false);
    const { toast } = useToast();
    const [structured, setStructured] = useState(recipeDefaults);
    const [rawText, setRawText] = useState("");
    const [aiPrompt, setAiPrompt] = useState("");
    const [message, setMessage] = useState("");

    if (!user)
        return (
            <div className="rounded-2xl border border-neutral-800/60 bg-neutral-900/70 p-6 text-neutral-100 dark:border-neutral-200 dark:bg-white">
                <p>Please sign in to create recipes.</p>
            </div>
        );

    const handleManual = async (data) => {
        setManualBusy(true);
        setMessage("");
        try {
            await saveManualRecipe(data);
            setMessage("Recipe saved.");
        } catch (error) {
            setMessage(error?.message || "Save failed");
            toast({ title: "Recipe saved" });
            setStructured(recipeDefaults);
        } finally {
            setManualBusy(false);
        }
    };

    const handleStructure = async () => {
        setAiBusy(true);
        setMessage("");
        try {
            const res = await fetch("/api/ai/structure", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rawText }),
            });
            const json = await res.json();
            // console.log(json);
            if (!res.ok) throw new Error(json.error || "AI failed");
            setStructured({ ...recipeDefaults, ...json.data });
            toast({ title: "Structured recipe ready" });
            setMessage("Structured draft ready to review.");
        } catch (error) {
            setMessage(error.message);
            toast({ title: "AI failed", description: error.message, type: "error" });
        } finally {
            setAiBusy(false);
        }
    };

    const handleGenerate = async () => {
        setAiBusy(true);
        setMessage("");
        try {
            const res = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: aiPrompt }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "AI failed");
            setStructured({ ...recipeDefaults, ...json.data });
            toast({ title: "Generated recipe ready" });
            setMessage("AI draft ready to review.");
        } catch (error) {
            setMessage(error.message);
            toast({ title: "AI failed", description: error.message, type: "error" });
        } finally {
            setAiBusy(false);
        }
    };

    const saveStructured = async (data) => {
        setManualBusy(true);
        setMessage("");
        try {
            await saveStructuredRecipe(data);
            setMessage("AI recipe saved.");
        } catch (error) {
            toast({ title: "Save failed", description: error?.message, type: "error" });
            setMessage(error?.message || "Save failed");
        } finally {
            setManualBusy(false);
        }
    };

    return (
        <div className="grid gap-10">
            <header className="grid gap-2">
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-300 dark:text-emerald-700">Create</p>
                <h1 className="text-3xl font-semibold text-white dark:text-neutral-900">Add a recipe</h1>
                <p className="text-sm text-neutral-400 dark:text-neutral-600">Manual entry or let AI help.</p>
            </header>

            <section className="grid gap-4 rounded-3xl border border-neutral-800/60 bg-neutral-900/70 p-6 text-neutral-100 shadow-lg dark:border-neutral-200 dark:bg-white">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white dark:text-neutral-900">Manual</h2>
                    <span className="text-xs uppercase tracking-wide text-neutral-400">Full control</span>
                </div>
                <RecipeForm onSubmit={handleManual} busy={manualBusy} />
            </section>

            <section className="grid gap-4 rounded-3xl border border-emerald-500/30 bg-linear-to-br from-emerald-900/40 via-neutral-900 to-neutral-950 p-6 text-neutral-100 shadow-lg dark:from-emerald-100/60 dark:via-white dark:to-white dark:text-neutral-900">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold">Semi AI</h2>
                    <p className="text-sm text-neutral-300 dark:text-neutral-600">Paste messy notes, we structure them.</p>
                </div>
                <textarea
                    className="input min-h-32 bg-neutral-950/70 dark:bg-white"
                    placeholder="eg. yesterday I made pasta with tomatoes..."
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                />
                <button onClick={handleStructure} disabled={aiBusy} className="btn-primary self-start">
                    {aiBusy ? "Thinking..." : "Structure with AI"}
                </button>
                <div className="rounded-2xl border border-neutral-800/60 bg-neutral-900/60 p-4 dark:border-neutral-200 dark:bg-white">
                    <p className="text-sm font-semibold text-neutral-200 dark:text-neutral-800">Review & tweak</p>
                    <RecipeForm initial={structured} onSubmit={saveStructured} busy={manualBusy} cta="Save structured" />
                </div>
            </section>

            <section className="grid gap-3 rounded-3xl border border-neutral-800/60 bg-neutral-900/70 p-6 text-neutral-100 shadow-lg dark:border-neutral-200 dark:bg-white">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold">Full AI</h2>
                    <p className="text-sm text-neutral-300 dark:text-neutral-600">Describe a dish; Gemini drafts it.</p>
                </div>
                <input
                    className="input"
                    placeholder="Paneer butter masala for 2, creamy, spicy"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                />
                <button onClick={handleGenerate} disabled={aiBusy} className="btn-primary self-start">
                    {aiBusy ? "Cooking..." : "Generate recipe"}
                </button>
            </section>

            {message && <p className="text-sm text-emerald-300 dark:text-emerald-700">{message}</p>}
        </div>
    );
}
