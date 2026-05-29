import type { Metadata } from "next";
import Link from "next/link";
import {
  Route, ClipboardList, Search, Network, Boxes, ShieldCheck, GitMerge,
  AlertTriangle, Sliders, Radar, Layers, ChevronRight, Lightbulb,
} from "lucide-react";
import SourceFooter from "../components/SourceFooter";
import SourceBadge from "../components/SourceBadge";
import Ticker from "../components/Ticker";

export const metadata: Metadata = {
  title: "Migration Playbook",
  description:
    "A six-step playbook for moving from classical RSA/ECC cryptography to post-quantum: inventory, prioritize with Mosca's inequality, design with ML-KEM and ML-DSA, and deploy hybrid — plus the physical changes PQC forces on real systems.",
  openGraph: {
    title: "Migration Playbook — From Classical Crypto to PQC",
    description:
      "Inventory, prioritize, design, guardrail, and deploy. The practical path from RSA/ECC to ML-KEM and ML-DSA.",
  },
};

interface Step {
  n: number;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  body: string;
}

const steps: Step[] = [
  {
    n: 1,
    icon: ClipboardList,
    title: "Prioritize by risk",
    body:
      "Classify systems by exposure. Highest priority: anything carrying long-lived secrets that an adversary could harvest today and decrypt later. Medium: systems facing an online quantum attacker. Low: symmetric-only systems, which only need larger keys.",
  },
  {
    n: 2,
    icon: Search,
    title: "Build a cryptographic inventory",
    body:
      "You cannot migrate what you cannot see. Map every place cryptography is used — protocols, libraries, certificates, hardcoded keys — with automated discovery tools backed by developer reporting. A Cryptographic Bill of Materials (CBOM) turns this into a living asset.",
  },
  {
    n: 3,
    icon: Network,
    title: "Address external dependencies",
    body:
      "Identify the blockers you don't own: community standards (NIST, IETF, ISO), hardware support (HSMs, CPUs, TPMs), and production-grade PQC implementations such as liboqs. Migration moves at the speed of your slowest dependency.",
  },
  {
    n: 4,
    icon: Boxes,
    title: "Design the PQC components",
    body:
      "Select algorithms per NIST guidance: ML-KEM for key exchange, ML-DSA for signatures, with SLH-DSA as a hash-based backup. Default to ML-KEM-768; drop to ML-KEM-512 only where performance is genuinely prohibitive.",
  },
  {
    n: 5,
    icon: ShieldCheck,
    title: "Implement guardrails",
    body:
      "Stop the bleeding while you migrate. Update internal cryptography guidelines, discourage the creation of new quantum-vulnerable keys, and block affected APIs in centrally managed build systems so new systems are born crypto-agile.",
  },
  {
    n: 6,
    icon: GitMerge,
    title: "Integrate — hybrid first",
    body:
      "Deploy via a hybrid approach (classical + PQC) before full replacement. Hybrid key exchange keeps a classical safety net while you gain confidence in the new primitives — the same path Cloudflare, Chrome, Apple, and Signal have already taken.",
  },
];

interface Reality {
  title: string;
  body: string;
}

const realities: Reality[] = [
  {
    title: "Database schemas",
    body: "VARCHAR(255) columns sized for classical keys must grow to hold 1,000+ byte PQC public keys.",
  },
  {
    title: "Network fragmentation",
    body: "PQC keys and certificates can exceed the 1,500-byte MTU, forcing packet fragmentation and added latency.",
  },
  {
    title: "TLS handshake inflation",
    body: "ML-DSA certificate chains push handshakes from 2–3 KB to 10–15 KB — painful on weak mobile links.",
  },
  {
    title: "The key-hierarchy trap",
    body: "AES-256 at rest is quantum-safe, but the RSA/ECDH layers wrapping those keys are fully exposed. Break the wrapper and you break the data.",
  },
  {
    title: "IoT & embedded constraints",
    body: "Devices with 8–16 KB of RAM struggle with 1,200-byte keys and 2.4 KB signatures; baked-in silicon can't be patched at all.",
  },
  {
    title: "The bottleneck shifts",
    body: "Lattice math is fast on modern CPUs — often faster than RSA — so the constraint moves from compute to network bandwidth.",
  },
];

export default function MigrationPage() {
  return (
    <div className="min-h-screen">
      <Ticker />
      <main id="main">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-10 sm:pt-14 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-[family-name:var(--font-display)] font-medium mb-6">
            <Route size={14} aria-hidden="true" />
            Migration Playbook
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
            From classical crypto to PQC
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl mb-3">
            Choosing ML-KEM and ML-DSA is the easy part. The work is finding every place you use
            RSA and ECC, deciding what to fix first, and rolling out replacements without breaking
            the systems that depend on them.
          </p>
          <p className="text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            This is the six-step strategy Meta and others use in production, condensed — paired with
            the physical realities PQC forces on real systems.
          </p>
        </section>

        {/* Prioritization callout */}
        <section className="max-w-4xl mx-auto px-6 pb-10">
          <div className="rounded-2xl border border-[var(--color-warning)]/25 bg-[var(--color-warning)]/[0.05] p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-[var(--color-warning)] flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-base font-semibold mb-1">
                  Start with Mosca&rsquo;s inequality
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
                  Before you touch any code, work out which data is already at risk. If the time your
                  data must stay secret (X) plus your migration time (Y) is greater than the time
                  until a quantum computer arrives (Z), you have already failed for that data class —
                  so it goes to the front of the queue.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/atlas/mosca" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-accent)] hover:underline">
                    <Sliders size={14} aria-hidden="true" /> Try the Mosca slider
                  </Link>
                  <span className="text-[var(--color-text-muted)]">·</span>
                  <Link href="/atlas/q-day" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-accent)] hover:underline">
                    <Radar size={14} aria-hidden="true" /> Run the Q-Day simulator
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The six steps */}
        <section className="max-w-4xl mx-auto px-6 pb-12">
          <h2 className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
            The six-step migration strategy
          </h2>
          <ol className="grid gap-4 sm:grid-cols-2">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <li
                  key={s.n}
                  className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/60 p-5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-[var(--color-accent)]" aria-hidden="true" />
                    </div>
                    <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-text-muted)]">
                      Step {s.n}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-base font-semibold mb-1">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{s.body}</p>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Recommended targets */}
        <section className="max-w-4xl mx-auto px-6 pb-12">
          <h2 className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
            What to migrate to
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <RecCard role="Key exchange" name="ML-KEM-768" sub="FIPS 203" />
            <RecCard role="Signatures" name="ML-DSA-65" sub="FIPS 204" />
            <RecCard role="Conservative backup" name="SLH-DSA" sub="FIPS 205" />
          </div>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Deploy these as <strong className="text-[var(--color-text-primary)]">hybrids</strong> (e.g. X25519 + ML-KEM-768) so a
            break in either layer alone is not catastrophic. Browse the full catalog in the{" "}
            <Link href="/atlas/toolkit" className="text-[var(--color-accent)] hover:underline inline-flex items-center gap-1">
              <Layers size={13} aria-hidden="true" /> PQC Toolkit
            </Link>.
          </p>
        </section>

        {/* Physical realities */}
        <section className="max-w-4xl mx-auto px-6 pb-12">
          <h2 className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
            What changes physically
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 max-w-2xl">
            PQC is not a drop-in replacement. Bigger keys and signatures ripple through storage,
            networks, and hardware — these are the surprises that derail migrations.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {realities.map((r) => (
              <div key={r.title} className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/40 p-4">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1 font-[family-name:var(--font-display)]">
                  {r.title}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Crypto-agility */}
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div className="rounded-2xl border border-[var(--color-quantum)]/25 bg-[var(--color-quantum)]/[0.05] p-5">
            <div className="flex items-start gap-3">
              <Lightbulb size={20} className="text-[var(--color-quantum)] flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-base font-semibold mb-1">
                  Build crypto-agility into everything new
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  This migration will not be the last. &ldquo;Quantum-safe&rdquo; is a present-tense
                  judgment about today&rsquo;s best evidence, not a permanent certificate — SIKE was a
                  finalist until it was broken on a laptop in an hour. Design systems so a primitive
                  can be swapped without rebuilding the system, and the next transition becomes a
                  configuration change instead of a crisis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Next steps */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <h2 className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
            Keep going
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <NextCard href="/atlas/q-day" title="Q-Day Simulator" blurb="Get a verdict for your own data and timelines." />
            <NextCard href="/learn/transition/hybrid-strategy" title="The hybrid strategy" blurb="Why classical + PQC together, and how it ships." />
            <NextCard href="/learn/transition/meta-framework" title="Meta's framework" blurb="The enterprise migration this playbook condenses." />
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border-subtle)] py-8">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-2">
          <p className="text-xs text-[var(--color-text-muted)]">
            Source: RefDoc.md §18, §20 (Meta&rsquo;s enterprise migration framework) and §13.1 (Mosca&rsquo;s inequality).
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <SourceBadge level="final" label="FIPS 203 / 204 / 205" />
          </div>
          <SourceFooter />
        </div>
      </footer>
    </div>
  );
}

function RecCard({ role, name, sub }: { role: string; name: string; sub: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-safe)]/25 bg-[var(--color-safe)]/[0.05] p-4">
      <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-1">
        {role}
      </div>
      <div className="font-[family-name:var(--font-mono)] text-base font-semibold text-[var(--color-text-primary)]">
        {name}
      </div>
      <div className="mt-1.5">
        <SourceBadge level="final" label={sub} />
      </div>
    </div>
  );
}

function NextCard({ href, title, blurb }: { href: string; title: string; blurb: string }) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/60 p-4 hover:border-[var(--color-accent)]/40 transition-colors group"
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] font-[family-name:var(--font-display)]">{title}</h3>
        <ChevronRight size={15} className="flex-shrink-0 text-[var(--color-accent)] group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
      </div>
      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{blurb}</p>
    </Link>
  );
}
