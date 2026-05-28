"use client";

import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import { lessonsForLab } from "../lib/labs";
import { getLesson } from "../lib/curriculum";

export default function LessonBacklinks({ labId }: { labId: string }) {
  const refs = lessonsForLab(labId);
  if (refs.length === 0) return null;

  const resolved = refs
    .map(r => {
      const data = getLesson(r.moduleId, r.lessonId);
      return data ? { ...r, title: data.lesson.title, subtitle: data.lesson.subtitle, moduleTitle: data.module.title } : null;
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (resolved.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 pb-10">
      <h2 className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
        <GraduationCap size={14} aria-hidden="true" />
        Back to the source
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {resolved.map(r => (
          <Link
            key={`${r.moduleId}/${r.lessonId}`}
            href={`/learn/${r.moduleId}/${r.lessonId}`}
            className="group flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/60 hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-mid)] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)]">
                {r.moduleTitle}
              </div>
              <div className="font-[family-name:var(--font-display)] font-medium text-sm text-[var(--color-text-primary)] group-hover:text-white transition-colors truncate">
                {r.title}
              </div>
            </div>
            <ArrowRight size={14} className="flex-shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </section>
  );
}
