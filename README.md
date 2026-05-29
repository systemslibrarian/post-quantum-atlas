# Post-Quantum Atlas

An interactive learning system for post-quantum cryptography — the structured curriculum from RefDoc.md, turned into a navigable map of where cryptography is going next.

Companion to *"From Caesar to Post-Quantum: Building a Three-Tier Cryptography Education Portfolio"* (Code4Lib Journal) and to the [Cipher Museum](https://github.com/systemslibrarian/cipher-museum), which covers where cryptography came from.

## What's inside

Two ways to engage:

- **`/learn`** — a guided 6-module, 21-lesson path: foundations → modern crypto → quantum threat → PQC solutions → transition → real-world deployment. Progress is tracked locally.
- **`/atlas`** — interactive labs that turn the reference document into something you can wander through:
  - **PQC Toolkit** (live): filterable cards for ML-KEM, ML-DSA, SLH-DSA, FN-DSA, HQC, Classic McEliece, and SIKE — by family, role, and standardization status.
  - Breaks vs. Survives map, Mosca's Inequality slider, TLS Handshake Theater, ECC Bounce Visualizer, Threat Timeline — *coming soon*.

The single source of truth for facts and figures is [`RefDoc.md`](./RefDoc.md). Each algorithm card links back to its section.

## Stack

- **Next.js 16** (App Router, static export)
- **React 19**
- **Tailwind CSS 4**
- **TypeScript 5**
- **lucide-react** icons

No backend. No database. Progress lives in `localStorage`.

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

Output is written to `out/`. The build runs `output: "export"` and prerenders all 35 pages (home, atlas index, toolkit, 6 module overviews, 21 lessons, 404). No server required to host the result.

## Deploy to GitHub Pages

1. In the repository settings, set **Pages → Source** to **GitHub Actions**.
2. Push to `main`. The workflow at [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) builds the static export and publishes it to Pages.
3. The site lives at `https://<owner>.github.io/post-quantum-atlas/`.

If you fork this repo under a different name, override the base path:

```bash
NEXT_PUBLIC_BASE_PATH=/your-repo-name npm run build
```

## Accessibility commitments

- Semantic landmarks (`<main>`, `<nav>`, `<footer>`) on every page
- Visible `:focus-visible` ring for keyboard users
- Skip-to-main link in the layout
- Modal dialogs: Esc-to-close, focus trap, focus return, scroll lock, `aria-modal` + `aria-labelledby`
- Filter pills expose `aria-pressed`; progress bars expose `role="progressbar"` with values
- `prefers-reduced-motion` honored: animations and smooth scrolling disabled
- Decorative icons marked `aria-hidden`; informative icons have text equivalents
- Mobile-first responsive layout (320 px and up); tap targets sized for touch

## Project layout

```
app/
  page.tsx                            # home — modules grid + atlas entry
  layout.tsx                          # root layout, fonts, skip link, viewport
  globals.css                         # design tokens, motion + focus rules
  atlas/
    page.tsx                          # /atlas — labs index
    toolkit/page.tsx                  # /atlas/toolkit — algorithm cards lab
  learn/
    [moduleId]/page.tsx               # module overview (SSG)
    [moduleId]/module-client.tsx
    [moduleId]/[lessonId]/page.tsx    # lesson (SSG)
    [moduleId]/[lessonId]/lesson-client.tsx
  lib/
    curriculum.ts                     # modules + lessons (source: RefDoc.md)
    algorithms.ts                     # PQC algorithm catalog (source: RefDoc.md §7–11, 16)
    progress.ts                       # localStorage progress helpers
RefDoc.md                             # canonical reference
```

## Adding content

- A new lesson: append to the relevant module's `lessons` array in `app/lib/curriculum.ts`. Routes prerender automatically via `generateStaticParams`.
- A new algorithm: append to `algorithms` in `app/lib/algorithms.ts`. The Toolkit cards page picks it up.
- A new lab: add a route under `app/atlas/<lab-name>/page.tsx` and mark the corresponding `labs[]` entry in `app/atlas/page.tsx` as `status: "live"` with the right `href`.

## Attribution

Paul Clark — IT Librarian & Application Systems Analyst, Leon County Public Library
paul@systemslibrarian.dev · github.com/systemslibrarian

> "Whether you eat or drink, or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31
