"use client";

import { courseOptions, cuisineOptions, typeOptions } from "@/lib/enums";

export default function RecipeFilters({ filters, onChange }) {
  const handle = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap gap-3 rounded-xl border border-neutral-800/60 bg-neutral-900/70 p-4 text-sm text-neutral-100 dark:border-neutral-200 dark:bg-white">
      <input
        placeholder="Search title"
        className="min-w-[180px] rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none dark:border-neutral-300"
        value={filters.search || ""}
        onChange={(e) => handle("search", e.target.value)}
      />
      <Select
        label="Cuisine"
        value={filters.cuisine}
        onChange={(v) => handle("cuisine", v)}
        options={cuisineOptions}
      />
      <Select
        label="Course"
        value={filters.course}
        onChange={(v) => handle("course", v)}
        options={courseOptions}
      />
      <Select
        label="Type"
        value={filters.type}
        onChange={(v) => handle("type", v)}
        options={typeOptions}
      />
      <button
        className="rounded-lg border border-neutral-700 px-3 py-2 hover:border-emerald-400 dark:border-neutral-300"
        onClick={() =>
          onChange({ search: "", cuisine: "", course: "", type: "" })
        }
      >
        Clear
      </button>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex items-center gap-2 text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-600">
      {label}
      <select
        className="rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-2 text-sm text-neutral-100 focus:border-emerald-400 focus:outline-none dark:bg-white dark:text-neutral-800 dark:border-neutral-300"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Any</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
