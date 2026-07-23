"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { withGuest } from "@/components/providers/routeGuards";

function SignupInner() {
    const router = useRouter();
    const search = useSearchParams();
    const redirectTo = search.get("redirect") || "/recipes";
    const { login } = useAuth();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Sign up failed");
            login(json.token, json.user);
            router.push(redirectTo);
        } catch (err) {
            setError(err?.message || "Sign up failed");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-md card p-6 sm:p-8">
            <h1 className="text-2xl font-semibold">Create your kitchen</h1>
            <p className="mt-2 text-sm text-muted">Store recipes and share with friends.</p>
            <form onSubmit={submit} className="mt-6 grid gap-4">
                <label className="grid gap-2 text-sm">
                    Name
                    <input
                        required
                        className="input"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                </label>
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
                <button type="submit" disabled={busy} className="btn-primary w-full">
                    {busy ? "Creating..." : "Create account"}
                </button>
            </form>
            <p className="mt-4 text-sm text-muted">
                Already have an account? <Link className="text-accent" href="/login">Sign in</Link>
            </p>
        </div>
    );
}

function SignupPage() {
    return (
        <Suspense fallback={null}>
            <SignupInner />
        </Suspense>
    );
}

export default withGuest(SignupPage);
