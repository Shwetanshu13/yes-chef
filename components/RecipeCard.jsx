"use client";

export default function RecipeCard({ recipe }) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-neutral-800/60 bg-linear-to-br from-neutral-900 to-neutral-950 p-5 text-neutral-50 shadow-lg dark:from-white dark:to-neutral-100 dark:border-neutral-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-300 dark:text-emerald-700">
            {recipe.course}
          </p>
          <h3 className="text-xl font-semibold text-white dark:text-neutral-900">
            {recipe.title}
          </h3>
          {recipe.description && (
            <p className="text-sm text-neutral-300 dark:text-neutral-600">
              {recipe.description}
            </p>
          )}
        </div>
        {recipe.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.image}
            alt={recipe.title}
            className="h-20 w-20 rounded-lg object-cover border border-neutral-800/60"
          />
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-neutral-300 dark:text-neutral-700">
        <Badge label={recipe.cuisine} />
        <Badge label={recipe.type} />
        {recipe.link && (
          <a
            className="rounded-full border border-neutral-600 px-2 py-1 hover:border-emerald-400"
            href={recipe.link}
            target="_blank"
            rel="noreferrer"
          >
            Link
          </a>
        )}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-neutral-100 dark:text-neutral-800">
          Ingredients
        </h4>
        <ul className="mt-2 list-disc pl-5 text-sm text-neutral-300 dark:text-neutral-700">
          {recipe.ingredients?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-neutral-100 dark:text-neutral-800">
          Steps
        </h4>
        <ol className="mt-2 list-decimal pl-5 text-sm text-neutral-300 dark:text-neutral-700">
          {recipe.steps?.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>
      {recipe.nutrition && (
        <div className="grid grid-cols-2 gap-2 text-xs text-neutral-200 dark:text-neutral-700">
          {Object.entries(recipe.nutrition).map(([k, v]) => (
            <div
              key={k}
              className="rounded-lg border border-neutral-700/70 px-3 py-2 dark:border-neutral-200"
            >
              <p className="uppercase tracking-wide text-[10px] text-neutral-400 dark:text-neutral-500">
                {k}
              </p>
              <p className="font-semibold text-neutral-100 dark:text-neutral-800">
                {v}
              </p>
            </div>
          ))}
        </div>
      )}
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
