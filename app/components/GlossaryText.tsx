"use client";

import { useId, useState, useEffect, useRef } from "react";
import { termsByLength, findTerm } from "../lib/glossary";

// Escape special regex chars in a literal term.
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Build one big regex with all terms (longest first, so "ML-KEM" beats "KEM").
function buildPattern(): RegExp {
  const terms = termsByLength().map(t => escapeRegex(t.term));
  // Word-ish boundaries that work for hyphenated terms like ML-KEM.
  return new RegExp(`(?<![\\w-])(${terms.join("|")})(?![\\w-])`, "gi");
}

let cachedPattern: RegExp | null = null;
function pattern(): RegExp {
  // Note: returning a fresh RegExp each call is safer than mutating .lastIndex.
  if (!cachedPattern) cachedPattern = buildPattern();
  return new RegExp(cachedPattern.source, cachedPattern.flags);
}

export default function GlossaryText({ children }: { children: string }) {
  const re = pattern();
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;

  while ((m = re.exec(children)) !== null) {
    if (m.index > last) parts.push(children.slice(last, m.index));
    const hit = findTerm(m[1]);
    if (hit) {
      parts.push(<Term key={key++} display={m[1]} definition={hit.definition} />);
    } else {
      parts.push(m[1]);
    }
    last = m.index + m[1].length;
  }
  if (last < children.length) parts.push(children.slice(last));

  return <>{parts}</>;
}

function Term({ display, definition }: { display: string; definition: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span ref={containerRef} className="glossary-term relative inline-block">
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline border-b border-dotted border-[var(--color-quantum)]/60 hover:border-[var(--color-quantum)] focus:border-[var(--color-quantum)] cursor-help bg-transparent p-0 text-inherit"
      >
        {display}
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-30 w-64 sm:w-72 px-3 py-2 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border-mid)] shadow-xl text-xs leading-relaxed text-[var(--color-text-secondary)] not-italic font-[family-name:var(--font-body)] normal-case"
          style={{ pointerEvents: "none" }}
        >
          <span className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-quantum)] block mb-0.5">
            {display}
          </span>
          {definition}
        </span>
      )}
    </span>
  );
}
