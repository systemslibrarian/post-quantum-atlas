// app/lib/glossary.ts
// Glossary of cryptographic terms. Keys are the canonical phrase as written in lessons.
// The auto-decorator matches case-insensitively on word boundaries.

export interface Term {
  term: string;
  definition: string;
}

export const glossary: Term[] = [
  { term: "CRQC", definition: "Cryptographically-Relevant Quantum Computer — a quantum machine large and stable enough to break RSA-2048 or ECC-256." },
  { term: "Shor's algorithm", definition: "A 1994 quantum algorithm that factors integers and solves discrete logarithms in polynomial time, breaking RSA, ECC, and Diffie-Hellman." },
  { term: "Grover's algorithm", definition: "A quantum search algorithm that provides a quadratic speedup, halving the effective security of symmetric ciphers and hashes." },
  { term: "ML-KEM", definition: "Module-Lattice Key Encapsulation Mechanism (FIPS 203), formerly CRYSTALS-Kyber. NIST's primary post-quantum key exchange." },
  { term: "ML-DSA", definition: "Module-Lattice Digital Signature Algorithm (FIPS 204), formerly CRYSTALS-Dilithium. NIST's primary post-quantum signature scheme." },
  { term: "SLH-DSA", definition: "Stateless Hash-Based Digital Signature Algorithm (FIPS 205), formerly SPHINCS+. A conservative backup using only hash primitives." },
  { term: "HQC", definition: "Hamming Quasi-Cyclic — a code-based key encapsulation mechanism, selected by NIST in March 2025 as a non-lattice backup." },
  { term: "PQC", definition: "Post-Quantum Cryptography — classical software algorithms that resist attack by quantum computers." },
  { term: "QKD", definition: "Quantum Key Distribution — a hardware approach using photonic states (e.g. BB84) to share keys; distinct from PQC." },
  { term: "KEM", definition: "Key Encapsulation Mechanism — a primitive that securely transports a symmetric key between two parties." },
  { term: "TLS", definition: "Transport Layer Security — the protocol securing HTTPS connections. Currently TLS 1.3." },
  { term: "AES-256", definition: "Advanced Encryption Standard with a 256-bit key. Survives Grover's with ~128-bit quantum security." },
  { term: "AES-128", definition: "Advanced Encryption Standard with a 128-bit key. Grover's drops its effective security to ~64 bits — upgrade to AES-256." },
  { term: "ECC", definition: "Elliptic Curve Cryptography — asymmetric crypto built on the discrete log problem over elliptic curves. Broken by Shor's." },
  { term: "ECDH", definition: "Elliptic-Curve Diffie-Hellman — key exchange over an elliptic curve. Broken by Shor's." },
  { term: "ECDSA", definition: "Elliptic-Curve Digital Signature Algorithm. Broken by Shor's." },
  { term: "RSA", definition: "Rivest-Shamir-Adleman — public-key cryptosystem based on integer factorization. Broken by Shor's." },
  { term: "MLWE", definition: "Module Learning With Errors — the lattice hardness assumption underpinning ML-KEM and ML-DSA." },
  { term: "LWE", definition: "Learning With Errors — Regev's 2005 lattice hardness assumption. PQC schemes use its module variant (MLWE)." },
  { term: "Mosca's inequality", definition: "X + Y > Z — if data lifetime (X) plus migration time (Y) exceeds time-to-CRQC (Z), you have already failed for that data class." },
  { term: "harvest-now-decrypt-later", definition: "HNDL — an adversary records encrypted traffic today and decrypts it once a CRQC exists. Already happening per EU NIS guidance." },
  { term: "store-now-decrypt-later", definition: "SNDL — synonym for harvest-now-decrypt-later. Recording encrypted data for future quantum decryption." },
  { term: "hybrid KEM", definition: "A construction combining a classical KEM (e.g. X25519) and a PQC KEM (e.g. ML-KEM-768) so an attacker must break both." },
  { term: "X25519", definition: "Curve25519-based Diffie-Hellman key exchange. Fast and widely deployed in TLS 1.3; broken by Shor's, used in hybrids today." },
  { term: "X-Wing", definition: "The IANA-registered hybrid KEM combining X25519 with ML-KEM-768. Endorsed by NCSC, NSA, NIST, and the EU as the migration default." },
  { term: "CNSA 2.0", definition: "NSA's Commercial National Security Algorithm Suite 2.0 — mandates ML-KEM-1024 and ML-DSA-87 for U.S. national-security systems." },
  { term: "FIPS 203", definition: "NIST standard for ML-KEM, published August 2024." },
  { term: "FIPS 204", definition: "NIST standard for ML-DSA, published August 2024." },
  { term: "FIPS 205", definition: "NIST standard for SLH-DSA, published August 2024." },
  { term: "CBOM", definition: "Cryptographic Bill of Materials — an inventory of cryptographic primitives used by a system, prerequisite to a real PQC migration." },
  { term: "Kerckhoffs's Principle", definition: "A cryptosystem should remain secure even if everything about it except the key is public knowledge." },
];

const ranked = [...glossary].sort((a, b) => b.term.length - a.term.length);

export function termsByLength(): Term[] {
  return ranked;
}

export function findTerm(s: string): Term | undefined {
  const key = s.toLowerCase();
  return glossary.find(t => t.term.toLowerCase() === key);
}
