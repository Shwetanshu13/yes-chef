"use client";

import { courseOptions, cuisineOptions, typeOptions } from "@/lib/enums";

export default function RecipeFilters({ filters, onChange }) {
  const handle = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="card grid grid-cols-1 gap-3 p-4 text-sm sm:grid-cols-6">
      <input
        placeholder="Search title"
        className="input sm:col-span-2"
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
      <Select
        label="Scope"
        value={filters.scope}
        onChange={(v) => handle("scope", v)}
        options={["all", "mine", "friends"]}
        includeAny={false}
      />
      <button
        type="button"
        className="rounded-xl border border-border px-3 py-2 hover:border-emerald-400 sm:col-span-1"
        onClick={() =>
          onChange({
            search: "",
            cuisine: "",
            course: "",
            type: "",
            scope: "all",
          })
        }
      >
        Clear
      </button>
    </div>
  );
}

function Select({ label, value, onChange, options, includeAny = true }) {
  return (
    <label className="grid gap-1 text-xs uppercase tracking-wide text-muted">
      <span>{label}</span>
      <select
        className="input"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {includeAny && <option value="">Any</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
