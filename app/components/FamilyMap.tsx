"use client";

import { algorithms, type Algorithm, type AlgorithmFamily } from "../lib/algorithms";
import Link from "next/link";

interface FamilyMeta {
  id: AlgorithmFamily;
  label: string;
  hue: string;     // tailwind class for color
  hex: string;     // raw hex for SVG fill
  description: string;
}

const families: FamilyMeta[] = [
  { id: "lattice",     label: "Lattice",     hue: "text-[var(--color-quantum)]", hex: "#a78bfa", description: "ML-KEM, ML-DSA, FN-DSA — the workhorse of NIST's standards." },
  { id: "hash",        label: "Hash",        hue: "text-[var(--color-safe)]",    hex: "#34d399", description: "SLH-DSA. Built only from hash primitives — the conservative backup." },
  { id: "code",        label: "Code",        hue: "text-[var(--color-accent)]",  hex: "#38bdf8", description: "HQC, Classic McEliece — the non-lattice safety net." },
  { id: "multivariate",label: "Multivariate",hue: "text-[var(--color-warning)]", hex: "#fbbf24", description: "Research-stage. Most submissions broken during the NIST competition." },
  { id: "isogeny",     label: "Isogeny",     hue: "text-[var(--color-danger)]",  hex: "#f87171", description: "SIKE — broken on a desktop in 2022. A cautionary tale." },
];

export default function FamilyMap() {
  // 5 columns, evenly spaced.
  const cols = families.length;
  const width = 100;
  const margin = 8;
  const colW = (width - margin * 2) / cols;

  function algosFor(f: AlgorithmFamily): Algorithm[] {
    return algorithms.filter(a => a.family === f);
  }

  return (
    <div className="relative w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/40 overflow-hidden">
      <svg
        viewBox="0 0 100 56"
        role="img"
        aria-label="Map of the five post-quantum cryptography families. Lattice, hash, and code are standardized or selected. Multivariate is research-stage. Isogeny is broken."
        className="w-full h-auto block"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="bgGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#0a0e17" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100" height="56" fill="url(#bgGlow)" />

        {/* Labels */}
        <text x="50" y="6" textAnchor="middle" fill="#94a3b8" fontSize="2.2" fontFamily="Outfit, sans-serif" letterSpacing="0.3">
          POST-QUANTUM CRYPTOGRAPHY · FIVE FAMILIES
        </text>

        {families.map((f, i) => {
          const cx = margin + colW * i + colW / 2;
          const algos = algosFor(f.id);
          const broken = f.id === "isogeny";
          const niche = f.id === "multivariate";
          const fade = broken || niche;

          return (
            <g key={f.id}>
              {/* Connection line to center axis */}
              <line
                x1={cx} y1={14}
                x2={cx} y2={20}
                stroke={f.hex}
                strokeOpacity={fade ? 0.2 : 0.5}
                strokeWidth="0.3"
              />

              {/* Family node */}
              <circle
                cx={cx}
                cy={14}
                r="3"
                fill={f.hex}
                fillOpacity={fade ? 0.15 : 0.25}
                stroke={f.hex}
                strokeOpacity={fade ? 0.4 : 0.9}
                strokeWidth="0.3"
              />
              <text
                x={cx}
                y={15.2}
                textAnchor="middle"
                fontSize="2"
                fontWeight="600"
                fill={f.hex}
                fillOpacity={fade ? 0.5 : 1}
                fontFamily="Outfit, sans-serif"
              >
                {f.label}
              </text>

              {/* Algorithm dots stacked */}
              {algos.map((a, j) => {
                const dotY = 22 + j * 6;
                const isBroken = a.status === "broken";
                const opacity = isBroken ? 0.35 : 0.95;
                return (
                  <g key={a.id} opacity={opacity}>
                    <circle
                      cx={cx}
                      cy={dotY}
                      r="2.2"
                      fill={f.hex}
                      fillOpacity={isBroken ? 0.1 : 0.18}
                      stroke={f.hex}
                      strokeOpacity={isBroken ? 0.4 : 0.7}
                      strokeWidth="0.25"
                    />
                    <text
                      x={cx}
                      y={dotY + 0.8}
                      textAnchor="middle"
                      fontSize="1.5"
                      fontFamily="JetBrains Mono, monospace"
                      fill={isBroken ? "#94a3b8" : "#f1f5f9"}
                      fillOpacity={isBroken ? 0.6 : 1}
                    >
                      {shortName(a.name)}
                    </text>
                    {isBroken && (
                      <>
                        <line x1={cx - 2.4} y1={dotY - 2.4} x2={cx + 2.4} y2={dotY + 2.4} stroke="#f87171" strokeWidth="0.3" opacity="0.7" />
                        <line x1={cx - 2.4} y1={dotY + 2.4} x2={cx + 2.4} y2={dotY - 2.4} stroke="#f87171" strokeWidth="0.3" opacity="0.7" />
                      </>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Horizontal axis */}
        <line x1={margin} y1={14} x2={width - margin} y2={14} stroke="#334155" strokeWidth="0.15" />
      </svg>

      {/* Legend / caption */}
      <div className="px-4 py-3 border-t border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--color-text-muted)]">
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
      <svg width="10" height="10" viewBox="0 0 10 10">
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
  // Compact display labels for the SVG.
  return name
    .replace("CRYSTALS-", "")
    .replace("Multivariate schemes", "Multi-V")
    .replace("Classic McEliece", "McEliece");
}
