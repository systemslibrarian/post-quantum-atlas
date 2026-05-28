"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Lock, Map, GraduationCap, Atom, Sparkles, Menu, X, Search } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  match: (path: string) => boolean;
}

const items: NavItem[] = [
  { label: "Entrance",   href: "/",            icon: Atom,          match: (p) => p === "/" },
  { label: "Halls",      href: "/learn/foundations", icon: GraduationCap, match: (p) => p.startsWith("/learn") },
  { label: "Atlas",      href: "/atlas",       icon: Map,           match: (p) => p.startsWith("/atlas") },
  { label: "Challenges", href: "/challenges",  icon: Sparkles,      match: (p) => p.startsWith("/challenges") },
  { label: "About",      href: "/about",       icon: Lock,          match: (p) => p.startsWith("/about") },
];

export default function MuseumNav() {
  const pathname = usePathname() ?? "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile drawer on route change.
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-[var(--color-quantum)]/15 border border-[var(--color-quantum)]/30 flex items-center justify-center">
            <Atom size={16} className="text-[var(--color-quantum)] group-hover:rotate-180 transition-transform duration-500" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline font-[family-name:var(--font-display)] font-semibold text-xs tracking-[0.18em] uppercase text-[var(--color-text-secondary)]">
            Post-Quantum Atlas
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 mx-auto" aria-label="Primary">
          {items.map(item => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-[family-name:var(--font-display)] font-medium tracking-wide transition-colors ${
                  active
                    ? "bg-[var(--color-quantum)]/15 text-[var(--color-quantum)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                <Icon size={12} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => {
            // Dispatch a synthetic Ctrl+K so the CommandPalette opens. This avoids
            // wiring an explicit imperative API across components.
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
          }}
          aria-label="Open search"
          className="ml-auto md:ml-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-mid)] transition-colors"
        >
          <Search size={12} aria-hidden="true" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-subtle)] font-[family-name:var(--font-mono)] text-[10px]">⌘K</kbd>
        </button>

        <button
          type="button"
          onClick={() => setMobileOpen(o => !o)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation"
          className="md:hidden w-9 h-9 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-text-secondary)]"
        >
          {mobileOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/95 backdrop-blur-md" aria-label="Mobile">
          <ul className="px-4 py-3 space-y-1">
            {items.map(item => {
              const active = item.match(pathname);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-[family-name:var(--font-display)] ${
                      active
                        ? "bg-[var(--color-quantum)]/15 text-[var(--color-quantum)]"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
                    }`}
                  >
                    <Icon size={14} aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
