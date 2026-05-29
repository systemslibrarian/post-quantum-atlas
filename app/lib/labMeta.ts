// app/lib/labMeta.ts
// Static, server-renderable teaching content for each interactive lab.
//
// The labs themselves are client components — and a few wrap their UI in a
// Suspense boundary for `useSearchParams`, so their prerendered HTML is nearly
// empty. This metadata is rendered server-side by <LabAbout> (via each lab's
// layout.tsx) so every lab page still teaches something for search engines,
// screen readers, link previews, and the no-JavaScript case.
//
// Source of truth: RefDoc.md. Related exhibits come from labLessons in labs.ts.

import type { Confidence } from "../components/SourceBadge";

export interface LabSource {
  title: string;
  url: string;
  level?: Confidence;
}

export interface LabMeta {
  teaches: string;
  howTo: string[];
  takeaway: string;
  refDoc: string;     // e.g. "RefDoc §13.1"
  sources: LabSource[];
}

export const labMeta: Record<string, LabMeta> = {
  toolkit: {
    teaches:
      "Every post-quantum algorithm NIST has standardized, selected, or studied — grouped by mathematical family, by cryptographic role (key exchange vs. signature), and by how settled its standard is.",
    howTo: [
      "Filter by family (lattice, hash, code, multivariate, isogeny), by role, or by standardization status.",
      "Open any card for the core math, why it won, the size trade-off, and copy-paste code samples.",
      "On ML-KEM, ML-DSA, SLH-DSA, and FN-DSA, hit “Run live” to generate real keys, ciphertexts, and signatures in your browser; the other families link out to full Crypto Lab demos.",
      "Read the status badge: a NIST final standard is production-ready; a broken entry like SIKE is a cautionary tale.",
    ],
    takeaway:
      "For most systems the answer is ML-KEM for key exchange and ML-DSA for signatures, with SLH-DSA as a hash-based backup. Diversity across mathematical families is the insurance policy.",
    refDoc: "RefDoc §7–11, §16",
    sources: [
      { title: "FIPS 203 — ML-KEM", url: "https://csrc.nist.gov/pubs/fips/203/final", level: "final" },
      { title: "FIPS 204 — ML-DSA", url: "https://csrc.nist.gov/pubs/fips/204/final", level: "final" },
      { title: "FIPS 205 — SLH-DSA", url: "https://csrc.nist.gov/pubs/fips/205/final", level: "final" },
    ],
  },
  "breaks-survives": {
    teaches:
      "Which cryptographic tools collapse under Shor's algorithm, which only weaken under Grover's, and which survive the quantum transition essentially intact.",
    howTo: [
      "Scan the three groups: what breaks, what weakens, and what survives.",
      "Expand any entry for why it lands there and the recommended action.",
    ],
    takeaway:
      "Public-key cryptography (RSA, ECC, Diffie–Hellman) breaks outright. Symmetric ciphers and hashes only need larger parameters — AES-256, SHA-384. The asymmetric layer is the emergency.",
    refDoc: "RefDoc §14",
    sources: [
      { title: "NIST IR 8105 — Report on Post-Quantum Cryptography", url: "https://csrc.nist.gov/pubs/ir/8105/final", level: "final" },
    ],
  },
  mosca: {
    teaches:
      "Mosca's inequality: if the time your data must stay secret (X) plus the time it takes to migrate (Y) is greater than the time until a quantum computer arrives (Z), you have already failed for that data class.",
    howTo: [
      "Drag the X, Y, and Z sliders, or load a preset (medical records, military secrets, finance, today's TLS).",
      "Watch the verdict flip the moment X + Y crosses Z.",
    ],
    takeaway:
      "The variable you control least is the shelf-life of your secrets. Long-lived data plus a slow migration means you are already late — even if the quantum computer is still years away.",
    refDoc: "RefDoc §13.1",
    sources: [
      { title: "Mosca — Cybersecurity in an era with quantum computers (2015/2018)", url: "https://eprint.iacr.org/2015/1075.pdf", level: "research" },
    ],
  },
  "tls-theater": {
    teaches:
      "How a TLS 1.3 handshake establishes a secure session, exactly which step a quantum attacker breaks, and how hybrid key exchange closes the hole.",
    howTo: [
      "Step through the handshake one message at a time.",
      "Toggle the quantum attacker, then toggle the hybrid (PQC) defense, and compare the attacker's view.",
    ],
    takeaway:
      "Two asymmetric messages set up the session key; everything after runs on fast symmetric crypto. Hybrid key exchange (X25519 + ML-KEM) forces the attacker to break both the classical and the quantum layer.",
    refDoc: "RefDoc §3",
    sources: [
      { title: "RFC 8446 — TLS 1.3", url: "https://www.rfc-editor.org/rfc/rfc8446", level: "final" },
      { title: "Cloudflare — post-quantum for all", url: "https://blog.cloudflare.com/post-quantum-for-all/", level: "deployment" },
    ],
  },
  "ecc-bounce": {
    teaches:
      "Why elliptic-curve cryptography is a one-way street: adding a point to itself over and over is easy, but recovering how many times you did it — the discrete logarithm — is infeasible, until Shor's algorithm.",
    howTo: [
      "Step the point addition and watch the 'bounce' trace across the curve.",
      "Try to recover the multiplier from the start and end points alone — that is the hard problem.",
    ],
    takeaway:
      "ECC's security rests on the Elliptic Curve Discrete Log Problem. Shor's algorithm solves it efficiently, which puts ECC — like RSA — on the wrong side of the quantum line.",
    refDoc: "RefDoc §2",
    sources: [
      { title: "Securing Elliptic Curve Cryptocurrencies against Quantum Vulnerabilities (2026)", url: "https://eprint.iacr.org/", level: "research" },
    ],
  },
  timeline: {
    teaches:
      "Two decades of quantum research set against one decade of hardening deadlines — and how fast the resource estimates for breaking RSA and ECC have been collapsing.",
    howTo: [
      "Scrub the cursor across 2020–2040.",
      "Filter by category (research, regulation, deployment) to follow a single thread.",
    ],
    takeaway:
      "Nobody can name Q-Day, but the estimates only move one direction — down. Regulators have already set 2030–2035 deadlines, so the migration clock is running regardless of the hardware.",
    refDoc: "RefDoc §13, §15",
    sources: [
      { title: "NSM-10 — U.S. National Security Memorandum on quantum", url: "https://bidenwhitehouse.archives.gov/briefing-room/statements-releases/2022/05/04/national-security-memorandum-on-promoting-united-states-leadership-in-quantum-computing-while-mitigating-risks-to-vulnerable-cryptographic-systems/", level: "final" },
      { title: "EU NIS — Roadmap on the transition to PQC (2025)", url: "https://digital-strategy.ec.europa.eu/en/library/nis-cooperation-group-publishes-roadmap-transition-post-quantum-cryptography", level: "final" },
    ],
  },
  "q-day": {
    teaches:
      "Your own Q-Day verdict — combine the kind of data you hold, how long it must stay confidential, how long your migration takes, when a quantum computer might arrive, and the cryptography you use today.",
    howTo: [
      "Pick a data type and the algorithm you currently rely on.",
      "Set the confidentiality-lifetime, migration-time, and quantum-arrival sliders.",
      "Read the verdict, then the reasoning that produced it.",
    ],
    takeaway:
      "Harvest-now-decrypt-later means the deadline for confidentiality is today, not Q-Day. Signatures only need to be quantum-safe by the time a CRQC exists; harvested ciphertext does not get that grace period.",
    refDoc: "RefDoc §5, §13.1, §18",
    sources: [
      { title: "Mosca — Cybersecurity in an era with quantum computers", url: "https://eprint.iacr.org/2015/1075.pdf", level: "research" },
      { title: "FIPS 203 — ML-KEM", url: "https://csrc.nist.gov/pubs/fips/203/final", level: "final" },
    ],
  },
  "crypto-bench": {
    teaches:
      "What post-quantum cryptography actually does — by running it. Real ML-KEM-768 key encapsulation, a real X25519 + ML-KEM-768 hybrid exchange, and real ML-DSA-65 signing and verification, all executed in your browser with the audited @noble/post-quantum library.",
    howTo: [
      "Run the ML-KEM-768 exchange and confirm Alice and Bob derive the identical 32-byte shared secret.",
      "Run the hybrid exchange to see a classical and a post-quantum secret folded into one session key.",
      "Type a message, sign it with ML-DSA-65, and watch verification reject it the moment one byte changes.",
    ],
    takeaway:
      "These are not animations — they are the same NIST-standard algorithms (FIPS 203 and 204) shipping in TLS today, fast enough to run a full key exchange in a millisecond. Fresh keys are sampled every run, and nothing leaves your machine.",
    refDoc: "RefDoc §7, §8, §16",
    sources: [
      { title: "FIPS 203 — ML-KEM", url: "https://csrc.nist.gov/pubs/fips/203/final", level: "final" },
      { title: "FIPS 204 — ML-DSA", url: "https://csrc.nist.gov/pubs/fips/204/final", level: "final" },
      { title: "noble-post-quantum (audited JS implementation)", url: "https://github.com/paulmillr/noble-post-quantum", level: "deployment" },
    ],
  },
};
