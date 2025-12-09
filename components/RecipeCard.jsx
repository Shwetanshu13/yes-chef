"use client";

export default function RecipeCard({ recipe, onSelect }) {
  return (
    <article
      className="card flex cursor-pointer flex-col gap-2 p-4 transition hover:border-emerald-300/70 hover:shadow-xl"
      onClick={() => onSelect?.(recipe)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-emerald-500">
            {recipe.course}
          </p>
          <h3 className="text-lg font-semibold">{recipe.title}</h3>
          {recipe.description && (
            <p className="text-sm text-muted overflow-hidden text-ellipsis whitespace-nowrap">
              {recipe.description}
            </p>
          )}
        </div>
        {recipe.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.image}
            alt={recipe.title}
            className="h-16 w-16 rounded-lg object-cover border border-border"
          />
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-muted">
        <Badge label={recipe.cuisine} />
        <Badge label={recipe.type} />
      </div>
    </article>
  );
}

function Badge({ label }) {
  return (
    <span className="rounded-full border border-neutral-700 px-2 py-1 text-[11px] uppercase tracking-wide dark:border-neutral-300">
      {label}
    </span>
  );
}
