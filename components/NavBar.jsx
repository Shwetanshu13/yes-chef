"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/app/providers/AuthProvider";

const links = [
  { href: "/recipes", label: "Recipes" },
  { href: "/recipes/create", label: "Create" },
  { href: "/friends", label: "Friends" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 backdrop-blur border-b border-neutral-800/60 bg-black/40 dark:bg-white/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold text-emerald-300 dark:text-emerald-600"
        >
          yes-chef
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1 transition-colors ${
                pathname.startsWith(link.href)
                  ? "bg-emerald-400/20 text-emerald-200 dark:text-emerald-700"
                  : "text-neutral-200 hover:text-white dark:text-neutral-800 dark:hover:text-black"
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
              className="rounded-full border border-neutral-500 px-3 py-1 text-sm text-neutral-100 hover:bg-neutral-800 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-emerald-400 px-3 py-1 text-sm text-emerald-300 hover:bg-emerald-400/20 dark:border-emerald-500 dark:text-emerald-700"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
