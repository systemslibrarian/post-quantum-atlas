"use client";

// Live Crypto Bench — the only lab that runs *real* post-quantum cryptography.
// Every byte shown here is produced in the browser by @noble/post-quantum
// (audited, pure-JS implementations of NIST FIPS 203 / 204) and @noble/curves.
// Nothing is faked or precomputed. All crypto runs inside click handlers, never
// during render, so the page still prerenders to static HTML for export.

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, FlaskConical, KeyRound, Layers, PenTool, RotateCcw,
  CheckCircle2, XCircle, Zap,
} from "lucide-react";
import { ml_kem768 } from "@noble/post-quantum/ml-kem.js";
import { ml_dsa65 } from "@noble/post-quantum/ml-dsa.js";
import { x25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, utf8ToBytes, concatBytes } from "@noble/hashes/utils.js";

// Render a byte array as a hex preview: full for short secrets (so a match is
// visibly byte-for-byte), head+tail for large keys.
function hex(b: Uint8Array, full = false): string {
  const h = bytesToHex(b);
  if (full || b.length <= 48) return h;
  return `${h.slice(0, 48)}…${h.slice(-16)}`;
}

// performance.now() is browser-only and only called inside handlers — safe here.
function timed<T>(fn: () => T): [T, number] {
  const t0 = performance.now();
  const out = fn();
  return [out, performance.now() - t0];
}

interface KemResult {
  pkLen: number; skLen: number; ctLen: number;
  pk: string; ct: string;
  bobSecret: string; aliceSecret: string;
  match: boolean; ms: number;
}

interface HybridResult {
  classical: string; pq: string; combined: string; ms: number;
}

interface SigResult {
  pkLen: number; sigLen: number;
  sig: string; message: string;
  validOk: boolean; tamperOk: boolean; ms: number;
}

export default function CryptoBenchPage() {
  const [kem, setKem] = useState<KemResult | null>(null);
  const [hybrid, setHybrid] = useState<HybridResult | null>(null);
  const [message, setMessage] = useState("Migrate before Q-Day.");
  const [sig, setSig] = useState<SigResult | null>(null);

  function runKem() {
    const [res, ms] = timed(() => {
      // Alice makes a keypair and publishes her public key.
      const alice = ml_kem768.keygen();
      // Bob encapsulates a fresh shared secret against Alice's public key.
      const { cipherText, sharedSecret: bobSecret } = ml_kem768.encapsulate(alice.publicKey);
      // Alice decapsulates the ciphertext with her secret key.
      const aliceSecret = ml_kem768.decapsulate(cipherText, alice.secretKey);
      return { alice, cipherText, bobSecret, aliceSecret };
    });
    setKem({
      pkLen: res.alice.publicKey.length,
      skLen: res.alice.secretKey.length,
      ctLen: res.cipherText.length,
      pk: hex(res.alice.publicKey),
      ct: hex(res.cipherText),
      bobSecret: hex(res.bobSecret, true),
      aliceSecret: hex(res.aliceSecret, true),
      match: bytesToHex(res.bobSecret) === bytesToHex(res.aliceSecret),
      ms,
    });
  }

  function runHybrid() {
    const [res, ms] = timed(() => {
      // Classical half: a real X25519 ECDH exchange.
      const a = x25519.keygen();
      const b = x25519.keygen();
      const classical = x25519.getSharedSecret(a.secretKey, b.publicKey);
      // Post-quantum half: a real ML-KEM-768 encapsulation.
      const kp = ml_kem768.keygen();
      const { sharedSecret: pq } = ml_kem768.encapsulate(kp.publicKey);
      // Combiner — teaching version: SHA-256 over a label + both secrets.
      const combined = sha256(concatBytes(utf8ToBytes("pqa-hybrid-v1"), classical, pq));
      return { classical, pq, combined };
    });
    setHybrid({
      classical: hex(res.classical, true),
      pq: hex(res.pq, true),
      combined: hex(res.combined, true),
      ms,
    });
  }

  function runSig() {
    const msg = utf8ToBytes(message);
    const [res, ms] = timed(() => {
      const { secretKey, publicKey } = ml_dsa65.keygen();
      const signature = ml_dsa65.sign(msg, secretKey);
      // Honest verification of the real message.
      const validOk = ml_dsa65.verify(signature, msg, publicKey);
      // Flip a single byte of the message and verify again — it must fail.
      const tampered = msg.slice();
      tampered[0] ^= 0x01;
      const tamperOk = ml_dsa65.verify(signature, tampered, publicKey);
      return { publicKey, signature, validOk, tamperOk };
    });
    setSig({
      pkLen: res.publicKey.length,
      sigLen: res.signature.length,
      sig: hex(res.signature),
      message,
      validOk: res.validOk,
      tamperOk: res.tamperOk,
      ms,
    });
  }

  function reset() {
    setKem(null);
    setHybrid(null);
    setSig(null);
    setMessage("Migrate before Q-Day.");
  }

  return (
    <div className="min-h-screen">
      <main id="main">
        <section className="max-w-5xl mx-auto px-6 pt-10 sm:pt-12 pb-6">
          <Link href="/atlas" className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] mb-6 transition-colors">
            <ChevronLeft size={14} aria-hidden="true" /> Back to the atlas
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-quantum)]/10 border border-[var(--color-quantum)]/20 text-[var(--color-quantum)] text-xs font-[family-name:var(--font-display)] font-medium mb-5">
            <FlaskConical size={14} aria-hidden="true" />
            Live Crypto Bench
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Run real post-quantum crypto.
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed max-w-2xl mb-4">
            This is not a simulation. Every byte below is generated right now, in your browser, by the
            audited{" "}
            <a href="https://github.com/paulmillr/noble-post-quantum" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-text-primary)]">
              @noble/post-quantum
            </a>{" "}
            library — the same <span className="font-[family-name:var(--font-mono)]">ML-KEM</span> and{" "}
            <span className="font-[family-name:var(--font-mono)]">ML-DSA</span> defined in NIST{" "}
            <span className="font-[family-name:var(--font-mono)]">FIPS&nbsp;203</span> and{" "}
            <span className="font-[family-name:var(--font-mono)]">FIPS&nbsp;204</span>.
          </p>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
            Nothing leaves your machine and nothing is precomputed — refresh and the bytes change,
            because fresh keys are sampled each run.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-16 space-y-5">
          {/* 1 — ML-KEM key exchange */}
          <Bench
            icon={KeyRound}
            n={1}
            title="ML-KEM-768 key encapsulation"
            subtitle="FIPS 203 · the quantum-safe replacement for RSA/ECC key exchange"
            run={runKem}
            runLabel="Run key exchange"
            hasResult={kem !== null}
          >
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Alice publishes a public key. Bob <em>encapsulates</em> a random shared secret against it,
              producing a ciphertext. Alice <em>decapsulates</em> that ciphertext with her secret key.
              If the scheme works, both sides hold the identical 32-byte secret — without it ever crossing the wire.
            </p>
            {kem && (
              <div className="mt-4 space-y-3">
                <BytesRow label="Alice public key" len={kem.pkLen} value={kem.pk} />
                <BytesRow label="Alice secret key" len={kem.skLen} value="(kept private)" mono={false} />
                <BytesRow label="Bob ciphertext" len={kem.ctLen} value={kem.ct} />
                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  <SecretBox label="Bob's shared secret" value={kem.bobSecret} />
                  <SecretBox label="Alice's shared secret" value={kem.aliceSecret} />
                </div>
                <Outcome
                  ok={kem.match}
                  okText="Shared secrets match — both sides derived the same 32 bytes."
                  badText="Mismatch (this should never happen)."
                  ms={kem.ms}
                />
              </div>
            )}
          </Bench>

          {/* 2 — Hybrid */}
          <Bench
            icon={Layers}
            n={2}
            title="Hybrid: X25519 + ML-KEM-768"
            subtitle="The construction shipping in TLS 1.3 today (x25519_mlkem768)"
            run={runHybrid}
            runLabel="Run hybrid exchange"
            hasResult={hybrid !== null}
          >
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              A real X25519 elliptic-curve exchange and a real ML-KEM-768 encapsulation, combined into one
              session secret. An attacker must break <strong>both</strong> the classical and the post-quantum
              layer — so the day a quantum computer breaks X25519, the ML-KEM half still holds.
            </p>
            {hybrid && (
              <div className="mt-4 space-y-3">
                <SecretBox label="X25519 shared secret (classical)" value={hybrid.classical} />
                <SecretBox label="ML-KEM-768 shared secret (post-quantum)" value={hybrid.pq} />
                <SecretBox label="Combined session secret" value={hybrid.combined} highlight />
                <Outcome
                  ok
                  okText="One secret, two independent hardness assumptions."
                  ms={hybrid.ms}
                />
                <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                  Teaching combiner: <span className="font-[family-name:var(--font-mono)]">SHA-256(label ‖ X25519 ‖ ML-KEM)</span>.
                  Production TLS uses an HKDF-based combiner (and X-Wing uses SHA3-256); the principle —
                  fold both secrets together — is identical.
                </p>
              </div>
            )}
          </Bench>

          {/* 3 — Signatures */}
          <Bench
            icon={PenTool}
            n={3}
            title="ML-DSA-65 sign & verify"
            subtitle="FIPS 204 · the quantum-safe replacement for RSA/ECDSA signatures"
            run={runSig}
            runLabel="Sign & verify"
            hasResult={sig !== null}
          >
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
              Type a message, sign it with a freshly generated ML-DSA key, and verify the signature.
              Then watch verification fail the instant a single byte of the message changes.
            </p>
            <label htmlFor="msg" className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-1.5">
              Message to sign
            </label>
            <input
              id="msg"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-sm font-[family-name:var(--font-mono)] text-[var(--color-text-primary)] focus:border-[var(--color-accent)]/50 focus:outline-none"
            />
            {sig && (
              <div className="mt-4 space-y-3">
                <BytesRow label="Public key" len={sig.pkLen} value="(verifies signatures)" mono={false} />
                <BytesRow label="Signature" len={sig.sigLen} value={sig.sig} />
                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  <Outcome ok={sig.validOk} okText="Original message verifies ✓" badText="Failed to verify" compact />
                  <Outcome ok={!sig.tamperOk} okText="Tampered message rejected ✗" badText="Tamper not detected!" compact danger />
                </div>
                <p className="text-[11px] text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
                  signed + verified in {sig.ms.toFixed(1)} ms
                </p>
              </div>
            )}
          </Bench>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
            >
              <RotateCcw size={13} aria-hidden="true" /> Reset bench
            </button>
            <Link href="/atlas/tls-theater" className="text-sm text-[var(--color-accent)] hover:underline">
              See where this runs in a TLS handshake →
            </Link>
            <Link href="/atlas/toolkit" className="text-sm text-[var(--color-accent)] hover:underline">
              Browse the algorithm cards →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function Bench({
  icon: Icon, n, title, subtitle, run, runLabel, hasResult, children,
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  n: number; title: string; subtitle: string;
  run: () => void; runLabel: string; hasResult: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/50 p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--color-quantum)]/10 flex items-center justify-center flex-shrink-0">
          <Icon size={18} className="text-[var(--color-quantum)]" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold leading-tight">
            <span className="text-[var(--color-text-muted)]">{n}.</span> {title}
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
      <button
        type="button"
        onClick={run}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--color-quantum)] px-4 py-2 text-sm font-medium text-[var(--color-surface)] hover:opacity-90 transition-opacity font-[family-name:var(--font-display)]"
      >
        <Zap size={15} aria-hidden="true" />
        {hasResult ? `Re-run (${runLabel.toLowerCase()})` : runLabel}
      </button>
    </div>
  );
}

function BytesRow({ label, len, value, mono = true }: { label: string; len: number; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <span className="text-xs text-[var(--color-text-secondary)] font-[family-name:var(--font-display)]">{label}</span>
        <span className="text-[11px] font-[family-name:var(--font-mono)] text-[var(--color-text-muted)]">{len.toLocaleString()} bytes</span>
      </div>
      <div className={`rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-[11px] break-all ${mono ? "font-[family-name:var(--font-mono)] text-[var(--color-text-secondary)]" : "text-[var(--color-text-muted)] italic"}`}>
        {value}
      </div>
    </div>
  );
}

function SecretBox({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-xs text-[var(--color-text-secondary)] font-[family-name:var(--font-display)] mb-1">{label}</div>
      <div className={`rounded-lg border px-3 py-2 text-[11px] break-all font-[family-name:var(--font-mono)] ${
        highlight
          ? "border-[var(--color-quantum)]/40 bg-[var(--color-quantum)]/[0.06] text-[var(--color-quantum)]"
          : "border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
      }`}>
        {value}
      </div>
    </div>
  );
}

function Outcome({
  ok, okText, badText, ms, compact = false, danger = false,
}: {
  ok: boolean; okText: string; badText?: string; ms?: number; compact?: boolean; danger?: boolean;
}) {
  const good = ok;
  const tint = good ? "text-[var(--color-safe)]" : (danger ? "text-[var(--color-danger)]" : "text-[var(--color-warning)]");
  const bg = good ? "bg-[var(--color-safe)]/10 border-[var(--color-safe)]/30" : "bg-[var(--color-danger)]/10 border-[var(--color-danger)]/30";
  const Icon = good ? CheckCircle2 : XCircle;
  return (
    <div className={`rounded-lg border ${bg} px-3 py-2 flex items-center gap-2 ${compact ? "" : "justify-between"}`}>
      <span className={`inline-flex items-center gap-2 text-sm font-medium ${tint}`}>
        <Icon size={16} aria-hidden="true" />
        {good ? okText : (badText ?? okText)}
      </span>
      {ms !== undefined && !compact && (
        <span className="text-[11px] font-[family-name:var(--font-mono)] text-[var(--color-text-muted)]">{ms.toFixed(1)} ms</span>
      )}
    </div>
  );
}
