import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, Map, GraduationCap, ExternalLink } from "lucide-react";
import { REFDOC_VERSION, REFDOC_DATE } from "../components/SourceFooter";

export const metadata: Metadata = {
  title: "About",
  description: "How Post-Quantum Atlas was built, what's in it, and how it stays current.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <main id="main" className="max-w-3xl mx-auto px-6 pt-10 sm:pt-12 pb-16">
        <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          About the Atlas
        </h1>
        <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-8">
          Post-Quantum Atlas is an interactive learning system for post-quantum cryptography.
          It started as a single reference document and grew into a navigable map of the transition.
        </p>

        <Section heading="Three ways to use it" icon={<GraduationCap size={18} />}>
          <p className="mb-2"><strong className="text-[var(--color-text-primary)]">Walk the halls.</strong> Six halls, twenty-one exhibits, in order, with progress tracked in your browser.</p>
          <p className="mb-2"><strong className="text-[var(--color-text-primary)]">Open the atlas.</strong> Five interactive labs — algorithm cards, the impact map, Mosca&rsquo;s slider, the TLS handshake theater, and the collapsing threat timeline — each rendering one part of the story in a hands-on way.</p>
          <p><strong className="text-[var(--color-text-primary)]">Take the challenges.</strong> Five short puzzles to see whether the math landed. Solved badges live in your browser.</p>
        </Section>

        <Section heading="Where the facts come from" icon={<BookOpen size={18} />}>
          <p className="mb-2">
            The single source of truth is{" "}
            <span className="font-[family-name:var(--font-mono)] text-[var(--color-text-primary)]">RefDoc.md</span>{" "}
            (<span className="font-[family-name:var(--font-mono)]">{REFDOC_VERSION}</span> · {REFDOC_DATE}) in the project root —
            a 21-section reference covering cryptographic foundations, modern internet security, the quantum threat,
            the five PQC families, and the migration playbook.
          </p>
          <p className="mb-2">
            Lesson content is structured in <span className="font-[family-name:var(--font-mono)]">app/lib/curriculum.ts</span>.
            Algorithm metadata lives in <span className="font-[family-name:var(--font-mono)]">app/lib/algorithms.ts</span>.
            Impact bucketing lives in <span className="font-[family-name:var(--font-mono)]">app/lib/impact.ts</span>.
            Every lab footer and algorithm detail cites the relevant RefDoc section.
          </p>
        </Section>

        <Section heading="How it&rsquo;s built" icon={<Map size={18} />}>
          <ul className="space-y-2 text-sm">
            <li>· Next.js 16 (App Router) with <span className="font-[family-name:var(--font-mono)]">output: &ldquo;export&rdquo;</span> — every page is prerendered HTML.</li>
            <li>· No backend. Progress and preferences live in <span className="font-[family-name:var(--font-mono)]">localStorage</span>.</li>
            <li>· Static-hosted on GitHub Pages via the workflow in <span className="font-[family-name:var(--font-mono)]">.github/workflows/deploy.yml</span>.</li>
            <li>· Accessible by default: skip link, visible focus rings, Esc-to-close modals with focus traps, <code className="font-[family-name:var(--font-mono)]">aria-pressed</code> toggles, <code className="font-[family-name:var(--font-mono)]">prefers-reduced-motion</code> respected.</li>
            <li>· Responsive from 320 px and up.</li>
          </ul>
        </Section>

        <Section heading="The companion projects" icon={<ExternalLink size={18} />}>
          <p className="mb-2">
            Companion to{" "}
            <em>&ldquo;From Caesar to Post-Quantum: Building a Three-Tier Cryptography Education Portfolio&rdquo;</em> in the{" "}
            <em>Code4Lib Journal</em>.
          </p>
          <p>
            Where the{" "}
            <a href="https://github.com/systemslibrarian/cipher-museum" className="underline text-[var(--color-accent)] hover:text-[var(--color-accent-dim)]">
              Cipher Museum
            </a>{" "}
            shows where cryptography came from, Post-Quantum Atlas shows where it goes next.
          </p>
        </Section>

        <Section heading="Author">
          <p className="mb-1">Paul Lester — IT Librarian &amp; Application Systems Analyst, Leon County Public Library, Tallahassee FL.</p>
          <p className="text-[var(--color-text-muted)] text-sm">paul@systemslibrarian.dev · github.com/systemslibrarian</p>
        </Section>

        <p className="mt-12 text-xs italic text-[var(--color-text-muted)]/70 text-center">
          &ldquo;Whether you eat or drink, or whatever you do, do it all for the glory of God.&rdquo; — 1 Corinthians 10:31
        </p>
      </main>
    </div>
  );
}

function Section({ heading, icon, children }: { heading: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold mb-3 flex items-center gap-2 text-[var(--color-text-primary)]">
        {icon}
        {heading}
      </h2>
      <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
        {children}
      </div>
    </section>
  );
}
