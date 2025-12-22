"use client";

import { useState } from "react";
import RecipeForm from "./RecipeForm";
import { updateRecipe } from "@/lib/recipes";
import { useToast } from "./providers/ToastProvider";

export default function RecipeDetail({
  recipe,
  onClose,
  onDelete,
  onUpdate,
  currentUserId,
}) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!recipe) return null;

  const canEdit =
    recipe?.ownerId && currentUserId && recipe.ownerId === currentUserId;

  const handleUpdate = async (data) => {
    if (!canEdit) {
      toast({
        title: "Not allowed",
        description: "You can only edit your own recipes.",
        type: "error",
      });
      return;
    }
    setBusy(true);
    try {
      const updated = await updateRecipe(recipe.id, data);
      onUpdate?.(updated);
      toast({ title: "Recipe updated", description: "Changes saved." });
      setEditing(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: error?.message || "Unable to save changes.",
        type: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-neutral-950/80 p-4 backdrop-blur-sm">
      <div className="card relative max-h-[90vh] w-full max-w-4xl overflow-y-auto p-6">
        <button
          className="absolute right-3 top-3 text-sm text-muted hover:text-accent cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          Close
        </button>

        {editing ? (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Edit recipe</h2>
              {canEdit && (
                <button
                  className="text-sm text-muted hover:text-emerald-500"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              )}
            </div>
            <RecipeForm
              initial={recipe}
              onSubmit={handleUpdate}
              busy={busy}
              clearOnSubmit={false}
              cta={busy ? "Saving..." : "Save changes"}
            />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="h-32 w-32 rounded-xl object-cover border border-border"
                />
              )}
              <div className="flex-1 space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-500">
                  {recipe.course}
                </p>
                <h2 className="text-2xl font-semibold">{recipe.title}</h2>
                {recipe.description && (
                  <p className="text-muted">{recipe.description}</p>
                )}
                <div className="flex flex-wrap gap-2 text-xs text-muted">
                  {recipe.cuisine && <Pill label={recipe.cuisine} />}
                  {recipe.type && <Pill label={recipe.type} />}
                  {recipe.link && (
                    <a
                      href={recipe.link}
                      className="rounded-full border border-border px-3 py-1 hover:border-emerald-400"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source
                    </a>
                  )}
                </div>
              </div>
            </div>

            {Array.isArray(recipe.ingredients) &&
              recipe.ingredients.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Ingredients</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
                    {recipe.ingredients.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

            {Array.isArray(recipe.steps) && recipe.steps.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Steps</h3>
                <ol className="list-decimal space-y-2 pl-5 text-sm text-muted">
                  {recipe.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {recipe.nutrition && (
              <div className="grid grid-cols-2 gap-2 text-xs text-muted sm:grid-cols-3">
                {Object.entries(recipe.nutrition).map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-lg border border-border px-3 py-2"
                  >
                    <p className="uppercase tracking-wide text-[10px] text-muted">
                      {k}
                    </p>
                    <p className="font-semibold text-foreground">{v}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {canEdit && (
                <>
                  <button
                    className="rounded-full border border-border px-4 py-2 text-sm cursor-pointer hover:border-emerald-400"
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-full border border-red-400/70 px-4 py-2 text-sm cursor-pointer text-red-500 hover:border-red-500"
                    onClick={onDelete}
                  >
                    Delete
                  </button>
                </>
              )}
              {!canEdit && (
                <p className="text-sm text-muted">
                  You can only edit your own recipes.
                </p>
              )}
              <button
                className="rounded-full border border-border px-4 py-2 text-sm cursor-pointer text-muted hover:border-emerald-400"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Pill({ label }) {
  return (
    <span className="rounded-full border border-border px-3 py-1 text-xs">
      {label}
    </span>
  );
}
