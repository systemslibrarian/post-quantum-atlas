"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, Radar, RotateCcw, AlertTriangle, ShieldCheck, ShieldAlert,
  Clock, ArrowRightLeft, PenTool,
} from "lucide-react";

interface DataType {
  id: string;
  label: string;
  x: number;       // default confidentiality lifetime (years)
  hint: string;
}

const dataTypes: DataType[] = [
  { id: "health",     label: "Health records",       x: 25, hint: "Decades of confidentiality; a diagnosis doesn't expire." },
  { id: "personal",   label: "Personal data (PII)",  x: 15, hint: "Identity data stays sensitive for many years." },
  { id: "financial",  label: "Financial records",    x: 10, hint: "Regulated retention, roughly 7–10 years." },
  { id: "government", label: "Government / defense",  x: 40, hint: "Classified material with multi-decade secrecy." },
  { id: "business",   label: "Trade secrets",        x: 20, hint: "Formulas, designs, strategy — long shelf life." },
  { id: "session",    label: "Web session traffic",  x: 2,  hint: "Ephemeral — until you remember it can be harvested." },
];

type CryptoKind = "vulnerable" | "weakened" | "safe-sym" | "safe-pqc";

interface CryptoOption {
  id: string;
  label: string;
  kind: CryptoKind;
}

const cryptos: CryptoOption[] = [
  { id: "rsa",    label: "RSA-2048 / 3072",          kind: "vulnerable" },
  { id: "ecc",    label: "ECC (P-256 / X25519)",     kind: "vulnerable" },
  { id: "aes128", label: "AES-128 (symmetric)",      kind: "weakened" },
  { id: "aes256", label: "AES-256 (symmetric)",      kind: "safe-sym" },
  { id: "hybrid", label: "Hybrid (X25519 + ML-KEM)", kind: "safe-pqc" },
];

const arrivalPresets = [
  { label: "Optimistic · ~5y",   z: 5 },
  { label: "Mainstream · ~10y",  z: 10 },
  { label: "Conservative · ~18y", z: 18 },
];

type Level = "safe" | "upgrade" | "migrate" | "critical";

interface Verdict {
  level: Level;
  headline: string;
  detail: string;
  hndl: boolean;
}

function computeVerdict(x: number, y: number, z: number, kind: CryptoKind): Verdict {
  if (kind === "safe-pqc") {
    return {
      level: "safe",
      headline: "Protected",
      detail:
        "Your key exchange is already quantum-safe — a hybrid like X25519 + ML-KEM forces an attacker to break both the classical and the post-quantum layer. Keep certificates and signatures on the same migration track.",
      hndl: false,
    };
  }
  if (kind === "safe-sym") {
    return {
      level: "safe",
      headline: "Symmetric crypto survives",
      detail:
        "Grover's algorithm only halves symmetric security, so AES-256 retains a ~128-bit margin. One caveat: if RSA or ECC wraps, manages, or exchanges these keys, that asymmetric layer is the real exposure — evaluate it instead.",
      hndl: false,
    };
  }
  if (kind === "weakened") {
    return {
      level: "upgrade",
      headline: "Weakened — upgrade the cipher",
      detail:
        "Grover's algorithm cuts AES-128 to roughly 64-bit effective security. Upgrading to AES-256 is a cheap, non-breaking change that restores a comfortable margin — do it, but it isn't an emergency.",
      hndl: false,
    };
  }

  // Quantum-vulnerable asymmetric (RSA / ECC) — apply Mosca's inequality.
  const fails = x + y > z;
  const hndl = x > z;
  if (fails) {
    return {
      level: "critical",
      headline: hndl ? "Already exposed" : "You'll miss the deadline",
      detail: hndl
        ? `This data must stay secret for ${x} years, but a quantum computer may exist in ${z}. Anything an adversary records today can be decrypted well inside that window — classic harvest-now-decrypt-later. By Mosca's inequality (X + Y = ${x + y} > Z = ${z}) you have already failed for this data class.`
        : `X + Y = ${x + y} years exceeds Z = ${z}. You can't finish a ${y}-year migration before the threat arrives. The data itself is short-lived, so harvested copies lose value — but new traffic is at risk. Start now and shorten Y.`,
      hndl,
    };
  }
  const margin = z - (x + y);
  return {
    level: "migrate",
    headline: "Vulnerable, but you have margin",
    detail:
      `You rely on quantum-vulnerable crypto, yet X + Y = ${x + y} years still fits inside Z = ${z} (margin: ${margin} year${margin === 1 ? "" : "s"}). That margin is fragile — resource estimates keep falling — so begin hybrid migration now rather than spending it.`,
    hndl,
  };
}

const levelStyle: Record<Level, { tint: string; bg: string; border: string; icon: React.ComponentType<{ className?: string; size?: number }>; word: string }> = {
  safe:     { tint: "text-[var(--color-safe)]",    bg: "bg-[var(--color-safe)]/10",    border: "border-[var(--color-safe)]/30",    icon: ShieldCheck, word: "Safe" },
  upgrade:  { tint: "text-[var(--color-warning)]", bg: "bg-[var(--color-warning)]/10", border: "border-[var(--color-warning)]/30", icon: AlertTriangle, word: "Minor action" },
  migrate:  { tint: "text-[var(--color-accent)]",  bg: "bg-[var(--color-accent)]/10",  border: "border-[var(--color-accent)]/30",  icon: Clock, word: "Migrate now" },
  critical: { tint: "text-[var(--color-danger)]",  bg: "bg-[var(--color-danger)]/10",  border: "border-[var(--color-danger)]/30",  icon: ShieldAlert, word: "Critical" },
};

export default function QDayPage() {
  const [dataTypeId, setDataTypeId] = useState("health");
  const [x, setX] = useState(25);
  const [y, setY] = useState(7);
  const [z, setZ] = useState(10);
  const [cryptoId, setCryptoId] = useState("ecc");

  const crypto = cryptos.find((c) => c.id === cryptoId)!;
  const verdict = useMemo(() => computeVerdict(x, y, z, crypto.kind), [x, y, z, crypto.kind]);
  const style = levelStyle[verdict.level];
  const Icon = style.icon;

  function pickDataType(dt: DataType) {
    setDataTypeId(dt.id);
    setX(dt.x);
  }

  function reset() {
    setDataTypeId("health");
    setX(25);
    setY(7);
    setZ(10);
    setCryptoId("ecc");
  }

  // Mosca bar: scale X+Y and Z against a common axis.
  const axisMax = Math.max(x + y, z, 1) * 1.1;
  const xPct = (x / axisMax) * 100;
  const yPct = (y / axisMax) * 100;
  const zPct = (z / axisMax) * 100;

  return (
    <div className="min-h-screen">
      <main id="main">
        <section className="max-w-5xl mx-auto px-6 pt-10 sm:pt-12 pb-6">
          <Link href="/atlas" className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] mb-6 transition-colors">
            <ChevronLeft size={14} aria-hidden="true" /> Back to the atlas
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-quantum)]/10 border border-[var(--color-quantum)]/20 text-[var(--color-quantum)] text-xs font-[family-name:var(--font-display)] font-medium mb-5">
            <Radar size={14} aria-hidden="true" />
            Q-Day Simulator
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Are you already exposed?
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
            Describe your situation — the data you hold, how long it must stay secret, how long your
            migration takes, when a quantum computer might arrive, and the crypto you use today. The
            verdict updates live.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            {/* Inputs */}
            <div className="space-y-6">
              {/* Data type */}
              <fieldset className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/50 p-5">
                <legend className="px-1 text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)]">
                  What kind of data?
                </legend>
                <div className="flex flex-wrap gap-2 mt-2">
                  {dataTypes.map((dt) => {
                    const active = dt.id === dataTypeId;
                    return (
                      <button
                        key={dt.id}
                        type="button"
                        onClick={() => pickDataType(dt)}
                        aria-pressed={active}
                        className={`text-xs px-3 py-1.5 min-h-[32px] rounded-full transition-colors font-[family-name:var(--font-display)] ${
                          active
                            ? "bg-[var(--color-text-primary)] text-[var(--color-surface)]"
                            : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
                        }`}
                      >
                        {dt.label}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {dataTypes.find((d) => d.id === dataTypeId)?.hint}
                </p>
              </fieldset>

              {/* Sliders */}
              <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/50 p-5 space-y-5">
                <Slider
                  id="x" label="X · Confidentiality lifetime" value={x} min={1} max={50}
                  onChange={setX} suffix="years" tint="text-[var(--color-quantum)]"
                  help="How long this data must remain secret."
                />
                <Slider
                  id="y" label="Y · Migration time" value={y} min={1} max={15}
                  onChange={setY} suffix="years" tint="text-[var(--color-accent)]"
                  help="How long it takes you to roll out PQC."
                />
                <div>
                  <Slider
                    id="z" label="Z · Years until a quantum computer" value={z} min={3} max={25}
                    onChange={setZ} suffix="years" tint="text-[var(--color-warning)]"
                    help="When a cryptographically-relevant quantum computer (CRQC) arrives."
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {arrivalPresets.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setZ(p.z)}
                        aria-pressed={z === p.z}
                        className={`text-[11px] px-2.5 py-1 rounded-full transition-colors font-[family-name:var(--font-display)] ${
                          z === p.z
                            ? "bg-[var(--color-warning)]/20 text-[var(--color-warning)]"
                            : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Crypto */}
              <fieldset className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/50 p-5">
                <legend className="px-1 text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)]">
                  What protects it today?
                </legend>
                <div className="flex flex-wrap gap-2 mt-2">
                  {cryptos.map((c) => {
                    const active = c.id === cryptoId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCryptoId(c.id)}
                        aria-pressed={active}
                        className={`text-xs px-3 py-1.5 min-h-[32px] rounded-full transition-colors font-[family-name:var(--font-mono)] ${
                          active
                            ? "bg-[var(--color-text-primary)] text-[var(--color-surface)]"
                            : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
              >
                <RotateCcw size={13} aria-hidden="true" /> Reset
              </button>
            </div>

            {/* Verdict */}
            <div className="space-y-4">
              <div className={`rounded-2xl border ${style.border} ${style.bg} p-6`} role="status" aria-live="polite">
                <div className={`inline-flex items-center gap-2 ${style.tint} mb-3`}>
                  <Icon size={20} aria-hidden="true" />
                  <span className="text-xs uppercase tracking-wider font-[family-name:var(--font-display)] font-semibold">
                    {style.word}
                  </span>
                </div>
                <h2 className={`font-[family-name:var(--font-display)] text-2xl font-bold mb-2 ${style.tint}`}>
                  {verdict.headline}
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{verdict.detail}</p>
              </div>

              {/* Mosca bar */}
              <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/50 p-5">
                <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-display)] uppercase tracking-wider mb-3">
                  <span>Mosca&rsquo;s inequality</span>
                  <span className="font-[family-name:var(--font-mono)] normal-case tracking-normal">
                    X + Y = {x + y} {verdict.level === "critical" ? ">" : "≤"} Z = {z}
                  </span>
                </div>
                <div className="relative h-8" aria-hidden="true">
                  {/* X + Y stacked bar */}
                  <div className="absolute top-0 left-0 h-3 flex rounded-full overflow-hidden" style={{ width: `${xPct + yPct}%` }}>
                    <div className="h-full bg-[var(--color-quantum)]" style={{ width: `${(xPct / (xPct + yPct)) * 100}%` }} />
                    <div className="h-full bg-[var(--color-accent)]" style={{ width: `${(yPct / (xPct + yPct)) * 100}%` }} />
                  </div>
                  {/* Z marker */}
                  <div className="absolute top-0 bottom-3 w-0.5 bg-[var(--color-warning)]" style={{ left: `${zPct}%` }} />
                  <div className="absolute top-4 text-[10px] font-[family-name:var(--font-mono)] text-[var(--color-warning)]" style={{ left: `calc(${zPct}% - 4px)` }}>
                    Z
                  </div>
                </div>
                <div className="flex gap-4 mt-2 text-[11px] font-[family-name:var(--font-display)]">
                  <Legend tint="bg-[var(--color-quantum)]" label={`X data lifetime · ${x}y`} />
                  <Legend tint="bg-[var(--color-accent)]" label={`Y migration · ${y}y`} />
                </div>
              </div>

              {/* HNDL + signatures notes */}
              {verdict.hndl && (
                <div className="rounded-xl border border-[var(--color-danger)]/25 bg-[var(--color-danger)]/[0.05] p-4 flex items-start gap-2">
                  <ArrowRightLeft size={16} className="text-[var(--color-danger)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    <strong className="text-[var(--color-danger)]">Harvest-now-decrypt-later is active.</strong>{" "}
                    The deadline for confidentiality is <em>today</em>, not Q-Day — ciphertext captured now sits in
                    storage until a quantum computer can open it.
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/40 p-4 flex items-start gap-2">
                <PenTool size={16} className="text-[var(--color-text-muted)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  <strong className="text-[var(--color-text-primary)]">Signatures are different.</strong>{" "}
                  A signature only needs to be quantum-safe by the time a CRQC exists — there&rsquo;s no retroactive
                  risk. Encrypted secrets get no such grace period, which is why confidentiality migrates first.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm pt-1">
                <Link href="/migration" className="text-[var(--color-accent)] hover:underline inline-flex items-center gap-1">
                  <ChevronLeft size={14} className="rotate-180" aria-hidden="true" /> Open the migration playbook
                </Link>
                <Link href="/atlas/mosca" className="text-[var(--color-accent)] hover:underline">
                  See Mosca&rsquo;s slider
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Slider({
  id, label, value, min, max, onChange, suffix, tint, help,
}: {
  id: string; label: string; value: number; min: number; max: number;
  onChange: (n: number) => void; suffix: string; tint: string; help: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-text-secondary)] font-[family-name:var(--font-display)]">
          {label}
        </label>
        <span className={`font-[family-name:var(--font-mono)] text-sm font-semibold ${tint}`}>
          {value} {suffix}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-accent)]"
      />
      <p className="text-[11px] text-[var(--color-text-muted)] mt-1">{help}</p>
    </div>
  );
}

function Legend({ tint, label }: { tint: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[var(--color-text-muted)]">
      <span className={`w-2.5 h-2.5 rounded-full ${tint}`} aria-hidden="true" />
      {label}
    </span>
  );
}
