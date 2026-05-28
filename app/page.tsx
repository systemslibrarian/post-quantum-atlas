"use client";

import { modules, getTotalLessons } from "./lib/curriculum";
import { getCompleted, getModuleProgress } from "./lib/progress";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Shield, Globe, Atom, Lock, ArrowRightLeft, Rocket,
  ChevronRight, BookOpen, GraduationCap, Map
} from "lucide-react";
import SourceFooter from "./components/SourceFooter";

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Shield, Globe, Atom, Lock, ArrowRightLeft, Rocket,
};

const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  emerald: { border: "border-emerald-500/30", bg: "bg-emerald-500/10", text: "text-emerald-400", glow: "hover:shadow-emerald-500/10" },
  blue: { border: "border-blue-500/30", bg: "bg-blue-500/10", text: "text-blue-400", glow: "hover:shadow-blue-500/10" },
  red: { border: "border-red-500/30", bg: "bg-red-500/10", text: "text-red-400", glow: "hover:shadow-red-500/10" },
  violet: { border: "border-violet-500/30", bg: "bg-violet-500/10", text: "text-violet-400", glow: "hover:shadow-violet-500/10" },
  amber: { border: "border-amber-500/30", bg: "bg-amber-500/10", text: "text-amber-400", glow: "hover:shadow-amber-500/10" },
  cyan: { border: "border-cyan-500/30", bg: "bg-cyan-500/10", text: "text-cyan-400", glow: "hover:shadow-cyan-500/10" },
};

export default function Home() {
  const [completed, setCompleted] = useState<string[]>([]);
  const total = getTotalLessons();

  useEffect(() => {
    setCompleted(getCompleted());
  }, []);

  const overallPct = total > 0 ? Math.round((completed.length / total) * 100) : 0;

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-border-subtle)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-quantum)]/20 flex items-center justify-center">
              <Lock size={16} className="text-[var(--color-quantum)]" />
            </div>
            <span className="font-[family-name:var(--font-display)] font-semibold text-sm tracking-wide uppercase text-[var(--color-text-secondary)]">
              PQC Learning Path
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-sm text-[var(--color-text-muted)]">
            <Link href="/atlas" className="flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
              <Map size={14} aria-hidden="true" />
              Atlas
            </Link>
            <span className="hidden sm:inline" aria-label={`${completed.length} of ${total} lessons completed`}>
              {completed.length}/{total} lessons
            </span>
            <div className="w-16 sm:w-24 h-1.5 bg-[var(--color-surface-raised)] rounded-full overflow-hidden" role="progressbar" aria-valuenow={overallPct} aria-valuemin={0} aria-valuemax={100} aria-label="Overall progress">
              <div className="progress-fill h-full bg-[var(--color-safe)] rounded-full" style={{ width: `${overallPct}%` }} />
            </div>
          </div>
        </div>
      </header>

      <main id="main">
      <section className="max-w-6xl mx-auto px-6 pt-12 sm:pt-16 pb-10 sm:pb-12">
        <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-quantum)]/10 border border-[var(--color-quantum)]/20 text-[var(--color-quantum)] text-xs font-[family-name:var(--font-display)] font-medium mb-6">
            <GraduationCap size={14} />
            Interactive Learning Experience
          </div>
        </div>
        <h1 className="animate-fade-up font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-4" style={{ animationDelay: "80ms" }}>
          Post-Quantum<br />
          <span className="text-[var(--color-quantum)]">Cryptography</span>
        </h1>
        <p className="animate-fade-up text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed mb-4" style={{ animationDelay: "160ms" }}>
          A guided path from cryptographic foundations to real-world PQC deployment.
          {" "}{modules.length} modules. {total} lessons. One clear progression.
        </p>
        <p className="animate-fade-up text-sm text-[var(--color-text-muted)] mb-10" style={{ animationDelay: "200ms" }}>
          Companion to{" "}
          <em>&ldquo;From Caesar to Post-Quantum: Building a Three-Tier Cryptography Education Portfolio&rdquo;</em>
          {" "}&mdash; Code4Lib Journal
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-5 rounded-2xl border border-[var(--color-quantum)]/20 bg-[var(--color-quantum)]/[0.04]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-quantum)] font-[family-name:var(--font-display)] mb-2">
              <GraduationCap size={14} /> Follow the path
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {modules.length} modules in order. Foundations → quantum threat → PQC → deployment. Track your progress as you go.
            </p>
          </div>
          <Link
            href="/atlas"
            className="block p-5 rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.04] hover:bg-[var(--color-accent)]/[0.08] hover:border-[var(--color-accent)]/40 transition-colors group"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-accent)] font-[family-name:var(--font-display)] mb-2">
              <Map size={14} /> Explore the atlas
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex items-start justify-between gap-2">
              <span>Interactive labs: algorithm cards, the breaks-vs-survives map, Mosca&rsquo;s inequality, and more.</span>
              <ChevronRight size={16} className="flex-shrink-0 text-[var(--color-accent)] group-hover:translate-x-0.5 transition-transform mt-0.5" />
            </p>
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod, i) => {
            const Icon = iconMap[mod.icon] || Shield;
            const colors = colorMap[mod.color] || colorMap.blue;
            const pct = getModuleProgress(mod.id, mod.lessons.length);

            return (
              <Link
                key={mod.id}
                href={`/learn/${mod.id}`}
                className={`animate-fade-up card-glow block p-6 rounded-2xl border ${colors.border} bg-[var(--color-surface-raised)]/80 backdrop-blur-sm ${colors.glow} hover:shadow-2xl transition-all group`}
                style={{ animationDelay: `${240 + i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <Icon size={22} className={colors.text} />
                  </div>
                  <span className="font-[family-name:var(--font-display)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    Module {mod.order}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold mb-1 group-hover:text-[var(--color-text-primary)] transition-colors">
                  {mod.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-4 leading-relaxed">
                  {mod.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <BookOpen size={13} />
                    {mod.lessons.length} lessons
                  </div>
                  <div className="flex items-center gap-2">
                    {pct > 0 && (
                      <span className="text-xs text-[var(--color-safe)]">{pct}%</span>
                    )}
                    <ChevronRight size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
                <div className="mt-3 w-full h-1 bg-[var(--color-surface)] rounded-full overflow-hidden">
                  <div className="progress-fill h-full bg-[var(--color-safe)] rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      </main>

      <footer className="border-t border-[var(--color-border-subtle)] py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-[var(--color-text-muted)] mb-2">
            Paul Lester &bull; IT Librarian &amp; Application Systems Analyst &bull; Leon County Public Library
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mb-3">
            paul@systemslibrarian.dev &bull; github.com/systemslibrarian
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">
            <Link href="/about" className="hover:text-[var(--color-text-secondary)] underline">About this project</Link>
            <span className="mx-2">·</span>
            <Link href="/atlas" className="hover:text-[var(--color-text-secondary)] underline">Atlas</Link>
          </p>
          <p className="text-sm italic text-[var(--color-text-muted)]/70 mb-3">
            &ldquo;Whether you eat or drink, or whatever you do, do it all for the glory of God.&rdquo;
            {" "}&mdash; 1 Corinthians 10:31
          </p>
          <SourceFooter />
        </div>
      </footer>
    </div>
  );
}
