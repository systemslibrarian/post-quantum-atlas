// app/components/SourceBadge.tsx
// A small, shared "source confidence" badge so a reader can tell, at a glance,
// how settled a claim is — an official NIST standard vs. a research candidate vs.
// a broken cautionary tale. No hooks, so it renders fine inside Server Components.

import {
  BadgeCheck, FlaskConical, FileClock, Rocket, ShieldAlert, BookOpen,
} from "lucide-react";

export type Confidence =
  | "final"        // published NIST/FIPS standard
  | "selected"     // chosen by NIST, standard pending
  | "draft"        // draft standard / in development
  | "deployment"   // shipped in a real product
  | "research"     // research-stage / historical context
  | "broken";      // broken or deprecated

const styles: Record<
  Confidence,
  { label: string; icon: React.ComponentType<{ className?: string; size?: number }>; tint: string; bg: string; border: string }
> = {
  final:      { label: "NIST final standard",   icon: BadgeCheck,    tint: "text-[var(--color-safe)]",       bg: "bg-[var(--color-safe)]/10",    border: "border-[var(--color-safe)]/25" },
  selected:   { label: "NIST selected · pending", icon: FileClock,   tint: "text-[var(--color-accent)]",     bg: "bg-[var(--color-accent)]/10",  border: "border-[var(--color-accent)]/25" },
  draft:      { label: "NIST draft standard",   icon: FileClock,     tint: "text-[var(--color-accent)]",     bg: "bg-[var(--color-accent)]/10",  border: "border-[var(--color-accent)]/25" },
  deployment: { label: "Deployment example",    icon: Rocket,        tint: "text-[var(--color-quantum)]",    bg: "bg-[var(--color-quantum)]/10", border: "border-[var(--color-quantum)]/25" },
  research:   { label: "Research / historical", icon: FlaskConical,  tint: "text-[var(--color-text-muted)]", bg: "bg-[var(--color-surface-hover)]", border: "border-[var(--color-border-subtle)]" },
  broken:     { label: "Broken / deprecated",   icon: ShieldAlert,   tint: "text-[var(--color-danger)]",     bg: "bg-[var(--color-danger)]/10",  border: "border-[var(--color-danger)]/25" },
};

export default function SourceBadge({
  level,
  label,
  className = "",
}: {
  level: Confidence;
  /** Override the default label (e.g. add a FIPS number). */
  label?: string;
  className?: string;
}) {
  const s = styles[level];
  const Icon = s.icon ?? BookOpen;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full border font-[family-name:var(--font-display)] ${s.bg} ${s.tint} ${s.border} ${className}`}
    >
      <Icon size={11} aria-hidden="true" />
      {label ?? s.label}
    </span>
  );
}
