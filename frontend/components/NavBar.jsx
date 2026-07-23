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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "border-b border-white/10 bg-background/70 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)]" 
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-accent transition-transform hover:scale-105 active:scale-95">
          yes-chef
        </Link>

        <nav className="hidden items-center gap-1 text-sm sm:flex">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-1.5 font-medium transition-all duration-300 ${
                  active
                    ? "text-accent bg-accent/10"
                    : "text-muted hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          {user ? (
            <button
              onClick={logout}
              className="rounded-full border border-border px-5 py-1.5 text-sm font-medium transition-all duration-300 hover:bg-foreground/5 hover:border-foreground/20 active:scale-95"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-accent/50 px-5 py-1.5 text-sm font-semibold text-accent transition-all duration-300 hover:bg-accent/10 hover:border-accent active:scale-95"
            >
              Sign in
            </Link>
          )}
        </div>

        <button
          type="button"
          className="rounded-full p-2 sm:hidden transition-colors hover:bg-foreground/5"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-64 border-b border-border bg-background/95 backdrop-blur-xl shadow-xl" : "max-h-0"
        }`}
      >
        <div className="mx-auto grid max-w-6xl gap-2 px-4 py-4">
          <nav className="grid gap-1 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-3 font-medium transition-colors ${
                  pathname.startsWith(link.href)
                    ? "bg-accent/10 text-accent"
                    : "text-foreground/80 hover:bg-foreground/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2">
            {user ? (
              <button
                onClick={logout}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-foreground/5"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="block w-full rounded-xl border border-accent/50 px-4 py-3 text-center text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
