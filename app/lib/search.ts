// app/lib/search.ts
// Shared corpus + ranking for the CommandPalette and the /search route.
// Built once at module load — covers modules, lessons, algorithms, labs,
// and top-level pages.

import { modules } from "./curriculum";
import { algorithms } from "./algorithms";
import { labs } from "./labs";

export type HitKind = "module" | "lesson" | "lab" | "algorithm" | "page";

export interface Hit {
  id: string;
  kind: HitKind;
  title: string;
  subtitle?: string;
  href: string;
  searchKey: string;
}

export const kindLabel: Record<HitKind, string> = {
  module: "Hall",
  lesson: "Exhibit",
  lab: "Lab",
  algorithm: "Algorithm",
  page: "Page",
};

let cachedCorpus: Hit[] | null = null;

export function corpus(): Hit[] {
  if (cachedCorpus) return cachedCorpus;
  const hits: Hit[] = [];

  hits.push({ id: "page:home",       kind: "page", title: "Entrance",  subtitle: "Hall overview & both entry points", href: "/",           searchKey: "home entrance overview" });
  hits.push({ id: "page:atlas",      kind: "page", title: "Atlas",     subtitle: "Interactive labs index",            href: "/atlas",      searchKey: "atlas labs map interactive" });
  hits.push({ id: "page:map",        kind: "page", title: "Museum map", subtitle: "Halls and labs at a glance",       href: "/map",        searchKey: "museum map sitemap overview" });
  hits.push({ id: "page:challenges", kind: "page", title: "Challenges", subtitle: "Ten short puzzles",                href: "/challenges", searchKey: "challenges puzzles game" });
  hits.push({ id: "page:about",      kind: "page", title: "About",     subtitle: "How the project is built",          href: "/about",      searchKey: "about credits author methodology" });
  hits.push({ id: "page:complete",   kind: "page", title: "Your summary", subtitle: "End-of-path printable",          href: "/learn/complete", searchKey: "summary complete printable certificate" });

  for (const m of modules) {
    hits.push({
      id: `module:${m.id}`,
      kind: "module",
      title: m.title,
      subtitle: `Hall ${m.order} · ${m.lessons.length} exhibits`,
      href: `/learn/${m.id}`,
      searchKey: `${m.title} ${m.subtitle} ${m.description}`,
    });
    for (const l of m.lessons) {
      hits.push({
        id: `lesson:${m.id}/${l.id}`,
        kind: "lesson",
        title: l.title,
        subtitle: `${m.title} · ${l.subtitle}`,
        href: `/learn/${m.id}/${l.id}`,
        searchKey: `${l.title} ${l.subtitle} ${l.keyTakeaways.join(" ")} ${m.title}`,
      });
    }
  }

  for (const a of algorithms) {
    hits.push({
      id: `algo:${a.id}`,
      kind: "algorithm",
      title: a.name,
      subtitle: [a.aka, a.fips, a.coreMath].filter(Boolean).join(" · "),
      href: "/atlas/toolkit",
      searchKey: `${a.name} ${a.aka ?? ""} ${a.coreMath} ${a.family} ${a.fips ?? ""} ${a.deployment} ${a.tradeoff} ${a.whyItWon}`,
    });
  }

  for (const l of Object.values(labs)) {
    hits.push({
      id: `lab:${l.id}`,
      kind: "lab",
      title: l.title,
      subtitle: l.blurb,
      href: l.href,
      searchKey: `${l.title} ${l.blurb}`,
    });
  }

  cachedCorpus = hits;
  return hits;
}

/** Rank hits against a query. Returns a copy sorted by score descending, score > 0 only. */
export function rank(query: string, limit = 25): Hit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);
  const scored: { h: Hit; score: number }[] = [];

  for (const h of corpus()) {
    const titleL = h.title.toLowerCase();
    const subL = (h.subtitle ?? "").toLowerCase();
    const keyL = (h.title + " " + h.searchKey).toLowerCase();

    let score = 0;
    let allHit = true;

    for (const t of tokens) {
      if (!keyL.includes(t)) { allHit = false; break; }
      if (titleL === t) score += 100;
      else if (titleL.startsWith(t)) score += 50;
      else if (titleL.includes(t)) score += 25;
      if (subL.includes(t)) score += 10;
      score += 3;
    }

    if (!allHit) continue;

    // Tiny tie-breaker: prefer pages and labs over deep lessons when scores tie.
    if (h.kind === "page" || h.kind === "lab") score += 0.5;

    scored.push({ h, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.h);
}
