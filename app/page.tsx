"use client";

import { modules, getTotalLessons } from "./lib/curriculum";
import { getCompleted, getModuleProgress } from "./lib/progress";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Shield, Globe, Atom, Lock, ArrowRightLeft, Rocket,
  ChevronRight, BookOpen, GraduationCap, Map, Landmark, ExternalLink,
  Sparkles, Briefcase, ClipboardList, Radar
} from "lucide-react";
import SourceFooter from "./components/SourceFooter";
import Ticker from "./components/Ticker";
import SonarHero from "./components/SonarHero";

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Shield, Globe, Atom, Lock, ArrowRightLeft, Rocket,
};

const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  emerald: { border: "border-emerald-500/30", bg: "bg-emerald-500/10", text: "text-emerald-400", glow: "hover:shadow-emerald-500/10" },
  blue: { border: "border-blue-500/30", bg: "bg-blue-500/10", text: "text-blue-400", glow: "hover:shadow-blue-500/10" },
  red: { border: "border-red-500/30", bg: "bg-red-500/10", text: "text-red-400", glow: "hover:shadow-red-500/10" },
  violet: { border: "border-violet-500/30", bg: "bg-violet-500/10", text: "text-violet-400", glow: "hover:shadow-violet-500/10" },
  amber: { border: "border-amber-500/30", bg: "bg-amber-500/10", text: "text-amber-400", glow: "hover:shadow-amber-500/10" },
  cyan: { border: "border-cyan-500/30", bg: "bg-cyan-500/10", text: "text-cyan-400", glow: "hover:shadow-cyan-500/10" },
};

export default function Home() {
  const [completed, setCompleted] = useState<string[]>([]);
  const total = getTotalLessons();

  useEffect(() => {
    setCompleted(getCompleted());
  }, []);

  const overallPct = total > 0 ? Math.round((completed.length / total) * 100) : 0;

  return (
    <div className="min-h-screen">
      <Ticker />

      <main id="main">
      <section className="max-w-6xl mx-auto px-6 pt-10 sm:pt-16 pb-10 sm:pb-12">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-center">
          <div>
            <div className="animate-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-quantum)]/10 border border-[var(--color-quantum)]/20 text-[var(--color-quantum)] text-xs font-[family-name:var(--font-display)] font-medium mb-6" style={{ animationDelay: "0ms" }}>
              <Atom size={14} aria-hidden="true" />
              The future wing
            </div>
            <h1 className="animate-fade-up font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-4" style={{ animationDelay: "80ms" }}>
              Post-Quantum<br />
              <span className="text-[var(--color-quantum)]">Cryptography</span>
            </h1>
            <p className="animate-fade-up text-lg md:text-xl text-[var(--color-text-secondary)] max-w-xl leading-relaxed mb-3" style={{ animationDelay: "160ms" }}>
              {modules.length} halls. {total} exhibits. A guided path from cryptographic foundations
              to the math protecting tomorrow&rsquo;s internet.
            </p>
            <p className="animate-fade-up text-sm md:text-base text-[var(--color-text-secondary)]/90 max-w-xl leading-relaxed mb-5" style={{ animationDelay: "180ms" }}>
              Learn what quantum computers threaten, which cryptographic systems survive, and how the
              internet is migrating from RSA and ECC to <span className="text-[var(--color-text-primary)]">ML-KEM, ML-DSA, SLH-DSA</span>, and
              hybrid deployment.
            </p>
            <p className="animate-fade-up text-sm text-[var(--color-text-muted)] mb-6" style={{ animationDelay: "200ms" }}>
              Sibling to the{" "}
              <a href="https://github.com/systemslibrarian/cipher-museum" className="underline hover:text-[var(--color-text-secondary)]" target="_blank" rel="noopener noreferrer">
                Cipher Museum<ExternalLink size={11} className="inline align-baseline ml-0.5" aria-hidden="true" />
              </a>{" "}&mdash; where cryptography came from.
            </p>
            <div className="animate-fade-up flex items-center gap-3 text-xs text-[var(--color-text-muted)]" style={{ animationDelay: "240ms" }}>
              <span aria-label={`${completed.length} of ${total} exhibits visited`}>
                {completed.length} / {total} exhibits visited
              </span>
              <div className="w-24 h-1.5 bg-[var(--color-surface-raised)] rounded-full overflow-hidden" role="progressbar" aria-valuenow={overallPct} aria-valuemin={0} aria-valuemax={100} aria-label="Overall progress">
                <div className="progress-fill h-full bg-[var(--color-safe)] rounded-full" style={{ width: `${overallPct}%` }} />
              </div>
              <span className="font-[family-name:var(--font-mono)]">{overallPct}%</span>
            </div>
          </div>
          <div className="hidden md:block animate-fade-up" style={{ animationDelay: "180ms" }}>
            <SonarHero size={320} />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-6">
        <h2 className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-3">
          Where to start
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          <RoleTile
            icon={Sparkles}
            tone="quantum"
            label="Beginner"
            blurb="Walk the halls in order. No PQC background assumed."
            href="/learn/foundations"
          />
          <RoleTile
            icon={Briefcase}
            tone="accent"
            label="Practitioner"
            blurb="The six-step migration playbook, algorithm cards, hybrid TLS in action."
            href="/migration"
          />
          <RoleTile
            icon={ClipboardList}
            tone="warning"
            label="Decision-maker"
            blurb="Deadlines, regulators, and the collapsing timeline."
            href="/atlas/timeline?filter=regulation"
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/learn/foundations"
            className="block p-5 rounded-2xl border border-[var(--color-quantum)]/20 bg-[var(--color-quantum)]/[0.04] hover:bg-[var(--color-quantum)]/[0.08] hover:border-[var(--color-quantum)]/40 transition-colors group"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-quantum)] font-[family-name:var(--font-display)] mb-2">
              <GraduationCap size={14} aria-hidden="true" /> Walk the halls
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex items-start justify-between gap-2">
              <span>{modules.length} halls in order. Foundations → quantum threat → PQC → deployment.</span>
              <ChevronRight size={16} className="flex-shrink-0 text-[var(--color-quantum)] group-hover:translate-x-0.5 transition-transform mt-0.5" />
            </p>
          </Link>
          <Link
            href="/atlas"
            className="block p-5 rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.04] hover:bg-[var(--color-accent)]/[0.08] hover:border-[var(--color-accent)]/40 transition-colors group"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-accent)] font-[family-name:var(--font-display)] mb-2">
              <Map size={14} aria-hidden="true" /> Open the atlas
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex items-start justify-between gap-2">
              <span>Eight interactive labs: a live crypto bench running real ML-KEM and ML-DSA, algorithm cards, the breaks-vs-survives map, Mosca&rsquo;s slider, the Q-Day simulator, TLS theater, the ECC bounce visualizer, and the threat timeline.</span>
              <ChevronRight size={16} className="flex-shrink-0 text-[var(--color-accent)] group-hover:translate-x-0.5 transition-transform mt-0.5" />
            </p>
          </Link>
        </div>

        <Link
          href="/atlas/q-day"
          className="mt-4 block p-5 rounded-2xl border border-[var(--color-quantum)]/30 bg-gradient-to-br from-[var(--color-quantum)]/[0.08] to-[var(--color-accent)]/[0.04] hover:border-[var(--color-quantum)]/50 transition-colors group"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[var(--color-quantum)]/15 flex items-center justify-center flex-shrink-0">
              <Radar size={22} className="text-[var(--color-quantum)]" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-quantum)] font-[family-name:var(--font-display)] mb-1">
                Flagship lab · New
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold mb-1">
                Q-Day Simulator
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex items-start justify-between gap-2">
                <span>Pick your data, your timelines, and your current crypto. Find out whether you&rsquo;re still safe, racing the clock, or already exposed to harvest-now-decrypt-later.</span>
                <ChevronRight size={16} className="flex-shrink-0 text-[var(--color-quantum)] group-hover:translate-x-0.5 transition-transform mt-0.5" />
              </p>
            </div>
          </div>
        </Link>

        <div className="mt-4 p-4 rounded-2xl border border-[var(--color-warning)]/20 bg-[var(--color-warning)]/[0.04] flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-warning)] font-[family-name:var(--font-display)] flex-shrink-0">
            <Landmark size={14} aria-hidden="true" /> Sibling exhibit
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex-1">
            Looking for where cryptography came <em>from</em>? Visit the{" "}
            <a href="https://github.com/systemslibrarian/cipher-museum" className="text-[var(--color-warning)] hover:underline font-medium" target="_blank" rel="noopener noreferrer">
              Cipher Museum<ExternalLink size={11} className="inline align-baseline ml-0.5" aria-hidden="true" />
            </a>{" "}
            — Caesar to Enigma, 140 ciphers, walked the same way.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod, i) => {
            const Icon = iconMap[mod.icon] || Shield;
            const colors = colorMap[mod.color] || colorMap.blue;
            const pct = getModuleProgress(mod.id, mod.lessons.length);

            return (
              <Link
                key={mod.id}
                href={`/learn/${mod.id}`}
                className={`animate-fade-up card-glow block p-6 rounded-2xl border ${colors.border} bg-[var(--color-surface-raised)]/80 backdrop-blur-sm ${colors.glow} hover:shadow-2xl transition-all group`}
                style={{ animationDelay: `${240 + i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <Icon size={22} className={colors.text} />
                  </div>
                  <span className="font-[family-name:var(--font-display)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    Hall {mod.order}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold mb-1 group-hover:text-[var(--color-text-primary)] transition-colors">
                  {mod.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-4 leading-relaxed">
                  {mod.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <BookOpen size={13} aria-hidden="true" />
                    {mod.lessons.length} exhibits
                  </div>
                  <div className="flex items-center gap-2">
                    {pct > 0 && (
                      <span className="text-xs text-[var(--color-safe)]">{pct}%</span>
                    )}
                    <ChevronRight size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
                <div className="mt-3 w-full h-1 bg-[var(--color-surface)] rounded-full overflow-hidden">
                  <div className="progress-fill h-full bg-[var(--color-safe)] rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      </main>

      {/* role tile component declared at file end */}
      <footer className="border-t border-[var(--color-border-subtle)] py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-1">
            Paul Clark
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mb-2">
            Cryptography education, interactive systems, and post-quantum learning tools
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mb-3">
            paul@systemslibrarian.dev &bull; github.com/systemslibrarian
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">
            <Link href="/about" className="hover:text-[var(--color-text-secondary)] underline">About this project</Link>
            <span className="mx-2">·</span>
            <Link href="/atlas" className="hover:text-[var(--color-text-secondary)] underline">Atlas</Link>
          </p>
          <p className="text-sm italic text-[var(--color-text-muted)]/70 mb-3">
            &ldquo;Whether you eat or drink, or whatever you do, do it all for the glory of God.&rdquo;
            {" "}&mdash; 1 Corinthians 10:31
          </p>
          <SourceFooter />
        </div>
      </footer>
    </div>
  );
}

function RoleTile({
  icon: Icon, tone, label, blurb, href,
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  tone: "quantum" | "accent" | "warning";
  label: string;
  blurb: string;
  href: string;
}) {
  const tones = {
    quantum: { border: "border-[var(--color-quantum)]/25",  bg: "bg-[var(--color-quantum)]/[0.04]",  text: "text-[var(--color-quantum)]"  },
    accent:  { border: "border-[var(--color-accent)]/25",   bg: "bg-[var(--color-accent)]/[0.04]",   text: "text-[var(--color-accent)]"   },
    warning: { border: "border-[var(--color-warning)]/25",  bg: "bg-[var(--color-warning)]/[0.04]",  text: "text-[var(--color-warning)]"  },
  }[tone];
  return (
    <Link href={href} className={`group block p-4 rounded-2xl border ${tones.border} ${tones.bg} hover:bg-[var(--color-surface-hover)] transition-colors`}>
      <div className={`flex items-center gap-2 text-xs uppercase tracking-wider font-[family-name:var(--font-display)] mb-2 ${tones.text}`}>
        <Icon size={14} aria-hidden="true" /> {label}
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex items-start justify-between gap-2">
        <span>{blurb}</span>
        <ChevronRight size={14} className={`flex-shrink-0 mt-0.5 ${tones.text} group-hover:translate-x-0.5 transition-transform`} aria-hidden="true" />
      </p>
    </Link>
  );
}
