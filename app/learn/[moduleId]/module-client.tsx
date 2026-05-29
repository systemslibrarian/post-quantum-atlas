// app/learn/[moduleId]/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { getModule, modules } from "../../lib/curriculum";
import { isComplete, getModuleProgress } from "../../lib/progress";
import { checkpoints } from "../../lib/checkpoints";
import QuestionCard from "../../components/QuestionCard";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, BookOpen, Sparkles, Trophy } from "lucide-react";


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

      {/* Hall checkpoint */}
      <HallCheckpoint moduleId={moduleId} />

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
          ) : modIdx === modules.length - 1 ? (
            <Link href="/learn/capstone" className="flex items-center gap-2 text-sm text-[var(--color-quantum)] hover:text-[var(--color-text-primary)] transition-colors">
              Take the capstone
              <Trophy size={16} />
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

const HALL_CP_KEY = "pq-atlas-hall-checkpoints-v1";

function loadCheckpoints(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(HALL_CP_KEY) ?? "{}"); } catch { return {}; }
}

function saveCheckpoints(state: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HALL_CP_KEY, JSON.stringify(state));
}

function HallCheckpoint({ moduleId }: { moduleId: string }) {
  const questions = checkpoints[moduleId];
  const [solved, setSolved] = useState<Record<string, boolean>>({});

  useEffect(() => { setSolved(loadCheckpoints()); }, []);

  if (!questions || questions.length === 0) return null;

  function mark(qid: string) {
    const key = `${moduleId}/${qid}`;
    const next = { ...solved, [key]: true };
    setSolved(next);
    saveCheckpoints(next);
  }

  const solvedCount = questions.filter(q => solved[`${moduleId}/${q.id}`]).length;
  const all = solvedCount === questions.length;

  return (
    <section className="max-w-4xl mx-auto px-6 pb-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold flex items-center gap-2">
          <Sparkles size={18} className="text-[var(--color-quantum)]" aria-hidden="true" />
          Hall checkpoint
        </h2>
        <span className={`text-xs font-[family-name:var(--font-mono)] ${all ? "text-[var(--color-safe)]" : "text-[var(--color-text-muted)]"}`}>
          {solvedCount} / {questions.length}{all ? " · cleared" : ""}
        </span>
      </div>
      <div className="space-y-3">
        {questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={i}
            solved={!!solved[`${moduleId}/${q.id}`]}
            onSolved={() => mark(q.id)}
          />
        ))}
      </div>
      {all && (
        <div className="mt-4 p-4 rounded-2xl border border-[var(--color-safe)]/30 bg-[var(--color-safe)]/10 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <strong className="text-[var(--color-safe)] font-[family-name:var(--font-display)]">Checkpoint cleared.</strong>{" "}
          Move to the next hall — or open the atlas to explore what you just learned.
        </div>
      )}
    </section>
  );
}
