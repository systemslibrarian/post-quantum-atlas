// app/components/LabAbout.tsx
// Server-rendered "About this lab" block appended to every interactive lab via
// the lab's layout.tsx. Because it is a Server Component with no client hooks,
// its content is always present in the prerendered HTML — so each lab teaches
// something even before (or without) the interactive component hydrating.

import Link from "next/link";
import { GraduationCap, Lightbulb, ListChecks, BookOpen, ExternalLink, ChevronRight } from "lucide-react";
import { labs, lessonsForLab } from "../lib/labs";
import { labMeta } from "../lib/labMeta";
import { getLesson } from "../lib/curriculum";
import SourceBadge from "./SourceBadge";

export default function LabAbout({ id }: { id: string }) {
  const lab = labs[id];
  const meta = labMeta[id];
  if (!lab || !meta) return null;

  const related = lessonsForLab(id)
    .map(({ moduleId, lessonId }) => {
      const found = getLesson(moduleId, lessonId);
      return found ? { moduleId, lessonId, title: found.lesson.title } : null;
    })
    .filter((x): x is { moduleId: string; lessonId: string; title: string } => x !== null);

  return (
    <section
      aria-label={`About the ${lab.title} lab`}
      className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/30"
    >
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-6">
          About this lab — {lab.title}
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] font-[family-name:var(--font-display)] mb-2">
              <GraduationCap size={16} className="text-[var(--color-accent)]" aria-hidden="true" />
              What this lab teaches
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{meta.teaches}</p>

            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] font-[family-name:var(--font-display)] mt-6 mb-2">
              <ListChecks size={16} className="text-[var(--color-accent)]" aria-hidden="true" />
              How to use it
            </h3>
            <ol className="space-y-1.5 text-sm text-[var(--color-text-secondary)] leading-relaxed list-decimal pl-5">
              {meta.howTo.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] font-[family-name:var(--font-display)] mb-2">
              <Lightbulb size={16} className="text-[var(--color-quantum)]" aria-hidden="true" />
              Key takeaway
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed rounded-xl border border-[var(--color-quantum)]/20 bg-[var(--color-quantum)]/[0.04] p-3">
              {meta.takeaway}
            </p>

            {related.length > 0 && (
              <>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] font-[family-name:var(--font-display)] mt-6 mb-2">
                  <BookOpen size={16} className="text-[var(--color-accent)]" aria-hidden="true" />
                  Related exhibits
                </h3>
                <ul className="space-y-1.5">
                  {related.map((r) => (
                    <li key={`${r.moduleId}/${r.lessonId}`}>
                      <Link
                        href={`/learn/${r.moduleId}/${r.lessonId}`}
                        className="inline-flex items-center gap-1 text-sm text-[var(--color-accent)] hover:underline"
                      >
                        <ChevronRight size={14} aria-hidden="true" />
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--color-border-subtle)]">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] font-[family-name:var(--font-display)] mb-3">
            Sources <span className="font-normal text-[var(--color-text-muted)]">· {meta.refDoc}</span>
          </h3>
          <ul className="flex flex-wrap gap-2">
            {meta.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {s.level && <SourceBadge level={s.level} className="!px-1.5 !py-0.5" />}
                  {s.title}
                  <ExternalLink size={11} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
