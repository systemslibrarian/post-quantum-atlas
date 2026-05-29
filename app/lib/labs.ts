// app/lib/labs.ts
// The labs catalog + the lesson↔lab map. Keeping this in one file lets every page
// reference the same source of truth.

export interface Lab {
  id: string;
  title: string;
  href: string;
  blurb: string;
}

export const labs: Record<string, Lab> = {
  toolkit: {
    id: "toolkit",
    title: "PQC Toolkit",
    href: "/atlas/toolkit",
    blurb: "Filterable algorithm cards for every PQC family.",
  },
  "breaks-survives": {
    id: "breaks-survives",
    title: "Breaks vs. Survives",
    href: "/atlas/breaks-survives",
    blurb: "Visual map of what falls to Shor's, weakens under Grover's, and survives intact.",
  },
  mosca: {
    id: "mosca",
    title: "Mosca's Inequality",
    href: "/atlas/mosca",
    blurb: "Slide X, Y, Z and watch the verdict change in real time.",
  },
  "tls-theater": {
    id: "tls-theater",
    title: "TLS Handshake Theater",
    href: "/atlas/tls-theater",
    blurb: "Step through a TLS 1.3 handshake with a quantum attacker.",
  },
  "timeline": {
    id: "timeline",
    title: "Threat Timeline",
    href: "/atlas/timeline",
    blurb: "Scrub a cursor through 2020–2040 and watch milestones light up.",
  },
  "ecc-bounce": {
    id: "ecc-bounce",
    title: "ECC Bounce Visualizer",
    href: "/atlas/ecc-bounce",
    blurb: "Watch point addition on a real elliptic curve and feel the trapdoor.",
  },
};

// moduleId/lessonId -> related lab ids
export const lessonLabs: Record<string, string[]> = {
  "modern-crypto/tls-certificates": ["tls-theater", "breaks-survives"],
  "quantum-threat/store-now-decrypt-later": ["mosca"],
  "quantum-threat/what-breaks": ["breaks-survives", "toolkit"],
  "pqc-solutions/five-families": ["toolkit"],
  "pqc-solutions/ml-kem": ["toolkit", "tls-theater"],
  "pqc-solutions/ml-dsa": ["toolkit"],
  "transition/hybrid-strategy": ["tls-theater", "toolkit"],
  "quantum-threat/hardware-timeline": ["timeline"],
  "transition/global-regulation": ["timeline"],
  "transition/nist-process": ["timeline", "toolkit"],
  "modern-crypto/elliptic-curves": ["ecc-bounce"],
  "foundations/rsa-trapdoor": ["ecc-bounce"],
};

// lab id -> related lessons (rendered as 'back to the source' on lab pages later)
export const labLessons: Record<string, { moduleId: string; lessonId: string }[]> = {
  "toolkit": [
    { moduleId: "pqc-solutions", lessonId: "five-families" },
    { moduleId: "pqc-solutions", lessonId: "ml-kem" },
    { moduleId: "pqc-solutions", lessonId: "ml-dsa" },
  ],
  "breaks-survives": [
    { moduleId: "quantum-threat", lessonId: "what-breaks" },
  ],
  "mosca": [
    { moduleId: "quantum-threat", lessonId: "store-now-decrypt-later" },
  ],
  "tls-theater": [
    { moduleId: "modern-crypto", lessonId: "tls-certificates" },
    { moduleId: "transition", lessonId: "hybrid-strategy" },
  ],
  "timeline": [
    { moduleId: "quantum-threat", lessonId: "hardware-timeline" },
    { moduleId: "transition", lessonId: "global-regulation" },
    { moduleId: "transition", lessonId: "nist-process" },
  ],
  "ecc-bounce": [
    { moduleId: "modern-crypto", lessonId: "elliptic-curves" },
    { moduleId: "foundations", lessonId: "rsa-trapdoor" },
  ],
};

export function labsForLesson(moduleId: string, lessonId: string): Lab[] {
  const ids = lessonLabs[`${moduleId}/${lessonId}`] ?? [];
  return ids.map(id => labs[id]).filter(Boolean);
}

export function lessonsForLab(labId: string) {
  return labLessons[labId] ?? [];
}
