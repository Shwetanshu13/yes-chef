"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { addFriend, fetchFriends } from "@/lib/recipes";
import { useEffect, useState } from "react";

export default function FriendsPage() {
    const { user } = useAuth();
    const [email, setEmail] = useState("");
    const [friends, setFriends] = useState([]);
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (!user) return;
        fetchFriends().then(setFriends).catch(console.error);
    }, [user]);

    if (!user)
        return (
            <div className="card p-6">
                <p>Please sign in to manage friends.</p>
            </div>
        );

    const invite = async () => {
        setBusy(true);
        setMessage("");
        try {
            const doc = await addFriend(email);
            setFriends((f) => [...f, doc]);
            setMessage("Friend added. They need to share recipes to see them.");
            setEmail("");
        } catch (error) {
            setMessage(error?.message || "Could not add");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="grid gap-6">
            <header className="grid gap-2">
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-500">Friends</p>
                <h1 className="text-3xl font-semibold">Share and browse</h1>
                <p className="text-sm text-muted">Add friends by email to see their recipes.</p>
            </header>

            <div className="card p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                        className="input"
                        placeholder="friend@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={invite} disabled={busy} className="btn-primary sm:w-40">
                        {busy ? "Adding..." : "Add friend"}
                    </button>
                </div>
                {message && <p className="mt-3 text-sm text-emerald-500">{message}</p>}
            </div>

            <div className="grid gap-3">
                <h2 className="text-xl font-semibold">Your circle</h2>
                {friends.length === 0 && <p className="text-muted">No friends yet.</p>}
                <div className="grid gap-3 sm:grid-cols-2">
                    {friends.map((f) => (
                        <div key={f.id} className="card p-4">
                            <p className="text-sm font-semibold">{f.friendName || f.friendEmail}</p>
                            <p className="text-xs text-muted">{f.friendEmail}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
