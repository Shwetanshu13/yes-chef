"use client";

export default function RecipeCard({ recipe, onSelect }) {
  return (
    <article
      className="card group flex cursor-pointer flex-col gap-3 overflow-hidden p-5 transition-all duration-300 hover:border-emerald-400/50 hover:shadow-2xl hover:-translate-y-1 relative"
      onClick={() => onSelect?.(recipe)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
      <div className="flex items-start justify-between gap-4 z-10">
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            {recipe.course}
          </p>
          <h3 className="text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-accent">
            {recipe.title}
          </h3>
          {recipe.description && (
            <p className="text-sm text-muted overflow-hidden text-ellipsis whitespace-nowrap">
              {recipe.description}
            </p>
          )}
        </div>
        {recipe.image && (
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border shadow-sm transition-transform duration-500 group-hover:scale-105 group-hover:shadow-md">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-muted z-10 pt-2">
        <Badge label={recipe.cuisine} />
        <Badge label={recipe.type} />
      </div>
    </article>
  );
}

function Badge({ label }) {
  if (!label) return null;
  return (
    <span className="rounded-full border border-border bg-background/50 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest backdrop-blur-sm transition-colors group-hover:border-accent/30 group-hover:bg-accent/10 group-hover:text-accent">
      {label}
    </span>
  );
}
