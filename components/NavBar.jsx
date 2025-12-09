"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/components/providers/AuthProvider";

const links = [
  { href: "/recipes", label: "Recipes" },
  { href: "/recipes/create", label: "Create" },
  { href: "/friends", label: "Friends" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 backdrop-blur border-b border-border/60 bg-[color:var(--card)]/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-[color:var(--foreground)]">
        <Link href="/" className="text-lg font-semibold text-emerald-500">
          yes-chef
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1 transition-colors ${
                pathname.startsWith(link.href)
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100"
                  : "text-[color:var(--foreground)]/70 hover:text-[color:var(--foreground)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <button
              onClick={logout}
              className="rounded-full border border-border px-3 py-1 text-sm text-[color:var(--foreground)] hover:bg-emerald-100/40"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-emerald-400 px-3 py-1 text-sm text-emerald-500 hover:bg-emerald-100/60"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
