"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { modules, getTotalLessons } from "../../lib/curriculum";
import { getCompleted, isComplete } from "../../lib/progress";
import {
  Trophy, CheckCircle2, Circle, Map, Sparkles, Printer, GraduationCap, ArrowRight,
  Download, Upload, Award
} from "lucide-react";

// All localStorage keys used by the site. Export/import bundles each into one JSON file.
const STORAGE_KEYS = [
  "pqc-learning-progress",        // lesson completion
  "pq-atlas-challenges-v1",       // /challenges
  "pq-atlas-hall-checkpoints-v1", // hall checkpoints
  "pq-atlas-capstone-v1",         // capstone
];

export default function CompletePage() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [capstonePassed, setCapstonePassed] = useState(false);
  const [name, setName] = useState("");
  const total = getTotalLessons();

  useEffect(() => {
    setCompleted(getCompleted());
    try {
      const cap = JSON.parse(localStorage.getItem("pq-atlas-capstone-v1") ?? "{}") as Record<string, boolean>;
      // Capstone has 10 questions; all keys solved => passed.
      const passed = Object.values(cap).filter(Boolean).length >= 10;
      setCapstonePassed(passed);
      setName(localStorage.getItem("pq-atlas-cert-name") ?? "");
    } catch { /* noop */ }
  }, []);

  function updateName(v: string) {
    setName(v);
    try { localStorage.setItem("pq-atlas-cert-name", v); } catch { /* noop */ }
  }

  function exportProgress() {
    const payload: Record<string, unknown> = {
      __atlas_export_version: 1,
      exportedAt: new Date().toISOString(),
    };
    for (const k of STORAGE_KEYS) {
      const raw = localStorage.getItem(k);
      if (raw !== null) { try { payload[k] = JSON.parse(raw); } catch { payload[k] = raw; } }
    }
    if (name) payload["pq-atlas-cert-name"] = name;
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `post-quantum-atlas-progress-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importProgress(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(String(e.target?.result ?? "{}")) as Record<string, unknown>;
        for (const k of STORAGE_KEYS) {
          if (data[k] !== undefined) localStorage.setItem(k, JSON.stringify(data[k]));
        }
        if (typeof data["pq-atlas-cert-name"] === "string") {
          localStorage.setItem("pq-atlas-cert-name", data["pq-atlas-cert-name"] as string);
        }
        window.location.reload();
      } catch {
        alert("That file didn't look like a Post-Quantum Atlas export.");
      }
    };
    reader.readAsText(file);
  }

  const done = completed.length;
  const finished = done >= total;

  return (
    <div className="min-h-screen">
      <main id="main">
        <section className="max-w-4xl mx-auto px-6 pt-10 sm:pt-12 pb-6 print:pt-0">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-[family-name:var(--font-display)] font-medium mb-4 ${
            finished
              ? "bg-[var(--color-safe)]/10 border border-[var(--color-safe)]/20 text-[var(--color-safe)]"
              : "bg-[var(--color-quantum)]/10 border border-[var(--color-quantum)]/20 text-[var(--color-quantum)]"
          }`}>
            {finished ? <Trophy size={14} aria-hidden="true" /> : <GraduationCap size={14} aria-hidden="true" />}
            {finished ? "All halls visited" : "Your progress so far"}
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            {finished ? "You walked every hall." : "Pick up where you left off."}
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] max-w-2xl leading-relaxed mb-4">
            {finished
              ? `Six halls. Twenty-one exhibits. You came in knowing what RSA was; you leave knowing why a hybrid TLS handshake bundles X25519 with ML-KEM-768, and what year the EU expects critical infrastructure to be migrated.`
              : `You've completed ${done} of ${total} exhibits. Here's what you've seen, and what's still ahead.`}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <CheckCircle2 size={16} className="text-[var(--color-safe)]" aria-hidden="true" />
              <span aria-label={`${done} of ${total} exhibits completed`}>
                {done} / {total} exhibits
              </span>
            </div>
            <div className="w-32 h-1.5 bg-[var(--color-surface-raised)] rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round((done / total) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Overall progress">
              <div className="progress-fill h-full bg-[var(--color-safe)] rounded-full" style={{ width: `${(done / total) * 100}%` }} />
            </div>
            <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-text-muted)]">
              {Math.round((done / total) * 100)}%
            </span>
            <div className="ml-auto flex flex-wrap items-center gap-2 print:hidden">
              <button
                onClick={exportProgress}
                aria-label="Export progress to a JSON file"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-mid)] transition-colors"
              >
                <Download size={12} aria-hidden="true" /> Export
              </button>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-mid)] transition-colors cursor-pointer">
                <Upload size={12} aria-hidden="true" /> Import
                <input
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) importProgress(f); }}
                />
              </label>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-mid)] transition-colors"
                aria-label="Print this summary"
              >
                <Printer size={12} aria-hidden="true" /> Print
              </button>
            </div>
          </div>
        </section>

        {capstonePassed && (
          <section className="max-w-4xl mx-auto px-6 pb-10">
            <Certificate name={name} onName={updateName} />
          </section>
        )}

        <section className="max-w-4xl mx-auto px-6 pb-10">
          <div className="space-y-5">
            {modules.map(m => {
              const modDone = m.lessons.filter(l => isComplete(m.id, l.id)).length;
              const modPct = Math.round((modDone / m.lessons.length) * 100);
              return (
                <div key={m.id} className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/60 p-4 sm:p-5">
                  <div className="flex items-baseline justify-between mb-3">
                    <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-text-primary)]">
                      <span className="text-[var(--color-quantum)]">Hall {m.order}</span> &middot; {m.title}
                    </h2>
                    <span className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
                      {modDone}/{m.lessons.length} · {modPct}%
                    </span>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-1.5">
                    {m.lessons.map(l => {
                      const isDone = isComplete(m.id, l.id);
                      return (
                        <li key={l.id}>
                          <Link
                            href={`/learn/${m.id}/${l.id}`}
                            className={`flex items-start gap-2 px-3 py-2 rounded-lg transition-colors ${
                              isDone
                                ? "bg-[var(--color-safe)]/[0.06] hover:bg-[var(--color-safe)]/[0.12]"
                                : "hover:bg-[var(--color-surface-hover)]"
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 size={14} className="text-[var(--color-safe)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                            ) : (
                              <Circle size={14} className="text-[var(--color-text-muted)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                            )}
                            <span className={`text-sm leading-snug ${isDone ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"}`}>
                              {l.title}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-12 print:hidden">
          <h2 className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
            What&rsquo;s next
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <NextCard
              icon={Map}
              tone="accent"
              title="Open the atlas"
              body="Six interactive labs that take what you learned and let you push on it."
              href="/atlas"
            />
            <NextCard
              icon={Sparkles}
              tone="warning"
              title="Take the challenges"
              body="Five short puzzles. Did the math actually land?"
              href="/challenges"
            />
            <NextCard
              icon={GraduationCap}
              tone="quantum"
              title="Return to the entrance"
              body="See the whole museum from the front door."
              href="/"
            />
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-20 hidden print:block">
          <h2 className="font-[family-name:var(--font-display)] text-base font-semibold mb-2">Key takeaways</h2>
          <ul className="text-sm leading-relaxed space-y-1.5 list-disc pl-5">
            <li>Asymmetric cryptography (RSA, ECC, DH) falls completely to Shor&rsquo;s algorithm; symmetric cryptography (AES) survives with key-size upgrades under Grover&rsquo;s.</li>
            <li>NIST standardized ML-KEM (FIPS 203), ML-DSA (FIPS 204), and SLH-DSA (FIPS 205) in August 2024 across multiple mathematical families for diversification.</li>
            <li>The hybrid X-Wing KEM (X25519 + ML-KEM-768) is the responsible migration default — endorsed by NSA, NIST, NCSC, and the EU.</li>
            <li>Mosca&rsquo;s inequality (X + Y &gt; Z) means data with multi-decade confidentiality requirements has already failed for classical asymmetric crypto.</li>
            <li>Major regulators converge on 2030 for critical infrastructure and 2035 for full migration.</li>
          </ul>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border-subtle)] py-8 print:border-0">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs italic text-[var(--color-text-muted)]/60">
            Post-Quantum Atlas · Sibling to the Cipher Museum · Knowledge sourced from RefDoc.md.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Certificate({ name, onName }: { name: string; onName: (v: string) => void }) {
  const dated = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  return (
    <div className="rounded-2xl border-2 border-[var(--color-quantum)]/40 bg-gradient-to-br from-[var(--color-quantum)]/[0.05] to-[var(--color-accent)]/[0.05] p-6 sm:p-8 relative overflow-hidden print:border-black print:bg-white print:text-black">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20 print:hidden" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#a78bfa" strokeWidth="0.5" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="#a78bfa" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="10" fill="#a78bfa" fillOpacity="0.3" />
        </svg>
      </div>
      <div className="flex items-start gap-3 mb-6">
        <Award size={28} className="text-[var(--color-quantum)] flex-shrink-0 print:text-black" aria-hidden="true" />
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-1">Certificate of completion</div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight">Post-Quantum Atlas</h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Six halls · twenty-one exhibits · ten-question capstone passed.</p>
        </div>
      </div>
      <div className="mb-6 print:hidden">
        <label className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] block mb-1">
          Your name on the certificate
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onName(e.target.value)}
          placeholder="e.g. Paul Clark"
          className="w-full max-w-sm px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-sm focus:border-[var(--color-quantum)] focus:outline-none transition-colors"
        />
      </div>
      <div className="border-t border-[var(--color-border-subtle)] pt-5 mt-5 print:border-black">
        <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-2">Awarded to</div>
        <div className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] print:text-black border-b border-dashed border-[var(--color-border-mid)] pb-2 mb-2 min-h-[2.5rem]">
          {name || <span className="text-[var(--color-text-muted)] italic font-normal">(enter your name above)</span>}
        </div>
        <div className="flex flex-wrap justify-between items-end gap-2 mt-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-0.5">Date</div>
            <div className="text-sm font-[family-name:var(--font-mono)]">{dated}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-0.5">Source of truth</div>
            <div className="text-sm font-[family-name:var(--font-mono)]">RefDoc.md v3.8</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NextCard({ icon: Icon, tone, title, body, href }: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  tone: "accent" | "warning" | "quantum";
  title: string;
  body: string;
  href: string;
}) {
  const tones = {
    accent:  { border: "border-[var(--color-accent)]/30",  bg: "bg-[var(--color-accent)]/[0.04]",  text: "text-[var(--color-accent)]" },
    warning: { border: "border-[var(--color-warning)]/30", bg: "bg-[var(--color-warning)]/[0.04]", text: "text-[var(--color-warning)]" },
    quantum: { border: "border-[var(--color-quantum)]/30", bg: "bg-[var(--color-quantum)]/[0.04]", text: "text-[var(--color-quantum)]" },
  }[tone];
  return (
    <Link href={href} className={`block p-4 rounded-2xl border ${tones.border} ${tones.bg} hover:bg-[var(--color-surface-hover)] transition-colors group`}>
      <div className={`flex items-center gap-2 text-xs uppercase tracking-wider font-[family-name:var(--font-display)] mb-2 ${tones.text}`}>
        <Icon size={14} aria-hidden="true" /> {title}
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex items-start justify-between gap-2">
        <span>{body}</span>
        <ArrowRight size={14} className={`flex-shrink-0 mt-0.5 ${tones.text} group-hover:translate-x-0.5 transition-transform`} aria-hidden="true" />
      </p>
    </Link>
  );
}
