"use client";

// Inline "run it live" demo embedded in a PQC Toolkit algorithm card.
// Uses the audited @noble/post-quantum primitives — the real NIST-standard
// algorithms — for the four schemes that have a browser-safe implementation.
// Algorithms without one (HQC, Classic McEliece, multivariate, SIKE) render
// nothing here and instead link out to the Crypto Lab demos (see algorithms.ts).
//
// All crypto runs inside the click handler, deferred one tick so the "Running…"
// state paints first — SLH-DSA in particular takes ~1s, which is itself the lesson.

import { useState } from "react";
import Link from "next/link";
import { Zap, CheckCircle2, XCircle, Loader2, FlaskConical } from "lucide-react";
import { ml_kem768 } from "@noble/post-quantum/ml-kem.js";
import { ml_dsa65 } from "@noble/post-quantum/ml-dsa.js";
import { slh_dsa_shake_128f } from "@noble/post-quantum/slh-dsa.js";
import { falcon512 } from "@noble/post-quantum/falcon.js";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils.js";

const DEMO_MESSAGE = "The quantum threat is real.";

function hex(b: Uint8Array, full = false): string {
  const h = bytesToHex(b);
  if (full || b.length <= 40) return h;
  return `${h.slice(0, 40)}…${h.slice(-12)}`;
}

type Result =
  | { kind: "kem"; pkLen: number; ctLen: number; secret: string; match: boolean; ms: number }
  | { kind: "sig"; pkLen: number; sigLen: number; sig: string; validOk: boolean; tamperOk: boolean; ms: number };

// Minimal shapes we rely on, to stay decoupled from noble's wrapper types.
interface Kem {
  keygen: () => { publicKey: Uint8Array; secretKey: Uint8Array };
  encapsulate: (pk: Uint8Array) => { cipherText: Uint8Array; sharedSecret: Uint8Array };
  decapsulate: (ct: Uint8Array, sk: Uint8Array) => Uint8Array;
}
interface Sig {
  keygen: () => { publicKey: Uint8Array; secretKey: Uint8Array };
  sign: (msg: Uint8Array, sk: Uint8Array) => Uint8Array;
  verify: (sig: Uint8Array, msg: Uint8Array, pk: Uint8Array) => boolean;
}

function runKem(scheme: Kem): Result {
  const t0 = performance.now();
  const alice = scheme.keygen();
  const { cipherText, sharedSecret: bob } = scheme.encapsulate(alice.publicKey);
  const aliceSecret = scheme.decapsulate(cipherText, alice.secretKey);
  return {
    kind: "kem",
    pkLen: alice.publicKey.length,
    ctLen: cipherText.length,
    secret: hex(bob, true),
    match: bytesToHex(bob) === bytesToHex(aliceSecret),
    ms: performance.now() - t0,
  };
}

function runSig(scheme: Sig): Result {
  const t0 = performance.now();
  const msg = utf8ToBytes(DEMO_MESSAGE);
  const { secretKey, publicKey } = scheme.keygen();
  const signature = scheme.sign(msg, secretKey);
  const validOk = scheme.verify(signature, msg, publicKey);
  const tampered = msg.slice();
  tampered[0] ^= 0x01;
  const tamperOk = scheme.verify(signature, tampered, publicKey);
  return {
    kind: "sig",
    pkLen: publicKey.length,
    sigLen: signature.length,
    sig: hex(signature),
    validOk,
    tamperOk,
    ms: performance.now() - t0,
  };
}

interface DemoSpec {
  variant: string;
  run: () => Result;
}

// Only the four schemes with a browser-safe, audited implementation.
const DEMOS: Record<string, DemoSpec> = {
  "ml-kem":  { variant: "ML-KEM-768",          run: () => runKem(ml_kem768 as unknown as Kem) },
  "ml-dsa":  { variant: "ML-DSA-65",           run: () => runSig(ml_dsa65 as unknown as Sig) },
  "slh-dsa": { variant: "SLH-DSA-SHAKE-128f",  run: () => runSig(slh_dsa_shake_128f as unknown as Sig) },
  "fn-dsa":  { variant: "FN-DSA (Falcon-512)", run: () => runSig(falcon512 as unknown as Sig) },
};

export default function AlgoDemo({ algoId }: { algoId: string }) {
  const spec = DEMOS[algoId];
  const [result, setResult] = useState<Result | null>(null);
  const [running, setRunning] = useState(false);

  if (!spec) return null; // no browser-safe implementation — handled by Crypto Lab links

  function go() {
    setRunning(true);
    setResult(null);
    // Defer so the "Running…" label paints before the (sometimes ~1s) sync crypto.
    setTimeout(() => {
      try {
        setResult(spec.run());
      } finally {
        setRunning(false);
      }
    }, 20);
  }

  return (
    <div className="rounded-xl border border-[var(--color-quantum)]/25 bg-[var(--color-quantum)]/[0.04] p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h4 className="text-[10px] uppercase tracking-wider text-[var(--color-quantum)] font-[family-name:var(--font-display)] flex items-center gap-1.5">
          <FlaskConical size={11} aria-hidden="true" /> Run it live
        </h4>
        <span className="text-[10px] text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">{spec.variant}</span>
      </div>

      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-3">
        Real cryptography, computed in your browser — fresh keys each run, nothing precomputed.
      </p>

      <button
        type="button"
        onClick={go}
        disabled={running}
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-quantum)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-surface)] hover:opacity-90 disabled:opacity-60 transition-opacity font-[family-name:var(--font-display)]"
      >
        {running ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Zap size={14} aria-hidden="true" />}
        {running ? "Running…" : result ? "Run again" : "Run"}
      </button>

      {result && !running && (
        <div className="mt-3 space-y-2" aria-live="polite">
          {result.kind === "kem" ? (
            <>
              <DemoStat label="Public key" value={`${result.pkLen.toLocaleString()} bytes`} />
              <DemoStat label="Ciphertext" value={`${result.ctLen.toLocaleString()} bytes`} />
              <DemoStat label="Shared secret" value={result.secret} mono />
              <Verdict ok={result.match} text={result.match ? "Both sides derived the same 32-byte secret" : "Mismatch"} ms={result.ms} />
            </>
          ) : (
            <>
              <DemoStat label="Public key" value={`${result.pkLen.toLocaleString()} bytes`} />
              <DemoStat label="Signature" value={`${result.sigLen.toLocaleString()} bytes`} />
              <DemoStat label="Signature (hex)" value={result.sig} mono />
              <div className="flex flex-wrap gap-2">
                <Verdict ok={result.validOk} text="Verified ✓" compact />
                <Verdict ok={!result.tamperOk} text="Tampered rejected ✗" compact danger />
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">{result.ms.toFixed(0)} ms · message “{DEMO_MESSAGE}”</p>
            </>
          )}
        </div>
      )}

      <p className="mt-3 text-[10px] text-[var(--color-text-muted)] leading-relaxed">
        Powered by{" "}
        <a href="https://github.com/paulmillr/noble-post-quantum" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-text-secondary)]">@noble/post-quantum</a>.{" "}
        <Link href="/atlas/crypto-bench" className="text-[var(--color-accent)] hover:underline">Open the full Crypto Bench →</Link>
      </p>
    </div>
  );
}

function DemoStat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2 text-xs">
      <span className="text-[var(--color-text-muted)] flex-shrink-0">{label}</span>
      <span className={`text-right break-all ${mono ? "font-[family-name:var(--font-mono)] text-[var(--color-text-secondary)] text-[10px]" : "font-[family-name:var(--font-mono)] text-[var(--color-text-primary)]"}`}>{value}</span>
    </div>
  );
}

function Verdict({ ok, text, ms, compact = false, danger = false }: { ok: boolean; text: string; ms?: number; compact?: boolean; danger?: boolean }) {
  const tint = ok ? "text-[var(--color-safe)]" : (danger ? "text-[var(--color-danger)]" : "text-[var(--color-warning)]");
  const bg = ok ? "bg-[var(--color-safe)]/10 border-[var(--color-safe)]/30" : "bg-[var(--color-danger)]/10 border-[var(--color-danger)]/30";
  const Icon = ok ? CheckCircle2 : XCircle;
  return (
    <div className={`rounded-lg border ${bg} px-2.5 py-1.5 flex items-center gap-2 ${compact ? "" : "justify-between"}`}>
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${tint}`}>
        <Icon size={14} aria-hidden="true" /> {text}
      </span>
      {ms !== undefined && !compact && (
        <span className="text-[10px] font-[family-name:var(--font-mono)] text-[var(--color-text-muted)]">{ms.toFixed(0)} ms</span>
      )}
    </div>
  );
}
