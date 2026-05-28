"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, KeyRound, PenTool, Atom, Hash, Binary,
  Sigma, Spline, ShieldAlert, CheckCircle2, AlertTriangle,
  Sparkles, Filter, X
} from "lucide-react";
import {
  algorithms, familyLabels, roleLabels, statusLabels,
  type AlgorithmFamily, type AlgorithmRole, type AlgorithmStatus, type Algorithm
} from "../../lib/algorithms";
import LessonBacklinks from "../../components/LessonBacklinks";

type FamilyFilter = AlgorithmFamily | "all";
type RoleFilter = AlgorithmRole | "all";
type StatusFilter = AlgorithmStatus | "all";

const familyIcon: Record<AlgorithmFamily, React.ComponentType<{ className?: string; size?: number }>> = {
  lattice: Sigma,
  hash: Hash,
  code: Binary,
  multivariate: Spline,
  isogeny: Atom,
};

const familyColor: Record<AlgorithmFamily, string> = {
  lattice: "text-[var(--color-quantum)]",
  hash: "text-[var(--color-safe)]",
  code: "text-[var(--color-accent)]",
  multivariate: "text-[var(--color-warning)]",
  isogeny: "text-[var(--color-danger)]",
};

const familyBg: Record<AlgorithmFamily, string> = {
  lattice: "bg-[var(--color-quantum)]/10",
  hash: "bg-[var(--color-safe)]/10",
  code: "bg-[var(--color-accent)]/10",
  multivariate: "bg-[var(--color-warning)]/10",
  isogeny: "bg-[var(--color-danger)]/10",
};

const statusStyle: Record<AlgorithmStatus, { icon: React.ComponentType<{ className?: string; size?: number }>; tint: string; bg: string }> = {
  "standardized":     { icon: CheckCircle2, tint: "text-[var(--color-safe)]", bg: "bg-[var(--color-safe)]/10" },
  "in-development":   { icon: Sparkles,     tint: "text-[var(--color-accent)]", bg: "bg-[var(--color-accent)]/10" },
  "selected":         { icon: Sparkles,     tint: "text-[var(--color-accent)]", bg: "bg-[var(--color-accent)]/10" },
  "under-evaluation": { icon: AlertTriangle, tint: "text-[var(--color-warning)]", bg: "bg-[var(--color-warning)]/10" },
  "broken":           { icon: ShieldAlert,   tint: "text-[var(--color-danger)]", bg: "bg-[var(--color-danger)]/10" },
  "niche":            { icon: AlertTriangle, tint: "text-[var(--color-text-muted)]", bg: "bg-[var(--color-surface-hover)]" },
};

const roleIcon = {
  kem: KeyRound,
  signature: PenTool,
  none: ShieldAlert,
} as const;

export default function ToolkitPage() {
  const [family, setFamily] = useState<FamilyFilter>("all");
  const [role, setRole] = useState<RoleFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  // Esc closes the drawer; lock body scroll while open.
  useEffect(() => {
    if (!openId) return;
    const prev = document.body.classList.contains("no-scroll");
    document.body.classList.add("no-scroll");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenId(null); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (!prev) document.body.classList.remove("no-scroll");
      // Return focus to the card that opened the drawer.
      openerRef.current?.focus();
    };
  }, [openId]);

  const filtered = useMemo(() => {
    return algorithms.filter(a => {
      if (family !== "all" && a.family !== family) return false;
      if (role !== "all" && a.role !== role) return false;
      if (status !== "all" && a.status !== status) return false;
      return true;
    });
  }, [family, role, status]);

  const open = openId ? algorithms.find(a => a.id === openId) ?? null : null;
  const hasFilters = family !== "all" || role !== "all" || status !== "all";

  return (
    <div className="min-h-screen">
      <main id="main">
      <section className="max-w-6xl mx-auto px-6 pt-10 sm:pt-12 pb-8">
        <h1 className="animate-fade-up font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          The PQC Toolkit
        </h1>
        <p className="animate-fade-up text-base text-[var(--color-text-secondary)] max-w-2xl leading-relaxed" style={{ animationDelay: "80ms" }}>
          Every algorithm in the post-quantum transition — what it does, what its math is, why it won (or why it broke).
          Filter to compare. Click a card for the deep view.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)]">
            <Filter size={14} /> Filter
          </div>

          <FilterPills<FamilyFilter>
            label="Family"
            value={family}
            options={[
              { v: "all", label: "All" },
              { v: "lattice", label: familyLabels.lattice },
              { v: "hash", label: familyLabels.hash },
              { v: "code", label: familyLabels.code },
              { v: "multivariate", label: familyLabels.multivariate },
              { v: "isogeny", label: familyLabels.isogeny },
            ]}
            onChange={setFamily}
          />

          <FilterPills<RoleFilter>
            label="Role"
            value={role}
            options={[
              { v: "all", label: "All" },
              { v: "kem", label: "KEM" },
              { v: "signature", label: "Signature" },
            ]}
            onChange={setRole}
          />

          <FilterPills<StatusFilter>
            label="Status"
            value={status}
            options={[
              { v: "all", label: "All" },
              { v: "standardized", label: "Standardized" },
              { v: "selected", label: "Selected" },
              { v: "in-development", label: "Draft" },
              { v: "under-evaluation", label: "Under eval" },
              { v: "broken", label: "Broken" },
            ]}
            onChange={setStatus}
          />

          {hasFilters && (
            <button
              onClick={() => { setFamily("all"); setRole("all"); setStatus("all"); }}
              className="ml-auto text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] flex items-center gap-1.5 transition-colors"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        <p className="mt-3 text-xs text-[var(--color-text-muted)]">
          Showing {filtered.length} of {algorithms.length} algorithms.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <AlgorithmCard
              key={a.id}
              algorithm={a}
              delay={i * 50}
              onOpen={(el) => { openerRef.current = el; setOpenId(a.id); }}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-sm text-[var(--color-text-muted)]" role="status">
            No algorithms match those filters.
          </div>
        )}
      </section>
      <LessonBacklinks labId="toolkit" />
      </main>

      {open && <DetailDrawer algorithm={open} onClose={() => setOpenId(null)} />}

      <footer className="border-t border-[var(--color-border-subtle)] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs italic text-[var(--color-text-muted)]/60">
            Sourced from RefDoc.md sections 7–11, 16. <Link href="/atlas" className="underline hover:text-[var(--color-text-secondary)]">Back to atlas</Link>.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FilterPills<T extends string>({
  label, value, options, onChange,
}: {
  label: string;
  value: T;
  options: { v: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const groupLabel = `Filter by ${label.toLowerCase()}`;
  return (
    <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label={groupLabel}>
      <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mr-1">
        {label}:
      </span>
      <div className="flex flex-wrap gap-1">
        {options.map(opt => {
          const active = value === opt.v;
          return (
            <button
              key={opt.v}
              onClick={() => onChange(opt.v)}
              aria-pressed={active}
              className={`text-xs px-3 py-1.5 min-h-[32px] rounded-full transition-colors font-[family-name:var(--font-display)] ${
                active
                  ? "bg-[var(--color-text-primary)] text-[var(--color-surface)]"
                  : "bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AlgorithmCard({
  algorithm: a, delay, onOpen,
}: { algorithm: Algorithm; delay: number; onOpen: (el: HTMLButtonElement) => void }) {
  const FamIcon = familyIcon[a.family];
  const RoleIcon = roleIcon[a.role];
  const Status = statusStyle[a.status];

  return (
    <button
      onClick={(e) => onOpen(e.currentTarget)}
      aria-label={`Open details for ${a.name}${a.aka ? ` (${a.aka})` : ""}, ${statusLabels[a.status]}`}
      aria-haspopup="dialog"
      className={`animate-fade-up card-glow text-left h-full block p-5 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/80 backdrop-blur-sm hover:shadow-2xl transition-all group ${
        a.status === "broken" ? "opacity-90" : ""
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${familyBg[a.family]}`}>
          <FamIcon size={20} className={familyColor[a.family]} />
        </div>
        <div className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full font-[family-name:var(--font-display)] ${Status.bg} ${Status.tint}`}>
          <Status.icon size={11} />
          {statusLabels[a.status]}
        </div>
      </div>

      <div className="mb-2">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold leading-tight">
          {a.name}
        </h3>
        {a.aka && (
          <p className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
            {a.aka}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-surface-hover)] ${familyColor[a.family]} font-[family-name:var(--font-display)]`}>
          {familyLabels[a.family]}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] font-[family-name:var(--font-display)]">
          <RoleIcon size={10} /> {roleLabels[a.role]}
        </span>
        {a.fips && (
          <span className="inline-flex items-center text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] font-[family-name:var(--font-display)]">
            {a.fips}
          </span>
        )}
      </div>

      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
        {a.whyItWon}
      </p>

      {a.tag && (
        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)]">
          {a.tag}
        </p>
      )}
    </button>
  );
}

function DetailDrawer({ algorithm: a, onClose }: { algorithm: Algorithm; onClose: () => void }) {
  const FamIcon = familyIcon[a.family];
  const Status = statusStyle[a.status];
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = `algo-${a.id}-title`;

  // Move focus to the close button on open + simple focus trap.
  useEffect(() => {
    closeBtnRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 md:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        aria-label="Close details"
        tabIndex={-1}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-up"
        style={{ animationDuration: "0.2s" }}
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border-mid)] rounded-2xl shadow-2xl animate-fade-up my-4 sm:my-8">
        <button
          ref={closeBtnRef}
          aria-label="Close details"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-[var(--color-surface-hover)] hover:bg-[var(--color-border-mid)] flex items-center justify-center text-[var(--color-text-secondary)] transition-colors"
        >
          <X size={16} />
        </button>

        <div className="p-5 sm:p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6 pr-10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${familyBg[a.family]}`}>
              <FamIcon size={24} className={familyColor[a.family]} aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 id={titleId} className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight">
                {a.name}
              </h2>
              {a.aka && (
                <p className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
                  {a.aka}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${familyBg[a.family]} ${familyColor[a.family]} font-[family-name:var(--font-display)]`}>
                  {familyLabels[a.family]}
                </span>
                <span className="inline-flex items-center text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] font-[family-name:var(--font-display)]">
                  {roleLabels[a.role]}
                </span>
                {a.fips && (
                  <span className="inline-flex items-center text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] font-[family-name:var(--font-display)]">
                    {a.fips}
                  </span>
                )}
                <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-[family-name:var(--font-display)] ${Status.bg} ${Status.tint}`}>
                  <Status.icon size={11} />
                  {statusLabels[a.status]}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <Field heading="Core math">{a.coreMath}</Field>
            <Field heading="Why it won">{a.whyItWon}</Field>
            <Field heading="Trade-off">{a.tradeoff}</Field>

            {a.sizes.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-2">
                  Sizes
                </h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  {a.sizes.map((s, i) => (
                    <div key={i} className="px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
                      <div className="text-xs text-[var(--color-text-muted)]">{s.label}</div>
                      <div className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-text-primary)]">
                        {s.bytes !== undefined ? `${s.bytes.toLocaleString()} B` : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {a.variants && a.variants.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-2">
                  Variants
                </h4>
                <div className="flex flex-wrap gap-2">
                  {a.variants.map(v => (
                    <span key={v} className="font-[family-name:var(--font-mono)] text-xs px-2 py-1 rounded bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Field heading="Real-world deployment">{a.deployment}</Field>

            <div className="pt-3 border-t border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)]">
              Reference: <span className="font-[family-name:var(--font-mono)]">RefDoc.md {a.refDocAnchor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-1.5">
        {heading}
      </h4>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{children}</p>
    </div>
  );
}
