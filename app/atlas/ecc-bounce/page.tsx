"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Orbit, Play, Pause, RotateCcw, ChevronRight, Eye, EyeOff
} from "lucide-react";
import LessonBacklinks from "../../components/LessonBacklinks";

// Curve: y² = x³ + a x + b (over the reals, not a finite field, for clarity).
const A = -3;
const B = 5;

interface Pt { x: number; y: number; }

function onCurve(x: number, y: number): boolean {
  return Math.abs(y * y - (x * x * x + A * x + B)) < 1e-6;
}

function curveY(x: number): number | null {
  const rhs = x * x * x + A * x + B;
  if (rhs < 0) return null;
  return Math.sqrt(rhs);
}

// Point doubling: 2P
function doublePoint(P: Pt): Pt {
  const m = (3 * P.x * P.x + A) / (2 * P.y);
  const rx = m * m - 2 * P.x;
  const ry = -(m * (rx - P.x) + P.y);
  return { x: rx, y: ry };
}

// Point addition: P + Q, P != Q.
function addPoints(P: Pt, Q: Pt): Pt {
  const m = (Q.y - P.y) / (Q.x - P.x);
  const rx = m * m - P.x - Q.x;
  const ry = -(m * (rx - P.x) + P.y);
  return { x: rx, y: ry };
}

// Compute n·G (scalar multiplication) by repeated addition.
function multiply(G: Pt, n: number): Pt {
  if (n === 1) return G;
  let R = G;
  for (let i = 1; i < n; i++) R = addPoints(R, G);
  return R;
}

const G: Pt = { x: 1, y: Math.sqrt(3) };

// View box for SVG plotting — world coordinates.
const VIEW = { minX: -3, maxX: 4, minY: -5, maxY: 5 };

function toScreen(p: Pt, W: number, H: number): { x: number; y: number } {
  const sx = ((p.x - VIEW.minX) / (VIEW.maxX - VIEW.minX)) * W;
  const sy = H - ((p.y - VIEW.minY) / (VIEW.maxY - VIEW.minY)) * H;
  return { x: sx, y: sy };
}

function curvePath(W: number, H: number, samples = 300): string {
  // Two halves: top (y > 0) and bottom (y < 0). Find first x where the curve exists.
  const xs: number[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = VIEW.minX + ((VIEW.maxX - VIEW.minX) * i) / samples;
    if (curveY(x) !== null) xs.push(x);
  }
  if (xs.length === 0) return "";
  const top = xs.map(x => toScreen({ x, y: curveY(x)! }, W, H));
  const bot = [...xs].reverse().map(x => toScreen({ x, y: -curveY(x)! }, W, H));
  const all = [...top, ...bot];
  return all.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
}

export default function EccBouncePage() {
  const [n, setN] = useState(1); // current multiple
  const [playing, setPlaying] = useState(false);
  const [showConstruction, setShowConstruction] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cache up to N=12 multiples.
  const points = useMemo(() => {
    const arr: Pt[] = [G];
    for (let i = 2; i <= 12; i++) arr.push(multiply(G, i));
    return arr;
  }, []);

  useEffect(() => {
    if (!playing) return;
    timerRef.current = setTimeout(() => {
      setN(prev => prev < 12 ? prev + 1 : (setPlaying(false), prev));
    }, 1200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, n]);

  function step() { setN(prev => Math.min(12, prev + 1)); }
  function reset() { setN(1); setPlaying(false); }

  const currentPoint = points[n - 1];
  const startPoint = points[0];

  // Construction: line from previous point to G, intersection (mirror across x).
  const showLine = showConstruction && n >= 2;
  const W = 720, H = 480;

  // The construction line: from (n-1)·G to G, hitting curve at a third point, then reflecting.
  const construction = useMemo(() => {
    if (n < 2) return null;
    const prev = points[n - 2];
    const Q = G;
    const next = points[n - 1];
    // The third intersection (pre-reflection) is at (next.x, -next.y).
    return { from: prev, to: Q, third: { x: next.x, y: -next.y }, result: next };
  }, [n, points]);

  return (
    <div className="min-h-screen">
      <main id="main">
        <section className="max-w-6xl mx-auto px-6 pt-10 sm:pt-12 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-quantum)]/10 border border-[var(--color-quantum)]/20 text-[var(--color-quantum)] text-xs font-[family-name:var(--font-display)] font-medium mb-4">
            <Orbit size={14} aria-hidden="true" />
            ECC bounce visualizer
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            Billiards on a curve.
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            Elliptic curve cryptography is a math game with one rule:
            given a starting point <code className="font-[family-name:var(--font-mono)] text-[var(--color-quantum)]">G</code>{" "}
            and a number of bounces <code className="font-[family-name:var(--font-mono)] text-[var(--color-quantum)]">n</code>,
            compute <code className="font-[family-name:var(--font-mono)] text-[var(--color-quantum)]">n·G</code>.
            Forward — milliseconds. Backward — infeasible. That asymmetry is the trapdoor that protects every modern HTTPS connection.
            And a CRQC running Shor&rsquo;s collapses it.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={step}
              disabled={n >= 12}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-quantum)] text-white text-sm font-[family-name:var(--font-display)] font-medium hover:bg-[var(--color-quantum-dim)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[40px]"
            >
              <ChevronRight size={14} aria-hidden="true" />
              Bounce ({n}·G → {Math.min(12, n + 1)}·G)
            </button>
            <button
              onClick={() => setPlaying(p => !p)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] text-sm font-[family-name:var(--font-display)] transition-colors min-h-[40px]"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
              {playing ? "Pause" : "Auto"}
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] text-sm font-[family-name:var(--font-display)] transition-colors min-h-[40px]"
            >
              <RotateCcw size={14} aria-hidden="true" /> Reset
            </button>
            <button
              onClick={() => setShowConstruction(c => !c)}
              aria-pressed={showConstruction}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-sm font-[family-name:var(--font-display)] transition-colors min-h-[40px]"
            >
              {showConstruction ? <Eye size={14} /> : <EyeOff size={14} />}
              Construction
            </button>
            <div className="ml-auto text-sm text-[var(--color-text-secondary)] font-[family-name:var(--font-mono)]">
              n = {n} / 12
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-6">
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/40 p-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label={`Elliptic curve y² = x³ + (${A})x + ${B} with point ${n}·G plotted`}>
              {/* Grid */}
              <Grid W={W} H={H} />
              {/* Axes */}
              <Axes W={W} H={H} />
              {/* Curve */}
              <path d={curvePath(W, H)} fill="none" stroke="#7c3aed" strokeOpacity="0.7" strokeWidth="1.5" />
              {/* Visited points trace */}
              {points.slice(0, n).map((p, i) => {
                const s = toScreen(p, W, H);
                return (
                  <g key={i} opacity={i === n - 1 ? 1 : 0.5}>
                    <circle cx={s.x} cy={s.y} r={i === n - 1 ? 6 : 4} fill="#a78bfa" />
                    <text x={s.x + 9} y={s.y - 6} fontSize="11" fill="#94a3b8" fontFamily="JetBrains Mono, monospace">
                      {i + 1}·G
                    </text>
                  </g>
                );
              })}
              {/* Starting point G - highlighted */}
              <g>
                <circle cx={toScreen(startPoint, W, H).x} cy={toScreen(startPoint, W, H).y} r="8" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2" />
                <text x={toScreen(startPoint, W, H).x + 10} y={toScreen(startPoint, W, H).y + 14} fontSize="11" fill="#34d399" fontFamily="JetBrains Mono, monospace" fontWeight="600">
                  G (start)
                </text>
              </g>
              {/* Construction lines */}
              {showLine && construction && (
                <Construction c={construction} W={W} H={H} />
              )}
            </svg>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <Stat label="Current point" mono={`${formatCoord(currentPoint)}`} sub={`${n}·G`} tone="quantum" />
            <Stat label="Bounces taken" mono={`${n - 1}`} sub={n - 1 === 0 ? "We start at G." : "Each step adds G."} tone="accent" />
          </div>
          {n >= 6 && (
            <div className="mt-4 p-4 rounded-2xl border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 text-sm text-[var(--color-text-secondary)] leading-relaxed">
              <strong className="text-[var(--color-warning)] font-[family-name:var(--font-display)]">The trapdoor.</strong>{" "}
              You watched {n - 1} bounces happen and you can&rsquo;t look away. Now imagine someone hands you only{" "}
              <code className="font-[family-name:var(--font-mono)] text-[var(--color-warning)]">G</code> and{" "}
              <code className="font-[family-name:var(--font-mono)] text-[var(--color-warning)]">{n}·G</code> and asks how many bounces it took.
              That&rsquo;s the Elliptic Curve Discrete Logarithm Problem. Classical computers: infeasible. A CRQC running Shor&rsquo;s: trivial.
            </div>
          )}
        </section>

        <LessonBacklinks labId="ecc-bounce" />
      </main>

      <footer className="border-t border-[var(--color-border-subtle)] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs italic text-[var(--color-text-muted)]/60">
            Curve <span className="font-[family-name:var(--font-mono)]">y² = x³ − 3x + 5</span> over ℝ for clarity.
            Real ECC uses a finite field <span className="font-[family-name:var(--font-mono)]">𝔽<sub>p</sub></span> for cryptographic strength.
            Sourced from RefDoc.md §2. <Link href="/atlas" className="underline hover:text-[var(--color-text-secondary)]">Back to atlas</Link>.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Grid({ W, H }: { W: number; H: number }) {
  const lines: React.ReactNode[] = [];
  for (let gx = Math.ceil(VIEW.minX); gx <= Math.floor(VIEW.maxX); gx++) {
    const sx = toScreen({ x: gx, y: 0 }, W, H).x;
    lines.push(<line key={`vx-${gx}`} x1={sx} y1={0} x2={sx} y2={H} stroke="#1e293b" strokeWidth="0.5" />);
  }
  for (let gy = Math.ceil(VIEW.minY); gy <= Math.floor(VIEW.maxY); gy++) {
    const sy = toScreen({ x: 0, y: gy }, W, H).y;
    lines.push(<line key={`hy-${gy}`} x1={0} y1={sy} x2={W} y2={sy} stroke="#1e293b" strokeWidth="0.5" />);
  }
  return <g>{lines}</g>;
}

function Axes({ W, H }: { W: number; H: number }) {
  const x0 = toScreen({ x: 0, y: 0 }, W, H).x;
  const y0 = toScreen({ x: 0, y: 0 }, W, H).y;
  return (
    <g>
      <line x1={0} y1={y0} x2={W} y2={y0} stroke="#334155" strokeWidth="1" />
      <line x1={x0} y1={0} x2={x0} y2={H} stroke="#334155" strokeWidth="1" />
    </g>
  );
}

function Construction({
  c, W, H,
}: { c: { from: Pt; to: Pt; third: Pt; result: Pt }; W: number; H: number }) {
  const from = toScreen(c.from, W, H);
  const to = toScreen(c.to, W, H);
  const third = toScreen(c.third, W, H);
  const result = toScreen(c.result, W, H);

  // Extend the secant line through from→to→third for visual clarity.
  const dx = third.x - from.x;
  const dy = third.y - from.y;
  const ext = 1.5;
  const lineStart = { x: from.x - dx * 0.2, y: from.y - dy * 0.2 };
  const lineEnd = { x: from.x + dx * ext, y: from.y + dy * ext };

  return (
    <g opacity="0.9">
      {/* Secant */}
      <line
        x1={lineStart.x} y1={lineStart.y} x2={lineEnd.x} y2={lineEnd.y}
        stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 3"
      />
      {/* Third intersection */}
      <circle cx={third.x} cy={third.y} r="4" fill="#38bdf8" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1" />
      {/* Reflection arrow (third → result) */}
      <line x1={third.x} y1={third.y} x2={result.x} y2={result.y} stroke="#34d399" strokeWidth="1" strokeDasharray="2 3" />
      <text x={result.x + 9} y={(third.y + result.y) / 2} fontSize="10" fill="#34d399" fontFamily="JetBrains Mono, monospace">
        reflect
      </text>
    </g>
  );
}

function Stat({ label, mono, sub, tone }: { label: string; mono: string; sub: string; tone: "quantum" | "accent" }) {
  const color = tone === "quantum" ? "text-[var(--color-quantum)]" : "text-[var(--color-accent)]";
  return (
    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/60 p-4">
      <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-1">{label}</div>
      <div className={`font-[family-name:var(--font-mono)] text-lg font-semibold ${color}`}>{mono}</div>
      <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{sub}</div>
    </div>
  );
}

function formatCoord(p: Pt): string {
  return `(${p.x.toFixed(3)}, ${p.y.toFixed(3)})`;
}
