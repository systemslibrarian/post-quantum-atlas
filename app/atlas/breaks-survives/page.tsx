"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, ShieldOff, AlertTriangle, ShieldCheck, Sparkles,
  Zap, ArrowRight, ChevronDown
} from "lucide-react";
import { impactBuckets, entriesByBucket, type ImpactBucket, type ImpactEntry } from "../../lib/impact";
import LessonBacklinks from "../../components/LessonBacklinks";

const bucketOrder: ImpactBucket[] = ["shor-broken", "grover-weakened", "survives", "pqc-replacement"];

const bucketIcon: Record<ImpactBucket, React.ComponentType<{ className?: string; size?: number }>> = {
  "shor-broken": ShieldOff,
  "grover-weakened": AlertTriangle,
  "survives": ShieldCheck,
  "pqc-replacement": Sparkles,
};

const toneClasses: Record<"danger" | "warning" | "safe" | "quantum", {
  border: string; bg: string; text: string; ring: string; cardBorder: string;
}> = {
  danger:  { border: "border-[var(--color-danger)]/40",  bg: "bg-[var(--color-danger)]/10",  text: "text-[var(--color-danger)]",  ring: "ring-[var(--color-danger)]/20",  cardBorder: "border-[var(--color-danger)]/20"  },
  warning: { border: "border-[var(--color-warning)]/40", bg: "bg-[var(--color-warning)]/10", text: "text-[var(--color-warning)]", ring: "ring-[var(--color-warning)]/20", cardBorder: "border-[var(--color-warning)]/20" },
  safe:    { border: "border-[var(--color-safe)]/40",    bg: "bg-[var(--color-safe)]/10",    text: "text-[var(--color-safe)]",    ring: "ring-[var(--color-safe)]/20",    cardBorder: "border-[var(--color-safe)]/20"    },
  quantum: { border: "border-[var(--color-quantum)]/40", bg: "bg-[var(--color-quantum)]/10", text: "text-[var(--color-quantum)]", ring: "ring-[var(--color-quantum)]/20", cardBorder: "border-[var(--color-quantum)]/20" },
};

export default function BreaksSurvivesPage() {
  const [qDay, setQDay] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-border-subtle)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/atlas" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
            <ChevronLeft size={16} />
            Atlas
          </Link>
          <span className="font-[family-name:var(--font-display)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
            Lab · Impact map
          </span>
        </div>
      </header>

      <main id="main">
        <section className="max-w-6xl mx-auto px-6 pt-10 sm:pt-12 pb-6">
          <h1 className="animate-fade-up font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            What breaks. What survives.
          </h1>
          <p className="animate-fade-up text-base text-[var(--color-text-secondary)] max-w-2xl leading-relaxed" style={{ animationDelay: "80ms" }}>
            When a cryptographically-relevant quantum computer arrives, every tool we use today lands in one of four buckets.
            The asymmetric layer collapses. The symmetric layer mostly holds. The migration path is the right column.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 p-1 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]">
            <button
              onClick={() => setQDay(false)}
              aria-pressed={!qDay}
              className={`px-4 py-1.5 rounded-full text-xs font-[family-name:var(--font-display)] font-medium transition-colors min-h-[32px] ${
                !qDay ? "bg-[var(--color-text-primary)] text-[var(--color-surface)]" : "text-[var(--color-text-secondary)]"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setQDay(true)}
              aria-pressed={qDay}
              className={`px-4 py-1.5 rounded-full text-xs font-[family-name:var(--font-display)] font-medium transition-colors min-h-[32px] flex items-center gap-1.5 ${
                qDay ? "bg-[var(--color-danger)] text-white" : "text-[var(--color-text-secondary)]"
              }`}
            >
              <Zap size={12} /> Q-Day
            </button>
          </div>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            {qDay
              ? "A CRQC exists. Tools in red are recoverable in minutes. Survivors keep working with the noted upgrades."
              : "Pre-quantum baseline. Everything looks safe — and most of it is, today."}
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-16" aria-label="Impact quadrants">
          <div className="grid gap-4 md:grid-cols-2">
            {bucketOrder.map((b, i) => (
              <BucketColumn key={b} bucket={b} qDay={qDay} delay={i * 80} />
            ))}
          </div>
        </section>

        <LessonBacklinks labId="breaks-survives" />

        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="p-5 sm:p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/60">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold mb-2">The shape of the transition</h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
              The asymmetric layer — what proves identity and shares keys — has to be rebuilt. The symmetric layer — what protects bulk data —
              keeps working with bigger keys. PQC is the bridge: ML-KEM picks up where RSA/ECC drop off, ML-DSA picks up where ECDSA drops off,
              and SLH-DSA stands by as a hash-based backup.
            </p>
            <Link href="/atlas/toolkit" className="inline-flex items-center gap-1 text-sm text-[var(--color-accent)] hover:underline">
              Open the PQC Toolkit <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border-subtle)] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs italic text-[var(--color-text-muted)]/60">
            Sourced from RefDoc.md §4 & §14. <Link href="/atlas" className="underline hover:text-[var(--color-text-secondary)]">Back to atlas</Link>.
          </p>
        </div>
      </footer>
    </div>
  );
}

function BucketColumn({ bucket, qDay, delay }: { bucket: ImpactBucket; qDay: boolean; delay: number }) {
  const meta = impactBuckets[bucket];
  const Icon = bucketIcon[bucket];
  const tone = toneClasses[meta.tone];
  const entries = entriesByBucket(bucket);

  // Visually pulse the broken bucket when q-day is on.
  const emphasize = qDay && bucket === "shor-broken";

  return (
    <div
      className={`animate-fade-up rounded-2xl border ${tone.border} ${tone.bg} p-4 sm:p-5 ${emphasize ? "ring-2 " + tone.ring : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tone.bg} border ${tone.border}`}>
          <Icon size={20} className={tone.text} aria-hidden="true" />
        </div>
        <div>
          <h2 className={`font-[family-name:var(--font-display)] font-semibold ${tone.text}`}>
            {meta.label}
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">{meta.sub}</p>
        </div>
        <span className="ml-auto text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
          {entries.length}
        </span>
      </div>

      <ul className="space-y-2">
        {entries.map(e => (
          <EntryRow key={e.id} entry={e} qDay={qDay} cardBorder={tone.cardBorder} />
        ))}
      </ul>
    </div>
  );
}

function EntryRow({ entry, qDay, cardBorder }: { entry: ImpactEntry; qDay: boolean; cardBorder: string }) {
  const [open, setOpen] = useState(false);
  const fade = qDay && entry.bucket === "shor-broken";

  return (
    <li>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className={`w-full text-left rounded-xl border ${cardBorder} bg-[var(--color-surface-raised)]/60 hover:bg-[var(--color-surface-hover)] px-3 py-2.5 transition-colors ${fade ? "line-through decoration-[var(--color-danger)]/60 decoration-2" : ""}`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-[family-name:var(--font-display)] font-medium text-sm text-[var(--color-text-primary)] truncate">
              {entry.name}
            </div>
            <div className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider font-[family-name:var(--font-display)]">
              {entry.category}
            </div>
          </div>
          <ChevronDown size={16} className={`flex-shrink-0 text-[var(--color-text-muted)] mt-0.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </div>
        {open && (
          <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)] space-y-2">
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{entry.detail}</p>
            <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)]">
              Action
            </p>
            <p className="text-xs text-[var(--color-text-primary)] leading-relaxed">{entry.action}</p>
          </div>
        )}
      </button>
    </li>
  );
}
