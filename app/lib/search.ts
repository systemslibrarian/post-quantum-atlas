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

// Synonym and intent expansion. Keys are normalized lowercase phrases the
// user might type; values are extra tokens injected into the query before ranking.
const synonyms: Record<string, string[]> = {
  // Algorithm aliases
  "kyber":          ["ml-kem"],
  "dilithium":      ["ml-dsa"],
  "sphincs":        ["slh-dsa"],
  "sphincs+":       ["slh-dsa"],
  "falcon":         ["fn-dsa"],
  "mceliece":       ["classic mceliece"],
  // Regulator + framework intent
  "cnsa":           ["cnsa 2.0", "ml-dsa-87", "ml-kem-1024", "transition"],
  "cnsa 2":         ["cnsa 2.0", "ml-dsa-87", "ml-kem-1024"],
  "cnsa 2.0":       ["ml-dsa-87", "ml-kem-1024"],
  "deadline":       ["2030", "2035", "transition", "global regulation", "cnsa"],
  "deadlines":      ["2030", "2035", "transition", "global regulation"],
  "nist":           ["fips 203", "fips 204", "fips 205", "standardization"],
  "fips":           ["fips 203", "fips 204", "fips 205"],
  "fips 203":       ["ml-kem"],
  "fips 204":       ["ml-dsa"],
  "fips 205":       ["slh-dsa"],
  "fips 206":       ["fn-dsa", "falcon"],
  "nis2":           ["regulation", "european union", "transition"],
  // Practitioner intent
  "what replaces ecdsa":       ["ml-dsa", "slh-dsa", "ecdsa"],
  "what replaces rsa":         ["ml-kem", "ml-dsa", "rsa"],
  "which algorithms survive":  ["breaks-survives", "aes-256", "sha-512"],
  "what breaks":               ["breaks-survives", "shor", "rsa", "ecc"],
  "hybrid tls":                ["x-wing", "ml-kem", "x25519", "tls"],
  "hybrid":                    ["x-wing", "ml-kem", "x25519", "hybrid kem"],
  "x-wing":                    ["x25519", "ml-kem-768", "hybrid"],
  "harvest now":               ["store now decrypt later", "mosca", "sndl", "hndl"],
  "decrypt later":             ["mosca", "harvest now decrypt later"],
  "sndl":                      ["store now decrypt later", "mosca"],
  "hndl":                      ["harvest now decrypt later", "mosca"],
  "quantum threat":            ["shor", "grover", "crqc", "quantum-threat"],
  "crqc":                      ["quantum threat", "shor"],
};

function expand(q: string): string {
  const trimmed = q.trim().toLowerCase();
  const extras = synonyms[trimmed] ?? [];
  if (extras.length === 0) {
    // Per-token expansion: catch single words like "kyber"
    const tokens = trimmed.split(/\s+/);
    const perToken: string[] = [];
    for (const t of tokens) {
      if (synonyms[t]) perToken.push(...synonyms[t]);
    }
    return [trimmed, ...perToken].join(" ");
  }
  return [trimmed, ...extras].join(" ");
}

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

/** Rank hits against a query. Synonym-aware: known phrases inject extra tokens
 *  that are OR-matched (any token hit counts). Returns hits sorted by score descending. */
export function rank(query: string, limit = 25): Hit[] {
  const original = query.trim().toLowerCase();
  if (!original) return [];

  const originalTokens = original.split(/\s+/).filter(Boolean);
  const expanded = expand(original);
  const expandedTokens = expanded.split(/\s+/).filter(Boolean);

  const scored: { h: Hit; score: number }[] = [];

  for (const h of corpus()) {
    const titleL = h.title.toLowerCase();
    const subL = (h.subtitle ?? "").toLowerCase();
    const keyL = (h.title + " " + h.searchKey).toLowerCase();

    let score = 0;

    // The original tokens are required (AND), the synonym tokens are bonuses (OR).
    let allOriginalHit = true;
    for (const t of originalTokens) {
      if (!keyL.includes(t)) { allOriginalHit = false; break; }
      if (titleL === t) score += 100;
      else if (titleL.startsWith(t)) score += 50;
      else if (titleL.includes(t)) score += 25;
      if (subL.includes(t)) score += 10;
      score += 3;
    }

    if (allOriginalHit) {
      // Synonym tokens are pure bonuses.
      for (const t of expandedTokens) {
        if (originalTokens.includes(t)) continue;
        if (keyL.includes(t)) {
          if (titleL.includes(t)) score += 8;
          else score += 2;
        }
      }
    } else {
      // Original failed — let strong synonym matches still surface some results.
      let synHits = 0;
      for (const t of expandedTokens) {
        if (originalTokens.includes(t)) continue;
        if (keyL.includes(t)) {
          synHits++;
          if (titleL.includes(t)) score += 12;
          else score += 4;
        }
      }
      if (synHits < 2) continue; // require at least 2 synonym hits to surface a fallback
    }

    if (h.kind === "page" || h.kind === "lab") score += 0.5;

    scored.push({ h, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.h);
}
