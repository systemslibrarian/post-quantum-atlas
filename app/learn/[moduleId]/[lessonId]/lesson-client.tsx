// app/learn/[moduleId]/[lessonId]/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { getLesson, getNextLesson, getPrevLesson, getLessonIndex, getTotalLessons, modules } from "../../../lib/curriculum";
import type { ContentSection, TableData } from "../../../lib/curriculum";
import { isComplete, markComplete } from "../../../lib/progress";
import { labsForLesson } from "../../../lib/labs";
import GlossaryText from "../../../components/GlossaryText";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, CheckCircle2, Circle,
  AlertTriangle, Info, Lightbulb, BookOpen, Map
} from "lucide-react";



function CalloutBlock({ type, text }: { type: string; text: string }) {
  const cls =
    type === "warning" ? "callout-warning" :
    type === "info" ? "callout-info" : "callout-key-concept";
  const Icon =
    type === "warning" ? AlertTriangle :
    type === "info" ? Info : Lightbulb;
  const iconColor =
    type === "warning" ? "text-[var(--color-danger)]" :
    type === "info" ? "text-[var(--color-accent)]" : "text-[var(--color-quantum)]";

  return (
    <div className={`${cls} rounded-lg px-5 py-4 my-6`}>
      <div className="flex gap-3">
        <Icon size={18} className={`${iconColor} flex-shrink-0 mt-0.5`} />
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{text}</p>
      </div>
    </div>
  );
}

function DataTable({ table }: { table: TableData }) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-[var(--color-border-subtle)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--color-surface-raised)]">
            {table.headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left font-[family-name:var(--font-display)] font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className="border-t border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-hover)] transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-[var(--color-text-secondary)] leading-relaxed">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionRenderer({ section, idx }: { section: ContentSection; idx: number }) {
  return (
    <div className="animate-fade-up" style={{ animationDelay: `${idx * 40}ms` }}>
      {section.heading && (
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold mt-10 mb-4 text-[var(--color-text-primary)]">
          {section.heading}
        </h2>
      )}
      {section.paragraphs?.map((p, pi) => (
        <p key={pi} className="text-[var(--color-text-secondary)] leading-[1.8] mb-4 text-base">
          <GlossaryText>{p}</GlossaryText>
        </p>
      ))}
      {section.bullets && (
        <ul className="space-y-3 my-5 ml-1">
          {section.bullets.map((b, bi) => {
            const colonIdx = b.indexOf(":");
            const hasLabel = colonIdx > 0 && colonIdx < 50;
            return (
              <li key={bi} className="flex gap-3 text-[var(--color-text-secondary)] leading-relaxed text-sm">
                <span className="text-[var(--color-quantum)] mt-1.5 flex-shrink-0">&#x2022;</span>
                <span>
                  {hasLabel ? (
                    <>
                      <strong className="text-[var(--color-text-primary)] font-medium">
                        {b.slice(0, colonIdx)}:
                      </strong>
                      <GlossaryText>{b.slice(colonIdx + 1)}</GlossaryText>
                    </>
                  ) : <GlossaryText>{b}</GlossaryText>}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {section.table && <DataTable table={section.table} />}
      {section.callout && <CalloutBlock type={section.callout.type} text={section.callout.text} />}
    </div>
  );
}

export default function LessonClient({ params }: { params: Promise<{ moduleId: string; lessonId: string }> }) {
  const { moduleId, lessonId } = use(params);
  const data = getLesson(moduleId, lessonId);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isComplete(moduleId, lessonId));
  }, [moduleId, lessonId]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--color-text-muted)]">Lesson not found.</p>
      </div>
    );
  }

  const { module: mod, lesson } = data;
  const prev = getPrevLesson(moduleId, lessonId);
  const next = getNextLesson(moduleId, lessonId);
  const globalIdx = getLessonIndex(moduleId, lessonId);
  const total = getTotalLessons();

  function handleComplete() {
    markComplete(moduleId, lessonId);
    setDone(true);
  }

  // Resolve prev/next lesson titles for display
  const prevData = prev ? getLesson(prev.moduleId, prev.lessonId) : null;
  const nextData = next ? getLesson(next.moduleId, next.lessonId) : null;

  return (
    <div className="min-h-screen">
      {/* Lesson progress strip — small, sits below the global breadcrumbs */}
      <div className="border-b border-[var(--color-border-subtle)]/50">
        <div className="max-w-3xl mx-auto px-6 py-2 flex items-center justify-end gap-3">
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)]">
            Exhibit {globalIdx + 1} of {total}
          </span>
          <div className="w-20 h-1 bg-[var(--color-surface-raised)] rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(((globalIdx + 1) / total) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Exhibit progress">
            <div className="progress-fill h-full bg-[var(--color-quantum)] rounded-full" style={{ width: `${((globalIdx + 1) / total) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Lesson content */}
      <article className="max-w-3xl mx-auto px-6 pt-8 sm:pt-10 pb-8">
        <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
          <span className="text-xs font-[family-name:var(--font-display)] font-semibold uppercase tracking-wider text-[var(--color-quantum)] mb-2 block">
            Hall {mod.order} &middot; Exhibit {lesson.order}
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {lesson.title}
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] mb-10">
            {lesson.subtitle}
          </p>
        </div>

        {/* Content sections */}
        {lesson.sections.map((section, i) => (
          <SectionRenderer key={i} section={section} idx={i} />
        ))}

        {/* Related labs from the atlas */}
        {(() => {
          const related = labsForLesson(moduleId, lessonId);
          if (related.length === 0) return null;
          return (
            <div className="mt-12 mb-8 p-6 rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.04]">
              <h3 className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-accent)] mb-4 flex items-center gap-2">
                <Map size={18} />
                Explore in the atlas
              </h3>
              <ul className="space-y-2">
                {related.map(lab => (
                  <li key={lab.id}>
                    <Link
                      href={lab.href}
                      className="group flex items-start gap-3 p-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/40 hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-mid)] transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-[family-name:var(--font-display)] font-medium text-[var(--color-text-primary)] text-sm group-hover:text-white transition-colors">
                          {lab.title}
                        </div>
                        <div className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
                          {lab.blurb}
                        </div>
                      </div>
                      <ChevronRight size={16} className="flex-shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all mt-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}

        {/* Key Takeaways */}
        {lesson.keyTakeaways.length > 0 && (
          <div className="mt-12 mb-8 p-6 rounded-2xl border border-[var(--color-quantum)]/20 bg-[var(--color-quantum)]/5">
            <h3 className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-quantum)] mb-4 flex items-center gap-2">
              <BookOpen size={18} />
              Key Takeaways
            </h3>
            <ul className="space-y-3">
              {lesson.keyTakeaways.map((t, i) => (
                <li key={i} className="flex gap-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  <CheckCircle2 size={16} className="text-[var(--color-safe)] flex-shrink-0 mt-0.5" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mark Complete */}
        <div className="flex justify-center my-10">
          {done ? (
            <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-safe)]/10 border border-[var(--color-safe)]/20 text-[var(--color-safe)] text-sm font-[family-name:var(--font-display)] font-medium">
              <CheckCircle2 size={18} />
              Lesson Complete
            </div>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-quantum)] hover:bg-[var(--color-quantum-dim)] text-white text-sm font-[family-name:var(--font-display)] font-semibold transition-colors cursor-pointer"
            >
              <Circle size={18} />
              Mark as Complete
            </button>
          )}
        </div>
      </article>

      {/* Prev / Next navigation */}
      <nav className="max-w-3xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 gap-4">
          {prev && prevData ? (
            <Link
              href={`/learn/${prev.moduleId}/${prev.lessonId}`}
              className="group p-4 rounded-xl border border-[var(--color-border-subtle)] hover:border-[var(--color-border-mid)] bg-[var(--color-surface-raised)]/60 hover:bg-[var(--color-surface-hover)] transition-all"
            >
              <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mb-1">
                <ChevronLeft size={14} /> Previous
              </span>
              <span className="text-sm font-[family-name:var(--font-display)] font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors line-clamp-1">
                {prevData.lesson.title}
              </span>
            </Link>
          ) : <div />}
          {next && nextData ? (
            <Link
              href={`/learn/${next.moduleId}/${next.lessonId}`}
              className="group p-4 rounded-xl border border-[var(--color-border-subtle)] hover:border-[var(--color-border-mid)] bg-[var(--color-surface-raised)]/60 hover:bg-[var(--color-surface-hover)] transition-all text-right"
            >
              <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 justify-end mb-1">
                Next <ChevronRight size={14} />
              </span>
              <span className="text-sm font-[family-name:var(--font-display)] font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors line-clamp-1">
                {nextData.lesson.title}
              </span>
            </Link>
          ) : (
            <Link
              href="/learn/complete"
              className="group p-4 rounded-xl border border-[var(--color-safe)]/20 hover:border-[var(--color-safe)]/40 bg-[var(--color-safe)]/5 hover:bg-[var(--color-safe)]/10 transition-all text-right"
            >
              <span className="text-xs text-[var(--color-safe)] flex items-center gap-1 justify-end mb-1">
                Finish <CheckCircle2 size={14} />
              </span>
              <span className="text-sm font-[family-name:var(--font-display)] font-medium text-[var(--color-safe)]">
                Your summary
              </span>
            </Link>
          )}
        </div>
      </nav>

      <footer className="border-t border-[var(--color-border-subtle)] py-8">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs italic text-[var(--color-text-muted)]/60">
            &ldquo;Whether you eat or drink, or whatever you do, do it all for the glory of God.&rdquo; &mdash; 1 Corinthians 10:31
          </p>
        </div>
      </footer>
    </div>
  );
}
