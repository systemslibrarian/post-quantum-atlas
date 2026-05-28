"use client";

import Link from "next/link";
import {
  ChevronRight, Layers, Sliders, Cable,
  Orbit, Activity, ShieldOff, Map
} from "lucide-react";
import FamilyMap from "../components/FamilyMap";
import SourceFooter from "../components/SourceFooter";
import Ticker from "../components/Ticker";

interface Lab {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  href?: string;
  status: "live" | "coming-soon";
}

const labs: Lab[] = [
  {
    id: "toolkit",
    title: "PQC Toolkit",
    subtitle: "The algorithm cards",
    description: "Filter ML-KEM, ML-DSA, SLH-DSA, FN-DSA, HQC, Classic McEliece, and SIKE by family, role, and standardization status.",
    icon: Layers,
    href: "/atlas/toolkit",
    status: "live",
  },
  {
    id: "breaks-survives",
    title: "Breaks vs. Survives",
    subtitle: "The impact map",
    description: "Visual split of every cryptographic tool that breaks under Shor's, weakens under Grover's, or survives with upgrades.",
    icon: ShieldOff,
    href: "/atlas/breaks-survives",
    status: "live",
  },
  {
    id: "mosca",
    title: "Mosca's Inequality",
    subtitle: "Are you already late?",
    description: "Slide X (data lifetime), Y (migration time), Z (time to CRQC). See in real time whether your data class has already failed.",
    icon: Sliders,
    href: "/atlas/mosca",
    status: "live",
  },
  {
    id: "tls-theater",
    title: "TLS Handshake Theater",
    subtitle: "Watch the handshake (with a quantum attacker)",
    description: "Step-by-step animation of a TLS 1.3 handshake. Toggle the quantum attacker and see exactly which step collapses.",
    icon: Cable,
    href: "/atlas/tls-theater",
    status: "live",
  },
  {
    id: "ecc-bounce",
    title: "ECC Bounce Visualizer",
    subtitle: "Why ECC is a billiards game",
    description: "Watch point addition on a real elliptic curve. Try to count the bounces — that's the Discrete Log Problem.",
    icon: Orbit,
    status: "coming-soon",
  },
  {
    id: "threat-timeline",
    title: "Threat Timeline",
    subtitle: "The collapsing estimates",
    description: "Twenty years of research, ten years of deadlines. Scrub a cursor through 2020–2040 and watch the milestones light up.",
    icon: Activity,
    href: "/atlas/timeline",
    status: "live",
  },
];

export default function AtlasIndex() {
  return (
    <div className="min-h-screen">
      <Ticker />

      <main id="main">
      <section className="max-w-6xl mx-auto px-6 pt-12 sm:pt-16 pb-10">
        <div className="animate-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-[family-name:var(--font-display)] font-medium mb-6">
          <Map size={14} aria-hidden="true" />
          Interactive Atlas
        </div>
        <h1 className="animate-fade-up font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4" style={{ animationDelay: "80ms" }}>
          Explore the map.
        </h1>
        <p className="animate-fade-up text-lg text-[var(--color-text-secondary)] max-w-2xl leading-relaxed mb-2" style={{ animationDelay: "160ms" }}>
          The learning path tells the story in order. The atlas lets you wander.
        </p>
        <p className="animate-fade-up text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed" style={{ animationDelay: "200ms" }}>
          Each lab is a self-contained, hands-on view of one piece of the post-quantum transition.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-12 animate-fade-up" style={{ animationDelay: "260ms" }} aria-label="Map of cryptographic families">
        <FamilyMap />
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20" aria-label="Available labs">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {labs.map((lab, i) => {
            const Icon = lab.icon;
            const isLive = lab.status === "live";
            const card = (
              <div
                className={`animate-fade-up card-glow h-full block p-6 rounded-2xl border bg-[var(--color-surface-raised)]/80 backdrop-blur-sm transition-all group ${
                  isLive
                    ? "border-[var(--color-accent)]/30 hover:shadow-2xl hover:shadow-[var(--color-accent)]/10"
                    : "border-[var(--color-border-subtle)] opacity-70"
                }`}
                style={{ animationDelay: `${240 + i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    isLive ? "bg-[var(--color-accent)]/10" : "bg-[var(--color-surface-hover)]"
                  }`}>
                    <Icon size={22} className={isLive ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"} />
                  </div>
                  <span className={`font-[family-name:var(--font-display)] text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${
                    isLive
                      ? "bg-[var(--color-safe)]/10 text-[var(--color-safe)]"
                      : "bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
                  }`}>
                    {isLive ? "Live" : "Coming soon"}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold mb-1">
                  {lab.title}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-3 font-[family-name:var(--font-display)]">
                  {lab.subtitle}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                  {lab.description}
                </p>
                {isLive && (
                  <div className="flex items-center gap-2 text-sm text-[var(--color-accent)]">
                    Open lab
                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                )}
              </div>
            );

            return isLive && lab.href ? (
              <Link key={lab.id} href={lab.href} aria-label={`Open lab: ${lab.title}`}>{card}</Link>
            ) : (
              <div key={lab.id} aria-label={`${lab.title} — coming soon`}>{card}</div>
            );
          })}
        </div>
      </section>
      </main>

      <footer className="border-t border-[var(--color-border-subtle)] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-2">
          <p className="text-xs text-[var(--color-text-muted)]">
            Companion to the <Link href="/" className="underline hover:text-[var(--color-text-secondary)]">learning path</Link>
            <span className="mx-2">·</span>
            <Link href="/about" className="underline hover:text-[var(--color-text-secondary)]">About</Link>
          </p>
          <SourceFooter />
        </div>
      </footer>
    </div>
  );
}
