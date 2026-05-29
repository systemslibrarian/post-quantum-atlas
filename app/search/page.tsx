"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, BookOpen, Map as MapIcon, Layers, ChevronRight, ArrowRight
} from "lucide-react";
import { corpus, rank, kindLabel, type HitKind } from "../lib/search";

const kindIcon = {
  module: BookOpen,
  lesson: BookOpen,
  lab: MapIcon,
  algorithm: Layers,
  page: ChevronRight,
} as const;

const kindOrder: HitKind[] = ["page", "lab", "algorithm", "module", "lesson"];

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchInner />
    </Suspense>
  );
}

function SearchSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-12 pb-20 text-sm text-[var(--color-text-muted)]">
      Loading search…
    </div>
  );
}

function SearchInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params?.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  // Reflect the query in the URL so results are shareable.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (query.trim()) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    window.history.replaceState({}, "", url.toString());
  }, [query]);

  const allHits = useMemo(corpus, []);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return rank(q, 50);
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<HitKind, typeof results>();
    for (const k of kindOrder) map.set(k, []);
    for (const r of results) map.get(r.kind)!.push(r);
    return map;
  }, [results]);

  return (
    <div className="min-h-screen">
      <main id="main">
        <section className="max-w-3xl mx-auto px-6 pt-10 sm:pt-12 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-[family-name:var(--font-display)] font-medium mb-4">
            <Search size={14} aria-hidden="true" />
            Search
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            Find anything in the museum.
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] max-w-2xl leading-relaxed mb-5">
            Searches across halls, exhibits, labs, algorithms, and top-level rooms.
            Or press <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] font-[family-name:var(--font-mono)] text-[11px]">⌘K</kbd> anywhere.
          </p>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && results[0]) router.push(results[0].href);
              }}
              placeholder='Try "ML-KEM", "Shor", "TLS", "Mosca"…'
              aria-label="Search query"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] text-base placeholder:text-[var(--color-text-muted)] text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
            />
          </div>

          <p className="mt-3 text-xs text-[var(--color-text-muted)]">
            {query.trim()
              ? `${results.length} of ${allHits.length} results.`
              : `${allHits.length} items indexed.`}
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-6 pb-20">
          {!query.trim() ? (
            <DefaultBrowse />
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-sm text-[var(--color-text-muted)]" role="status">
              No matches. Try a shorter or differently-spelled query.
            </div>
          ) : (
            <div className="space-y-8">
              {kindOrder.map(kind => {
                const list = grouped.get(kind) ?? [];
                if (list.length === 0) return null;
                return (
                  <ResultGroup key={kind} kind={kind} hits={list} />
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[var(--color-border-subtle)] py-8">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs italic text-[var(--color-text-muted)]/60">
            <Link href="/map" className="underline hover:text-[var(--color-text-secondary)]">Museum map</Link>
            <span className="mx-2">·</span>
            <Link href="/" className="underline hover:text-[var(--color-text-secondary)]">Entrance</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

function ResultGroup({ kind, hits }: { kind: HitKind; hits: ReturnType<typeof rank> }) {
  return (
    <div>
      <h2 className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-3">
        {kindLabel[kind]}{hits.length === 1 ? "" : "s"} <span className="font-[family-name:var(--font-mono)] text-[10px]">({hits.length})</span>
      </h2>
      <ul className="space-y-1.5">
        {hits.map(h => {
          const Icon = kindIcon[h.kind];
          return (
            <li key={h.id}>
              <Link
                href={h.href}
                className="group flex items-start gap-3 p-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/60 hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-mid)] transition-colors"
              >
                <Icon size={14} className="flex-shrink-0 text-[var(--color-text-muted)] mt-0.5" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="font-[family-name:var(--font-display)] text-sm font-medium text-[var(--color-text-primary)] group-hover:text-white transition-colors truncate">
                    {h.title}
                  </div>
                  {h.subtitle && (
                    <div className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                      {h.subtitle}
                    </div>
                  )}
                </div>
                <ArrowRight size={14} className="flex-shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all mt-1" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DefaultBrowse() {
  const examples = ["ML-KEM", "Mosca", "Shor", "TLS handshake", "FIPS 204", "X-Wing"];
  return (
    <div>
      <h2 className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-3">
        Try one of these
      </h2>
      <div className="flex flex-wrap gap-2">
        {examples.map(ex => (
          <Link
            key={ex}
            href={`/search?q=${encodeURIComponent(ex)}`}
            className="text-xs px-3 py-1.5 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors font-[family-name:var(--font-display)]"
          >
            {ex}
          </Link>
        ))}
      </div>
    </div>
  );
}
