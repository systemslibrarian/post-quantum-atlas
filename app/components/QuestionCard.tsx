"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Lock } from "lucide-react";
import type { Question } from "../lib/curriculum";

interface Props {
  question: Question;
  index: number;
  solved: boolean;
  onSolved: () => void;
}

export default function QuestionCard({ question: q, index, solved, onSolved }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const correct = picked === q.correctId;
  const revealed = picked !== null;

  useEffect(() => {
    if (correct && !solved) onSolved();
  }, [correct, solved, onSolved]);

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 bg-[var(--color-surface-raised)]/60 transition-colors ${
      solved ? "border-[var(--color-safe)]/30" : "border-[var(--color-border-subtle)]"
    }`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
          solved ? "bg-[var(--color-safe)]/15 text-[var(--color-safe)]" : "bg-[var(--color-quantum)]/10 text-[var(--color-quantum)]"
        }`}>
          {solved ? <CheckCircle2 size={18} aria-hidden="true" /> : <span className="font-[family-name:var(--font-mono)] text-sm">{index + 1}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">{q.prompt}</p>
        </div>
        {solved && (
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-safe)] font-[family-name:var(--font-display)] flex items-center gap-1">
            <Lock size={11} aria-hidden="true" /> Solved
          </span>
        )}
      </div>

      <ul className="grid sm:grid-cols-2 gap-2" role="radiogroup">
        {q.choices.map(opt => {
          const isPicked = picked === opt.id;
          const isCorrect = opt.id === q.correctId;
          const showCorrect = revealed && isCorrect;
          const showWrong = revealed && isPicked && !isCorrect;
          return (
            <li key={opt.id}>
              <button
                role="radio"
                aria-checked={isPicked}
                disabled={revealed && correct}
                onClick={() => setPicked(opt.id)}
                className={`w-full text-left p-3 rounded-xl border text-sm transition-colors ${
                  showCorrect ? "border-[var(--color-safe)]/50 bg-[var(--color-safe)]/10 text-[var(--color-safe)]"
                  : showWrong ? "border-[var(--color-danger)]/50 bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
                  : isPicked ? "border-[var(--color-border-mid)] bg-[var(--color-surface-hover)]"
                  : "border-[var(--color-border-subtle)] bg-[var(--color-surface)]/40 hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-mid)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  {showCorrect && <CheckCircle2 size={14} aria-hidden="true" />}
                  {showWrong && <XCircle size={14} aria-hidden="true" />}
                  <span className="font-[family-name:var(--font-display)] font-medium">{opt.label}</span>
                </div>
                {opt.detail && (
                  <div className="text-[11px] text-[var(--color-text-muted)] mt-1">{opt.detail}</div>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {revealed && (
        <div className={`mt-4 p-3 rounded-xl text-sm leading-relaxed ${
          correct ? "bg-[var(--color-safe)]/10 border border-[var(--color-safe)]/20 text-[var(--color-text-secondary)]"
                  : "bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 text-[var(--color-text-secondary)]"
        }`}>
          <div className={`text-[10px] uppercase tracking-wider mb-1 font-[family-name:var(--font-display)] ${
            correct ? "text-[var(--color-safe)]" : "text-[var(--color-danger)]"
          }`}>
            {correct ? "Correct" : "Not quite"}
          </div>
          {q.explanation}
          {!correct && (
            <div className="mt-2">
              <button onClick={() => setPicked(null)} className="text-xs underline text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">
                Try again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
