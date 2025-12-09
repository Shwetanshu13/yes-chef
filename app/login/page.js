"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";

export default function LoginPage() {
    const router = useRouter();
    const { refresh } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Login failed");
            await refresh();
            router.push("/recipes");
        } catch (err) {
            setError(err?.message || "Login failed");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="mx-auto max-w-md rounded-3xl border border-neutral-800/60 bg-neutral-900/70 p-8 text-neutral-100 dark:border-neutral-200 dark:bg-white">
            <h1 className="text-2xl font-semibold text-white dark:text-neutral-900">Welcome back</h1>
            <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-600">Sign in to save and share recipes.</p>
            <form onSubmit={submit} className="mt-6 grid gap-4">
                <label className="grid gap-2 text-sm">
                    Email
                    <input
                        type="email"
                        required
                        className="input"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                </label>
                <label className="grid gap-2 text-sm">
                    Password
                    <input
                        type="password"
                        required
                        className="input"
                        value={form.password}
                        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    />
                </label>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button type="submit" disabled={busy} className="btn-primary">
                    {busy ? "Signing in..." : "Sign in"}
                </button>
            </form>
            <p className="mt-4 text-sm text-neutral-400 dark:text-neutral-600">
                New here? <Link className="text-emerald-300 dark:text-emerald-700" href="/signup">Create an account</Link>
            </p>
        </div>
    );
}
