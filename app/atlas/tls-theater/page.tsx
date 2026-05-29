"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Zap,
  Globe, Server, ArrowRight, ArrowLeft, ShieldAlert, CheckCircle2
} from "lucide-react";
import LessonBacklinks from "../../components/LessonBacklinks";

interface Step {
  id: number;
  title: string;
  from: "client" | "server" | "both";
  classicalPayload: string;
  pqcNote?: string;
  attackerNote?: string;       // what the quantum attacker does at this step
  attackerBreaks?: boolean;    // is this the step where it falls?
  detail: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Client Hello",
    from: "client",
    classicalPayload: "Supported ciphers, random nonce, key shares (X25519 / RSA / ECDHE)",
    pqcNote: "Hybrid clients send X25519 + ML-KEM-768 key shares (~1,184 B).",
    attackerNote: "Recording the wire. Cannot break the key share alone yet.",
    detail: "The browser advertises which algorithms it speaks and sends ephemeral key material. In hybrid PQC, the key share blob jumps from 32 bytes to ~1.2 KB.",
  },
  {
    id: 2,
    title: "Server Hello + Certificate",
    from: "server",
    classicalPayload: "Selected cipher, server key share, certificate (RSA / ECDSA signature)",
    pqcNote: "Hybrid servers reply with ML-KEM ciphertext (~1,088 B) + ML-DSA-signed certificate (~2.4 KB).",
    attackerNote: "Verifying the cert chain — for now.",
    detail: "The server picks the strongest mutually-supported cipher, sends its key share, and presents its certificate signed by a CA's private key.",
  },
  {
    id: 3,
    title: "Key derivation",
    from: "both",
    classicalPayload: "Both sides derive the same session key from the key shares",
    pqcNote: "With ML-KEM the server's ciphertext decapsulates to the shared secret on the client.",
    attackerNote: "Storing the ciphertext for harvest-now-decrypt-later.",
    attackerBreaks: true,
    detail: "If the underlying key exchange is RSA or ECDH, a CRQC can solve the discrete log offline and recover the session key — even years later from a recording.",
  },
  {
    id: 4,
    title: "Finished",
    from: "both",
    classicalPayload: "MAC over the handshake transcript, switch to symmetric encryption",
    pqcNote: "Same — handshake completes; the AES session begins.",
    attackerNote: "Has the session key. Reads everything past this point.",
    detail: "Both sides confirm they computed the same key. From here, AES-GCM (or ChaCha20) carries the data.",
  },
  {
    id: 5,
    title: "Application data",
    from: "both",
    classicalPayload: "Symmetric AES-GCM stream",
    pqcNote: "AES-256 stays quantum-resilient.",
    attackerNote: "Replays the recording with the recovered key. Decrypts everything.",
    detail: "Bulk data travels under fast symmetric encryption. AES-256 itself survives a quantum attacker — but only if the attacker never recovers the symmetric key.",
  },
];

export default function TlsTheaterPage() {
  return (
    <Suspense fallback={null}>
      <TlsTheaterInner />
    </Suspense>
  );
}

function TlsTheaterInner() {
  const params = useSearchParams();
  const initialStep = Math.max(1, Math.min(steps.length, parseInt(params?.get("step") ?? "1", 10) || 1));
  const initialAttacker = params?.get("attacker") === "1";
  const initialPqc = params?.get("pqc") === "1";

  const [step, setStep] = useState(initialStep);
  const [playing, setPlaying] = useState(false);
  const [attacker, setAttacker] = useState(initialAttacker);
  const [pqc, setPqc] = useState(initialPqc);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!playing) return;
    if (step >= steps.length) { setPlaying(false); return; }
    timerRef.current = setTimeout(() => setStep(s => Math.min(s + 1, steps.length)), 1500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [step, playing]);

  function reset() {
    setStep(1);
    setPlaying(false);
  }

  const current = steps[step - 1];
  const broken = !!(attacker && !pqc && current.attackerBreaks);

  return (
    <div className="min-h-screen">
      <main id="main">
        <section className="max-w-5xl mx-auto px-6 pt-10 sm:pt-12 pb-6">
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            The TLS handshake — with and without a quantum attacker
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            Step through a TLS 1.3 handshake. Toggle the quantum attacker to see exactly which step collapses,
            and toggle hybrid PQC to watch it hold.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setPlaying(p => !p)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)] text-[var(--color-surface)] text-sm font-[family-name:var(--font-display)] font-medium hover:bg-[var(--color-accent-dim)] transition-colors min-h-[40px]"
              aria-label={playing ? "Pause animation" : "Play animation"}
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
              {playing ? "Pause" : "Play"}
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] text-sm font-[family-name:var(--font-display)] transition-colors min-h-[40px]"
            >
              <RotateCcw size={14} /> Reset
            </button>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <Toggle on={attacker} setOn={setAttacker} label="Quantum attacker" icon={<Zap size={12} />} activeTone="danger" />
              <Toggle on={pqc} setOn={setPqc} label="Hybrid PQC" icon={<ShieldAlert size={12} />} activeTone="quantum" />
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-6">
          <Stage step={step} attacker={attacker} pqc={pqc} broken={broken} />
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <div className="flex gap-1.5" role="tablist" aria-label="Handshake steps">
              {steps.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setStep(s.id); setPlaying(false); }}
                  aria-label={`Go to step ${s.id}: ${s.title}`}
                  aria-current={s.id === step ? "step" : undefined}
                  className={`w-8 h-8 rounded-full text-xs font-[family-name:var(--font-display)] font-medium transition-colors ${
                    s.id === step
                      ? "bg-[var(--color-accent)] text-[var(--color-surface)]"
                      : s.id < step
                        ? "bg-[var(--color-surface-hover)] text-[var(--color-text-primary)]"
                        : "bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
                  }`}
                >
                  {s.id}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(s => Math.min(steps.length, s + 1))}
              disabled={step === steps.length}
              className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>

          <StepCard current={current} attacker={attacker} pqc={pqc} broken={broken} />
        </section>

        {broken && (
          <section className="max-w-5xl mx-auto px-6 pb-10">
            <div className="rounded-2xl border-2 border-[var(--color-danger)]/50 bg-[var(--color-danger)]/10 p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert size={24} className="text-[var(--color-danger)] flex-shrink-0" />
                <div>
                  <div className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-danger)] mb-1">
                    Session compromised here.
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    With classical key exchange, a CRQC solves the discrete log offline and recovers the session key.
                    Every byte after step 4 reads in plaintext. Toggle hybrid PQC to watch the same step hold.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        <LessonBacklinks labId="tls-theater" />

        {attacker && pqc && step >= 3 && (
          <section className="max-w-5xl mx-auto px-6 pb-10">
            <div className="rounded-2xl border-2 border-[var(--color-safe)]/40 bg-[var(--color-safe)]/10 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={24} className="text-[var(--color-safe)] flex-shrink-0" />
                <div>
                  <div className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-safe)] mb-1">
                    Hybrid holds.
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    The attacker would need to break both X25519 (classical) and ML-KEM (post-quantum) to recover the session key.
                    Even with a CRQC, ML-KEM remains hard.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-[var(--color-border-subtle)] py-8">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs italic text-[var(--color-text-muted)]/60">
            Sourced from RefDoc.md §3. <Link href="/atlas" className="underline hover:text-[var(--color-text-secondary)]">Back to atlas</Link>.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Toggle({
  on, setOn, label, icon, activeTone,
}: {
  on: boolean; setOn: (v: boolean) => void; label: string; icon: React.ReactNode; activeTone: "danger" | "quantum";
}) {
  const activeBg = activeTone === "danger" ? "bg-[var(--color-danger)] text-white" : "bg-[var(--color-quantum)] text-white";
  return (
    <button
      onClick={() => setOn(!on)}
      aria-pressed={on}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-[family-name:var(--font-display)] font-medium transition-colors min-h-[32px] border ${
        on ? activeBg + " border-transparent" : "bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)]"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function Stage({ step, attacker, pqc, broken }: { step: number; attacker: boolean; pqc: boolean; broken: boolean }) {
  const current = steps[step - 1];
  return (
    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/60 p-4 sm:p-6 relative overflow-hidden">
      <div className="grid grid-cols-3 gap-4 items-center">
        {/* Client */}
        <Actor icon={<Globe size={24} />} label="Browser" sub="Client" />
        {/* Wire */}
        <div className="flex flex-col items-center gap-2">
          <ArrowFlow direction={current.from === "client" ? "right" : current.from === "server" ? "left" : "both"} broken={broken} />
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] text-center">
            Step {step} · {current.title}
          </span>
          {attacker && (
            <div className={`flex items-center gap-1 text-[10px] font-[family-name:var(--font-display)] ${broken ? "text-[var(--color-danger)]" : "text-[var(--color-warning)]"}`}>
              <Zap size={10} /> Attacker {pqc ? "watching" : "recording"}
            </div>
          )}
        </div>
        {/* Server */}
        <Actor icon={<Server size={24} />} label="example.com" sub="Server" align="right" />
      </div>
    </div>
  );
}

function Actor({ icon, label, sub, align = "left" }: { icon: React.ReactNode; label: string; sub: string; align?: "left" | "right" }) {
  return (
    <div className={`flex flex-col items-center ${align === "right" ? "sm:items-end" : "sm:items-start"} gap-2`}>
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-hover)] border border-[var(--color-border-mid)] flex items-center justify-center text-[var(--color-accent)]">
        {icon}
      </div>
      <div className="text-center sm:text-left">
        <div className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-text-primary)]">{label}</div>
        <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)]">{sub}</div>
      </div>
    </div>
  );
}

function ArrowFlow({ direction, broken }: { direction: "left" | "right" | "both"; broken: boolean }) {
  const tone = broken ? "text-[var(--color-danger)]" : "text-[var(--color-accent)]";
  return (
    <div className={`flex items-center gap-1 ${tone}`} aria-hidden="true">
      {direction === "left" && <ArrowLeft size={20} className="animate-pulse" />}
      {direction === "right" && <ArrowRight size={20} className="animate-pulse" />}
      {direction === "both" && (
        <>
          <ArrowLeft size={18} className="animate-pulse" />
          <ArrowRight size={18} className="animate-pulse" />
        </>
      )}
    </div>
  );
}

function StepCard({ current, attacker, pqc, broken }: { current: Step; attacker: boolean; pqc: boolean; broken: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 sm:p-6 ${broken ? "border-[var(--color-danger)]/40 bg-[var(--color-danger)]/5" : "border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/60"}`}>
      <div className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
        Step {current.id}
      </div>
      <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold mb-2">
        {current.title}
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
        {current.detail}
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        <Pane heading="On the wire">
          {pqc && current.pqcNote ? current.pqcNote : current.classicalPayload}
        </Pane>
        {attacker && (
          <Pane heading="Attacker view" tone={broken ? "danger" : pqc ? "safe" : "warning"}>
            {pqc ? "Hybrid key exchange — needs to break both layers. Out of reach." : current.attackerNote ?? "Recording."}
          </Pane>
        )}
      </div>
    </div>
  );
}

function Pane({ heading, tone = "neutral", children }: { heading: string; tone?: "neutral" | "danger" | "warning" | "safe"; children: React.ReactNode }) {
  const toneText = tone === "danger" ? "text-[var(--color-danger)]" : tone === "warning" ? "text-[var(--color-warning)]" : tone === "safe" ? "text-[var(--color-safe)]" : "text-[var(--color-text-muted)]";
  return (
    <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] p-3">
      <div className={`text-[10px] uppercase tracking-wider font-[family-name:var(--font-display)] mb-1 ${toneText}`}>
        {heading}
      </div>
      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{children}</p>
    </div>
  );
}
