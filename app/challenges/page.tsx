"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles, CheckCircle2, XCircle, RotateCcw, Lock,
  Cable, FileSignature, Hash, ShieldOff, AlertTriangle, Trophy
} from "lucide-react";

interface Choice {
  id: string;
  label: string;
  detail?: string;
}

interface Challenge {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  prompt: string;
  choices: Choice[];
  correctId: string;
  explanation: string;
}

const challenges: Challenge[] = [
  {
    id: "handshake",
    title: "Which handshake survives?",
    icon: Cable,
    prompt: "A CRQC arrives and recovers the session keys from every handshake whose key exchange relies solely on classical math. Which of these TLS 1.3 configurations is still safe?",
    choices: [
      { id: "rsa",     label: "RSA key transport",                      detail: "Classic RSA-only key exchange." },
      { id: "x25519",  label: "X25519 (pure classical ECDH)",           detail: "Modern default in TLS 1.3 — pre-PQC." },
      { id: "hybrid",  label: "X25519 + ML-KEM-768 (hybrid)",           detail: "The IANA X-Wing group, code point 0x11EC." },
      { id: "ecdsa",   label: "ECDSA-only signed cert + ECDHE",         detail: "Modern but entirely elliptic-curve." },
    ],
    correctId: "hybrid",
    explanation: "Hybrid wraps the session key in both X25519 and ML-KEM-768. An attacker would need to break both lattices and elliptic curves — even with a CRQC, the ML-KEM half holds.",
  },
  {
    id: "pqc-cert",
    title: "Which certificate is PQC-signed?",
    icon: FileSignature,
    prompt: "You inspect four certificates' signature algorithm OIDs. Which one is post-quantum?",
    choices: [
      { id: "rsa-pss",  label: "rsassaPss (RSA-PSS, 2048-bit)",        detail: "OID 1.2.840.113549.1.1.10" },
      { id: "ecdsa",    label: "ecdsa-with-SHA384 (P-384)",            detail: "OID 1.2.840.10045.4.3.3" },
      { id: "eddsa",    label: "Ed25519",                              detail: "OID 1.3.101.112" },
      { id: "ml-dsa",   label: "ML-DSA-65",                            detail: "NIST FIPS 204 signature algorithm" },
    ],
    correctId: "ml-dsa",
    explanation: "ML-DSA (Dilithium) is one of the three NIST PQC signature standards — FIPS 204. The others (RSA-PSS, ECDSA, Ed25519) are all classically secure but fall to Shor's.",
  },
  {
    id: "fips",
    title: "Match algorithm to FIPS number",
    icon: Hash,
    prompt: "Which FIPS standard publishes SLH-DSA (SPHINCS+)?",
    choices: [
      { id: "203", label: "FIPS 203", detail: "ML-KEM" },
      { id: "204", label: "FIPS 204", detail: "ML-DSA" },
      { id: "205", label: "FIPS 205", detail: "SLH-DSA" },
      { id: "206", label: "FIPS 206 (draft)", detail: "FN-DSA / FALCON" },
    ],
    correctId: "205",
    explanation: "FIPS 205 standardizes SLH-DSA — the stateless hash-based signature scheme. FIPS 203 = ML-KEM, 204 = ML-DSA, and FIPS 206 is FN-DSA in development.",
  },
  {
    id: "broken",
    title: "Spot the broken family",
    icon: ShieldOff,
    prompt: "NIST diversified across five mathematical families. One of them was broken on a desktop in roughly an hour back in 2022. Which?",
    choices: [
      { id: "lattice",     label: "Lattice",      detail: "Foundation of ML-KEM, ML-DSA, FN-DSA." },
      { id: "hash",        label: "Hash",         detail: "Foundation of SLH-DSA, LMS, XMSS." },
      { id: "code",        label: "Code",         detail: "HQC, Classic McEliece." },
      { id: "isogeny",     label: "Isogeny",      detail: "SIKE — Supersingular Isogeny KEM." },
    ],
    correctId: "isogeny",
    explanation: "Castryck and Decru broke SIKE — the only isogeny-based NIST finalist — in 2022 with a classical attack running in about an hour on a standard laptop. The cautionary tale that justifies the diversification strategy.",
  },
  {
    id: "mosca",
    title: "Verdict by Mosca's inequality",
    icon: AlertTriangle,
    prompt: "A medical record must stay confidential for X = 30 years. Your hospital's migration plan needs Y = 5 years. Best CRQC estimate is Z = 15 years. Verdict?",
    choices: [
      { id: "safe",          label: "Safe — plenty of headroom",                    detail: "X + Y comfortably below Z." },
      { id: "tight",         label: "Tight — start migrating soon",                 detail: "X + Y close to Z." },
      { id: "already-failed",label: "Already failed for this data class",           detail: "X + Y > Z." },
      { id: "unknowable",    label: "Unknowable until Q-Day",                       detail: "Mosca's offers no verdict." },
    ],
    correctId: "already-failed",
    explanation: "X + Y = 35 years > Z = 15 years. By Mosca's inequality, any record encrypted today under classical asymmetric crypto is on the table for retroactive decryption. The decision to migrate is already overdue for 30-year medical secrecy.",
  },
];

const STORAGE_KEY = "pq-atlas-challenges-v1";

function loadSolved(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"); } catch { return {}; }
}

function saveSolved(solved: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(solved));
}

export default function ChallengesPage() {
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  useEffect(() => { setSolved(loadSolved()); }, []);

  function markSolved(id: string) {
    const next = { ...solved, [id]: true };
    setSolved(next);
    saveSolved(next);
  }

  function reset() {
    setSolved({});
    saveSolved({});
  }

  const solvedCount = Object.values(solved).filter(Boolean).length;
  const total = challenges.length;
  const allDone = solvedCount === total;

  return (
    <div className="min-h-screen">
      <main id="main">
        <section className="max-w-4xl mx-auto px-6 pt-10 sm:pt-12 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 text-[var(--color-warning)] text-xs font-[family-name:var(--font-display)] font-medium mb-4">
            <Sparkles size={14} aria-hidden="true" />
            Challenges
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            Did you catch the math?
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] max-w-2xl leading-relaxed mb-6">
            Five short puzzles drawn from the halls and the atlas. Pick one answer per challenge.
            Wrong picks reveal the explanation; right picks unlock the badge.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Trophy size={16} className="text-[var(--color-warning)]" aria-hidden="true" />
              <span aria-label={`${solvedCount} of ${total} challenges solved`}>
                {solvedCount} / {total} solved
              </span>
            </div>
            <div className="w-32 h-1.5 bg-[var(--color-surface-raised)] rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round((solvedCount / total) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Challenge progress">
              <div className="progress-fill h-full bg-[var(--color-warning)] rounded-full" style={{ width: `${(solvedCount / total) * 100}%` }} />
            </div>
            {solvedCount > 0 && (
              <button
                onClick={reset}
                className="ml-auto inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] px-3 py-1.5 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] transition-colors"
              >
                <RotateCcw size={12} aria-hidden="true" /> Reset
              </button>
            )}
          </div>

          {allDone && (
            <div className="mt-6 p-4 rounded-2xl border border-[var(--color-safe)]/30 bg-[var(--color-safe)]/10 flex items-start gap-3">
              <Trophy size={22} className="text-[var(--color-safe)] flex-shrink-0" aria-hidden="true" />
              <div>
                <div className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-safe)] mb-1">Quantum-safe.</div>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  You called every shot. Now go check the{" "}
                  <Link href="/atlas/timeline" className="underline hover:text-[var(--color-text-primary)]">timeline</Link>{" "}
                  — the dates keep moving.
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-20 space-y-5">
          {challenges.map((c, i) => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              index={i}
              solved={!!solved[c.id]}
              onSolved={() => markSolved(c.id)}
            />
          ))}
        </section>
      </main>

      <footer className="border-t border-[var(--color-border-subtle)] py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs italic text-[var(--color-text-muted)]/60">
            Sourced from RefDoc.md. <Link href="/atlas" className="underline hover:text-[var(--color-text-secondary)]">Back to atlas</Link>.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ChallengeCard({
  challenge: c, index, solved, onSolved,
}: {
  challenge: Challenge; index: number; solved: boolean; onSolved: () => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const Icon = c.icon;
  const correct = picked === c.correctId;
  const revealed = picked !== null;

  useEffect(() => {
    if (correct && !solved) onSolved();
  }, [correct, solved, onSolved]);

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 bg-[var(--color-surface-raised)]/60 transition-colors ${
      solved ? "border-[var(--color-safe)]/30" : "border-[var(--color-border-subtle)]"
    }`}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
          solved ? "bg-[var(--color-safe)]/15 text-[var(--color-safe)]" : "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
        }`}>
          {solved ? <CheckCircle2 size={22} aria-hidden="true" /> : <Icon size={20} aria-hidden="true" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-1">
            Challenge {index + 1}
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold leading-tight">
            {c.title}
          </h2>
        </div>
        {solved && (
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-safe)] font-[family-name:var(--font-display)] flex items-center gap-1">
            <Lock size={11} aria-hidden="true" /> Solved
          </span>
        )}
      </div>

      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">{c.prompt}</p>

      <ul className="grid sm:grid-cols-2 gap-2" role="radiogroup" aria-label={c.title}>
        {c.choices.map(opt => {
          const isPicked = picked === opt.id;
          const isCorrect = opt.id === c.correctId;
          const showCorrect = revealed && isCorrect;
          const showWrong = revealed && isPicked && !isCorrect;
          return (
            <li key={opt.id}>
              <button
                role="radio"
                aria-checked={isPicked}
                disabled={revealed && correct}
                onClick={() => setPicked(opt.id)}
                className={`w-full text-left p-3 rounded-xl border text-sm transition-colors ${
                  showCorrect ? "border-[var(--color-safe)]/50 bg-[var(--color-safe)]/10 text-[var(--color-safe)]"
                  : showWrong ? "border-[var(--color-danger)]/50 bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
                  : isPicked ? "border-[var(--color-border-mid)] bg-[var(--color-surface-hover)]"
                  : "border-[var(--color-border-subtle)] bg-[var(--color-surface)]/40 hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-mid)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  {showCorrect && <CheckCircle2 size={14} aria-hidden="true" />}
                  {showWrong && <XCircle size={14} aria-hidden="true" />}
                  <span className="font-[family-name:var(--font-display)] font-medium">{opt.label}</span>
                </div>
                {opt.detail && (
                  <div className="text-[11px] text-[var(--color-text-muted)] mt-1">{opt.detail}</div>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {revealed && (
        <div className={`mt-4 p-3 rounded-xl text-sm leading-relaxed ${
          correct
            ? "bg-[var(--color-safe)]/10 border border-[var(--color-safe)]/20 text-[var(--color-text-secondary)]"
            : "bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 text-[var(--color-text-secondary)]"
        }`}>
          <div className={`text-[10px] uppercase tracking-wider mb-1 font-[family-name:var(--font-display)] ${
            correct ? "text-[var(--color-safe)]" : "text-[var(--color-danger)]"
          }`}>
            {correct ? "Correct" : "Not quite"}
          </div>
          {c.explanation}
          {!correct && (
            <div className="mt-2">
              <button
                onClick={() => setPicked(null)}
                className="text-xs underline text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
