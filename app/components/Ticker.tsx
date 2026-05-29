"use client";

import Link from "next/link";
import { algorithms } from "../lib/algorithms";

// Marquee of algorithm names. Pure CSS animation honors prefers-reduced-motion via globals.css.
export default function Ticker() {
  // The list is rendered twice so the CSS loop wraps seamlessly. Only the first
  // copy is real content; the second is a visual duplicate, so it is hidden from
  // assistive tech and the readable text, and kept out of the tab order.
  const items = algorithms.map((a) => ({ a, dup: false }))
    .concat(algorithms.map((a) => ({ a, dup: true })));

  return (
    <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]/60 overflow-hidden">
      <div className="max-w-full mx-auto relative">
        <div className="ticker-track flex items-center gap-8 py-2 whitespace-nowrap will-change-transform">
          {items.map(({ a, dup }, i) => {
            const broken = a.status === "broken";
            const pending = a.status === "selected" || a.status === "in-development";
            return (
              <Link
                key={`${a.id}-${i}`}
                href="/atlas/toolkit"
                aria-hidden={dup || undefined}
                tabIndex={dup ? -1 : undefined}
                className={`inline-flex items-center gap-2 text-[11px] font-[family-name:var(--font-display)] tracking-wide uppercase ${
                  broken ? "text-[var(--color-danger)] line-through opacity-70"
                    : pending ? "text-[var(--color-warning)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-quantum)] transition-colors"
                }`}
              >
                <span className="w-1 h-1 rounded-full bg-current opacity-60" aria-hidden="true" />
                {a.name}
                {a.fips && <span className="text-[var(--color-text-muted)] opacity-60 font-[family-name:var(--font-mono)]">{a.fips.replace("FIPS ", "FIPS-")}</span>}
              </Link>
            );
          })}
        </div>
        {/* fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[var(--color-surface)] to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[var(--color-surface)] to-transparent" aria-hidden="true" />
      </div>
    </div>
  );
}
