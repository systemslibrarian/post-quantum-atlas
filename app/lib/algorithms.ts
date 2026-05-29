// app/lib/algorithms.ts
// Canonical PQC algorithm reference, sourced from RefDoc.md sections 7–11 and 16.
// Used by the /atlas/toolkit interactive cards.

export type AlgorithmFamily = "lattice" | "hash" | "code" | "multivariate" | "isogeny";
export type AlgorithmRole = "kem" | "signature";
export type AlgorithmStatus =
  | "standardized"   // FIPS published
  | "in-development" // FIPS draft, expected
  | "selected"       // chosen by NIST, not yet FIPS
  | "under-evaluation"
  | "broken"
  | "niche";

export interface AlgorithmSize {
  label: string;
  bytes?: number;
}

export interface Algorithm {
  id: string;
  name: string;            // ML-KEM
  aka?: string;            // CRYSTALS-Kyber
  family: AlgorithmFamily;
  role: AlgorithmRole | "none"; // SIKE has no role anymore
  fips?: string;           // "FIPS 203"
  status: AlgorithmStatus;
  coreMath: string;
  whyItWon: string;
  tradeoff: string;
  sizes: AlgorithmSize[];
  deployment: string;
  variants?: string[];     // ML-KEM-512 / 768 / 1024
  refDocAnchor: string;    // section number in RefDoc.md
  tag?: string;            // optional short badge text (e.g., "Primary KEM")
  codeSamples?: CodeSample[];
}

export interface CodeSample {
  language: "bash" | "python" | "javascript" | "rust" | "go";
  label?: string;          // tab label override (default: language)
  description?: string;
  code: string;
}

export const algorithms: Algorithm[] = [
  {
    id: "ml-kem",
    name: "ML-KEM",
    aka: "CRYSTALS-Kyber",
    family: "lattice",
    role: "kem",
    fips: "FIPS 203",
    status: "standardized",
    coreMath: "MLWE — noisy multi-dimensional grids; both sides add noise.",
    whyItWon: "Faster than ECC with scalable security tiers (512/768/1024 = 2×2/3×3/4×4 module grids).",
    tradeoff: "Public keys are ~1,184 B vs. 32 B for X25519, but still fit a 1,500 B MTU.",
    sizes: [
      { label: "Public key", bytes: 1184 },
      { label: "Ciphertext", bytes: 1088 },
      { label: "Shared secret", bytes: 32 },
    ],
    deployment: "Chrome + Cloudflare hybrid TLS (live), Apple PQ3, Signal PQXDH, BoringSSL, OpenSSL.",
    variants: ["ML-KEM-512", "ML-KEM-768", "ML-KEM-1024"],
    refDocAnchor: "§10",
    tag: "Primary KEM",
    codeSamples: [
      {
        language: "bash",
        description: "OpenSSL 3 + oqs-provider hybrid TLS handshake.",
        code: `# Generate an X-Wing (X25519 + ML-KEM-768) keypair via oqs-provider.
openssl genpkey -algorithm x25519_mlkem768 -out hybrid.key

# Inspect the resulting key.
openssl pkey -in hybrid.key -noout -text

# Curl a hybrid-enabled origin.
curl -v --curves x25519_mlkem768 https://pq.cloudflareresearch.com/`,
      },
      {
        language: "python",
        description: "Encapsulate / decapsulate ML-KEM-768 with the official liboqs binding.",
        code: `from oqs import KeyEncapsulation  # pip install oqs

with KeyEncapsulation("ML-KEM-768") as kem:
    public_key = kem.generate_keypair()
    # Sender uses the public key to encapsulate a shared secret.
    ciphertext, shared_send = kem.encap_secret(public_key)
    # Receiver decapsulates with the same KEM object (holds the private key).
    shared_recv = kem.decap_secret(ciphertext)

assert shared_send == shared_recv
print("shared secret bytes:", len(shared_send))  # 32`,
      },
      {
        language: "javascript",
        description: "Hybrid handshake from Node via the oqs-provider OpenSSL plugin.",
        code: `import { execSync } from "node:child_process";

// Requires OpenSSL 3 + oqs-provider in your environment.
const pub = execSync(
  "openssl genpkey -algorithm x25519_mlkem768 -outform PEM"
).toString();
console.log(pub);

// In browsers, prefer your TLS stack's hybrid support (Chrome ships X-Wing).
// For raw KEM in JS, use \`mlkem\` from @noble/post-quantum.`,
      },
    ],
  },
  {
    id: "ml-dsa",
    name: "ML-DSA",
    aka: "CRYSTALS-Dilithium",
    family: "lattice",
    role: "signature",
    fips: "FIPS 204",
    status: "standardized",
    coreMath: "MLWE — sister to ML-KEM; one library powers both.",
    whyItWon: "Fast verification; ideal for TLS certs and server auth at internet scale.",
    tradeoff: "Signatures ~2,420 B vs. ~64 B classical; inflates TLS handshakes to 10–15 KB.",
    sizes: [
      { label: "Signature (ML-DSA-44)", bytes: 2420 },
      { label: "Public key (ML-DSA-44)", bytes: 1312 },
    ],
    deployment: "OpenSSL / BoringSSL integrated. CNSA 2.0 mandates ML-DSA-87 for U.S. national security systems.",
    variants: ["ML-DSA-44", "ML-DSA-65", "ML-DSA-87"],
    refDocAnchor: "§11",
    tag: "Primary signature",
    codeSamples: [
      {
        language: "bash",
        description: "Generate an ML-DSA-65 keypair and self-sign a test certificate.",
        code: `# Requires OpenSSL 3 + oqs-provider configured in openssl.cnf.
openssl req -new -x509 -newkey mldsa65 \\
  -keyout mldsa65.key -out mldsa65.crt \\
  -nodes -days 365 \\
  -subj "/CN=pq-atlas.test"

openssl x509 -in mldsa65.crt -noout -text | grep "Signature Algorithm"`,
      },
      {
        language: "python",
        description: "Sign and verify with the official liboqs Python binding.",
        code: `from oqs import Signature  # pip install oqs

message = b"For all who eat or drink..."

with Signature("ML-DSA-65") as signer:
    public_key = signer.generate_keypair()
    signature = signer.sign(message)
    assert len(signature) <= 3309  # ML-DSA-65 sig size

with Signature("ML-DSA-65") as verifier:
    ok = verifier.verify(message, signature, public_key)
    assert ok`,
      },
      {
        language: "javascript",
        description: "Verify an ML-DSA-65 signature with @noble/post-quantum.",
        code: `// npm install @noble/post-quantum
import { ml_dsa65 } from "@noble/post-quantum/ml-dsa";

const { secretKey, publicKey } = ml_dsa65.keygen();

const msg = new TextEncoder().encode("hello PQC");
const sig = ml_dsa65.sign(secretKey, msg);
const ok  = ml_dsa65.verify(publicKey, msg, sig);

console.log("verified:", ok, "sig bytes:", sig.length);`,
      },
    ],
  },
  {
    id: "slh-dsa",
    name: "SLH-DSA",
    aka: "SPHINCS+",
    family: "hash",
    role: "signature",
    fips: "FIPS 205",
    status: "standardized",
    coreMath: "Merkle trees + hash functions — entirely different math from lattices.",
    whyItWon: "Survives if lattice math breaks. Built only from well-understood hash primitives.",
    tradeoff: "Much larger signatures (~7–50 KB) and slower generation than lattice signatures.",
    sizes: [
      { label: "Signature (small)", bytes: 7856 },
      { label: "Signature (fast)", bytes: 17088 },
    ],
    deployment: "Standardized as a conservative backup. LMS/XMSS (SP 800-208) used for code and firmware signing.",
    refDocAnchor: "§11.6",
    tag: "Conservative backup",
    codeSamples: [
      {
        language: "bash",
        description: "Generate an SLH-DSA-SHA2-128f keypair via oqs-provider.",
        code: `openssl genpkey -algorithm sphincssha2128fsimple -out slhdsa.key
openssl pkey -in slhdsa.key -noout -text

# Sign and verify a file.
openssl dgst -sign slhdsa.key -out msg.sig msg.txt
openssl dgst -verify slhdsa.pub -signature msg.sig msg.txt`,
      },
      {
        language: "python",
        description: "Sign + verify SLH-DSA-128f with the official liboqs binding.",
        code: `from oqs import Signature

with Signature("SPHINCS+-SHA2-128f-simple") as signer:
    pk = signer.generate_keypair()
    sig = signer.sign(b"firmware update v3.8")

with Signature("SPHINCS+-SHA2-128f-simple") as verifier:
    assert verifier.verify(b"firmware update v3.8", sig, pk)`,
      },
    ],
  },
  {
    id: "fn-dsa",
    name: "FN-DSA",
    aka: "FALCON",
    family: "lattice",
    role: "signature",
    fips: "FIPS 206 (draft)",
    status: "in-development",
    coreMath: "NTRU lattices with Fast-Fourier sampling.",
    whyItWon: "Smallest lattice signatures — useful where bandwidth is tight.",
    tradeoff: "Floating-point signing is tricky to implement safely; smaller deployment surface than ML-DSA.",
    sizes: [
      { label: "Signature (FALCON-512)", bytes: 666 },
      { label: "Public key (FALCON-512)", bytes: 897 },
    ],
    deployment: "FIPS 206 in development. Complements ML-DSA for bandwidth-constrained signing.",
    refDocAnchor: "§8",
    tag: "Compact signature",
  },
  {
    id: "hqc",
    name: "HQC",
    family: "code",
    role: "kem",
    fips: "Pending",
    status: "selected",
    coreMath: "Error-correcting codes (Hamming Quasi-Cyclic).",
    whyItWon: "Provides a non-lattice KEM. If lattice math falls, HQC survives.",
    tradeoff: "Larger ciphertexts than ML-KEM; moderate performance.",
    sizes: [
      { label: "Public key (HQC-128)", bytes: 2249 },
      { label: "Ciphertext (HQC-128)", bytes: 4481 },
    ],
    deployment: "Selected by NIST in March 2025 for standardization. Meta cryptographers are co-authors.",
    refDocAnchor: "§8",
    tag: "Non-lattice backup",
  },
  {
    id: "classic-mceliece",
    name: "Classic McEliece",
    family: "code",
    role: "kem",
    fips: "Under consideration",
    status: "under-evaluation",
    coreMath: "Error-correcting codes (binary Goppa).",
    whyItWon: "Unbroken since 1978 — the longest track record of any PQC candidate.",
    tradeoff: "Public keys exceed 1 MB. Too large for the open web or mobile.",
    sizes: [
      { label: "Public key (mceliece348864)", bytes: 261120 },
      { label: "Public key (mceliece6960119)", bytes: 1047319 },
    ],
    deployment: "Suited for static high-security environments (e.g. long-lived embedded systems).",
    refDocAnchor: "§8",
    tag: "Static / high-security",
  },
  {
    id: "multivariate",
    name: "Multivariate schemes",
    family: "multivariate",
    role: "signature",
    status: "niche",
    coreMath: "Systems of polynomial equations (NP-hard in the general case).",
    whyItWon: "Potential for ultra-small signatures useful in constrained IoT.",
    tradeoff: "Many submissions broken during NIST competition. No standard winner.",
    sizes: [{ label: "Varies", bytes: undefined }],
    deployment: "No NIST standard. Research-stage / niche use only.",
    refDocAnchor: "§8",
  },
  {
    id: "sike",
    name: "SIKE",
    family: "isogeny",
    role: "none",
    status: "broken",
    coreMath: "Bridges between elliptic curves (Supersingular Isogeny Key Encapsulation).",
    whyItWon: "Had the smallest keys of any PQC family — a structural advantage.",
    tradeoff: "Broken on a standard desktop in ~1 hour (Castryck–Decru, 2022). A cautionary tale.",
    sizes: [{ label: "N/A (withdrawn)" }],
    deployment: "Withdrawn. Demonstrates why NIST diversified across mathematical families.",
    refDocAnchor: "§8, §19",
    tag: "Cautionary tale",
  },
];

export const familyLabels: Record<AlgorithmFamily, string> = {
  lattice: "Lattice",
  hash: "Hash",
  code: "Code",
  multivariate: "Multivariate",
  isogeny: "Isogeny",
};

export const roleLabels: Record<AlgorithmRole | "none", string> = {
  kem: "Key exchange (KEM)",
  signature: "Digital signature",
  none: "—",
};

export const statusLabels: Record<AlgorithmStatus, string> = {
  "standardized": "Standardized",
  "in-development": "FIPS in development",
  "selected": "Selected (FIPS pending)",
  "under-evaluation": "Under evaluation",
  "broken": "Broken",
  "niche": "Niche / research",
};

export function getAlgorithm(id: string): Algorithm | undefined {
  return algorithms.find(a => a.id === id);
}
