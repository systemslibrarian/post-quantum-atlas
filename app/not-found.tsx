import Link from "next/link";
import { Home, Map, GraduationCap, Atom } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <main id="main" className="max-w-xl w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-quantum)]/10 border border-[var(--color-quantum)]/20 text-[var(--color-quantum)] text-xs font-[family-name:var(--font-display)] font-medium mb-6">
          <Atom size={14} aria-hidden="true" />
          Superposition error
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl font-bold tracking-tight mb-3">
          <span className="text-[var(--color-quantum)]">|0&rang;</span>
          <span className="text-[var(--color-text-muted)] mx-3">+</span>
          <span className="text-[var(--color-accent)]">|1&rang;</span>
        </h1>
        <p className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-semibold mb-3">
          That page exists in superposition.
        </p>
        <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">
          But until you measure it, we can&rsquo;t say where. Try one of the entry points below — those collapse to a definite answer.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/60 hover:bg-[var(--color-surface-hover)] text-sm font-[family-name:var(--font-display)] transition-colors"
          >
            <Home size={16} /> Home
          </Link>
          <Link
            href="/learn/foundations"
            className="flex items-center justify-center gap-2 p-4 rounded-xl border border-[var(--color-quantum)]/30 bg-[var(--color-quantum)]/10 hover:bg-[var(--color-quantum)]/20 text-[var(--color-quantum)] text-sm font-[family-name:var(--font-display)] transition-colors"
          >
            <GraduationCap size={16} /> Start learning
          </Link>
          <Link
            href="/atlas"
            className="flex items-center justify-center gap-2 p-4 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-sm font-[family-name:var(--font-display)] transition-colors"
          >
            <Map size={16} /> Open the atlas
          </Link>
        </div>
      </main>
    </div>
  );
}
