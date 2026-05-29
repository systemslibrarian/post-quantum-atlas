// app/lib/checkpoints.ts
// 3-question hall-end checkpoints + a 10-question capstone covering the whole path.
// Kept in its own file so the curriculum stays lean.

import type { Question } from "./curriculum";

export const checkpoints: Record<string, Question[]> = {
  foundations: [
    {
      id: "f1",
      prompt: "Kerckhoffs's Principle says a cryptosystem should remain secure even if…",
      choices: [
        { id: "a", label: "the key is leaked" },
        { id: "b", label: "everything except the key is public knowledge" },
        { id: "c", label: "the implementation is closed source" },
        { id: "d", label: "the algorithm is patented" },
      ],
      correctId: "b",
      explanation: "Security must depend on the secrecy of the key, not the algorithm. Public algorithms get peer-reviewed; secret algorithms get cracked.",
    },
    {
      id: "f2",
      prompt: "Which combination is correct for the CIA Triad?",
      choices: [
        { id: "a", label: "Confidentiality + Integrity + Authentication" },
        { id: "b", label: "Compression + Integrity + Authority" },
        { id: "c", label: "Confidentiality + Identity + Anonymization" },
        { id: "d", label: "Cryptography + Integrity + Authority" },
      ],
      correctId: "a",
      explanation: "The CIA triad: Confidentiality (secrecy), Integrity (tamper-proofing), Authentication (proving identity).",
    },
    {
      id: "f3",
      prompt: "RSA's security depends on which problem being hard?",
      choices: [
        { id: "a", label: "Factoring large composites into their prime factors" },
        { id: "b", label: "Computing discrete logarithms on elliptic curves" },
        { id: "c", label: "Finding hash preimages" },
        { id: "d", label: "Inverting AES" },
      ],
      correctId: "a",
      explanation: "RSA's trapdoor is integer factorization. Multiplying two big primes is easy; factoring the product without the secret is infeasible classically.",
    },
  ],
  "modern-crypto": [
    {
      id: "m1",
      prompt: "Why does a 256-bit ECC key give roughly the same security as a 3072-bit RSA key?",
      choices: [
        { id: "a", label: "ECC uses larger primes per bit" },
        { id: "b", label: "The Elliptic Curve Discrete Log Problem has no general subexponential attack" },
        { id: "c", label: "ECC compresses the public key with gzip" },
        { id: "d", label: "ECC reuses RSA's modulus structure" },
      ],
      correctId: "b",
      explanation: "No subexponential classical algorithm is known for ECDLP, so security per bit is dramatically higher. 256-bit ECC ≈ 3072-bit RSA.",
    },
    {
      id: "m2",
      prompt: "In a TLS 1.3 handshake, asymmetric cryptography is used primarily to…",
      choices: [
        { id: "a", label: "Encrypt the entire conversation" },
        { id: "b", label: "Establish a session key and verify identity" },
        { id: "c", label: "Compress the payload" },
        { id: "d", label: "Sign each AES-GCM record" },
      ],
      correctId: "b",
      explanation: "Asymmetric crypto sets the stage: derive a shared session key and verify the certificate. Bulk data then flows under fast symmetric encryption.",
    },
    {
      id: "m3",
      prompt: "What is the strongest reason a Certificate Authority's private key is the ultimate quantum target?",
      choices: [
        { id: "a", label: "It is the largest key in use" },
        { id: "b", label: "Forging a CA's signature impersonates every site it vouches for" },
        { id: "c", label: "CAs publish their keys openly" },
        { id: "d", label: "CAs use weaker curves than browsers" },
      ],
      correctId: "b",
      explanation: "A CA's signing power is transitive. Forging that signature lets an attacker issue valid certificates for any domain — collapsing the chain of trust.",
    },
  ],
  "quantum-threat": [
    {
      id: "q1",
      prompt: "Shor's algorithm makes which class of problems easy on a CRQC?",
      choices: [
        { id: "a", label: "Symmetric encryption like AES" },
        { id: "b", label: "Hash preimage on SHA-256" },
        { id: "c", label: "Integer factoring and discrete logs" },
        { id: "d", label: "NP-hard problems generally" },
      ],
      correctId: "c",
      explanation: "Shor's polynomial-time quantum algorithm solves factoring and discrete logs — the foundations of RSA, ECC, and DH. Symmetric and hash problems are only weakened by Grover's, not broken.",
    },
    {
      id: "q2",
      prompt: "Mosca's inequality says you have already failed when…",
      choices: [
        { id: "a", label: "Z (time to CRQC) < X (data lifetime) + Y (migration time)" },
        { id: "b", label: "X > Y" },
        { id: "c", label: "Y > Z" },
        { id: "d", label: "X + Z > Y" },
      ],
      correctId: "a",
      explanation: "If your data has to outlive its protection — X + Y > Z — then today's classical asymmetric crypto is already insufficient for that class.",
    },
    {
      id: "q3",
      prompt: "Which class of cryptography survives quantum with key-size upgrades, no replacement needed?",
      choices: [
        { id: "a", label: "Asymmetric encryption (RSA / ECC)" },
        { id: "b", label: "Digital signatures (ECDSA / EdDSA)" },
        { id: "c", label: "Diffie-Hellman key exchange" },
        { id: "d", label: "Symmetric encryption (AES) and hashing (SHA)" },
      ],
      correctId: "d",
      explanation: "Grover's only halves effective key length. AES-256 stays ~128-bit quantum-secure; SHA-384/512 stays strong. The asymmetric layer is what needs PQC.",
    },
  ],
  "pqc-solutions": [
    {
      id: "p1",
      prompt: "Which FIPS standard publishes ML-KEM?",
      choices: [
        { id: "a", label: "FIPS 197" },
        { id: "b", label: "FIPS 203" },
        { id: "c", label: "FIPS 204" },
        { id: "d", label: "FIPS 205" },
      ],
      correctId: "b",
      explanation: "FIPS 203 = ML-KEM, 204 = ML-DSA, 205 = SLH-DSA. FIPS 197 is AES.",
    },
    {
      id: "p2",
      prompt: "Why did NIST standardize SLH-DSA (SPHINCS+) alongside ML-DSA?",
      choices: [
        { id: "a", label: "It's faster than ML-DSA" },
        { id: "b", label: "It uses different math — hash-based — so a lattice break wouldn't take it down" },
        { id: "c", label: "It produces smaller signatures than ML-DSA" },
        { id: "d", label: "It's required by GDPR" },
      ],
      correctId: "b",
      explanation: "Diversification. SLH-DSA's only assumption is hash collision resistance — completely different math from MLWE. If lattice falls, hash stands.",
    },
    {
      id: "p3",
      prompt: "MLWE solved which engineering problem of pure LWE?",
      choices: [
        { id: "a", label: "Slow signature generation" },
        { id: "b", label: "Multi-megabyte public keys" },
        { id: "c", label: "Quantum vulnerability" },
        { id: "d", label: "Lack of formal proof" },
      ],
      correctId: "b",
      explanation: "Pure LWE needed million-number matrices. MLWE groups them into polynomial blocks of 256 values — shrinking public keys from megabytes to ~1.1 KB.",
    },
  ],
  transition: [
    {
      id: "t1",
      prompt: "What does the X-Wing hybrid KEM combine?",
      choices: [
        { id: "a", label: "X25519 + ML-KEM-768" },
        { id: "b", label: "X25519 + ML-KEM-1024" },
        { id: "c", label: "P-384 + ML-KEM-768" },
        { id: "d", label: "RSA-2048 + ML-KEM-512" },
      ],
      correctId: "a",
      explanation: "X-Wing (IANA group 0x11EC) is X25519 + ML-KEM-768 — endorsed by NCSC, NSA, NIST, and the EU as the migration default.",
    },
    {
      id: "t2",
      prompt: "Which year do U.S. and EU regulators converge on for full PQC migration?",
      choices: [
        { id: "a", label: "2027" },
        { id: "b", label: "2030" },
        { id: "c", label: "2033" },
        { id: "d", label: "2035" },
      ],
      correctId: "d",
      explanation: "Critical infrastructure: 2030. Full migration: 2035. U.S. all systems target is 2033 (CNSA 2.0), with the 2035 figure being the broader Western convergence point.",
    },
    {
      id: "t3",
      prompt: "What is the first deliverable in every regulator's PQC migration plan?",
      choices: [
        { id: "a", label: "A vendor procurement contract" },
        { id: "b", label: "A cryptographic inventory (CBOM)" },
        { id: "c", label: "A risk insurance policy" },
        { id: "d", label: "An HSM upgrade order" },
      ],
      correctId: "b",
      explanation: "Discover before you migrate. You can't replace what you can't find — every framework starts with mapping every place crypto is used.",
    },
  ],
  deployment: [
    {
      id: "d1",
      prompt: "Most Chrome users today perform a hybrid TLS handshake by default. Which combination?",
      choices: [
        { id: "a", label: "X25519 + ML-KEM-768" },
        { id: "b", label: "P-256 + ML-KEM-512" },
        { id: "c", label: "RSA-4096 + ML-KEM-1024" },
        { id: "d", label: "Pure ML-KEM-768" },
      ],
      correctId: "a",
      explanation: "Chrome + Cloudflare's deployment uses X25519 + ML-KEM-768 (the X-Wing combiner). Pure-PQC isn't deployed yet — the hybrid safety net is the responsible default.",
    },
    {
      id: "d2",
      prompt: "What is the bottleneck shift for PQC vs. classical?",
      choices: [
        { id: "a", label: "CPU → memory" },
        { id: "b", label: "CPU → network bandwidth" },
        { id: "c", label: "Disk → CPU" },
        { id: "d", label: "Power → entropy" },
      ],
      correctId: "b",
      explanation: "Lattice operations are fast on modern CPUs — often faster than RSA. The new bottleneck is bandwidth: 10-15 KB handshakes vs. 2-3 KB classical.",
    },
    {
      id: "d3",
      prompt: "Why is KEMTLS interesting?",
      choices: [
        { id: "a", label: "It replaces AES with a KEM" },
        { id: "b", label: "It uses a KEM for authentication, replacing the certificate signature and shrinking the handshake" },
        { id: "c", label: "It eliminates the need for Certificate Authorities" },
        { id: "d", label: "It downgrades to classical when PQC fails" },
      ],
      correctId: "b",
      explanation: "KEMTLS replaces the handshake's signature step with a second KEM, dramatically reducing handshake byte counts because KEMs are smaller than signatures at equivalent security.",
    },
  ],
};

// 10-question capstone covering the whole path.
export const capstone: Question[] = [
  {
    id: "c1",
    prompt: "Which is the canonical asymmetric problem broken in polynomial time by Shor's algorithm?",
    choices: [
      { id: "a", label: "Boolean satisfiability" },
      { id: "b", label: "Integer factoring / discrete log" },
      { id: "c", label: "Hash preimage" },
      { id: "d", label: "Linear programming" },
    ],
    correctId: "b",
    explanation: "Shor's reduces factoring and discrete log to polynomial-time quantum operations. RSA, ECC, and Diffie-Hellman all rest on those being hard.",
  },
  {
    id: "c2",
    prompt: "By Mosca's inequality, your data class is already in trouble when…",
    choices: [
      { id: "a", label: "X + Y > Z" },
      { id: "b", label: "X > Y" },
      { id: "c", label: "Z > X + Y" },
      { id: "d", label: "Y > X + Z" },
    ],
    correctId: "a",
    explanation: "Data lifetime + migration time exceeds time-to-CRQC means harvested ciphertext can be decrypted within the data's relevant secrecy window.",
  },
  {
    id: "c3",
    prompt: "Which FIPS number is ML-DSA?",
    choices: [
      { id: "a", label: "203" },
      { id: "b", label: "204" },
      { id: "c", label: "205" },
      { id: "d", label: "206" },
    ],
    correctId: "b",
    explanation: "ML-DSA = FIPS 204. ML-KEM = 203. SLH-DSA = 205. FN-DSA (FALCON) is FIPS 206 in development.",
  },
  {
    id: "c4",
    prompt: "Why is hybrid KEM (e.g. X-Wing) the responsible default during migration?",
    choices: [
      { id: "a", label: "Hybrids are cheaper to license" },
      { id: "b", label: "An attacker must break both layers; either alone is insufficient" },
      { id: "c", label: "Hybrids reduce handshake size" },
      { id: "d", label: "Classical algorithms have been peer-reviewed longer" },
    ],
    correctId: "b",
    explanation: "Hybrid wraps the secret in both classical and PQC math. SIKE's 2022 break shows we can't yet bet everything on PQC alone.",
  },
  {
    id: "c5",
    prompt: "What was the cautionary tale of the NIST competition?",
    choices: [
      { id: "a", label: "ML-KEM was rejected" },
      { id: "b", label: "Falcon was found insecure" },
      { id: "c", label: "SIKE was broken on a laptop in 2022" },
      { id: "d", label: "NIST chose proprietary algorithms" },
    ],
    correctId: "c",
    explanation: "Castryck and Decru broke SIKE in roughly an hour on a standard laptop using classical math. It was a finalist. That's why NIST diversifies across families.",
  },
  {
    id: "c6",
    prompt: "What does CNSA 2.0 mandate for top-tier U.S. national-security signatures?",
    choices: [
      { id: "a", label: "ECDSA P-384" },
      { id: "b", label: "ML-DSA-44" },
      { id: "c", label: "ML-DSA-65" },
      { id: "d", label: "ML-DSA-87" },
    ],
    correctId: "d",
    explanation: "CNSA 2.0 mandates the highest tier: ML-KEM-1024 for key exchange and ML-DSA-87 for signatures.",
  },
  {
    id: "c7",
    prompt: "What survives quantum with just a key-size upgrade?",
    choices: [
      { id: "a", label: "RSA" },
      { id: "b", label: "ECDH" },
      { id: "c", label: "AES with a 256-bit key" },
      { id: "d", label: "ECDSA" },
    ],
    correctId: "c",
    explanation: "Grover's only halves effective symmetric key length. AES-256 keeps ~128-bit quantum security. AES-128 should be upgraded.",
  },
  {
    id: "c8",
    prompt: "What is the first step of any real PQC migration plan?",
    choices: [
      { id: "a", label: "Buy a quantum-safe HSM" },
      { id: "b", label: "Run a cryptographic inventory / CBOM" },
      { id: "c", label: "Switch everything to ML-KEM" },
      { id: "d", label: "Disable RSA" },
    ],
    correctId: "b",
    explanation: "You can't replace what you can't find. Every regulator's framework — NIST, NCSC, EU, NSM-10 — starts with discovery.",
  },
  {
    id: "c9",
    prompt: "Which protocol is hybrid PQC live in production today?",
    choices: [
      { id: "a", label: "SSH only" },
      { id: "b", label: "Chrome + Cloudflare TLS handshakes" },
      { id: "c", label: "Bitcoin signatures" },
      { id: "d", label: "DNSSEC" },
    ],
    correctId: "b",
    explanation: "Most Chrome users perform hybrid X25519 + ML-KEM-768 TLS handshakes today. Apple iMessage PQ3 and Signal PQXDH are also live in production.",
  },
  {
    id: "c10",
    prompt: "After everything you walked through, what's the most accurate statement?",
    choices: [
      { id: "a", label: "Quantum cryptography means using quantum computers to encrypt" },
      { id: "b", label: "PQC is classical software resistant to both classical and quantum attack" },
      { id: "c", label: "AES will be broken at the same time RSA is" },
      { id: "d", label: "PQC standards aren't published yet" },
    ],
    correctId: "b",
    explanation: "PQC runs on the same CPUs you have today. It's an algorithm migration, not a hardware swap. Quantum cryptography (QKD) is a different field entirely.",
  },
];
