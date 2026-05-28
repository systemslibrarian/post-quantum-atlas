// app/learn/[moduleId]/page.tsx
"use client";

import { use } from "react";
import { getModule, modules } from "../../lib/curriculum";
import { isComplete, getModuleProgress } from "../../lib/progress";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, BookOpen } from "lucide-react";


export default function ModuleClient({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = use(params);
  const mod = getModule(moduleId);

  if (!mod) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--color-text-muted)]">Module not found.</p>
      </div>
    );
  }

  const pct = getModuleProgress(mod.id, mod.lessons.length);
  const modIdx = modules.findIndex(m => m.id === moduleId);
  const prevMod = modIdx > 0 ? modules[modIdx - 1] : null;
  const nextMod = modIdx < modules.length - 1 ? modules[modIdx + 1] : null;

  return (
    <div className="min-h-screen">
      <section className="max-w-4xl mx-auto px-6 pt-10 sm:pt-12 pb-8">
        <span className="text-xs font-[family-name:var(--font-display)] font-semibold uppercase tracking-wider text-[var(--color-quantum)] mb-3 block">
          Hall {mod.order} of {modules.length}
        </span>
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold mb-2">
          {mod.title}
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] mb-6">
          {mod.description}
        </p>
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <BookOpen size={15} aria-hidden="true" />
            {mod.lessons.length} exhibits
          </div>
          {pct > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-[var(--color-surface-raised)] rounded-full overflow-hidden">
                <div className="progress-fill h-full bg-[var(--color-safe)] rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-[var(--color-safe)]">{pct}%</span>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="space-y-3">
          {mod.lessons.map((lesson, i) => {
            const done = isComplete(mod.id, lesson.id);
            return (
              <Link
                key={lesson.id}
                href={`/learn/${mod.id}/${lesson.id}`}
                className="animate-fade-up card-glow flex items-center gap-4 p-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/60 hover:bg-[var(--color-surface-hover)] transition-all group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex-shrink-0">
                  {done ? (
                    <CheckCircle2 size={22} className="text-[var(--color-safe)]" />
                  ) : (
                    <Circle size={22} className="text-[var(--color-text-muted)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-text-primary)] group-hover:text-white transition-colors">
                    {lesson.order}. {lesson.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] truncate">
                    {lesson.subtitle}
                  </p>
                </div>
                <ChevronRight size={18} className="flex-shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] group-hover:translate-x-0.5 transition-all" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Module navigation */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between">
          {prevMod ? (
            <Link href={`/learn/${prevMod.id}`} className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
              <ChevronLeft size={16} />
              {prevMod.title}
            </Link>
          ) : <div />}
          {nextMod ? (
            <Link href={`/learn/${nextMod.id}`} className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
              {nextMod.title}
              <ChevronRight size={16} />
            </Link>
          ) : <div />}
        </div>
      </section>

      <footer className="border-t border-[var(--color-border-subtle)] py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs italic text-[var(--color-text-muted)]/60">
            &ldquo;Whether you eat or drink, or whatever you do, do it all for the glory of God.&rdquo; &mdash; 1 Corinthians 10:31
          </p>
        </div>
      </footer>
    </div>
  );
}
