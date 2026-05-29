"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Compass, X, ChevronLeft, ChevronRight, GraduationCap, Map,
  Sparkles, Search, Atom
} from "lucide-react";

const TOUR_KEY = "pq-atlas-tour-seen-v1";

interface Step {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  tag: string;
  title: string;
  body: string;
  cta?: { href: string; label: string };
}

const steps: Step[] = [
  {
    icon: Atom,
    tag: "Welcome",
    title: "A museum, not a textbook.",
    body: "Post-Quantum Atlas is the future wing of the Cipher Museum. Sixty seconds and you'll know where to go next.",
  },
  {
    icon: GraduationCap,
    tag: "The halls",
    title: "Walk the curriculum in order.",
    body: "Six halls, twenty-three exhibits. Foundations → quantum threat → PQC → deployment. Each hall ends with a checkpoint; the final capstone unlocks your certificate.",
    cta: { href: "/learn/foundations", label: "Open Hall 1" },
  },
  {
    icon: Map,
    tag: "The atlas",
    title: "Then push on what you learned.",
    body: "Eight interactive labs: a live bench that runs real ML-KEM and ML-DSA in your browser, the Q-Day simulator, filterable algorithm cards, the breaks-vs-survives map, Mosca's slider, TLS handshake theater, the threat timeline, and an ECC bounce visualizer.",
    cta: { href: "/atlas", label: "Open the atlas" },
  },
  {
    icon: Sparkles,
    tag: "Challenges",
    title: "Ten puzzles to prove the math landed.",
    body: "Quick-fire questions on hybrid TLS, FIPS numbers, CNSA 2.0, the broken family. Wrong picks reveal the why; right picks unlock the badge.",
    cta: { href: "/challenges", label: "Take the challenges" },
  },
  {
    icon: Search,
    tag: "Find anything",
    title: "⌘K, or /search",
    body: "Press ⌘K (Ctrl+K) anywhere. Try \"CNSA 2.0 deadline\" or \"what replaces ECDSA\" — synonyms route to the right hall, exhibit, lab, or algorithm.",
    cta: { href: "/search", label: "Open search" },
  },
];

export default function Tour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [hasSeen, setHasSeen] = useState(true);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Detect first-time visitor on mount.
  useEffect(() => {
    const seen = typeof window === "undefined" ? true : localStorage.getItem(TOUR_KEY) === "1";
    setHasSeen(seen);
  }, []);

  // Allow any control to open the tour by dispatching a custom event.
  useEffect(() => {
    function onOpen() { setStep(0); setOpen(true); }
    window.addEventListener("pq-atlas-open-tour", onOpen as EventListener);
    return () => window.removeEventListener("pq-atlas-open-tour", onOpen as EventListener);
  }, []);

  // Body scroll lock + Esc + focus
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("no-scroll");
    closeBtnRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") setStep(s => Math.min(steps.length - 1, s + 1));
      else if (e.key === "ArrowLeft") setStep(s => Math.max(0, s - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [open]);

  function close() {
    setOpen(false);
    setHasSeen(true);
    try { localStorage.setItem(TOUR_KEY, "1"); } catch { /* noop */ }
  }

  // Render: nothing visible until invoked OR a small button if first-time.
  // The triggering button lives in the page footer / about so we don't surprise people on every load.
  if (!open) {
    if (hasSeen) return null;
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-quantum)] text-white text-sm font-[family-name:var(--font-display)] font-medium shadow-2xl shadow-[var(--color-quantum)]/30 hover:bg-[var(--color-quantum-dim)] transition-colors animate-fade-up"
      >
        <Compass size={14} aria-hidden="true" />
        Take the 60-second tour
      </button>
    );
  }

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
    >
      <button
        aria-label="Close tour"
        tabIndex={-1}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={close}
      />
      <div className="relative w-full max-w-lg bg-[var(--color-surface-raised)] border border-[var(--color-border-mid)] rounded-2xl shadow-2xl">
        <button
          ref={closeBtnRef}
          onClick={close}
          aria-label="Close tour"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[var(--color-surface-hover)] hover:bg-[var(--color-border-mid)] flex items-center justify-center text-[var(--color-text-secondary)]"
        >
          <X size={14} />
        </button>

        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[var(--color-quantum)]/15 border border-[var(--color-quantum)]/30 flex items-center justify-center flex-shrink-0">
              <Icon size={22} className="text-[var(--color-quantum)]" aria-hidden="true" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-1">
                Step {step + 1} of {steps.length} · {current.tag}
              </div>
              <h2 id="tour-title" className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-semibold leading-tight">
                {current.title}
              </h2>
            </div>
          </div>

          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-5">{current.body}</p>

          {current.cta && (
            <Link
              href={current.cta.href}
              onClick={close}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/25 text-xs font-[family-name:var(--font-display)] font-medium transition-colors"
            >
              {current.cta.label} <ChevronRight size={12} aria-hidden="true" />
            </Link>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-[var(--color-border-subtle)]">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} aria-hidden="true" /> Back
          </button>

          <div className="flex gap-1.5" aria-hidden="true">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === step ? "bg-[var(--color-quantum)]" : "bg-[var(--color-border-mid)]"}`}
              />
            ))}
          </div>

          {isLast ? (
            <button
              onClick={close}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--color-quantum)] text-white text-xs font-[family-name:var(--font-display)] font-medium hover:bg-[var(--color-quantum-dim)] transition-colors"
            >
              Done
            </button>
          ) : (
            <button
              onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--color-quantum)] text-white text-xs font-[family-name:var(--font-display)] font-medium hover:bg-[var(--color-quantum-dim)] transition-colors"
            >
              Next <ChevronRight size={12} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper for other components: trigger the tour from anywhere.
export function openTour() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("pq-atlas-open-tour"));
}
