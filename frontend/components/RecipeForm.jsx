"use client";

import {
  courseOptions,
  cuisineOptions,
  nutritionKeys,
  recipeDefaults,
  typeOptions,
} from "@/lib/enums";
import { uploadImageFile } from "@/lib/uploads";
import { useEffect, useState } from "react";

const normalizeForm = (value = {}) => ({
  title: value.title ?? "",
  description: value.description ?? "",
  cuisine: value.cuisine ?? cuisineOptions[0],
  type: value.type ?? typeOptions[0],
  course: value.course ?? courseOptions[0],
  nutrition: {
    carbs: value.nutrition?.carbs ?? "",
    fats: value.nutrition?.fats ?? "",
    protein: value.nutrition?.protein ?? "",
    calories: value.nutrition?.calories ?? "",
  },
  ingredients:
    Array.isArray(value.ingredients) && value.ingredients.length
      ? value.ingredients.map((v) => v ?? "")
      : [""],
  steps:
    Array.isArray(value.steps) && value.steps.length
      ? value.steps.map((v) => v ?? "")
      : [""],
  image: value.image ?? "",
  link: value.link ?? "",
});

export default function RecipeForm({
  initial = recipeDefaults,
  onSubmit,
  cta = "Save Recipe",
  busy,
  clearOnSubmit = true,
  onChange,
}) {
  const [form, setForm] = useState(normalizeForm(initial));
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    setForm(normalizeForm(initial));
  }, [initial]);

  const updateField = (key, value) =>
    setForm((f) => {
      const next = { ...f, [key]: value };
      onChange?.(next);
      return next;
    });
  const updateArray = (key, index, value) =>
    setForm((f) => {
      const next = {
        ...f,
        [key]: f[key].map((item, i) => (i === index ? value : item)),
      };
      onChange?.(next);
      return next;
    });

  const addRow = (key) =>
    setForm((f) => {
      const next = { ...f, [key]: [...f[key], ""] };
      onChange?.(next);
      return next;
    });

  const removeRow = (key, index) =>
    setForm((f) => {
      const next = {
        ...f,
        [key]: f[key].filter((_, i) => i !== index && f[key].length > 1),
      };
      onChange?.(next);
      return next;
    });

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
    if (clearOnSubmit) setForm(recipeDefaults);
  };

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await uploadImageFile(file);
      updateField("image", url);
    } catch (err) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm text-muted">Title</label>
        <input
          required
          className="input"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Spiced Paneer Tikka"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm text-muted">Description</label>
        <textarea
          className="input min-h-20"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Smoky, tangy paneer with peppers"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Select
          label="Cuisine"
          value={form.cuisine}
          onChange={(v) => updateField("cuisine", v)}
          options={cuisineOptions}
        />
        <Select
          label="Course"
          value={form.course}
          onChange={(v) => updateField("course", v)}
          options={courseOptions}
        />
        <Select
          label="Type"
          value={form.type}
          onChange={(v) => updateField("type", v)}
          options={typeOptions}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {nutritionKeys.map((key) => (
          <Input
            key={key}
            label={key}
            value={form.nutrition?.[key] || ""}
            onChange={(v) =>
              setForm((f) => ({
                ...f,
                nutrition: { ...f.nutrition, [key]: v },
              }))
            }
            placeholder={key === "calories" ? "320 kcal" : ""}
          />
        ))}
      </div>
      <ListField
        label="Ingredients"
        items={form.ingredients}
        onChange={(idx, val) => updateArray("ingredients", idx, val)}
        onAdd={() => addRow("ingredients")}
        onRemove={(idx) => removeRow("ingredients", idx)}
      />
      <ListField
        label="Steps"
        items={form.steps}
        onChange={(idx, val) => updateArray("steps", idx, val)}
        onAdd={() => addRow("steps")}
        onRemove={(idx) => removeRow("steps", idx)}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="Image URL"
          value={form.image}
          onChange={(v) => updateField("image", v)}
          placeholder="https://...jpg"
        />
        <label className="grid gap-1 text-sm text-muted">
          Upload image
          <input
            type="file"
            accept="image/*"
            className="input"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {uploading && (
            <span className="text-xs text-muted">Uploading...</span>
          )}
          {uploadError && (
            <span className="text-xs text-red-400">{uploadError}</span>
          )}
        </label>
        <Input
          label="Reference link"
          value={form.link}
          onChange={(v) => updateField("link", v)}
          placeholder="Optional"
        />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:brightness-95 disabled:opacity-60"
      >
        {busy ? "Saving..." : cta}
      </button>
    </form>
  );
}

function ListField({ label, items, onChange, onAdd, onRemove }) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>{label}</span>
        <button
          type="button"
          onClick={onAdd}
          className="text-emerald-300 hover:text-emerald-200"
        >
          + add
        </button>
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            className="input flex-1"
            value={item}
            onChange={(e) => onChange(idx, e.target.value)}
            placeholder={`${label} ${idx + 1}`}
          />
          <button
            type="button"
            className="rounded-lg border border-neutral-700 px-2 py-2 text-xs text-neutral-300 hover:border-red-400"
            onClick={() => onRemove(idx)}
            disabled={items.length === 1}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <label className="grid gap-1 text-sm text-muted">
      {label}
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="grid gap-1 text-sm text-muted">
      {label}
      <select
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
