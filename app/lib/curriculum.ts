// app/lib/curriculum.ts
// Full PQC Learning Path curriculum — 6 modules, 23 lessons

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  order: number;
  facts?: LessonFact[];        // scannable "artifact card" shown at the top
  sections: ContentSection[];
  keyTakeaways: string[];
  sources?: Source[];
}

// A single label/value pair in a lesson's top "exhibit fact card".
export interface LessonFact {
  label: string;
  value: string;
}

// A titled concept card — renders what used to be prose bullets as a scannable
// visual grid (the museum-exhibit feel).
export interface ConceptCard {
  title: string;
  body: string;
  icon?: string;               // lucide icon name
  tone?: "quantum" | "accent" | "safe" | "warning" | "danger";
}

export interface Source {
  title: string;
  url: string;
  note?: string;
}

export interface ContentSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  cards?: ConceptCard[];       // titled cards rendered as a grid
  table?: TableData;
  callout?: { type: "warning" | "info" | "key-concept"; text: string };
  diagram?: { id: string; caption?: string };
  cta?: { label: string; href: string; description?: string };
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface Module {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string; // lucide icon name
  color: string; // tailwind color class
  order: number;
  lessons: Lesson[];
  checkpoint?: Question[];
}

export interface Question {
  id: string;
  prompt: string;
  choices: { id: string; label: string; detail?: string }[];
  correctId: string;
  explanation: string;
}

export const modules: Module[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 1: CRYPTOGRAPHIC FOUNDATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "foundations",
    title: "Cryptographic Foundations",
    subtitle: "The building blocks of digital trust",
    description: "Understand why cryptography exists, how symmetric and asymmetric encryption work together, and the essential tools that protect every internet transaction.",
    icon: "Shield",
    color: "emerald",
    order: 1,
    lessons: [
      {
        id: "why-cryptography",
        title: "Why Cryptography Matters",
        subtitle: "The CIA Triad and Kerckhoffs's Principle",
        order: 1,
        facts: [
          { label: "Solves", value: "Confidentiality · Integrity · Authentication" },
          { label: "Core principle", value: "Kerckhoffs's — security lives in the key" },
          { label: "Formalized", value: "1883, by Auguste Kerckhoffs" },
          { label: "Golden rule", value: "Never invent your own crypto" },
        ],
        keyTakeaways: [
          "Cryptography solves three problems: confidentiality, integrity, and authentication (the CIA Triad)",
          "Kerckhoffs's Principle: security must depend on the key, not the secrecy of the algorithm",
          "Never invent your own cryptography — always use standard, peer-reviewed algorithms"
        ],
        sections: [
          {
            paragraphs: [
              "Cryptography is the invisible infrastructure of the digital world — the science that lets us build trust in an untrusted environment. Without it the internet could host public reading material, but never banking, shopping, or private conversation."
            ]
          },
          {
            heading: "The CIA Triad",
            paragraphs: [
              "Cryptography isn't just hiding messages. It's a toolbox for three specific problems:"
            ],
            cards: [
              { title: "Confidentiality", body: "Only authorized parties can read the data — a sealed envelope the carrier delivers but can't open.", icon: "Lock", tone: "accent" },
              { title: "Integrity", body: "The data hasn't been altered in transit — a wax seal that shows if anyone tampered with it.", icon: "ShieldCheck", tone: "safe" },
              { title: "Authentication", body: "You can prove who you're talking to — a signature or passport, origin made mathematically verifiable.", icon: "Fingerprint", tone: "quantum" },
            ],
            diagram: { id: "cia-triad", caption: "Three problems, three families of tools. Trust is where they overlap." }
          },
          {
            heading: "Kerckhoffs's Principle",
            paragraphs: [
              "In 1883 Auguste Kerckhoffs set the rule modern security still follows: a system must stay secure even if everything about it except the key is public. AES and RSA are open-source — the secrecy lives entirely in the key. Because the algorithms are public, thousands of mathematicians attack them daily, and surviving that scrutiny is what earns trust."
            ],
            callout: { type: "key-concept", text: "Never invent your own cryptography. Always use standard, public, peer-reviewed algorithms." }
          }
        ]
      },
      {
        id: "symmetric-asymmetric",
        title: "Symmetric vs. Asymmetric Encryption",
        subtitle: "Two families that protect the internet together",
        order: 2,
        keyTakeaways: [
          "Symmetric encryption uses one shared key — fast but has a key-distribution problem",
          "Asymmetric encryption uses a key pair — solves distribution but is slow",
          "The hybrid handshake combines both: asymmetric for key exchange, symmetric for data"
        ],
        sections: [
          {
            heading: "Symmetric Encryption (Same Key)",
            paragraphs: [
              "Both sender and receiver use the same secret key to lock and unlock data. The champion algorithm is AES (Advanced Encryption Standard), used by the U.S. government for Top Secret data. AES is blazing fast — modern CPUs have dedicated hardware to run it instantly — making it ideal for encrypting data at rest (hard drives) and high-volume data in transit (streaming video).",
              "Other notable symmetric ciphers include Twofish and Blowfish, used for disk encryption and high-performance applications. The fatal flaw: how do you share the key with a stranger over an open network?"
            ]
          },
          {
            heading: "Asymmetric Encryption (Two Keys)",
            paragraphs: [
              "Each user generates a mathematically linked pair: a Public Key (shared openly, used only to encrypt) and a Private Key (kept secret, used only to decrypt). Data encrypted with the Public Key can only be decrypted by the corresponding Private Key — even the Public Key itself cannot unscramble what it created.",
              "The champion algorithms are RSA, ECC (Elliptic Curve Cryptography), and Diffie-Hellman (used for secure key exchanges over insecure channels). The flaw: asymmetric math is complex and slow."
            ]
          },
          {
            heading: "The Hybrid Handshake",
            paragraphs: [
              "Every time you visit an HTTPS website, your browser performs a hybrid handshake: it uses slow asymmetric encryption (RSA/ECC) to securely exchange a temporary symmetric key, then switches to fast symmetric encryption (AES) for the rest of the session. This gives you the security of asymmetric key exchange with the speed of symmetric data encryption."
            ],
            diagram: { id: "symmetric-vs-asymmetric", caption: "Symmetric solves speed; asymmetric solves key distribution. The internet uses both." },
            callout: { type: "info", text: "This hybrid approach — asymmetric for key exchange, symmetric for bulk data — is the foundation of all internet security and is directly relevant to understanding PQC migration." }
          }
        ]
      },
      {
        id: "cipher-taxonomy",
        title: "Classical Cipher Taxonomy",
        subtitle: "Transposition, substitution, stream, and block ciphers",
        order: 3,
        keyTakeaways: [
          "Transposition ciphers rearrange character positions; substitution ciphers replace characters",
          "Stream ciphers encrypt one bit/byte at a time; block ciphers encrypt fixed-size blocks",
          "AES (block cipher) replaced DES as the standard; ChaCha20 is a modern stream cipher"
        ],
        sections: [
          {
            paragraphs: [
              "Before modern algorithms like AES, cryptography relied on classical cipher techniques that remain foundational to understanding how encryption works. These fall into two broad categories within symmetric-key cryptography."
            ]
          },
          {
            heading: "Transposition vs. Substitution",
            paragraphs: [
              "Transposition ciphers rearrange the positions of plaintext characters without changing the characters themselves. Mathematically, a bijective function maps each character's original position to a new position. The Rail Fence cipher is a classic example.",
              "Substitution ciphers replace plaintext characters with different characters according to a fixed system. The Caesar cipher — shifting each letter by a fixed number — is the simplest example; the Vigenère cipher uses a keyword to vary the shift per letter."
            ]
          },
          {
            heading: "Stream Ciphers vs. Block Ciphers",
            paragraphs: [
              "Stream ciphers encrypt one bit or byte at a time using a pseudorandom keystream. The same plaintext bit encrypted at different positions produces different ciphertext, making them ideal for real-time communication. ChaCha20 is a widely deployed modern stream cipher.",
              "Block ciphers encrypt fixed-size blocks of data (typically 128 bits). AES encrypts 128-bit blocks with key sizes of 128, 192, or 256 bits. DES (Data Encryption Standard) used 56-bit keys and was the U.S. government standard from 1977 until AES replaced it in 2001."
            ]
          }
        ]
      },
      {
        id: "three-tools",
        title: "The Three Essential Cryptographic Tools",
        subtitle: "Encryption, hashing, and digital signatures",
        order: 4,
        keyTakeaways: [
          "Encryption is two-way (reversible) — protects data in transit and at rest",
          "Hashing is one-way (irreversible) — used for password storage and file verification",
          "Digital signatures combine both to provide authentication and non-repudiation"
        ],
        sections: [
          {
            paragraphs: [
              "Cryptographic algorithms serve three primary functions — data encryption, authentication, and digital signatures — and choosing the right tool for the right job is critical. A common and dangerous mistake is using encryption to store passwords (a job that requires hashing)."
            ]
          },
          {
            heading: "Encryption (Two-Way)",
            paragraphs: [
              "Scrambles readable data (plaintext) into ciphertext using a key, with the specific intention of unscrambling it later. Encryption protects data in transit (HTTPS, messaging) and data at rest (BitLocker, FileVault). It is reversible by design."
            ]
          },
          {
            heading: "Hashing (One-Way)",
            paragraphs: [
              "A mathematical algorithm that crushes any input — a single word or a 100-gigabyte file — into a fixed-length string called a hash or digest. Crucially, hashing is irreversible: you cannot reconstruct the original data from the hash.",
              "High-quality hash algorithms like SHA-256 exhibit the avalanche effect: changing a single comma in a 500-page document produces a completely different hash. Hashing is used for password storage (websites store the hash, never the actual password) and file verification."
            ]
          },
          {
            heading: "Digital Signatures (Authentication Seal)",
            paragraphs: [
              "Combine asymmetric encryption and hashing to provide both authentication (proving identity) and non-repudiation (the sender cannot deny having signed). The signer hashes the document, then encrypts the hash with their private key. The verifier decrypts with the signer's public key and compares. If they match, the signature is valid.",
              "Digital signatures secure software updates, blockchain transactions, TLS certificates, and legal documents."
            ]
          }
        ]
      },
      {
        id: "rsa-trapdoor",
        title: "How RSA Works",
        subtitle: "The trapdoor function and computational security",
        order: 5,
        sources: [
          { title: "Rivest, Shamir, Adleman — A Method for Obtaining Digital Signatures and Public-Key Cryptosystems (1978)", url: "https://people.csail.mit.edu/rivest/Rsapaper.pdf", note: "The original RSA paper." },
          { title: "NIST SP 800-56B Rev. 2 — Pair-Wise Key-Establishment Using Integer Factorization Cryptography", url: "https://csrc.nist.gov/pubs/sp/800/56/b/r2/final", note: "Current NIST guidance on RSA-based key establishment." },
        ],
        keyTakeaways: [
          "RSA's security rests on the difficulty of factoring the product of two large primes",
          "The public key is published openly; the private key is derived from knowing the prime factors",
          "RSA keys must grow larger as computers get faster — from 512 bits (1990s) to 2048-4096 bits today"
        ],
        sections: [
          {
            heading: "The Trapdoor Function",
            paragraphs: [
              "RSA, created in 1977 by Rivest, Shamir, and Adleman, relies on a trapdoor function — a math problem that is easy to compute in one direction but virtually impossible to reverse without a secret.",
              "The trapdoor in RSA is prime number factorization: multiplying two massive prime numbers (P and Q) together is trivial, but factoring the result (N) back into P and Q is computationally infeasible. The public key (N, e) is published openly; the private key (d) is derived from knowing P and Q."
            ],
            diagram: { id: "rsa-trapdoor", caption: "Easy one way, infeasible the other. Until Shor's." }
          },
          {
            heading: "Computational vs. Information-Theoretic Security",
            paragraphs: [
              "Almost the entire modern internet is only computationally secure. This means the lock can be picked; it just takes a ridiculously long time. RSA relies on the extreme difficulty of factoring massive prime numbers. ECC relies on reverse-engineering a point on an elliptic curve.",
              "Brute-forcing a 2048-bit RSA key would require a supercomputer guessing millions of times per second for a period longer than the age of the universe. We deemed them 'unbreakable' — but that assumption rested on the rules of computing never changing."
            ],
            callout: { type: "warning", text: "This assumption — that computing rules never change — is exactly what quantum computers threaten. The entire crisis of post-quantum cryptography flows from this single point." }
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 2: MODERN CRYPTOGRAPHY IN ACTION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "modern-crypto",
    title: "Modern Cryptography in Action",
    subtitle: "ECC, TLS, and the systems we trust today",
    description: "Learn how Elliptic Curve Cryptography powers mobile security, how TLS handshakes protect every web connection, and why these systems are the primary quantum targets.",
    icon: "Globe",
    color: "blue",
    order: 2,
    lessons: [
      {
        id: "elliptic-curves",
        title: "Elliptic Curve Cryptography",
        subtitle: "The geometry powering modern security",
        order: 1,
        keyTakeaways: [
          "ECC replaces RSA's prime factoring with operations on mathematical curves (y² = x³ + ax + b)",
          "A 256-bit ECC key equals a 3072-bit RSA key in security — 10× smaller",
          "ECC powers Bitcoin, TLS handshakes, Signal, and iMessage"
        ],
        sections: [
          {
            paragraphs: [
              "By the late 2000s, the smartphone revolution exposed a fundamental limitation of RSA. A standard RSA key of 2048 bits drained batteries, slowed browsing, and consumed excessive memory on mobile devices. The answer was found not in prime numbers, but in geometry."
            ]
          },
          {
            heading: "The ECC Trapdoor: Point Addition",
            paragraphs: [
              "ECC replaces RSA's prime-number factoring with operations on a specific type of mathematical curve defined by y² = x³ + ax + b. The trapdoor is a geometric process called point addition — like a game of billiards on a strangely shaped table.",
              "Starting from an agreed-upon point, you draw a line, find where it intersects the curve, and reflect across the x-axis. Repeating this process causes the point to bounce wildly. A computer can calculate the endpoint after millions of bounces in milliseconds, but given only the start and end points, there is no shortcut to determine how many bounces occurred. This is the Elliptic Curve Discrete Logarithm Problem (ECDLP)."
            ]
          },
          {
            heading: "The Key Size Advantage",
            paragraphs: [
              "A 256-bit ECC key provides the same security as a 3072-bit RSA key — roughly 10× smaller. This means less data transmitted, less CPU power consumed, and longer battery life for mobile devices and IoT sensors."
            ]
          },
          {
            heading: "Where ECC Is Used Today",
            bullets: [
              "Cryptocurrency: Bitcoin and Ethereum use the secp256k1 curve for wallet signatures",
              "Web Browsing: TLS handshakes use ECDHE for session key establishment",
              "Secure Messaging: Signal, WhatsApp, and iMessage use ECC for identity and encryption"
            ]
          },
          {
            heading: "ECC's Quantum Vulnerability",
            paragraphs: [
              "Shor's algorithm can solve the ECDLP almost effortlessly — experts predict quantum computers will break ECC easier and faster than RSA. The ultimate shield built for the mobile era is fundamentally vulnerable to the next era of computing."
            ],
            callout: { type: "warning", text: "ECC's quantum vulnerability is a primary driver of the hybrid transition strategy. The very efficiency that made ECC revolutionary makes it the easiest target for quantum attack." }
          }
        ]
      },
      {
        id: "tls-certificates",
        title: "TLS, HTTPS & Certificates",
        subtitle: "How internet security actually works",
        order: 2,
        sources: [
          { title: "RFC 8446 — The Transport Layer Security (TLS) Protocol Version 1.3", url: "https://www.rfc-editor.org/rfc/rfc8446", note: "The current TLS standard." },
          { title: "Cloudflare — Defending against future threats: Cloudflare goes post-quantum", url: "https://blog.cloudflare.com/post-quantum-for-all/", note: "Production hybrid PQC TLS deployment." },
          { title: "draft-ietf-tls-hybrid-design — Hybrid key exchange in TLS 1.3", url: "https://datatracker.ietf.org/doc/draft-ietf-tls-hybrid-design/", note: "IETF draft for X-Wing and hybrid KEM combiners." },
        ],
        keyTakeaways: [
          "TLS handshakes use asymmetric crypto in two critical places quantum computers can attack",
          "Certificate Authorities form a chain of trust verified by your browser's Root Store",
          "If a quantum computer forges a CA's private key, the entire trust model collapses"
        ],
        sections: [
          {
            heading: "The Man-in-the-Middle Problem",
            paragraphs: [
              "In the early internet, data traveled as plaintext. HTTPS added encryption, but encryption alone does not solve identity. A hacker intercepting your browser's request for a bank's public key can substitute their own — this is a Man-in-the-Middle (MITM) attack."
            ]
          },
          {
            heading: "Digital Certificates and Certificate Authorities",
            paragraphs: [
              "Certificate Authorities (CAs) — DigiCert, GlobalSign, Let's Encrypt — verify website identities and issue certificates signed with the CA's private key. Your browser ships with a Root Store containing ~100 trusted CA public keys. Trust flows downward: browser trusts CA, CA vouches for website."
            ]
          },
          {
            heading: "The TLS Handshake: Step by Step",
            bullets: [
              "Step 1 — Client Hello: Browser announces supported algorithms and sends a random number",
              "Step 2 — Server Hello & Certificate: Server selects algorithms and sends its certificate",
              "Step 3 — Verification & Key Exchange: Browser verifies certificate, generates a session key, encrypts it with server's public key",
              "Step 4 — Switch to Symmetric: Server decrypts the session key. Both sides share the same key",
              "Step 5 — Secure Data Transfer: All subsequent communication uses fast AES encryption"
            ],
            diagram: { id: "tls-handshake", caption: "Two asymmetric messages set the stage; the rest of the session runs on symmetric speed." }
          },
          {
            heading: "Why TLS Is the Ultimate Quantum Target",
            paragraphs: [
              "The TLS handshake relies on asymmetric cryptography in two critical places: the CA's digital signature on the certificate, and the key exchange that transports the session key. If a quantum computer can reverse-engineer the CA's private key, it can forge perfect certificates for any website. Browsers would show green padlocks for attacker-controlled servers. The entire chain of trust would evaporate."
            ],
            callout: { type: "warning", text: "This is the 'quantum apocalypse' scenario — not just breaking one connection, but collapsing the entire trust infrastructure of the internet." },
            cta: { label: "See the handshake break in TLS Theater", href: "/atlas/tls-theater?step=3&attacker=1", description: "Pre-loaded at step 3 with the quantum attacker on. Toggle hybrid PQC and watch it hold." }
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 3: THE QUANTUM THREAT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "quantum-threat",
    title: "The Quantum Threat",
    subtitle: "Why everything changes",
    description: "Understand how quantum computers work, why Shor's algorithm breaks RSA and ECC, what Store Now Decrypt Later means, and how the threat timeline is collapsing faster than predicted.",
    icon: "Atom",
    color: "red",
    order: 3,
    lessons: [
      {
        id: "quantum-computing",
        title: "How Quantum Computers Break Cryptography",
        subtitle: "Qubits, superposition, and Shor's Algorithm",
        order: 1,
        sources: [
          { title: "Shor — Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer (1997)", url: "https://arxiv.org/abs/quant-ph/9508027", note: "The original Shor's algorithm paper." },
          { title: "Grover — A fast quantum mechanical algorithm for database search (1996)", url: "https://arxiv.org/abs/quant-ph/9605043", note: "The original Grover's algorithm paper." },
        ],
        keyTakeaways: [
          "Qubits use superposition and entanglement to hold exponentially many states simultaneously",
          "Quantum algorithms use interference to amplify correct answers and cancel wrong ones",
          "Shor's Algorithm breaks RSA and ECC by finding hidden mathematical patterns"
        ],
        sections: [
          {
            heading: "Bits vs. Qubits",
            paragraphs: [
              "Classical computers run on bits — light switches that are either 0 or 1. Quantum computers use qubits that exist in superposition — holding the probability of being both 0 and 1 simultaneously. When qubits are linked through entanglement, their power scales exponentially: 300 qubits hold more states than there are atoms in the observable universe."
            ]
          },
          {
            heading: "Interference: The Real Mechanism",
            paragraphs: [
              "Quantum computers don't crack codes by 'trying every password at once.' Measuring qubits in superposition gives random garbage. Instead, quantum algorithms use interference — choreographing qubits so wrong answers cancel out (destructive interference) while the correct answer amplifies (constructive interference)."
            ]
          },
          {
            heading: "Shor's Algorithm",
            paragraphs: [
              "In 1994, Peter Shor proved a quantum computer could find the hidden mathematical structure behind RSA and ECC without brute force. Shor's algorithm exploits the fact that prime factoring is tied to finding hidden repeating patterns — exactly what quantum interference excels at. A classical computer takes trillions of years to factor RSA-2048; a quantum computer could do it in minutes."
            ]
          },
          {
            heading: "Grover's Algorithm and Symmetric Crypto",
            paragraphs: [
              "Grover's algorithm speeds up brute-force searches but only halves the effective key length. The fix is simple: upgrade AES-128 to AES-256 and SHA-256 to SHA-384/512. Symmetric tools survive quantum with minor upgrades. The real crisis is entirely in asymmetric cryptography."
            ],
            callout: { type: "key-concept", text: "Shor's breaks asymmetric crypto completely. Grover's only weakens symmetric crypto, which is easily fixed by doubling key sizes. This distinction is fundamental to understanding PQC." }
          }
        ]
      },
      {
        id: "hardware-timeline",
        title: "The Quantum Hardware Race & Q-Day",
        subtitle: "Engineering reality and the collapsing timeline",
        order: 2,
        keyTakeaways: [
          "Current quantum computers have hundreds of noisy qubits; breaking RSA needs millions of error-corrected ones",
          "Resource estimates have collapsed 20× in six years — from 20M qubits to under 1M",
          "AI-assisted cryptanalysis may expose vulnerabilities before a CRQC even exists"
        ],
        sections: [
          {
            heading: "The Engineering Reality",
            paragraphs: [
              "Qubits are extremely fragile. A microscopic temperature fluctuation causes decoherence (data loss). Quantum processors run in dilution refrigerators near absolute zero. Current machines have hundreds of noisy qubits; breaking RSA-2048 requires millions of stable, error-corrected ones. Most experts estimate 10–15 years to Q-Day."
            ]
          },
          {
            heading: "The Hardware Race",
            paragraphs: [
              "IBM unveiled its 120-qubit Nighthawk chip in late 2025, targeting fault-tolerance by 2029. PsiQuantum pursues photonic qubits. Neutral-atom platforms demonstrate control over thousands of qubits. Each advancement shortens the timeline."
            ]
          },
          {
            heading: "Collapsing Resource Estimates",
            bullets: [
              "Gidney (May 2025): RSA-2048 revised from 20M to under 1M noisy qubits — 20× reduction in six years",
              "Iceberg Quantum (Feb 2026): Quantum LDPC codes suggest RSA-2048 tractable with <100K physical qubits",
              "Google/Stanford (Mar 2026): ECDLP-256 breakable with <500K qubits in minutes",
              "Caltech–Berkeley–Oratomic (Mar 2026): Neutral-atom designs estimate Shor's with 10K–20K atomic qubits"
            ]
          },
          {
            heading: "The AI-Accelerated Threat",
            paragraphs: [
              "AI-assisted cryptanalysis is compressing the cost of finding implementation flaws. Cryptographic code is small, well-bounded, with crisp correctness criteria — exactly what AI excels at scrutinizing. Anthropic's Project Glasswing deploys AI to find zero-days across critical software in partnership with Google, Microsoft, NVIDIA, and Palo Alto Networks."
            ],
            callout: { type: "warning", text: "Harvested ciphertext may become decryptable before a CRQC exists, through classical implementation flaws discovered at AI-assisted scale." }
          }
        ]
      },
      {
        id: "store-now-decrypt-later",
        title: "Store Now, Decrypt Later",
        subtitle: "Why we must act now, not when quantum arrives",
        order: 3,
        sources: [
          { title: "Mosca — Cybersecurity in an era with quantum computers: will we be ready? (2018)", url: "https://eprint.iacr.org/2015/1075.pdf", note: "Where Mosca's inequality was formalized." },
          { title: "EU NIS Cooperation Group — Roadmap on the transition to post-quantum cryptography (2025)", url: "https://digital-strategy.ec.europa.eu/en/library/nis-cooperation-group-publishes-roadmap-transition-post-quantum-cryptography", note: "EU recognition that HNDL is 'likely occurring already now.'" },
        ],
        keyTakeaways: [
          "Adversaries are actively intercepting and storing encrypted data today for future quantum decryption",
          "Mosca's Inequality: if data lifetime + migration time > time to CRQC, you've already failed",
          "Three colliding timelines make delay catastrophic: data shelf-life, embedded systems, migration duration"
        ],
        sections: [
          {
            paragraphs: [
              "Intelligence agencies and state-sponsored hackers are actively intercepting and storing encrypted communications today — military blueprints, diplomatic cables, corporate secrets. The data is currently unreadable, but when a CRQC is built, they will decrypt everything retroactively. This is Store Now, Decrypt Later (SNDL)."
            ]
          },
          {
            heading: "Mosca's Inequality",
            paragraphs: [
              "If X + Y > Z, you have already failed for that data class — where X is how long data must stay confidential, Y is migration timeline, and Z is time until a CRQC. For data needing 25+ years of secrecy, the math is already dire."
            ]
          },
          {
            heading: "Three Colliding Timelines",
            bullets: [
              "Data Shelf-Life: Medical records and military secrets need 25–50 years of confidentiality. A CRQC in 15 years exposes data encrypted today.",
              "Embedded Systems: Satellites, smart grids, and vehicles have RSA/ECC hardcoded into silicon with 20-year lifespans. They cannot be easily patched.",
              "The Migration Marathon: The last major cryptographic upgrade took nearly two decades. Waiting for Q-Day means arriving decades too late."
            ],
            callout: { type: "warning", text: "The EU's NIS Coop Group has recognized that HNDL attacks are 'likely occurring already now.' This is not a future threat — it is a present-day reality." },
            cta: { label: "Try Mosca's slider with a medical-record preset", href: "/atlas/mosca?preset=medical", description: "Slide X (30y), Y (5y), Z (15y) and read the verdict in real time." }
          }
        ]
      },
      {
        id: "what-breaks",
        title: "What Breaks vs. What Survives",
        subtitle: "A clear impact map for every cryptographic tool",
        order: 4,
        keyTakeaways: [
          "All asymmetric cryptography (RSA, ECC, DH, digital signatures) is completely broken by Shor's",
          "Symmetric cryptography (AES) and hashing (SHA) survive with key-size upgrades",
          "Blockchain wallet signatures are forgeable — ownership collapses without PQC migration"
        ],
        sections: [
          {
            paragraphs: [
              "When a CRQC is built, the internet's cryptographic tools divide cleanly into two categories. The asymmetric layer — key exchange, signatures, identity — is completely broken. The symmetric layer — bulk encryption and hashing — survives with minor upgrades."
            ],
            table: {
              headers: ["Category", "Examples", "Quantum Impact", "Action Required"],
              rows: [
                ["Asymmetric Encryption", "RSA, ECC, Diffie-Hellman", "Completely broken (Shor's)", "Replace with PQC"],
                ["Digital Signatures", "RSA-PSS, ECDSA, EdDSA", "Completely broken — forged signatures", "Replace with ML-DSA / SLH-DSA"],
                ["Key Exchanges", "TLS (ECDHE, RSA transport)", "All past & future sessions exposed", "Deploy hybrid or pure PQC KEM"],
                ["Symmetric Encryption", "AES-128, AES-256", "Grover's halves key length", "Upgrade AES-128 → AES-256"],
                ["Hashing", "SHA-256, SHA-512", "Modest speedup only", "Upgrade to SHA-384 / SHA-512"],
                ["Blockchain", "Bitcoin/Ethereum wallets", "Signatures forgeable", "Migrate to PQC signatures"]
              ]
            }
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 4: POST-QUANTUM SOLUTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "pqc-solutions",
    title: "Post-Quantum Solutions",
    subtitle: "The new math protecting the future internet",
    description: "Explore the five families of PQC algorithms, understand Learning With Errors, and see how ML-KEM and ML-DSA actually work under the hood.",
    icon: "Lock",
    color: "violet",
    order: 4,
    lessons: [
      {
        id: "what-is-pqc",
        title: "What is Post-Quantum Cryptography?",
        subtitle: "Clearing myths and understanding quantum-safe math",
        order: 1,
        keyTakeaways: [
          "PQC is software running on normal CPUs — not quantum hardware",
          "Quantum-safe means brute force is the only attack, even for a quantum computer",
          "PQC keys are much larger than classical keys, creating engineering challenges"
        ],
        sections: [
          {
            heading: "Clearing the Biggest Myth",
            paragraphs: [
              "Post-Quantum Cryptography (PQC) does not mean using a quantum computer to encrypt. There are two distinct fields: Quantum Cryptography (hardware — shooting photons for QKD) and Post-Quantum Cryptography (software — new math algorithms on normal silicon CPUs). PQC is simply an upgrade to existing mathematical libraries."
            ]
          },
          {
            heading: "What Makes Math 'Quantum-Safe'",
            paragraphs: [
              "For an algorithm to be post-quantum, brute force must be the only way to break it, even with a quantum computer. If forced to guess one-by-one, a quantum computer takes billions of years — just like a classical one."
            ]
          },
          {
            heading: "The Goldilocks Problem",
            paragraphs: [
              "A viable PQC algorithm must be: (1) hard for classical computers, (2) hard for quantum computers, and (3) light enough for a smartphone to compute in milliseconds. PQC keys are often tens of thousands of bits vs. 256 bits for ECC — creating real bandwidth challenges."
            ],
            diagram: { id: "byte-sizes", caption: "Logarithmic scale. The bandwidth jump is the real cost of the migration." }
          }
        ]
      },
      {
        id: "five-families",
        title: "The Five Families of PQC",
        subtitle: "Diversification as a defense strategy",
        order: 2,
        keyTakeaways: [
          "NIST standardized algorithms from multiple math families so a breakthrough against one doesn't compromise all",
          "Lattice-based (ML-KEM, ML-DSA), hash-based (SLH-DSA), and code-based (HQC) are the primary families",
          "SIKE (isogeny-based) was broken in 2022, proving diversification is essential"
        ],
        sections: [
          {
            paragraphs: [
              "NIST deliberately standardized algorithms from multiple mathematical families so that a breakthrough against one does not compromise the entire ecosystem. For twenty years, the internet relied on a single mathematical basket. Cryptographers building PQC recognized they could not repeat that mistake."
            ],
            table: {
              headers: ["Family", "Algorithm", "FIPS", "Job", "Status"],
              rows: [
                ["Lattice", "ML-KEM (Kyber)", "FIPS 203", "Key Exchange (KEM)", "Chrome/Cloudflare live; Apple PQ3; Signal"],
                ["Lattice", "ML-DSA (Dilithium)", "FIPS 204", "Digital Signatures", "OpenSSL/BoringSSL; CNSA 2.0"],
                ["Hash", "SLH-DSA (SPHINCS+)", "FIPS 205", "Signatures (backup)", "Standardized; backup if lattice breaks"],
                ["Code", "HQC", "Pending", "KEM (non-lattice backup)", "Selected Mar 2025; Meta co-authored"],
                ["Code", "Classic McEliece", "Under eval.", "Static KEM", "1+ MB keys; high-security static use"],
                ["Isogeny", "SIKE (broken)", "None", "N/A", "Broken 2022 on desktop in ~1 hour"]
              ]
            }
          }
        ]
      },
      {
        id: "learning-with-errors",
        title: "Learning With Errors (LWE)",
        subtitle: "The mathematical foundation of PQC",
        order: 3,
        keyTakeaways: [
          "LWE adds intentional random noise to solvable equations, making them NP-Hard even for quantum computers",
          "Pure LWE had a fatal flaw: million-number matrices made keys several megabytes",
          "MLWE solved the size problem by grouping numbers into polynomial modules — keys shrink to ~1,100 bytes"
        ],
        sections: [
          {
            heading: "Adding Intentional Noise",
            paragraphs: [
              "In 2005, Oded Regev proposed taking easily solvable equations and corrupting each with tiny random errors. The errors are minuscule — like adding random pennies to restaurant bills — but compound into mathematical chaos. Finding the secret variables requires simultaneously guessing every error — a problem proven NP-Hard."
            ],
            diagram: { id: "lattice-lwe", caption: "Same grid. With noise, even quantum interference loses the signal." }
          },
          {
            heading: "The File Size Crisis",
            paragraphs: [
              "Pure LWE required matrices of 1,000 × 1,000 numbers — one million numbers per public key, several megabytes in size. Far too large for the modern internet."
            ]
          },
          {
            heading: "MLWE: Polynomial Compression",
            paragraphs: [
              "MLWE groups numbers into structured polynomial blocks of 256 values each. Because of their structure, only a few blocks need to be transmitted. Public keys shrink from megabytes to ~1,100 bytes — fitting in a standard internet packet.",
              "The modular design enables ML-KEM's scalability tiers: ML-KEM-512 (2×2 grid, AES-128 equivalent), ML-KEM-768 (3×3, AES-192), and ML-KEM-1024 (4×4, AES-256). Increasing security means adding one more module — no code rewrites."
            ],
            callout: { type: "key-concept", text: "MLWE is the mathematical engine powering both ML-KEM (key exchange) and ML-DSA (signatures) — the two primary NIST PQC standards." }
          }
        ]
      },
      {
        id: "ml-kem",
        title: "How ML-KEM (Kyber) Works",
        subtitle: "The key encapsulation mechanism protocol",
        order: 4,
        sources: [
          { title: "NIST FIPS 203 — Module-Lattice-Based Key-Encapsulation Mechanism Standard", url: "https://csrc.nist.gov/pubs/fips/203/final", note: "The official ML-KEM standard." },
          { title: "CRYSTALS-Kyber project", url: "https://pq-crystals.org/kyber/", note: "Reference implementation and design rationale." },
        ],
        keyTakeaways: [
          "ML-KEM transports a 256-bit symmetric key — it doesn't encrypt data directly",
          "Three steps: key generation (add noise), encapsulation (add more noise), decapsulation (cancel noise with trapdoor)",
          "Scalability tiers: ML-KEM-512/768/1024 for standard/high/top-secret security"
        ],
        sections: [
          {
            paragraphs: [
              "ML-KEM is a Key Encapsulation Mechanism — its sole job is to securely transport a small 256-bit symmetric key between two parties. Actual data encryption uses AES-256-GCM."
            ]
          },
          {
            heading: "The Three-Step Handshake",
            bullets: [
              "Step 1 — Key Generation: Server generates a private key (clean lattice matrix) and public key (same matrix + MLWE noise). Noisy public key sent to client.",
              "Step 2 — Encapsulation: Client generates a random 256-bit key, mixes it into the noisy public key, adds more noise. Result is pure chaos to observers.",
              "Step 3 — Decapsulation: Server applies private key (the mathematical trapdoor), cancels all noise layers, recovers the clean symmetric key."
            ]
          },
          {
            heading: "Scalability Tiers",
            bullets: [
              "ML-KEM-512: 2×2 module matrix — fastest, standard security (AES-128 equivalent)",
              "ML-KEM-768: 3×3 matrix — high security (AES-192), used in X-Wing hybrid",
              "ML-KEM-1024: 4×4 matrix — top-secret tier (AES-256), CNSA 2.0 mandate"
            ]
          }
        ]
      },
      {
        id: "ml-dsa",
        title: "How ML-DSA (Dilithium) Works",
        subtitle: "Quantum-safe digital signatures",
        order: 5,
        sources: [
          { title: "NIST FIPS 204 — Module-Lattice-Based Digital Signature Standard", url: "https://csrc.nist.gov/pubs/fips/204/final", note: "The official ML-DSA standard." },
          { title: "NIST FIPS 205 — Stateless Hash-Based Digital Signature Standard", url: "https://csrc.nist.gov/pubs/fips/205/final", note: "SLH-DSA — the conservative hash-based backup." },
          { title: "CRYSTALS-Dilithium project", url: "https://pq-crystals.org/dilithium/", note: "Reference implementation." },
        ],
        keyTakeaways: [
          "ML-DSA shares MLWE math with ML-KEM — one library powers both",
          "Fiat-Shamir with Aborts proves private key knowledge without revealing it",
          "Signatures are ~2,420 bytes vs. ~64 bytes classical — inflating TLS handshakes to 10–15 KB"
        ],
        sections: [
          {
            heading: "Sister Algorithms",
            paragraphs: [
              "Kyber and Dilithium share the CRYSTALS prefix and the same MLWE engine. One optimized library powers both key exchange and signatures — saving code space and reducing complexity."
            ]
          },
          {
            heading: "Fiat-Shamir with Aborts",
            bullets: [
              "Commitment: Signer chooses a random lattice point",
              "Challenge: Derived from the document + commitment",
              "Noise: Massive lattice noise obscures the private key relationship",
              "Response: Verifiable against public key without revealing private key",
              "Abort: If noise accidentally reveals the key relationship, the algorithm discards and retries"
            ]
          },
          {
            heading: "The Size Trade-Off",
            paragraphs: [
              "Classical ECDSA: ~64 bytes. ML-DSA-44: ~2,420 bytes. TLS handshakes inflate from 2–3 KB to 10–15 KB. Acceptable for laptops, potentially problematic for constrained IoT devices."
            ]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 5: THE TRANSITION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "transition",
    title: "The Transition",
    subtitle: "Hybrid strategies and migration frameworks",
    description: "Learn the hybrid approach to PQC deployment, NIST's standardization process, global regulatory deadlines, and Meta's enterprise migration framework.",
    icon: "ArrowRightLeft",
    color: "amber",
    order: 5,
    lessons: [
      {
        id: "hybrid-strategy",
        title: "The Hybrid Transition Strategy",
        subtitle: "Why we deploy both classical and PQC simultaneously",
        order: 1,
        sources: [
          { title: "draft-connolly-tls-mlkem-key-agreement — Hybrid X25519+ML-KEM-768 for TLS 1.3", url: "https://datatracker.ietf.org/doc/draft-tls-westerbaan-xyber768d00/", note: "IETF X-Wing draft." },
          { title: "Castryck, Decru — An efficient key recovery attack on SIDH (2022)", url: "https://eprint.iacr.org/2022/975", note: "The classical attack that broke SIKE — the reason a hybrid safety net matters." },
        ],
        keyTakeaways: [
          "Hybrid wraps data in both a classical and PQC lock — if either is broken, the other survives",
          "X-Wing (X25519 + ML-KEM-768) is the endorsed hybrid KEM",
          "SIKE's 2022 failure proves why relying on PQC alone would be premature"
        ],
        sections: [
          {
            paragraphs: [
              "Because PQC algorithms are mathematically young (~decade vs. 40 years for RSA), the industry deploys hybrid cryptography — both a classical and PQC lock simultaneously. If PQC is broken, classical holds; if classical falls to quantum, PQC survives.",
              "X-Wing (X25519 + ML-KEM-768) combines classical ECDH with NIST's primary lattice standard. Endorsed by NCSC, NSA, NIST, and the EU as the responsible default during migration.",
              "SIKE's 2022 failure — a NIST finalist broken on a desktop in an hour — underscores why a classical safety net remains essential."
            ]
          }
        ]
      },
      {
        id: "nist-process",
        title: "The NIST Standardization Process",
        subtitle: "Eight years of global competition",
        order: 2,
        keyTakeaways: [
          "NIST ran an 8-year global competition starting in 2016 to prevent internet fragmentation",
          "FIPS 203 (ML-KEM), 204 (ML-DSA), 205 (SLH-DSA) finalized August 2024",
          "HQC selected March 2025 as a non-lattice backup KEM"
        ],
        sections: [
          {
            paragraphs: [
              "To prevent fragmentation — Apple inventing one math, Google another — NIST ran a worldwide competition. Over eight years, submissions faced brutal peer review. SIKE was the most dramatic casualty, shattered in 2022.",
              "August 2024: FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA) published. March 2025: HQC selected as a fifth algorithm — a code-based KEM providing a non-lattice backup. Additional algorithms remain under evaluation."
            ]
          }
        ]
      },
      {
        id: "global-regulation",
        title: "Global Regulatory Convergence",
        subtitle: "2030 and 2035: the deadlines everyone agrees on",
        order: 3,
        sources: [
          { title: "NSA — Announcing the Commercial National Security Algorithm Suite 2.0", url: "https://media.defense.gov/2022/Sep/07/2003071834/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS_.PDF", note: "CNSA 2.0 mandates ML-KEM-1024 and ML-DSA-87." },
          { title: "NIST IR 8547 — Transition to Post-Quantum Cryptography Standards", url: "https://csrc.nist.gov/pubs/ir/8547/ipd", note: "U.S. federal PQC transition timeline." },
          { title: "UK NCSC — Timelines for migration to post-quantum cryptography", url: "https://www.ncsc.gov.uk/guidance/pqc-migration-timelines", note: "UK three-phase plan." },
        ],
        keyTakeaways: [
          "Major regulators converge on 2030 for critical infrastructure, 2035 for full migration",
          "Every regulator requires cryptographic inventory as the first deliverable",
          "The EU recognizes HNDL as 'likely occurring already now'"
        ],
        sections: [
          {
            paragraphs: [
              "Major Western regulators have converged on two deadlines: 2030 for critical infrastructure and 2035 for full migration."
            ],
            table: {
              headers: ["Jurisdiction", "Key Mandates", "Timeline"],
              rows: [
                ["United States (NIST/NSA)", "FIPS 203–205; NIST IR 8547; CNSA 2.0", "Firmware 2030. All systems 2033. Full migration 2035."],
                ["United States (Exec.)", "NSM-10; OMB M-23-02; EO 14144 (TLS 1.3)", "Federal TLS 1.3 by Jan 2030"],
                ["United Kingdom", "Three-phase NCSC migration plan", "Discovery to 2028. High priority 2028–2031. Complete 2031–2035."],
                ["European Union", "NIS2 PQC mandate; HNDL 'likely now'", "Critical by 2030. All by 2035."],
                ["Others", "UAE, Australia ASD, Singapore MAS, HK HKMA", "Converging on 2030–2035"]
              ]
            },
            cta: { label: "Scrub to 2030 on the threat timeline", href: "/atlas/timeline?filter=regulation&year=2030", description: "Cursor pre-set to 2030 with the regulation filter active." }
          }
        ]
      },
      {
        id: "meta-framework",
        title: "Enterprise Migration: Meta's Framework",
        subtitle: "A practical playbook for any organization",
        order: 4,
        keyTakeaways: [
          "Meta's 5-level maturity model: PQ-Unaware → PQ-Aware → PQ-Ready → PQ-Hardened → PQ-Enabled",
          "Six-step strategy: Prioritize → Inventory → Dependencies → Design → Guardrails → Integrate",
          "Four principles: effectiveness, timeliness, performance, cost efficiency"
        ],
        sections: [
          {
            heading: "PQC Maturity Levels",
            bullets: [
              "PQ-Unaware: Not aware of quantum threat — most vulnerable",
              "PQ-Aware: Assessment completed, no protections designed",
              "PQ-Ready: Solution implemented, not yet in production",
              "PQ-Hardened: All available protections deployed, some gaps",
              "PQ-Enabled: Full quantum protection — the ultimate goal"
            ]
          },
          {
            heading: "The Six-Step Strategy",
            bullets: [
              "Step 1 — Prioritize: Classify by risk (High: SNDL-vulnerable; Medium: online attack targets; Low: symmetric-only)",
              "Step 2 — Inventory: Map all cryptographic usage with automated discovery + developer reporting",
              "Step 3 — Dependencies: Identify blockers (NIST/IETF standards, HSM support, LibOQS readiness)",
              "Step 4 — Design: Select ML-KEM for key exchange, ML-DSA for signatures. Prefer ML-KEM-768.",
              "Step 5 — Guardrails: Block new quantum-vulnerable keys in build systems",
              "Step 6 — Integrate: Deploy hybrid approach. Meta prioritizes classical safety net."
            ]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 6: REAL-WORLD DEPLOYMENT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "deployment",
    title: "Real-World Deployment",
    subtitle: "PQC in production today",
    description: "See which platforms have already deployed PQC, explore the 5G Core case study with real performance data, and understand the developer migration challenges ahead.",
    icon: "Rocket",
    color: "cyan",
    order: 6,
    lessons: [
      {
        id: "deployment-status",
        title: "Who's Already Using PQC",
        subtitle: "Chrome, Signal, Apple, Meta, and more",
        order: 1,
        keyTakeaways: [
          "Most Chrome users are already performing PQC handshakes via X25519 + ML-KEM-768",
          "Signal, Apple iMessage, and Meta have deployed PQC in production messaging",
          "OpenSSL and BoringSSL have integrated ML-KEM and ML-DSA"
        ],
        sections: [
          {
            paragraphs: [
              "PQC is not a future technology — it is deployed in production today across some of the world's largest platforms."
            ],
            table: {
              headers: ["Platform", "Implementation", "Notes"],
              rows: [
                ["Chrome + Cloudflare", "Hybrid TLS (X25519 + ML-KEM-768)", "Live — most Chrome users doing PQC"],
                ["Apple iMessage", "PQ3 protocol (ML-KEM)", "Deployed across iOS/macOS"],
                ["Signal", "PQXDH protocol (ML-KEM)", "PQC key exchange in production"],
                ["Meta", "Hybrid PQC internally", "ML-KEM + ML-DSA across infrastructure"],
                ["BoringSSL / OpenSSL", "ML-KEM + ML-DSA integrated", "Backend for Chrome, Android, most servers"],
                ["LibOQS (PQCA)", "Open-source PQC library", "Linux Foundation; Meta contributes"],
                ["Certificate Authorities", "Testing ML-DSA for TLS certs", "Let's Encrypt, GlobalSign"]
              ]
            }
          }
        ]
      },
      {
        id: "5g-case-study",
        title: "PQC in Telecommunications: 5G Core",
        subtitle: "Lab-validated performance in real network infrastructure",
        order: 2,
        keyTakeaways: [
          "5G Core's PKI-dependent architecture makes it uniquely quantum-vulnerable",
          "Hybrid PQC adds only ~2.7% median latency overhead in lab testing",
          "KEMTLS could further reduce overhead by replacing signatures with KEMs"
        ],
        sections: [
          {
            paragraphs: [
              "The 5G Core (5GC) represents a critical PQC deployment target. Unlike previous mobile generations using SIM-based symmetric auth, 5GC is cloud-native with microservices communicating via TLS and OAuth 2.0 — making it uniquely quantum-vulnerable."
            ]
          },
          {
            heading: "Lab-Validated Performance",
            paragraphs: [
              "A 2026 study tested hybrid PQC in an open5gs/liboqs testbed with 10 essential Network Functions. Hybrid KEMs tested included BIKE and FrodoKEM combined with ECC; hybrid signatures included Falcon, ML-DSA, and SPHINCS+ combined with ECC or RSA."
            ],
            table: {
              headers: ["Metric", "Conventional", "Hybrid PQC", "Change"],
              rows: [
                ["Median UE Setup", "257 ms", "264 ms", "+2.7%"],
                ["99th Percentile", "505 ms", "669 ms", "+32.5%"],
                ["SBI Data Rate", "111.0 KB/s", "114.8 KB/s", "+3.4%"]
              ]
            }
          },
          {
            heading: "Key Conclusion",
            paragraphs: [
              "The 5G Core can technically support PQC without substantial impact on usability, computational overhead, or message size. The hybrid strategy endorsed for web and enterprise is equally viable for telecom infrastructure."
            ]
          }
        ]
      },
      {
        id: "developer-migration",
        title: "Developer Migration Considerations",
        subtitle: "PQC is not a drop-in replacement",
        order: 3,
        keyTakeaways: [
          "Database schemas, network MTU limits, IoT RAM constraints, and key hierarchies all need updating",
          "The bottleneck shifts from CPU (RSA's big-integer math) to network bandwidth (larger PQC keys)",
          "KEMTLS is a promising mitigation for TLS handshake inflation"
        ],
        sections: [
          {
            paragraphs: [
              "PQC fundamentally changes the physical properties of security systems. Migration requires careful planning across every layer of the stack."
            ],
            bullets: [
              "Database schemas: VARCHAR(255) for keys must accommodate 1,000+ byte PQC keys",
              "Network fragmentation: PQC keys may exceed 1,500-byte MTU, requiring packet fragmentation",
              "IoT constraints: 8–16 KB RAM devices struggle with 1,200-byte keys and 2.4 KB signatures",
              "Key hierarchy trap: AES-256 at rest is safe, but the asymmetric layers wrapping those keys are exposed",
              "CPU → network shift: PQC lattice math is faster than RSA on modern CPUs; bandwidth becomes the bottleneck",
              "Embedded systems: Satellites and smart grids with 20-year lifespans need quantum-safe chips now",
              "TLS inflation: Certificate chains inflate handshakes to 10–15 KB (vs. 2–3 KB classical)",
              "KEMTLS mitigation: Replaces handshake signatures with KEMs, significantly reducing overhead",
              "Cryptographic inventory: Map all crypto usage before migrating — combine automated discovery with developer reporting",
              "PQC guardrails: Block new quantum-vulnerable keys in build systems and update internal guidelines"
            ]
          }
        ]
      }
    ]
  }
];

export function getModule(id: string): Module | undefined {
  return modules.find(m => m.id === id);
}

export function getLesson(moduleId: string, lessonId: string): { module: Module; lesson: Lesson } | undefined {
  const mod = getModule(moduleId);
  if (!mod) return undefined;
  const lesson = mod.lessons.find(l => l.id === lessonId);
  if (!lesson) return undefined;
  return { module: mod, lesson };
}

export function getNextLesson(moduleId: string, lessonId: string): { moduleId: string; lessonId: string } | null {
  const mod = getModule(moduleId);
  if (!mod) return null;
  const idx = mod.lessons.findIndex(l => l.id === lessonId);
  if (idx < mod.lessons.length - 1) {
    return { moduleId, lessonId: mod.lessons[idx + 1].id };
  }
  // Move to next module
  const modIdx = modules.findIndex(m => m.id === moduleId);
  if (modIdx < modules.length - 1) {
    const nextMod = modules[modIdx + 1];
    return { moduleId: nextMod.id, lessonId: nextMod.lessons[0].id };
  }
  return null;
}

export function getPrevLesson(moduleId: string, lessonId: string): { moduleId: string; lessonId: string } | null {
  const mod = getModule(moduleId);
  if (!mod) return null;
  const idx = mod.lessons.findIndex(l => l.id === lessonId);
  if (idx > 0) {
    return { moduleId, lessonId: mod.lessons[idx - 1].id };
  }
  const modIdx = modules.findIndex(m => m.id === moduleId);
  if (modIdx > 0) {
    const prevMod = modules[modIdx - 1];
    return { moduleId: prevMod.id, lessonId: prevMod.lessons[prevMod.lessons.length - 1].id };
  }
  return null;
}

export function getTotalLessons(): number {
  return modules.reduce((sum, m) => sum + m.lessons.length, 0);
}

export function getLessonIndex(moduleId: string, lessonId: string): number {
  let idx = 0;
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (mod.id === moduleId && lesson.id === lessonId) return idx;
      idx++;
    }
  }
  return -1;
}
