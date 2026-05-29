"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, RotateCcw, Award, ArrowRight } from "lucide-react";
import { capstone } from "../../lib/checkpoints";
import QuestionCard from "../../components/QuestionCard";

const STORAGE_KEY = "pq-atlas-capstone-v1";

function load(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"); } catch { return {}; }
}

function save(state: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function CapstonePage() {
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  useEffect(() => { setSolved(load()); }, []);

  function mark(qid: string) {
    const next = { ...solved, [qid]: true };
    setSolved(next);
    save(next);
  }

  function reset() { setSolved({}); save({}); }

  const solvedCount = capstone.filter(q => solved[q.id]).length;
  const total = capstone.length;
  const all = solvedCount === total;

  return (
    <div className="min-h-screen">
      <main id="main">
        <section className="max-w-3xl mx-auto px-6 pt-10 sm:pt-12 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-quantum)]/10 border border-[var(--color-quantum)]/20 text-[var(--color-quantum)] text-xs font-[family-name:var(--font-display)] font-medium mb-4">
            <Trophy size={14} aria-hidden="true" />
            The capstone
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            One last walk through the museum.
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] max-w-2xl leading-relaxed mb-5">
            Ten questions spanning all six halls. Pass all ten and the certificate on your{" "}
            <Link href="/learn/complete" className="underline hover:text-[var(--color-text-primary)]">summary page</Link>{" "}
            unlocks.
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Award size={16} className={all ? "text-[var(--color-safe)]" : "text-[var(--color-quantum)]"} aria-hidden="true" />
              <span aria-label={`${solvedCount} of ${total} solved`}>{solvedCount} / {total} solved</span>
            </div>
            <div className="w-40 h-1.5 bg-[var(--color-surface-raised)] rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round((solvedCount / total) * 100)} aria-valuemin={0} aria-valuemax={100}>
              <div className={`progress-fill h-full rounded-full ${all ? "bg-[var(--color-safe)]" : "bg-[var(--color-quantum)]"}`} style={{ width: `${(solvedCount / total) * 100}%` }} />
            </div>
            {solvedCount > 0 && (
              <button
                onClick={reset}
                className="ml-auto inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] px-3 py-1.5 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] transition-colors"
              >
                <RotateCcw size={12} aria-hidden="true" /> Reset
              </button>
            )}
          </div>

          {all && (
            <div className="mt-6 p-4 rounded-2xl border border-[var(--color-safe)]/40 bg-[var(--color-safe)]/10">
              <div className="flex items-start gap-3">
                <Trophy size={22} className="text-[var(--color-safe)] flex-shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <div className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-safe)] mb-1">
                    Capstone cleared.
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-2">
                    The certificate is now unlocked on your summary page.
                  </p>
                  <Link href="/learn/complete" className="inline-flex items-center gap-1 text-sm text-[var(--color-safe)] underline hover:text-[var(--color-text-primary)]">
                    Open the summary <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="max-w-3xl mx-auto px-6 pb-20 space-y-3">
          {capstone.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={i}
              solved={!!solved[q.id]}
              onSolved={() => mark(q.id)}
            />
          ))}
        </section>
      </main>

      <footer className="border-t border-[var(--color-border-subtle)] py-8">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs italic text-[var(--color-text-muted)]/60">
            <Link href="/learn/foundations" className="underline hover:text-[var(--color-text-secondary)]">Back to Hall 1</Link>
            <span className="mx-2">·</span>
            <Link href="/learn/complete" className="underline hover:text-[var(--color-text-secondary)]">Summary</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
