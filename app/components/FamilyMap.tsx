"use client";

import { algorithms, statusLabels, type Algorithm, type AlgorithmFamily } from "../lib/algorithms";
import Link from "next/link";

interface FamilyMeta {
  id: AlgorithmFamily;
  label: string;
  hex: string;        // raw hex, used for inline color so it can carry an alpha
  tag: string;        // short status word shown next to the family name
  description: string;
}

const families: FamilyMeta[] = [
  { id: "lattice",      label: "Lattice",      hex: "#a78bfa", tag: "The standards",     description: "ML-KEM and ML-DSA are NIST's primary picks — the workhorse of the whole transition." },
  { id: "hash",         label: "Hash",         hex: "#34d399", tag: "Conservative backup", description: "SLH-DSA is built only from hash functions. Larger and slower, but the most trusted." },
  { id: "code",         label: "Code",         hex: "#38bdf8", tag: "Non-lattice net",   description: "HQC was selected to diversify away from lattices; McEliece is the conservative old guard." },
  { id: "multivariate", label: "Multivariate", hex: "#fbbf24", tag: "Research-stage",    description: "Most submissions were broken during the NIST competition. Studied, not deployed." },
  { id: "isogeny",      label: "Isogeny",      hex: "#f87171", tag: "Broken · 2022",     description: "SIKE was broken on a single desktop in a weekend. A cautionary tale, kept for the lesson." },
];

// Convert "#rrggbb" to an rgba() string so a family colour can be reused at
// several opacities for borders, fills, and chips.
function withAlpha(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

export default function FamilyMap() {
  function algosFor(f: AlgorithmFamily): Algorithm[] {
    return algorithms.filter((a) => a.family === f);
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/40 overflow-hidden">
      <div className="px-5 sm:px-6 pt-5 pb-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-1.5">
          Post-quantum cryptography
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold mb-1.5">
          The five families
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
          Every post-quantum algorithm rests on one of five hard math problems. Three families
          already carry NIST standards, one is still research-stage, and one was broken outright.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 px-5 sm:px-6 pb-5">
        {families.map((f) => {
          const algos = algosFor(f.id);
          const fade = f.id === "isogeny" || f.id === "multivariate";

          return (
            <div
              key={f.id}
              className={`relative flex flex-col gap-2.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/60 p-3.5 ${
                fade ? "opacity-80" : ""
              }`}
              style={{ borderTop: `2px solid ${withAlpha(f.hex, 0.75)}` }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: f.hex, boxShadow: `0 0 8px ${withAlpha(f.hex, 0.6)}` }}
                  aria-hidden="true"
                />
                <span
                  className="font-[family-name:var(--font-display)] font-semibold text-sm leading-none"
                  style={{ color: f.hex }}
                >
                  {f.label}
                </span>
              </div>

              <span
                className="text-[10px] uppercase tracking-wider font-[family-name:var(--font-display)] font-semibold"
                style={{ color: withAlpha(f.hex, 0.85) }}
              >
                {f.tag}
              </span>

              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                {f.description}
              </p>

              <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                {algos.map((a) => {
                  const broken = a.status === "broken";
                  return (
                    <span
                      key={a.id}
                      title={`${a.name} — ${statusLabels[a.status]}`}
                      className={`text-[11px] font-[family-name:var(--font-mono)] px-2 py-0.5 rounded-md border whitespace-nowrap ${
                        broken ? "line-through" : ""
                      }`}
                      style={{
                        borderColor: withAlpha(f.hex, broken ? 0.25 : 0.4),
                        backgroundColor: withAlpha(f.hex, broken ? 0.04 : 0.08),
                        color: broken ? "var(--color-text-muted)" : f.hex,
                      }}
                    >
                      {shortName(a.name)}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend / caption */}
      <div className="px-5 sm:px-6 py-3 border-t border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--color-text-muted)]">
        <div className="flex flex-wrap items-center gap-3">
          <LegendDot hex="#a78bfa" label="Standardized" />
          <LegendDot hex="#34d399" label="Survives" />
          <LegendDot hex="#fbbf24" label="Research" />
          <LegendDot hex="#f87171" label="Broken" crossed />
        </div>
        <Link href="/atlas/toolkit" className="text-[var(--color-accent)] hover:underline font-[family-name:var(--font-display)]">
          Open the Toolkit →
        </Link>
      </div>
    </div>
  );
}

function LegendDot({ hex, label, crossed = false }: { hex: string; label: string; crossed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <circle cx="5" cy="5" r="3.5" fill={hex} fillOpacity={crossed ? 0.15 : 0.3} stroke={hex} strokeWidth="0.6" strokeOpacity={crossed ? 0.4 : 0.9} />
        {crossed && (
          <>
            <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" stroke="#f87171" strokeWidth="0.8" />
            <line x1="1.5" y1="8.5" x2="8.5" y2="1.5" stroke="#f87171" strokeWidth="0.8" />
          </>
        )}
      </svg>
      <span>{label}</span>
    </span>
  );
}

function shortName(name: string): string {
  // Compact display labels for the chips.
  return name
    .replace("CRYSTALS-", "")
    .replace("Multivariate schemes", "Multivariate")
    .replace("Classic McEliece", "McEliece");
}
