# Post-Quantum Atlas

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)
![Static export](https://img.shields.io/badge/output-static%20export-success)
![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-222?logo=github)
![Accessibility](https://img.shields.io/badge/a11y-WCAG%20minded-6E40C9)

An interactive learning system for post-quantum cryptography — the structured curriculum from
`RefDoc.md`, turned into a navigable map of where cryptography is going next. Learn what quantum
computers threaten, which cryptographic systems survive, and how the internet is migrating from
RSA and ECC to ML-KEM, ML-DSA, SLH-DSA, and hybrid deployment.

Companion to *"From Caesar to Post-Quantum: Building a Three-Tier Cryptography Education Portfolio"*
(Code4Lib Journal) and to the [Cipher Museum](https://github.com/systemslibrarian/cipher-museum),
which covers where cryptography came *from*.

## What's inside

Four ways to engage, all client-side and progress-tracked in `localStorage`:

- **`/learn`** — a guided **6-module, 23-lesson** path: foundations → modern crypto → quantum threat
  → PQC solutions → transition → real-world deployment. Diagrams, checkpoints, and a capstone.
- **`/atlas`** — **eight interactive labs**, all live:
  - **Live Crypto Bench** ⭐ *(real crypto)* — runs actual ML-KEM-768, a hybrid X25519 + ML-KEM
    exchange, and ML-DSA-65 sign/verify in the browser via the audited `@noble/post-quantum`
    library. Real NIST FIPS 203/204 bytes, not a simulation.
  - **Q-Day Simulator** ⭐ *(flagship)* — pick your data type, confidentiality lifetime, migration
    time, quantum-arrival estimate, and current crypto, and get a live verdict: safe, racing the
    clock, or already exposed to harvest-now-decrypt-later.
  - **PQC Toolkit** — filterable cards for ML-KEM, ML-DSA, SLH-DSA, FN-DSA, HQC, Classic McEliece,
    and SIKE, by family, role, and standardization status (with source-confidence badges).
  - **Breaks vs. Survives** — the impact map: what Shor's breaks, what Grover's weakens, what survives.
  - **Mosca's Inequality** — slide X, Y, Z and watch the verdict flip in real time.
  - **TLS Handshake Theater** — step through a TLS 1.3 handshake against a quantum attacker.
  - **ECC Bounce Visualizer** — point addition on a real curve; feel the discrete-log trapdoor.
  - **Threat Timeline** — scrub 2020–2040 and watch the milestones and collapsing estimates light up.
- **`/migration`** — a **six-step Migration Playbook**: inventory, prioritize with Mosca's
  inequality, design with ML-KEM/ML-DSA, guardrail, and deploy hybrid — plus the physical changes
  PQC forces on real systems.
- **`/challenges`** — **10 short puzzles** to check whether the math landed. Solved badges live in
  your browser.

Each lab page also renders a server-side **"About this lab"** block (what it teaches, how to use it,
the key takeaway, related exhibits, and sources) so the content is present for search engines,
screen readers, and link previews even before the interactive component hydrates.

## Educational accuracy model

The single source of truth for every fact, figure, and citation is [`RefDoc.md`](./RefDoc.md)
(a 21-section reference document). Content is structured into typed data modules that read from it:

- `app/lib/curriculum.ts` — modules + lessons
- `app/lib/algorithms.ts` — the PQC algorithm catalog (RefDoc §7–11, §16)
- `app/lib/labMeta.ts` — per-lab teaching content + sources
- `app/lib/impact.ts` — breaks/weakens/survives bucketing

Claims carry **source-confidence badges** (`NIST final standard`, `NIST selected · pending`,
`research / historical`, `broken / deprecated`, `deployment example`) so a reader can tell an official
NIST standard from a research candidate at a glance. Every lab and algorithm detail cites its RefDoc
section and primary sources (FIPS 203/204/205, RFCs, NIST IRs, the original papers).

## Why I built this

Most post-quantum explainers are either a wall of standards-body prose or a single scary headline.
I wanted something in between: a place where a beginner can walk the halls in order, a practitioner
can jump straight to the migration playbook, and a decision-maker can drag the Mosca sliders and see
*their* data class fail in real time. Building it on top of a single reference document keeps the
interactive front-end honest — nothing on screen exists without a citation behind it.

## What I learned

- **Static export has sharp edges.** Client components prerender to HTML, but anything inside a
  `<Suspense>` boundary that reads `useSearchParams` renders its fallback at build time — so those
  lab pages shipped nearly empty HTML. The fix here is a server-rendered "About this lab" section
  per lab (via each lab's `layout.tsx`) so every route teaches something without JavaScript.
- **`basePath` discipline matters.** On GitHub Pages the site lives under `/post-quantum-atlas/`, so
  every internal link must go through `next/link` (or carry the base path) — a raw `<a href="/…">`
  silently 404s in production.
- **Modeling confidence is content.** Adding source-confidence badges did more for credibility than
  any amount of copy, because it makes the difference between "standardized" and "promising research"
  legible.

## Stack

- **Next.js 16** (App Router, static export)
- **React 19**
- **Tailwind CSS 4**
- **TypeScript 5**
- **lucide-react** icons

No backend. No database. Progress and preferences live in `localStorage`.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Build a static site

```bash
npm run build
```

Output is written to `out/`. The build runs `output: "export"` and prerenders all **48 pages** (home,
atlas index, eight labs, migration playbook, challenges, map, search, about, six module overviews,
23 lessons, capstone, completion, 404) to static HTML. No server required to host the result.

## Deploy to GitHub Pages

1. In the repository settings, set **Pages → Source** to **GitHub Actions**.
2. Push to `main`. The workflow at [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)
   builds the static export and publishes it to Pages.
3. The site lives at `https://<owner>.github.io/post-quantum-atlas/`.

If you fork this repo under a different name, override the base path:

```bash
NEXT_PUBLIC_BASE_PATH=/your-repo-name npm run build
```

## Accessibility commitments

- Semantic landmarks (`<main>`, `<nav>`, `<footer>`) on every page
- Visible `:focus-visible` ring for keyboard users; skip-to-main link in the layout
- Modal dialogs: Esc-to-close, focus trap, focus return, scroll lock, `aria-modal` + `aria-labelledby`
- Filter/toggle controls expose `aria-pressed`; progress bars expose `role="progressbar"` with values
- `prefers-reduced-motion` honored: animations and smooth scrolling disabled
- Decorative icons marked `aria-hidden`; informative icons have text equivalents
- Mobile-first responsive layout (320 px and up); tap targets sized for touch

## Project layout

```
app/
  page.tsx                            # home — hero, role tiles, flagship Q-Day callout, modules grid
  layout.tsx                          # root layout, fonts, nav, skip link, metadata
  globals.css                         # design tokens, motion + focus rules
  migration/page.tsx                  # /migration — the six-step Migration Playbook (static)
  atlas/
    page.tsx                          # /atlas — labs index
    layout.tsx                        # atlas-wide metadata
    q-day/                            # flagship Q-Day Simulator (+ layout.tsx → About block)
    toolkit/  breaks-survives/  mosca/  tls-theater/  ecc-bounce/  timeline/
                                      # each: page.tsx (client UI) + layout.tsx (metadata + About)
  learn/
    [moduleId]/page.tsx               # module overview (SSG)
    [moduleId]/[lessonId]/page.tsx    # lesson (SSG via generateStaticParams)
    capstone/  complete/
  challenges/page.tsx                 # /challenges — 10 puzzles
  components/
    LabAbout.tsx                      # server-rendered "About this lab" block
    SourceBadge.tsx                   # shared source-confidence badge
    MuseumNav.tsx  Ticker.tsx  ...    # shared chrome
  lib/
    curriculum.ts  algorithms.ts  labs.ts  labMeta.ts  impact.ts  progress.ts
RefDoc.md                             # canonical reference (source of truth)
```

## Adding content

- **A new lesson:** append to the relevant module's `lessons` array in `app/lib/curriculum.ts`.
  Routes prerender automatically via `generateStaticParams`.
- **A new algorithm:** append to `algorithms` in `app/lib/algorithms.ts`. The Toolkit picks it up.
- **A new lab:** add `app/atlas/<lab>/page.tsx` (the interactive UI) and `app/atlas/<lab>/layout.tsx`
  (metadata + `<LabAbout id="<lab>" />`); register it in `app/lib/labs.ts` and `app/lib/labMeta.ts`
  and add a card to `app/atlas/page.tsx`. It then flows into the sitemap automatically.

## Roadmap

- KEMTLS handshake variant in the TLS Theater
- CBOM / cryptographic-inventory worksheet attached to the Migration Playbook
- Shareable permalinks for Q-Day Simulator verdicts
- Per-challenge credential badges and a completion certificate

## Attribution

Paul Clark — cryptography education, interactive systems, and post-quantum learning tools.
paul@systemslibrarian.dev · github.com/systemslibrarian

> "Whether you eat or drink, or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31
