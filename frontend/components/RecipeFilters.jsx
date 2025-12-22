"use client";

import { courseOptions, cuisineOptions, typeOptions } from "@/lib/enums";

export default function RecipeFilters({ filters, onChange }) {
  const handle = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="card flex flex-wrap gap-3 p-4 text-sm">
      <input
        placeholder="Search title"
        className="input min-w-[180px]"
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
        options={["mine", "friends"]}
      />
      <button
        className="rounded-lg border border-border px-3 py-2 hover:border-emerald-400"
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

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted">
      {label}
      <select
        className="rounded-lg border border-border px-2 py-2 text-sm focus:border-emerald-400 focus:outline-none"
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
