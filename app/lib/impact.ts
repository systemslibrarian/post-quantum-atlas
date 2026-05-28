// app/lib/impact.ts
// Quantum impact dataset — every cryptographic tool, bucketed by what happens when a CRQC arrives.
// Source: RefDoc.md §4 (algorithms) and §14 (impact table).

export type ImpactBucket = "shor-broken" | "grover-weakened" | "survives" | "pqc-replacement";

export interface ImpactEntry {
  id: string;
  name: string;
  category: string;          // e.g. "Asymmetric encryption", "Signature", "Symmetric"
  bucket: ImpactBucket;
  detail: string;            // 1–2 sentence explanation
  action: string;            // what to do about it
}

export const impactBuckets: Record<ImpactBucket, { label: string; sub: string; tone: "danger" | "warning" | "safe" | "quantum" }> = {
  "shor-broken":      { label: "Broken by Shor's", sub: "Completely defeated. Replace.", tone: "danger" },
  "grover-weakened":  { label: "Weakened by Grover's", sub: "Effective key length halves. Upgrade.", tone: "warning" },
  "survives":         { label: "Survives with upgrades", sub: "Still strong at larger sizes.", tone: "safe" },
  "pqc-replacement":  { label: "Post-quantum replacement", sub: "The new foundation.", tone: "quantum" },
};

export const impactEntries: ImpactEntry[] = [
  // === Broken by Shor's ===
  {
    id: "rsa",
    name: "RSA",
    category: "Asymmetric encryption / key transport",
    bucket: "shor-broken",
    detail: "Shor's algorithm factors the modulus in polynomial time. Every RSA key — including 4096-bit — becomes recoverable.",
    action: "Migrate key transport to ML-KEM. Replace RSA signatures with ML-DSA.",
  },
  {
    id: "ecc",
    name: "ECC / ECDH",
    category: "Asymmetric encryption / key exchange",
    bucket: "shor-broken",
    detail: "The Elliptic Curve Discrete Log Problem falls to Shor's. Smaller keys mean ECC breaks faster and cheaper than RSA.",
    action: "Migrate key exchange to ML-KEM. Deploy hybrid (X25519 + ML-KEM-768) during transition.",
  },
  {
    id: "dh",
    name: "Diffie-Hellman",
    category: "Key exchange",
    bucket: "shor-broken",
    detail: "Classic DH and its variants (DHE, ECDHE) rely on discrete logs — all defeated by Shor's.",
    action: "Replace with ML-KEM or a hybrid KEM.",
  },
  {
    id: "ecdsa",
    name: "ECDSA / EdDSA",
    category: "Digital signatures",
    bucket: "shor-broken",
    detail: "Signature schemes built on elliptic-curve discrete logs are broken — past signatures can be forged retroactively.",
    action: "Migrate to ML-DSA. Use SLH-DSA where conservative hash-based security matters more than size.",
  },
  {
    id: "rsa-pss",
    name: "RSA-PSS",
    category: "Digital signatures",
    bucket: "shor-broken",
    detail: "RSA-based signatures fall with RSA. Forged code-signing and TLS certificates become possible.",
    action: "Replace with ML-DSA. SLH-DSA as conservative backup.",
  },
  {
    id: "blockchain-sigs",
    name: "Blockchain wallet signatures",
    category: "Identity / ownership",
    bucket: "shor-broken",
    detail: "Bitcoin (secp256k1) and Ethereum signature schemes use ECC. A CRQC could forge wallet ownership.",
    action: "Chains must migrate to PQC signatures. Long-tail wallets remain at risk during the transition.",
  },

  // === Weakened by Grover's ===
  {
    id: "aes-128",
    name: "AES-128",
    category: "Symmetric encryption",
    bucket: "grover-weakened",
    detail: "Grover's search halves effective key length: 128-bit AES drops to ~64-bit quantum security.",
    action: "Upgrade to AES-256 (gives ~128-bit quantum security). Cheap and universal.",
  },
  {
    id: "sha-256",
    name: "SHA-256 (preimage)",
    category: "Hashing",
    bucket: "grover-weakened",
    detail: "Grover's halves preimage resistance. SHA-256 preimage drops to ~128-bit security.",
    action: "Use SHA-384 or SHA-512 where long-term collision/preimage resistance matters.",
  },
  {
    id: "hmac",
    name: "HMAC-SHA-256",
    category: "Message authentication",
    bucket: "grover-weakened",
    detail: "Same Grover speedup as the underlying hash. MAC strength halves.",
    action: "Move to HMAC-SHA-384/512 in high-assurance settings.",
  },

  // === Survives ===
  {
    id: "aes-256",
    name: "AES-256",
    category: "Symmetric encryption",
    bucket: "survives",
    detail: "Even with Grover's, ~128-bit quantum security remains. NSA's CNSA 2.0 keeps AES-256 in the post-quantum baseline.",
    action: "Already deployed. Keep as the bulk-data cipher of choice.",
  },
  {
    id: "sha-384",
    name: "SHA-384 / SHA-512",
    category: "Hashing",
    bucket: "survives",
    detail: "Larger output sizes preserve ≥128-bit security under Grover's.",
    action: "Adopt where SHA-256 was used for long-lived integrity.",
  },
  {
    id: "lms-xmss",
    name: "LMS / XMSS",
    category: "Stateful hash-based signatures",
    bucket: "survives",
    detail: "Hash-based stateful signatures (NIST SP 800-208) are quantum-safe by construction. Used today for firmware and code signing.",
    action: "Already standardized. Use for high-value code-signing roots.",
  },
  {
    id: "fhe-lattice",
    name: "Lattice-based FHE (CKKS, BFV, TFHE)",
    category: "Homomorphic encryption",
    bucket: "survives",
    detail: "Built on the same lattice hardness assumptions as ML-KEM. Quantum-safe by design.",
    action: "Continue research deployment; no PQC migration needed.",
  },

  // === PQC replacement ===
  {
    id: "ml-kem-r",
    name: "ML-KEM (Kyber)",
    category: "Key exchange (KEM)",
    bucket: "pqc-replacement",
    detail: "Lattice-based KEM, FIPS 203. Already deployed in Chrome, Cloudflare, Signal, Apple PQ3.",
    action: "Default KEM for new deployments. Prefer ML-KEM-768 hybrid.",
  },
  {
    id: "ml-dsa-r",
    name: "ML-DSA (Dilithium)",
    category: "Digital signatures",
    bucket: "pqc-replacement",
    detail: "Lattice-based signatures, FIPS 204. CNSA 2.0 mandates ML-DSA-87 for national-security systems.",
    action: "Default signature for new deployments. Plan TLS certificate migration.",
  },
  {
    id: "slh-dsa-r",
    name: "SLH-DSA (SPHINCS+)",
    category: "Digital signatures (conservative)",
    bucket: "pqc-replacement",
    detail: "Hash-based, FIPS 205. Different math from ML-DSA — survives if lattice assumptions fall.",
    action: "Use as backup or for code-signing roots with long lifetimes.",
  },
  {
    id: "hqc-r",
    name: "HQC",
    category: "Key exchange (non-lattice backup)",
    bucket: "pqc-replacement",
    detail: "Code-based KEM, selected by NIST March 2025. Provides a non-lattice alternative.",
    action: "Track FIPS publication. Hold as fallback if lattice math weakens.",
  },
];

export function entriesByBucket(bucket: ImpactBucket): ImpactEntry[] {
  return impactEntries.filter(e => e.bucket === bucket);
}
