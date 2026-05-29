"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, AlertTriangle, ShieldCheck, Sliders, RotateCcw, FileDown } from "lucide-react";
import LessonBacklinks from "../../components/LessonBacklinks";

interface Preset {
  id: string;
  label: string;
  x: number; y: number; z: number;
  description: string;
}

const presets: Preset[] = [
  { id: "medical",  label: "Medical records",        x: 30, y: 5,  z: 15, description: "Long-lived patient data with multi-decade confidentiality requirements." },
  { id: "defense",  label: "Military secrets",       x: 50, y: 7,  z: 15, description: "Diplomatic cables and weapons schematics that must remain secret for 50 years." },
  { id: "finance",  label: "Financial transactions", x: 10, y: 4,  z: 15, description: "Standard regulated data with 7–10 year retention." },
  { id: "session",  label: "Today's TLS sessions",   x: 1,  y: 1,  z: 15, description: "Ephemeral web traffic — until you remember harvest-now-decrypt-later." },
  { id: "embedded", label: "Embedded systems",     x: 20, y: 10, z: 15, description: "Satellites, vehicles, smart grids — 20-year hardware lifespans, migration takes a decade." },
];

export default function MoscaPage() {
  return (
    <Suspense fallback={null}>
      <MoscaInner />
    </Suspense>
  );
}

function MoscaInner() {
  const params = useSearchParams();
  const presetId = params?.get("preset");
  const initial = presets.find(p => p.id === presetId);

  const [x, setX] = useState(initial?.x ?? 20);
  const [y, setY] = useState(initial?.y ?? 5);
  const [z, setZ] = useState(initial?.z ?? 15);

  useEffect(() => {
    if (initial) { setX(initial.x); setY(initial.y); setZ(initial.z); }
  }, [presetId]); // eslint-disable-line react-hooks/exhaustive-deps

  const sum = x + y;
  const failing = sum > z;
  const margin = z - sum;

  function loadPreset(p: Preset) {
    setX(p.x); setY(p.y); setZ(p.z);
  }

  function reset() {
    setX(20); setY(5); setZ(15);
  }

  return (
    <div className="min-h-screen">
      <main id="main">
        <section className="max-w-5xl mx-auto px-6 pt-10 sm:pt-12 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 text-[var(--color-warning)] text-xs font-[family-name:var(--font-display)] font-medium mb-4">
            <Sliders size={14} aria-hidden="true" />
            Are you already late?
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            Mosca&rsquo;s Inequality
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            If <strong className="text-[var(--color-text-primary)]">X</strong> (how long your data must stay secret) plus{" "}
            <strong className="text-[var(--color-text-primary)]">Y</strong> (how long the migration takes) is greater than{" "}
            <strong className="text-[var(--color-text-primary)]">Z</strong> (time until a CRQC exists),
            then for that data class you have already failed. Adversaries are recording today.
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-2 font-[family-name:var(--font-mono)]">
            X + Y &gt; Z &nbsp;⟶&nbsp; already failed
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-10">
          <Verdict failing={failing} margin={margin} sum={sum} z={z} />
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-10">
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/60 p-5 sm:p-6 mb-6">
            <Timeline x={x} y={y} z={z} />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <SliderRow
              label="X — Data lifetime"
              tone="text-[var(--color-accent)]"
              value={x}
              setValue={setX}
              max={50}
              unit="years"
              hint="How long this data must stay confidential."
            />
            <SliderRow
              label="Y — Migration time"
              tone="text-[var(--color-warning)]"
              value={y}
              setValue={setY}
              max={15}
              unit="years"
              hint="How long it takes your org to roll out PQC."
            />
            <SliderRow
              label="Z — Time to CRQC"
              tone="text-[var(--color-quantum)]"
              value={z}
              setValue={setZ}
              max={30}
              unit="years"
              hint="Estimated years until a cryptographically-relevant quantum computer."
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] px-3 py-1.5 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] transition-colors"
            >
              <RotateCcw size={12} /> Reset
            </button>
            <button
              onClick={() => downloadReport(x, y, z, failing, margin, presetId)}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-3 py-1.5 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-mid)] transition-colors"
            >
              <FileDown size={12} /> Download readiness report
            </button>
          </div>
        </section>

        <LessonBacklinks labId="mosca" />

        <section className="max-w-5xl mx-auto px-6 pb-20">
          <h2 className="font-[family-name:var(--font-display)] text-sm uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
            Try a preset
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {presets.map(p => (
              <button
                key={p.id}
                onClick={() => loadPreset(p)}
                className="text-left rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/60 hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-mid)] p-4 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-[family-name:var(--font-display)] font-semibold text-sm text-[var(--color-text-primary)]">
                    {p.label}
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text-muted)]">
                    {p.x}+{p.y} vs {p.z}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{p.description}</p>
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border-subtle)] py-8">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs italic text-[var(--color-text-muted)]/60">
            Sourced from RefDoc.md §5 & §13. <Link href="/atlas" className="underline hover:text-[var(--color-text-secondary)]">Back to atlas</Link>.
          </p>
        </div>
      </footer>
    </div>
  );
}

function downloadReport(x: number, y: number, z: number, failing: boolean, margin: number, presetId: string | null | undefined) {
  const today = new Date().toISOString().slice(0, 10);
  const preset = presetId ? `Preset: ${presetId}` : "Preset: (custom)";
  const verdict = failing
    ? `ALREADY FAILED FOR THIS DATA CLASS.\n  X + Y = ${x + y} years exceeds Z = ${z} years.\n  Anything encrypted today under classical asymmetric crypto is on the table for retroactive decryption.`
    : `SLACK REMAINING — for now.\n  X + Y = ${x + y} years vs. Z = ${z} years.\n  ${margin} year${margin === 1 ? "" : "s"} of headroom. Plan the migration now; estimates collapse fast.`;

  const body = `POST-QUANTUM ATLAS — MOSCA READINESS REPORT
Generated ${today}

INPUTS
  ${preset}
  X (data secrecy lifetime):   ${x} years
  Y (migration time):           ${y} years
  Z (time to CRQC):             ${z} years

VERDICT
  ${verdict}

WHY THIS MATTERS
  Mosca's inequality (X + Y > Z) says any data with a secrecy window long enough
  to outlive its protection has already failed for that data class. Adversaries
  capable of harvest-now-decrypt-later are recording today.

NEXT STEPS (FRAMEWORK-AGNOSTIC)
  1. Cryptographic inventory (CBOM) — discover before you migrate.
  2. Risk-rank data classes by X. Highest first.
  3. Deploy hybrid KEMs (e.g. X25519 + ML-KEM-768) where feasible.
  4. Plan signature migration to ML-DSA (or SLH-DSA where hash-based backup matters).
  5. Track regulator deadlines — most converge on 2030 (critical) and 2035 (full).

PRIMARY REFERENCES
  • NIST FIPS 203 / 204 / 205 — August 2024
  • CNSA 2.0 (NSA)
  • UK NCSC — Migration timelines
  • EU NIS Cooperation Group roadmap

Sourced from RefDoc.md v3.8 — Post-Quantum Atlas
https://systemslibrarian.github.io/post-quantum-atlas/
`;
  const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mosca-readiness-${today}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function Verdict({ failing, margin, sum, z }: { failing: boolean; margin: number; sum: number; z: number }) {
  const Icon = failing ? AlertTriangle : ShieldCheck;
  const tone = failing ? "border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
                       : "border-[var(--color-safe)]/40 bg-[var(--color-safe)]/10 text-[var(--color-safe)]";

  return (
    <div className={`rounded-2xl border-2 ${tone} p-5 sm:p-6`} role="status" aria-live="polite">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${failing ? "bg-[var(--color-danger)]/20" : "bg-[var(--color-safe)]/20"}`}>
          <Icon size={26} aria-hidden="true" />
        </div>
        <div className="flex-1">
          <div className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wider opacity-80 mb-1">
            Verdict
          </div>
          <div className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold mb-1">
            {failing ? "Already failed for this data class." : "Margin remaining — for now."}
          </div>
          <p className="text-sm opacity-90 leading-relaxed">
            {failing
              ? `X + Y = ${sum} years vs. Z = ${z} years. Adversaries collecting today can decrypt later — start migrating now.`
              : `X + Y = ${sum} years vs. Z = ${z} years. You have ${margin} year${margin === 1 ? "" : "s"} of slack. Plan the migration now anyway; slack disappears as estimates collapse.`}
          </p>
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  label, tone, value, setValue, max, unit, hint,
}: {
  label: string; tone: string; value: number; setValue: (v: number) => void; max: number; unit: string; hint: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/60 p-4 sm:p-5">
      <div className="flex items-baseline justify-between mb-1">
        <label className={`font-[family-name:var(--font-display)] text-sm font-semibold ${tone}`}>
          {label}
        </label>
        <span className="font-[family-name:var(--font-mono)] text-base text-[var(--color-text-primary)]">
          {value} <span className="text-xs text-[var(--color-text-muted)]">{unit}</span>
        </span>
      </div>
      <p className="text-xs text-[var(--color-text-muted)] mb-3 leading-relaxed">{hint}</p>
      <input
        type="range"
        min={1}
        max={max}
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value, 10))}
        aria-label={label}
        className="w-full accent-[var(--color-accent)] cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] mt-1 font-[family-name:var(--font-mono)]">
        <span>1</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function Timeline({ x, y, z }: { x: number; y: number; z: number }) {
  const maxYears = Math.max(50, z + 5);
  const xy = x + y;
  const xPct = useMemo(() => (x / maxYears) * 100, [x, maxYears]);
  const yPct = useMemo(() => (y / maxYears) * 100, [y, maxYears]);
  const zPct = useMemo(() => (z / maxYears) * 100, [z, maxYears]);
  const xyPct = useMemo(() => (xy / maxYears) * 100, [xy, maxYears]);
  const overrun = xy > z;
  const ticks = [0, 10, 20, 30, 40, 50].filter(t => t <= maxYears);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-text-primary)]">
          Timeline (years from today)
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)]">
          X + Y vs. Z
        </span>
      </div>

      <div className="relative h-28 sm:h-32">
        {/* Z bar — quantum threat horizon */}
        <Bar
          top="top-1"
          label="Z · CRQC arrives"
          width={zPct}
          colorClass="bg-[var(--color-quantum)]/30 border-[var(--color-quantum)]/60"
          textClass="text-[var(--color-quantum)]"
          marker
        />
        {/* X bar */}
        <Bar
          top="top-10"
          label={`X · data secret for ${x}y`}
          width={xPct}
          colorClass="bg-[var(--color-accent)]/30 border-[var(--color-accent)]/60"
          textClass="text-[var(--color-accent)]"
        />
        {/* Y bar stacked after X */}
        <div className="absolute top-[68px] left-0 right-0 h-6 flex">
          <div style={{ width: `${xPct}%` }} aria-hidden="true" />
          <div
            className="h-full rounded-md border border-[var(--color-warning)]/60 bg-[var(--color-warning)]/30 flex items-center px-2"
            style={{ width: `${yPct}%` }}
          >
            <span className="text-[10px] text-[var(--color-warning)] truncate font-[family-name:var(--font-display)]">
              Y · migrate ({y}y)
            </span>
          </div>
        </div>

        {/* Overrun marker */}
        {overrun && (
          <div
            className="absolute top-[64px] h-9 border-l-2 border-dashed border-[var(--color-danger)]"
            style={{ left: `${zPct}%` }}
            aria-hidden="true"
          >
            <span className="absolute -top-5 left-1 text-[10px] uppercase tracking-wider text-[var(--color-danger)] font-[family-name:var(--font-display)] whitespace-nowrap">
              Late by {xy - z}y
            </span>
          </div>
        )}

        {/* Tick marks */}
        <div className="absolute bottom-0 left-0 right-0 h-4 border-t border-[var(--color-border-subtle)]">
          {ticks.map(t => (
            <div
              key={t}
              className="absolute -top-0.5 h-2 border-l border-[var(--color-text-muted)]/40"
              style={{ left: `${(t / maxYears) * 100}%` }}
            >
              <span className="absolute top-2 -translate-x-1/2 text-[10px] text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
                {t}y
              </span>
            </div>
          ))}
        </div>
      </div>

      {overrun && (
        <p className="mt-4 text-xs text-[var(--color-danger)]">
          X + Y extends past Z. Anything encrypted today inside that overlap is on the table for retroactive decryption.
        </p>
      )}
    </div>
  );
}

function Bar({
  top, label, width, colorClass, textClass, marker,
}: {
  top: string; label: string; width: number; colorClass: string; textClass: string; marker?: boolean;
}) {
  return (
    <div className={`absolute ${top} left-0 right-0 h-6`}>
      <div
        className={`h-full rounded-md border ${colorClass} flex items-center px-2 relative`}
        style={{ width: `${width}%` }}
      >
        <span className={`text-[10px] truncate font-[family-name:var(--font-display)] ${textClass}`}>
          {label}
        </span>
        {marker && (
          <span className={`absolute -right-px top-0 bottom-0 w-0.5 ${textClass.replace("text-", "bg-")}`} aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
