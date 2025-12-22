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
            <div className="card p-6">
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
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-500">Create</p>
                <h1 className="text-3xl font-semibold">Add a recipe</h1>
                <p className="text-sm text-muted">Manual entry or let AI help.</p>
            </header>

            <section className="card grid gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Manual</h2>
                    <span className="text-xs uppercase tracking-wide text-muted">Full control</span>
                </div>
                <RecipeForm onSubmit={handleManual} busy={manualBusy} />
            </section>

            <section className="grid gap-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold">Semi AI</h2>
                    <p className="text-sm text-muted">Paste messy notes, we structure them.</p>
                </div>
                <textarea
                    className="input min-h-32"
                    placeholder="eg. yesterday I made pasta with tomatoes..."
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                />
                <button onClick={handleStructure} disabled={aiBusy} className="btn-primary self-start">
                    {aiBusy ? "Thinking..." : "Structure with AI"}
                </button>
                <div className="card p-4">
                    <p className="text-sm font-semibold">Review & tweak</p>
                    <RecipeForm initial={structured} onSubmit={saveStructured} busy={manualBusy} cta="Save structured" />
                </div>
            </section>

            <section className="card grid gap-3 p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold">Full AI</h2>
                    <p className="text-sm text-muted">Describe a dish; AI drafts it.</p>
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

            {message && <p className="text-sm text-emerald-500">{message}</p>}
        </div>
    );
}
