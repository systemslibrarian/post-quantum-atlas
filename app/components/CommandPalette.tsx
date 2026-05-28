"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, BookOpen, Map, Layers, X, CornerDownLeft } from "lucide-react";
import { modules } from "../lib/curriculum";
import { algorithms } from "../lib/algorithms";
import { labs } from "../lib/labs";

interface Hit {
  id: string;
  kind: "module" | "lesson" | "lab" | "algorithm" | "page";
  title: string;
  subtitle?: string;
  href: string;
  searchKey: string;
}

function buildCorpus(): Hit[] {
  const hits: Hit[] = [];

  // Static top-level pages
  hits.push({ id: "page:home", kind: "page", title: "Home", subtitle: "Module overview & both entry points", href: "/", searchKey: "home overview" });
  hits.push({ id: "page:atlas", kind: "page", title: "Atlas", subtitle: "Interactive labs index", href: "/atlas", searchKey: "atlas labs map" });
  hits.push({ id: "page:about", kind: "page", title: "About", subtitle: "How the project is built and sourced", href: "/about", searchKey: "about credits author" });

  for (const m of modules) {
    hits.push({
      id: `module:${m.id}`,
      kind: "module",
      title: m.title,
      subtitle: `Module ${m.order} · ${m.lessons.length} lessons`,
      href: `/learn/${m.id}`,
      searchKey: `${m.title} ${m.subtitle} ${m.description}`,
    });
    for (const l of m.lessons) {
      hits.push({
        id: `lesson:${m.id}/${l.id}`,
        kind: "lesson",
        title: l.title,
        subtitle: `${m.title} · ${l.subtitle}`,
        href: `/learn/${m.id}/${l.id}`,
        searchKey: `${l.title} ${l.subtitle} ${l.keyTakeaways.join(" ")} ${m.title}`,
      });
    }
  }

  for (const a of algorithms) {
    hits.push({
      id: `algo:${a.id}`,
      kind: "algorithm",
      title: a.name,
      subtitle: [a.aka, a.fips, a.coreMath].filter(Boolean).join(" · "),
      href: "/atlas/toolkit",
      searchKey: `${a.name} ${a.aka ?? ""} ${a.coreMath} ${a.family} ${a.fips ?? ""} ${a.deployment}`,
    });
  }

  for (const l of Object.values(labs)) {
    hits.push({
      id: `lab:${l.id}`,
      kind: "lab",
      title: l.title,
      subtitle: l.blurb,
      href: l.href,
      searchKey: `${l.title} ${l.blurb}`,
    });
  }

  return hits;
}

const kindIcon = {
  module: BookOpen,
  lesson: BookOpen,
  lab: Map,
  algorithm: Layers,
  page: ChevronRight,
} as const;

const kindLabel = {
  module: "Module",
  lesson: "Lesson",
  lab: "Lab",
  algorithm: "Algorithm",
  page: "Page",
};

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const corpus = useMemo(buildCorpus, []);

  // Global hotkey
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isCmd = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if (isCmd) {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === "/" && !open) {
        const t = e.target as HTMLElement;
        if (!t || (t.tagName !== "INPUT" && t.tagName !== "TEXTAREA" && !t.isContentEditable)) {
          e.preventDefault();
          setOpen(true);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll + focus input on open
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("no-scroll");
    setQuery("");
    setActive(0);
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      document.body.classList.remove("no-scroll");
      clearTimeout(t);
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default selection: a curated overview
      return corpus.filter(h => h.kind === "page" || h.kind === "lab").slice(0, 12);
    }
    const tokens = q.split(/\s+/);
    const scored = corpus.map(h => {
      const key = (h.title + " " + h.searchKey).toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (!key.includes(t)) return { h, score: -1 };
        if (h.title.toLowerCase().includes(t)) score += 5;
        score += 1;
      }
      return { h, score };
    }).filter(s => s.score >= 0);
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 20).map(s => s.h);
  }, [query, corpus]);

  // Clamp active
  useEffect(() => {
    if (active >= results.length) setActive(0);
  }, [results, active]);

  const go = useCallback((h: Hit) => {
    setOpen(false);
    router.push(h.href);
  }, [router]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(results.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      const hit = results[active];
      if (hit) go(hit);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="fixed bottom-4 right-4 z-40 hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-mid)] shadow-lg backdrop-blur-md transition-colors"
      >
        <Search size={12} />
        Search
        <kbd className="ml-1 px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-subtle)] font-[family-name:var(--font-mono)] text-[10px]">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:pt-24 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <button
        aria-label="Close command palette"
        tabIndex={-1}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-mid)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border-subtle)]">
          <Search size={16} className="text-[var(--color-text-muted)]" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
            placeholder="Search modules, lessons, algorithms, labs…"
            aria-label="Search"
            className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-[var(--color-text-muted)] text-[var(--color-text-primary)]"
          />
          <button onClick={() => setOpen(false)} aria-label="Close" className="w-6 h-6 rounded-full bg-[var(--color-surface-hover)] hover:bg-[var(--color-border-mid)] flex items-center justify-center text-[var(--color-text-secondary)]">
            <X size={12} />
          </button>
        </div>

        <div ref={listRef} className="max-h-[60vh] overflow-y-auto" role="listbox" aria-label="Search results">
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-[var(--color-text-muted)]">
              No matches. Try &ldquo;ML-KEM&rdquo;, &ldquo;Shor&rdquo;, &ldquo;TLS&rdquo;, or &ldquo;Mosca&rdquo;.
            </div>
          ) : results.map((h, i) => {
            const Icon = kindIcon[h.kind];
            const isActive = i === active;
            return (
              <button
                key={h.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(h)}
                role="option"
                aria-selected={isActive}
                className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-[var(--color-border-subtle)]/50 last:border-b-0 transition-colors ${
                  isActive ? "bg-[var(--color-surface-hover)]" : "hover:bg-[var(--color-surface-hover)]/60"
                }`}
              >
                <Icon size={14} className="flex-shrink-0 text-[var(--color-text-muted)] mt-0.5" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-[family-name:var(--font-display)] text-sm font-medium text-[var(--color-text-primary)] truncate">
                      {h.title}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] flex-shrink-0">
                      {kindLabel[h.kind]}
                    </span>
                  </div>
                  {h.subtitle && (
                    <div className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                      {h.subtitle}
                    </div>
                  )}
                </div>
                {isActive && (
                  <CornerDownLeft size={12} className="flex-shrink-0 text-[var(--color-text-muted)] mt-1" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>

        <div className="px-4 py-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[10px] text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
          <div className="flex gap-3">
            <span><kbd className="px-1 rounded bg-[var(--color-surface)]">↑↓</kbd> navigate</span>
            <span><kbd className="px-1 rounded bg-[var(--color-surface)]">↵</kbd> open</span>
            <span><kbd className="px-1 rounded bg-[var(--color-surface)]">esc</kbd> close</span>
          </div>
          <span>{results.length} result{results.length === 1 ? "" : "s"}</span>
        </div>
      </div>
    </div>
  );
}
