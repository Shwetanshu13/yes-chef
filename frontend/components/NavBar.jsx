"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect, useState } from "react";

const links = [
  { href: "/recipes", label: "Recipes" },
  { href: "/recipes/create", label: "Create" },
  { href: "/friends", label: "Friends" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="text-lg font-semibold text-emerald-500">
          yes-chef
        </Link>

        <nav className="hidden items-center gap-4 text-sm sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1 transition-colors ${
                pathname.startsWith(link.href)
                  ? "bg-emerald-100 text-emerald-800"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          {user ? (
            <button
              onClick={logout}
              className="rounded-full border border-border px-3 py-1 text-sm hover:bg-emerald-100/40"
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

        <button
          type="button"
          className="rounded-xl border border-border px-3 py-2 text-sm sm:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 sm:hidden">
          <div className="mx-auto grid max-w-6xl gap-2 px-4 py-3">
            <nav className="grid gap-1 text-sm">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-3 py-2 transition-colors ${
                    pathname.startsWith(link.href)
                      ? "bg-emerald-100 text-emerald-800"
                      : "text-foreground/80 hover:bg-emerald-100/40"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-1">
              {user ? (
                <button
                  onClick={logout}
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm hover:bg-emerald-100/40"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block w-full rounded-xl border border-emerald-400 px-3 py-2 text-center text-sm text-emerald-600 hover:bg-emerald-100/60"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
