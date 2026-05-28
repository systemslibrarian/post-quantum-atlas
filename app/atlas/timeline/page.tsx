"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, Activity, Calendar, Sparkles, ShieldAlert,
  Shield, Cpu, Gavel, FileCheck2, Atom
} from "lucide-react";
import LessonBacklinks from "../../components/LessonBacklinks";

type MilestoneCategory = "research" | "hardware" | "standards" | "regulation" | "deployment";

interface Milestone {
  id: string;
  date: string;          // YYYY-MM
  label: string;
  detail: string;
  category: MilestoneCategory;
  source?: string;       // RefDoc anchor
}

const milestones: Milestone[] = [
  // Pre-2020 context (off-axis but worth listing for the curious)
  { id: "shor",      date: "1994-04", label: "Shor's algorithm published",        detail: "Peter Shor proves a quantum computer can factor integers in polynomial time. The clock for the asymmetric layer starts ticking.", category: "research" },
  { id: "regev",     date: "2005-05", label: "Regev proposes LWE",                detail: "Oded Regev introduces Learning With Errors — the mathematical foundation that becomes ML-KEM and ML-DSA two decades later.", category: "research" },
  { id: "nist-start",date: "2016-12", label: "NIST PQC competition opens",        detail: "NIST calls for post-quantum candidate algorithms. Over 80 submissions arrive over the next year. The process will run for eight years.", category: "standards" },

  // 2020s — the transition window
  { id: "sike-broken",   date: "2022-07", label: "SIKE broken on a desktop",                detail: "Wouter Castryck and Thomas Decru break Supersingular Isogeny Key Encapsulation in roughly one hour on a standard laptop — a NIST finalist defeated by classical math.", category: "research", source: "§19" },
  { id: "fips-final",    date: "2024-08", label: "FIPS 203, 204, 205 published",            detail: "ML-KEM (FIPS 203), ML-DSA (FIPS 204), and SLH-DSA (FIPS 205) become official U.S. federal standards. The post-quantum primary algorithms are now law.", category: "standards", source: "§19" },
  { id: "chrome-live",   date: "2024-09", label: "Chrome + Cloudflare hybrid TLS at scale", detail: "Most Chrome users perform hybrid X25519 + ML-KEM-768 TLS handshakes by default. The first time most internet traffic runs PQC.", category: "deployment", source: "§16" },
  { id: "ibm-nighthawk", date: "2025-11", label: "IBM Nighthawk 120-qubit chip",            detail: "IBM unveils its 120-qubit processor, targeting fault-tolerance by 2029. A hardware milestone, not a CRQC — but the trajectory keeps steepening.", category: "hardware", source: "§4.6" },
  { id: "hqc-selected",  date: "2025-03", label: "HQC selected as backup KEM",              detail: "NIST selects HQC — a code-based KEM — as the non-lattice alternative to ML-KEM. Meta cryptographers are co-authors.", category: "standards", source: "§8" },
  { id: "gidney",        date: "2025-05", label: "Gidney revises RSA-2048 estimate",         detail: "Resource estimate for breaking RSA-2048 drops from 20 million noisy qubits to under 1 million — a 20× reduction in six years.", category: "research", source: "§13.2" },
  { id: "iceberg",       date: "2026-02", label: "Iceberg Quantum LDPC result",              detail: "Quantum LDPC codes suggest RSA-2048 may be tractable with fewer than 100,000 physical qubits.", category: "research", source: "§13.2" },
  { id: "google-ecdlp",  date: "2026-03", label: "Google/Stanford: ECDLP-256 in minutes",    detail: "A new analysis estimates ECDLP-256 breakable with under 500,000 qubits in minutes — ECC's runway shrinks further.", category: "research", source: "§13.2" },
  { id: "neutral-atom",  date: "2026-03", label: "Neutral-atom Shor's estimates",            detail: "Caltech–Berkeley–Oratomic propose neutral-atom designs estimating Shor's algorithm with 10K–20K atomic qubits.", category: "hardware", source: "§13.2" },
  { id: "eu-nis2",       date: "2026-01", label: "EU NIS2 mandates PQC",                     detail: "European Commission COM(2026) 13 makes post-quantum cryptography a NIS2 requirement and recognizes HNDL as 'likely occurring already now.'", category: "regulation", source: "§15" },
  { id: "code-sign",     date: "2025-01", label: "U.S. PQC code-signing preferred",          detail: "Federal guidance prefers PQC signatures for new code-signing roots.", category: "regulation", source: "§15" },
  { id: "us-acq",        date: "2027-01", label: "U.S. new acquisitions require PQC",        detail: "All federal new acquisitions of cryptographic systems must support NIST PQC.", category: "regulation", source: "§15" },
  { id: "uk-discovery",  date: "2028-01", label: "UK NCSC discovery deadline",               detail: "Phase 1 of the UK three-phase migration — every organization must have inventoried its cryptography.", category: "regulation", source: "§15" },
  { id: "fed-tls13",     date: "2030-01", label: "U.S. federal TLS 1.3 by Jan 2030",         detail: "EO 14144 — all federal TLS deployments must support TLS 1.3 with PQC-capable cipher suites.", category: "regulation", source: "§15" },
  { id: "firmware-2030", date: "2030-01", label: "Firmware exclusive PQC (U.S.)",            detail: "All firmware signing on federal systems must be PQC-exclusive by 2030.", category: "regulation", source: "§15" },
  { id: "eu-critical",   date: "2030-01", label: "EU critical infrastructure migrated",      detail: "Critical-sector PQC migration target under NIS2.", category: "regulation", source: "§15" },
  { id: "uk-high",       date: "2031-12", label: "UK high-priority systems complete",        detail: "Phase 2 of the UK NCSC migration plan — high-priority systems migrated.", category: "regulation", source: "§15" },
  { id: "us-all",        date: "2033-01", label: "U.S. all systems migrated",                detail: "CNSA 2.0 target — all national-security systems on ML-KEM-1024 and ML-DSA-87.", category: "regulation", source: "§15" },
  { id: "full",          date: "2035-01", label: "Full migration target (U.S. / EU / UK)",   detail: "The deadline most major Western regulators have converged on for full PQC adoption.", category: "regulation", source: "§15" },
];

const catMeta: Record<MilestoneCategory, { label: string; icon: React.ComponentType<{ className?: string; size?: number }>; hex: string }> = {
  research:   { label: "Research",   icon: Sparkles,   hex: "#a78bfa" },
  hardware:   { label: "Hardware",   icon: Cpu,        hex: "#38bdf8" },
  standards:  { label: "Standards",  icon: FileCheck2, hex: "#34d399" },
  regulation: { label: "Regulation", icon: Gavel,      hex: "#fbbf24" },
  deployment: { label: "Deployment", icon: Shield,     hex: "#f87171" },
};

const MIN_YEAR = 2020;
const MAX_YEAR = 2040;
const TODAY_DECIMAL = 2026 + (5 - 1) / 12; // May 2026 per RefDoc

function toDecimalYear(d: string): number {
  const [y, m] = d.split("-").map(n => parseInt(n, 10));
  return y + (m - 1) / 12;
}

function inAxis(d: number): boolean { return d >= MIN_YEAR && d <= MAX_YEAR; }
function pct(d: number): number { return ((d - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100; }

export default function TimelinePage() {
  const [cursorYear, setCursorYear] = useState(2026);
  const [filter, setFilter] = useState<MilestoneCategory | "all">("all");

  const decorated = useMemo(() => {
    return milestones
      .map(m => ({ ...m, decimal: toDecimalYear(m.date) }))
      .sort((a, b) => a.decimal - b.decimal);
  }, []);

  const onAxis = decorated.filter(m => inAxis(m.decimal));
  const offAxis = decorated.filter(m => !inAxis(m.decimal));

  const visible = (filter === "all" ? onAxis : onAxis.filter(m => m.category === filter));

  return (
    <div className="min-h-screen">
      <main id="main">
        <section className="max-w-6xl mx-auto px-6 pt-10 sm:pt-12 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-[family-name:var(--font-display)] font-medium mb-4">
            <Activity size={14} aria-hidden="true" />
            The collapsing timeline
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            Twenty years of warnings, ten years of deadlines.
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            Scrub the cursor and watch the milestones light up. Research shrinks the qubit estimate.
            Standards land. Regulators set deadlines. Deployment ships. The window between &ldquo;safe&rdquo; and &ldquo;late&rdquo; keeps narrowing.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-6">
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/60 p-5 sm:p-6">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                <Calendar size={14} aria-hidden="true" /> Cursor
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-mono)] text-2xl font-bold text-[var(--color-accent)]">{cursorYear}</span>
                {cursorYear < TODAY_DECIMAL && <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)]">Past</span>}
                {cursorYear >= TODAY_DECIMAL && cursorYear < TODAY_DECIMAL + 1 && <span className="text-[10px] uppercase tracking-wider text-[var(--color-safe)] font-[family-name:var(--font-display)]">Now</span>}
                {cursorYear >= TODAY_DECIMAL + 1 && <span className="text-[10px] uppercase tracking-wider text-[var(--color-quantum)] font-[family-name:var(--font-display)]">Future</span>}
              </div>
            </div>

            <Axis cursorYear={cursorYear} milestones={onAxis} filter={filter} />

            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              step={1}
              value={cursorYear}
              onChange={(e) => setCursorYear(parseInt(e.target.value, 10))}
              aria-label="Cursor year"
              className="w-full mt-4 accent-[var(--color-accent)] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-[family-name:var(--font-mono)] mt-1">
              <span>{MIN_YEAR}</span>
              <span>2025</span>
              <span>2030</span>
              <span>2035</span>
              <span>{MAX_YEAR}</span>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mr-1">Filter:</span>
            <CategoryPill label="All" active={filter === "all"} onClick={() => setFilter("all")} />
            {(Object.entries(catMeta) as [MilestoneCategory, typeof catMeta.research][]).map(([k, m]) => (
              <CategoryPill key={k} label={m.label} active={filter === k} hex={m.hex} onClick={() => setFilter(k)} />
            ))}
            <span className="ml-auto text-xs text-[var(--color-text-muted)]">
              {visible.length} milestone{visible.length === 1 ? "" : "s"}
            </span>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-10">
          <ol className="space-y-2">
            {visible.map((m, i) => (
              <MilestoneCard key={m.id} milestone={m} cursorYear={cursorYear} delay={i * 30} />
            ))}
          </ol>
        </section>

        {offAxis.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 pb-10">
            <h2 className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-3">
              Before the window
            </h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {offAxis.map(m => (
                <div key={m.id} className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/40 p-3">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs font-[family-name:var(--font-mono)] text-[var(--color-text-muted)]">{m.date}</span>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)]">{catMeta[m.category].label}</span>
                  </div>
                  <div className="font-[family-name:var(--font-display)] text-sm font-medium text-[var(--color-text-primary)] mb-1">{m.label}</div>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{m.detail}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <LessonBacklinks labId="timeline" />
      </main>

      <footer className="border-t border-[var(--color-border-subtle)] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs italic text-[var(--color-text-muted)]/60">
            Sourced from RefDoc.md §13 & §15. <Link href="/atlas" className="underline hover:text-[var(--color-text-secondary)]">Back to atlas</Link>.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Axis({ cursorYear, milestones, filter }: { cursorYear: number; milestones: (Milestone & { decimal: number })[]; filter: MilestoneCategory | "all" }) {
  const cursorPct = pct(cursorYear);
  const todayPct = pct(TODAY_DECIMAL);

  return (
    <div className="relative h-24">
      {/* Year ticks */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[var(--color-border-subtle)]" />
      {[2020, 2025, 2030, 2035, 2040].map(y => (
        <div key={y} className="absolute top-0" style={{ left: `${pct(y)}%` }}>
          <div className="w-px h-3 bg-[var(--color-border-mid)] -translate-x-1/2" />
        </div>
      ))}

      {/* Today marker */}
      <div className="absolute top-0 bottom-0 border-l border-dashed border-[var(--color-safe)]/70 pointer-events-none" style={{ left: `${todayPct}%` }} aria-hidden="true">
        <span className="absolute top-1 -translate-x-1/2 text-[10px] text-[var(--color-safe)] font-[family-name:var(--font-display)] uppercase tracking-wider whitespace-nowrap px-1 bg-[var(--color-surface-raised)]">
          Today
        </span>
      </div>

      {/* Past shaded region */}
      <div className="absolute top-0 bottom-12 bg-[var(--color-quantum)]/[0.04]" style={{ left: 0, width: `${cursorPct}%` }} aria-hidden="true" />

      {/* Cursor */}
      <div className="absolute top-0 bottom-0 border-l-2 border-[var(--color-accent)] pointer-events-none" style={{ left: `${cursorPct}%` }} aria-hidden="true">
        <div className="absolute -top-1 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/30" />
      </div>

      {/* Milestone dots */}
      {milestones.map(m => {
        const active = filter === "all" || filter === m.category;
        const past = m.decimal <= cursorYear;
        const tone = catMeta[m.category];
        return (
          <div
            key={m.id}
            className="absolute"
            style={{ left: `${pct(m.decimal)}%`, top: 16 }}
            aria-hidden="true"
          >
            <span
              title={`${m.date} — ${m.label}`}
              className={`block -translate-x-1/2 w-2.5 h-2.5 rounded-full border transition-all ${active ? "" : "opacity-20"}`}
              style={{
                backgroundColor: past ? tone.hex : "transparent",
                borderColor: tone.hex,
                boxShadow: past ? `0 0 8px ${tone.hex}66` : "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function MilestoneCard({ milestone: m, cursorYear, delay }: { milestone: Milestone & { decimal: number }; cursorYear: number; delay: number }) {
  const Icon = catMeta[m.category].icon;
  const past = m.decimal <= cursorYear;
  return (
    <li
      className={`animate-fade-up rounded-xl border bg-[var(--color-surface-raised)]/60 p-4 transition-all ${
        past ? "border-[var(--color-border-mid)]" : "border-[var(--color-border-subtle)] opacity-60"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${catMeta[m.category].hex}1a`, color: catMeta[m.category].hex }}
        >
          <Icon size={16} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-2 mb-0.5">
            <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-text-muted)]">{m.date}</span>
            <span className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-text-primary)]">{m.label}</span>
            {m.source && (
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
                RefDoc {m.source}
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{m.detail}</p>
        </div>
      </div>
    </li>
  );
}

function CategoryPill({ label, active, hex, onClick }: { label: string; active: boolean; hex?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`text-xs px-3 py-1.5 min-h-[32px] rounded-full transition-colors font-[family-name:var(--font-display)] inline-flex items-center gap-1.5 ${
        active ? "bg-[var(--color-text-primary)] text-[var(--color-surface)]" : "bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
      }`}
    >
      {hex && <span className="w-2 h-2 rounded-full" style={{ background: hex }} aria-hidden="true" />}
      {label}
    </button>
  );
}
