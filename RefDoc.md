# Post-Quantum Cryptography — Reference Document

**NIST Standards, Algorithm Families, Deployment Status, Regulatory Landscape & Threat Timeline**

*Companion to "From Caesar to Post-Quantum: Building a Three-Tier Cryptography Education Portfolio" — Code4Lib Journal*

**Paul Clark** — IT Librarian & Application Systems Analyst
Leon County Public Library • Tallahassee, Florida
paul@systemslibrarian.dev • github.com/systemslibrarian

*May 2026 • Version 3.8*

---

# Table of Contents

- [1. Cryptographic Foundations: Why Cryptography Matters](#1-cryptographic-foundations-why-cryptography-matters)
  - [1.1 The CIA Triad](#11-the-cia-triad)
  - [1.2 Kerckhoffs’s Principle](#12-kerckhoffss-principle)
  - [1.3 Symmetric vs. Asymmetric Encryption](#13-symmetric-vs-asymmetric-encryption)
  - [1.4 Classical Cipher Taxonomy](#14-classical-cipher-taxonomy)
  - [1.5 The Three Essential Cryptographic Tools](#15-the-three-essential-cryptographic-tools)
  - [1.6 How RSA Works: The Trapdoor Function](#16-how-rsa-works-the-trapdoor-function)
  - [1.7 Computational vs. Information-Theoretic Security](#17-computational-vs-information-theoretic-security)
- [2. Elliptic Curve Cryptography: The Geometry Powering Modern Security](#2-elliptic-curve-cryptography-the-geometry-powering-modern-security)
  - [2.1 From Numbers to Shapes](#21-from-numbers-to-shapes)
  - [2.2 The ECC Trapdoor: Point Addition](#22-the-ecc-trapdoor-point-addition)
  - [2.3 ECC Key Generation](#23-ecc-key-generation)
  - [2.4 The Key Size Advantage](#24-the-key-size-advantage)
  - [2.5 Where ECC Is Used Today](#25-where-ecc-is-used-today)
  - [2.6 ECC’s Quantum Vulnerability](#26-eccs-quantum-vulnerability)
- [3. How Internet Security Works: TLS, HTTPS & Certificates](#3-how-internet-security-works-tls-https--certificates)
  - [3.1 The Man-in-the-Middle Problem](#31-the-man-in-the-middle-problem)
  - [3.2 Digital Certificates: The Digital Passport](#32-digital-certificates-the-digital-passport)
  - [3.3 Certificate Authorities and the Chain of Trust](#33-certificate-authorities-and-the-chain-of-trust)
  - [3.4 The TLS Handshake: Step by Step](#34-the-tls-handshake-step-by-step)
  - [3.5 Why TLS Is the Ultimate Quantum Target](#35-why-tls-is-the-ultimate-quantum-target)
- [4. The Quantum Threat: How Quantum Computers Break Cryptography](#4-the-quantum-threat-how-quantum-computers-break-cryptography)
  - [4.1 Bits vs. Qubits](#41-bits-vs-qubits)
  - [4.2 Interference: The Real Mechanism](#42-interference-the-real-mechanism)
  - [4.3 Shor’s Algorithm](#43-shors-algorithm)
  - [4.4 Grover’s Algorithm and Symmetric Cryptography](#44-grovers-algorithm-and-symmetric-cryptography)
  - [4.5 The Engineering Reality](#45-the-engineering-reality)
  - [4.6 The Quantum Hardware Race](#46-the-quantum-hardware-race)
  - [4.7 The Wrong Axis: Why Qubit Counts Don’t Predict Q-Day](#47-the-wrong-axis-why-qubit-counts-dont-predict-q-day)
- [5. Store Now, Decrypt Later: Why We Must Act Now](#5-store-now-decrypt-later-why-we-must-act-now)
  - [5.1 The Y2Q Urgency](#51-the-y2q-urgency)
  - [5.2 The HNDL Counterpoint: Plaintext Leaks Before Ciphertext Breaks](#52-the-hndl-counterpoint-plaintext-leaks-before-ciphertext-breaks)
  - [5.3 Why Perfect Forward Secrecy Does Not Survive the Transition](#53-why-perfect-forward-secrecy-does-not-survive-the-transition)
  - [5.4 Information Half-Life: Which Harvested Data Still Matters Later](#54-information-half-life-which-harvested-data-still-matters-later)
- [6. What is Post-Quantum Cryptography?](#6-what-is-post-quantum-cryptography)
  - [6.1 Clearing the Biggest Myth](#61-clearing-the-biggest-myth)
  - [6.2 What Makes Math “Quantum-Safe”](#62-what-makes-math-quantum-safe)
  - [6.3 The Goldilocks Engineering Problem](#63-the-goldilocks-engineering-problem)
  - [6.4 PQC vs. QKD: Two Ideas That Are Not Interchangeable](#64-pqc-vs-qkd-two-ideas-that-are-not-interchangeable)
  - [6.5 “Quantum-Safe” Is a Present-Tense Judgment, Not a Permanent Certificate](#65-quantum-safe-is-a-present-tense-judgment-not-a-permanent-certificate)
- [7. The Five Families of Post-Quantum Cryptography](#7-the-five-families-of-post-quantum-cryptography)
- [8. PQC Algorithm Reference Table](#8-pqc-algorithm-reference-table)
- [9. Learning With Errors: The Mathematical Foundation of PQC](#9-learning-with-errors-the-mathematical-foundation-of-pqc)
  - [9.1 The Baseline: Systems of Linear Equations](#91-the-baseline-systems-of-linear-equations)
  - [9.2 LWE: Adding Intentional Noise](#92-lwe-adding-intentional-noise)
  - [9.3 The File Size Crisis: Pure LWE’s Fatal Flaw](#93-the-file-size-crisis-pure-lwes-fatal-flaw)
  - [9.4 MLWE: Compressing the Math with Polynomial Modules](#94-mlwe-compressing-the-math-with-polynomial-modules)
  - [9.5 Why Modules Enable Developer Scalability](#95-why-modules-enable-developer-scalability)
- [10. How ML-KEM (Kyber) Works: The KEM Protocol](#10-how-ml-kem-kyber-works-the-kem-protocol)
  - [10.1 The Three-Step Handshake](#101-the-three-step-handshake)
  - [10.2 Scalability Tiers](#102-scalability-tiers)
- [11. How ML-DSA (CRYSTALS-Dilithium) Works: Quantum-Safe Digital Signatures](#11-how-ml-dsa-crystals-dilithium-works-quantum-safe-digital-signatures)
  - [11.1 The Relationship Between Kyber and Dilithium](#111-the-relationship-between-kyber-and-dilithium)
  - [11.2 Core Mechanism: Fiat-Shamir with Aborts](#112-core-mechanism-fiat-shamir-with-aborts)
  - [11.3 The Abort Mechanic: Preventing Information Leaks](#113-the-abort-mechanic-preventing-information-leaks)
  - [11.4 The Signature Size Trade-Off](#114-the-signature-size-trade-off)
  - [11.5 Deployment Targets](#115-deployment-targets)
  - [11.6 Companion Scheme: How SLH-DSA (SPHINCS+) Works](#116-companion-scheme-how-slh-dsa-sphincs-works)
  - [11.7 Signatures That Must Outlive Their Own Cryptography: Audit Trails](#117-signatures-that-must-outlive-their-own-cryptography-audit-trails)
- [12. The Hybrid Transition Strategy](#12-the-hybrid-transition-strategy)
- [13. The Collapsing Threat Timeline](#13-the-collapsing-threat-timeline)
  - [13.1 Mosca’s Inequality](#131-moscas-inequality)
  - [13.2 Collapsing Resource Estimates](#132-collapsing-resource-estimates)
  - [13.3 The AI-Accelerated Threat](#133-the-ai-accelerated-threat)
- [14. Quantum Impact Reference: What Breaks vs. What Survives](#14-quantum-impact-reference-what-breaks-vs-what-survives)
  - [14.1 A Closer Look: Which Zero-Knowledge Proof Systems Survive](#141-a-closer-look-which-zero-knowledge-proof-systems-survive)
  - [14.2 A Closer Look: Blockchain at Q-Day (Bitcoin and Ethereum)](#142-a-closer-look-blockchain-at-q-day-bitcoin-and-ethereum)
  - [14.3 A Closer Look: Fully Homomorphic Encryption on the “Survives” Side](#143-a-closer-look-fully-homomorphic-encryption-on-the-survives-side)
- [15. Global Regulatory Convergence](#15-global-regulatory-convergence)
  - [15.1 Europe’s Digital-Identity Mandate Meets a Certification Bottleneck](#151-europes-digital-identity-mandate-meets-a-certification-bottleneck)
- [16. Real-World Deployment Status](#16-real-world-deployment-status)
  - [16.1 Post-Quantum Defaults Have Arrived in Everyday Tools](#161-post-quantum-defaults-have-arrived-in-everyday-tools)
- [17. PQC in Telecommunications: The 5G Core Case Study](#17-pqc-in-telecommunications-the-5g-core-case-study)
  - [17.1 Why 5G Is Especially Vulnerable](#171-why-5g-is-especially-vulnerable)
  - [17.2 Lab-Validated Performance Impact](#172-lab-validated-performance-impact)
  - [17.3 Performance Results](#173-performance-results)
  - [17.4 Implications for PQC Migration](#174-implications-for-pqc-migration)
  - [17.5 Future Directions: KEMTLS and IPsec](#175-future-directions-kemtls-and-ipsec)
- [18. Developer Migration Considerations](#18-developer-migration-considerations)
  - [18.1 When Probability Becomes a Side-Channel](#181-when-probability-becomes-a-side-channel)
  - [18.2 Cryptographic Bills of Materials (CBOMs): Operationalizing Inventory](#182-cryptographic-bills-of-materials-cboms-operationalizing-inventory)
  - [18.3 Cryptographic Agility: Where the Algorithm Lives Decides How Hard Migration Is](#183-cryptographic-agility-where-the-algorithm-lives-decides-how-hard-migration-is)
  - [18.4 Configuration Is Not Negotiation: Wire-Level PQC Verification](#184-configuration-is-not-negotiation-wire-level-pqc-verification)
  - [18.5 The Cost of Keys and Signatures: A Sizing Lens for Algorithm Choice](#185-the-cost-of-keys-and-signatures-a-sizing-lens-for-algorithm-choice)
  - [18.6 A Quieter Corner: Is Format-Preserving Encryption Quantum-Safe?](#186-a-quieter-corner-is-format-preserving-encryption-quantum-safe)
- [19. The NIST Standardization Process](#19-the-nist-standardization-process)
- [20. Enterprise PQC Migration: Meta’s Framework](#20-enterprise-pqc-migration-metas-framework)
  - [20.1 PQC Maturity Levels](#201-pqc-maturity-levels)
  - [20.2 The Six-Step Migration Strategy](#202-the-six-step-migration-strategy)
  - [20.3 Key Takeaways for Any Organization](#203-key-takeaways-for-any-organization)
  - [20.4 Estimating the Effort: From Open-Ended Migration to a Countable Number](#204-estimating-the-effort-from-open-ended-migration-to-a-countable-number)
- [21. Sources](#21-sources)

---

# 1. Cryptographic Foundations: Why Cryptography Matters

Cryptography is the invisible infrastructure of the modern digital world. It is the science that allows us to build trust in an untrusted environment. Without it, the internet would be a digital library—useful for reading public information, but impossible for banking, shopping, or private conversation.

## 1.1 The CIA Triad

Modern cryptography is not simply the art of hiding messages. It is a toolbox used to solve three specific problems, known as the CIA Triad:

**Confidentiality (Secrecy):** Ensure that information is accessible only to those authorized to have access. The analogy is a sealed envelope—the mail carrier handles it, but cannot read the contents.

**Integrity (Tamper-Proofing):** Ensure that data has not been changed or corrupted during transit. The analogy is a wax seal—if the seal is broken, the recipient knows someone tampered with the message.

**Authentication (Identity):** Confirm the identity of the person or system you are communicating with. The analogy is a signature or passport—a mathematical way to prove origin.

## 1.2 Kerckhoffs’s Principle

In 1883, Dutch cryptographer Auguste Kerckhoffs formulated a principle that defines modern security: a cryptosystem should be secure even if everything about the system, except the key, is public knowledge. The algorithms used to secure bank accounts (AES, RSA) are publicly available and open-source. Security lies entirely in the key—a specific string of random numbers—not in the secrecy of the algorithm. Because algorithms are public, thousands of mathematicians try to break them every day; surviving this scrutiny is what earns trust.

**Takeaway:** Never invent your own cryptography. Always use standard, public, peer-reviewed algorithms.

## 1.3 Symmetric vs. Asymmetric Encryption

Modern cryptography uses two fundamentally different families that work together to secure the internet:

**Symmetric Encryption (Same Key):** Both sender and receiver use the same secret key to lock and unlock data. The champion algorithm is AES (Advanced Encryption Standard), used by the U.S. government for Top Secret data. AES is blazing fast—modern CPUs have dedicated hardware to run it instantly—making it ideal for encrypting data at rest (hard drives) and high-volume data in transit (streaming video). Other notable symmetric ciphers include Twofish and Blowfish, used for disk encryption and high-performance applications. The fatal flaw: how do you share the key with a stranger over an open network?

**Asymmetric Encryption (Two Keys):** Each user generates a mathematically linked pair: a Public Key (shared openly, used only to encrypt) and a Private Key (kept secret, used only to decrypt). Data encrypted with the Public Key can only be decrypted by the corresponding Private Key—even the Public Key itself cannot unscramble what it created. The champion algorithms are RSA, ECC (Elliptic Curve Cryptography), and Diffie-Hellman (used for secure key exchanges over insecure channels). The flaw: asymmetric math is complex and slow.

**The Hybrid Handshake:** Every time you visit an HTTPS website, your browser performs a hybrid handshake: it uses slow asymmetric encryption (RSA/ECC) to securely exchange a temporary symmetric key, then switches to fast symmetric encryption (AES) for the rest of the session. This gives you the security of asymmetric key exchange with the speed of symmetric data encryption.

## 1.4 Classical Cipher Taxonomy

Before modern algorithms like AES, cryptography relied on classical cipher techniques that remain foundational to understanding how encryption works. These fall into two broad categories within symmetric-key cryptography:

**Transposition Ciphers:** Rearrange the positions of plaintext characters without changing the characters themselves. The plaintext letters are shuffled according to a regular system—mathematically, a bijective function maps each character’s original position to a new position. The key determines the reordering pattern. For example, the Rail Fence cipher writes the message in a zigzag pattern across rows and reads off each row sequentially.

**Substitution Ciphers:** Replace plaintext characters with different characters according to a fixed system. The units may be single letters (monoalphabetic), pairs (digraphs), or larger groups. The Caesar cipher—shifting each letter by a fixed number—is the simplest example; the Vigenère cipher uses a keyword to vary the shift per letter.

Modern symmetric algorithms are further divided by how they process data:

**Stream Ciphers:** Encrypt one bit or byte at a time using a pseudorandom keystream generated from the secret key. The same plaintext bit encrypted at different positions produces different ciphertext, making stream ciphers ideal for real-time communication (voice, video). ChaCha20 is a widely deployed modern stream cipher.

**Block Ciphers:** Encrypt fixed-size blocks of data (typically 128 bits) using a deterministic algorithm and a symmetric key. AES, the reigning standard, encrypts 128-bit blocks with key sizes of 128, 192, or 256 bits. An earlier block cipher, DES (Data Encryption Standard), used 56-bit keys and was the U.S. government standard from 1977 until AES replaced it in 2001. Block ciphers operate using pseudorandom permutation (PRP) families—functions that cannot be distinguished from truly random permutations—and are considered reliable until proven otherwise.

## 1.5 The Three Essential Cryptographic Tools

Cryptographic algorithms serve three primary functions—data encryption, authentication, and digital signatures—and choosing the right tool for the right job is critical. A common and dangerous mistake is using encryption to store passwords (a job that requires hashing). The three core tools are:

**Encryption (Two-Way):** Scrambles readable data (plaintext) into ciphertext using a key, with the specific intention of unscrambling it later. Encryption protects data in transit (HTTPS, messaging) and data at rest (BitLocker, FileVault). It is reversible by design.

**Hashing (One-Way):** A mathematical algorithm that crushes any input—a single word or a 100-gigabyte file—into a fixed-length string of characters called a hash or digest. Crucially, hashing is irreversible: you cannot reconstruct the original data from the hash. High-quality hash algorithms like SHA-256 exhibit the avalanche effect: changing a single comma in a 500-page document produces a completely different hash. Hashing is used for password storage (websites store the hash, never the actual password) and file verification (comparing hashes proves a download was not corrupted or injected with malware).

**Digital Signatures (Authentication Seal):** Combine asymmetric encryption and hashing to provide both authentication (proving identity) and non-repudiation (the sender cannot deny having signed). The signer hashes the document, then encrypts the hash with their private key to create the signature. The verifier decrypts the signature with the signer’s public key and compares the result to a fresh hash of the document. If they match, the signature is valid—proving both who sent it and that nothing was altered. Digital signatures secure software updates, blockchain transactions, TLS certificates, and legal documents.

## 1.6 How RSA Works: The Trapdoor Function

RSA, created in 1977 by Rivest, Shamir, and Adleman, relies on a trapdoor function—a math problem that is easy to compute in one direction but virtually impossible to reverse without a secret. The trapdoor in RSA is prime number factorization: multiplying two massive prime numbers (P and Q) together is trivial, but factoring the result (N) back into P and Q is computationally infeasible. The public key (N, e) is published openly; the private key (d) is derived from knowing P and Q. Because a hacker only knows N, they cannot determine P and Q, and therefore cannot compute d. However, RSA keys must grow larger as computers get faster—from 512 bits in the 1990s to 2048 or 4096 bits today—making RSA increasingly heavy for modern mobile devices.

## 1.7 Computational vs. Information-Theoretic Security

Almost the entire modern internet is only computationally secure. This means the lock can be picked; it just takes a ridiculously long time. RSA relies on the extreme difficulty of factoring massive prime numbers. ECC relies on the extreme difficulty of reverse-engineering a point on an elliptic curve. These algorithms assume that a hacker must use brute force—guessing the answer, checking if it works, and trying again. Brute-forcing a 2048-bit RSA key would require a supercomputer guessing millions of times per second for a period longer than the age of the universe. We deemed them “unbreakable”—but that assumption rested on the rules of computing never changing.

# 2. Elliptic Curve Cryptography: The Geometry Powering Modern Security

By the late 2000s, the smartphone revolution exposed a fundamental limitation of RSA. A standard RSA key of 2048 bits—a number so massive it would take pages to write out—drained batteries, slowed browsing, and consumed excessive memory on mobile devices. The industry needed asymmetric cryptography that was radically lighter, faster, and more efficient. The answer was found not in prime numbers, but in geometry.

## 2.1 From Numbers to Shapes

Elliptic Curve Cryptography (ECC) replaces the prime-number factoring of RSA with operations on a specific type of mathematical curve defined by the equation y² = x³ + ax + b. The critical visual property of this curve is horizontal symmetry: the top half is a perfect mirror image of the bottom half across the x-axis. This simple geometric property of symmetry is the engine that drives ECC.

## 2.2 The ECC Trapdoor: Point Addition

Like RSA, ECC requires a trapdoor function—easy to compute forward, impossible to reverse. In ECC, the trapdoor is a geometric process called point addition, which works like a game of billiards on a strangely shaped table. Starting from an agreed-upon point on the curve, you draw a line (a tangent), find where it intersects the curve, and reflect that intersection point across the x-axis. Repeating this process—shoot, hit the curve, reflect—causes the ball to bounce wildly across the graph.

The security lies in the irreversibility: a computer that knows the starting point can calculate the endpoint after millions of bounces in milliseconds (the forward direction). But given only the starting point and the final resting point, there is no mathematical shortcut to determine how many bounces occurred. The only option is to manually replay every bounce one by one. This irreversible geometric puzzle is the Elliptic Curve Discrete Logarithm Problem (ECDLP).

## 2.3 ECC Key Generation

Generating keys in ECC is elegantly simple. The Private Key is the number of times the point was bounced—a massive, random number kept secret on the device. The Public Key is the final resting coordinate of the point on the curve—shared openly. Because of the ECDLP trapdoor, hackers cannot reverse-engineer the coordinate to discover the bounce count.

## 2.4 The Key Size Advantage

Because the ECDLP is fundamentally harder to solve than RSA’s integer factorization, ECC achieves equivalent security with dramatically smaller keys. A 256-bit ECC key provides the same security level as a 3072-bit RSA key—roughly 10 times smaller. Smaller keys mean less data transmitted over networks, dramatically less CPU power for encryption and decryption, and significantly longer battery life for mobile devices and IoT sensors.

## 2.5 Where ECC Is Used Today

- **Cryptocurrency:** Bitcoin and Ethereum exclusively use the secp256k1 elliptic curve for wallet address generation and transaction signing.

- **Modern Web Browsing:** TLS handshakes use ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) to establish symmetric session keys.

- **Secure Messaging:** Signal, WhatsApp, and Apple iMessage use elliptic curves for identity verification and end-to-end encryption.

## 2.6 ECC’s Quantum Vulnerability

ECC is elegant, fast, and currently unbreakable by any classical supercomputer. However, its compact 256-bit key size becomes a liability against quantum computers. Shor’s algorithm can solve the ECDLP almost effortlessly—in fact, experts predict that a quantum computer will break ECC easier and faster than the bulkier RSA keys. The ultimate shield built for the mobile era is fundamentally vulnerable to the next era of computing. ECC’s quantum vulnerability is a primary driver of the hybrid transition strategy described later in this document.

# 3. How Internet Security Works: TLS, HTTPS & Certificates

Understanding the TLS handshake is essential for grasping why the quantum threat is so urgent. TLS (Transport Layer Security) is the protocol that makes HTTPS possible, and it relies on asymmetric cryptography in two critical places that quantum computers can attack.

## 3.1 The Man-in-the-Middle Problem

In the early internet, data traveled as plaintext—like a postcard anyone could read. HTTPS added encryption, but encryption alone does not solve identity. If a hacker on a public Wi-Fi network intercepts your browser’s request for a bank’s public key and substitutes their own, your browser unknowingly encrypts your password with the attacker’s key. The attacker decrypts it, steals the password, and forwards the request to the real bank. This is a Man-in-the-Middle (MITM) attack.

## 3.2 Digital Certificates: The Digital Passport

To bind a public key to a real-world identity, the internet uses Digital Certificates (SSL/TLS certificates). A certificate is a small data file containing the website’s domain name, its public key, validity dates, the name of the issuing authority, and a digital signature from that authority. The certificate proves you are communicating with the authentic server, not an imposter.

## 3.3 Certificate Authorities and the Chain of Trust

Certificate Authorities (CAs)—organizations like DigiCert, GlobalSign, and Let’s Encrypt—verify website identities and issue certificates signed with the CA’s own private key. Your browser ships with a pre-installed Root Store containing the public keys of approximately 100 trusted CAs. When a browser receives a certificate, it checks the CA’s signature against its Root Store. If the signature verifies, the browser displays the green padlock. If not, it shows a security warning. Trust flows downward: the browser trusts the CA, and the CA vouches for the website.

## 3.4 The TLS Handshake: Step by Step

When you type https://bank.com, your browser and the server perform the following handshake in milliseconds:

- **Step 1 — Client Hello:** Your browser announces its supported cryptographic algorithms and sends a random number.

- **Step 2 — Server Hello & Certificate:** The server selects algorithms and sends its digital certificate containing its public key.

- **Step 3 — Verification & Key Exchange:** The browser verifies the certificate against its Root Store, then generates a temporary symmetric session key and encrypts it with the server’s public key.

- **Step 4 — The Switch to Symmetric:** The server decrypts the session key using its private key. Both sides now share the same symmetric key.

- **Step 5 — Secure Data Transfer:** All subsequent communication uses fast symmetric encryption (AES). The slow asymmetric math is finished.

## 3.5 Why TLS Is the Ultimate Quantum Target

The TLS handshake relies on asymmetric cryptography in two critical places: the CA’s digital signature on the certificate, and the key exchange that transports the session key. If a quantum computer can reverse-engineer the CA’s private key, it can forge mathematically perfect certificates for any website. Browsers would display green padlocks for attacker-controlled servers. The entire chain of trust would evaporate—the “quantum apocalypse” scenario that post-quantum cryptography is racing to prevent.

# 4. The Quantum Threat: How Quantum Computers Break Cryptography

A quantum computer is not a faster normal computer. It is an entirely different type of machine that uses fundamentally different physics to process information.

## 4.1 Bits vs. Qubits

Classical computers run on bits—light switches that are either Off (0) or On (1). Every photo, video, and message is millions of these binary values. If a classical computer wants to solve a problem, it checks one combination at a time, sequentially.

Quantum computers use qubits (quantum bits). A qubit can exist in superposition—a fluid state holding the probability of being both 0 and 1 simultaneously until the moment of measurement. When qubits are linked through entanglement, their computing power scales exponentially: 2 entangled qubits hold 4 states at once, 3 hold 8, and 300 qubits hold more states simultaneously than there are atoms in the observable universe.

## 4.2 Interference: The Real Mechanism

Quantum computers do not crack codes by “trying every password at once.” If you simply measured qubits in superposition, the result would be random garbage. Instead, quantum algorithms use interference—choreographing qubits so that wrong answers create waves that cancel each other out (destructive interference) while the correct answer creates waves that align and amplify (constructive interference). By measurement time, only the correct answer remains.

## 4.3 Shor’s Algorithm

In 1994, Peter Shor published an algorithm proving that a quantum computer could find the hidden mathematical structure behind RSA and ECC without brute force. Rather than guessing, Shor’s algorithm exploits the fact that prime factoring is fundamentally tied to finding hidden repeating patterns (periods) in massive datasets—exactly what quantum interference excels at. A classical computer would take trillions of years to factor an RSA-2048 key; a quantum computer running Shor’s algorithm could do it in minutes.

## 4.4 Grover’s Algorithm and Symmetric Cryptography

Quantum computers also have Grover’s algorithm, which can speed up brute-force searches against symmetric keys—but it is not an instant shortcut like Shor’s. It merely halves the effective key length. The practical fix is straightforward: upgrade AES from 128-bit to 256-bit keys and hashing from SHA-256 to SHA-384 or SHA-512. Once doubled, symmetric tools are safe from quantum threats. The real crisis lies entirely in asymmetric cryptography (RSA, ECC, digital signatures, TLS handshakes, and key exchanges).

## 4.5 The Engineering Reality

Qubits are extremely fragile. To maintain superposition, a qubit must be isolated from the entire universe—a microscopic temperature fluctuation, stray magnetic field, or vibration causes decoherence (data loss). Quantum processors are suspended inside dilution refrigerators cooled to a fraction of a degree above absolute zero. Current machines have a few hundred noisy qubits; breaking RSA-2048 requires millions of stable, error-corrected qubits. Most experts estimate 10–15 years until a cryptographically relevant quantum computer (CRQC) exists—a date often called “Q-Day.”

## 4.6 The Quantum Hardware Race

The quantum hardware landscape is advancing rapidly on multiple fronts. IBM unveiled its 120-qubit Quantum Nighthawk chip in late 2025, aiming to demonstrate quantum advantage for select tasks, with a fault-tolerant system targeted by 2029. Google is accelerating its adoption of post-quantum cryptography internally. Alongside these established players, newer approaches are flourishing: PsiQuantum is pursuing light-based (photonic) qubits using traditional chip-manufacturing technology, and experimental neutral-atom platforms have demonstrated control over thousands of qubits in laboratory settings. Each advancement shortens the estimated timeline to a cryptographically relevant quantum computer.

## 4.7 The Wrong Axis: Why Qubit Counts Don’t Predict Q-Day

Headlines track raw qubit counts, gate-fidelity demos, and the occasional Random Circuit Sampling claim. These milestones are real, but they are largely the wrong axis to watch when estimating when a cryptographically relevant quantum computer (CRQC) will actually arrive. The CRQC date is governed not by how many physical qubits a vendor can fabricate, but by overhead—specifically, the surface-code distance required to push physical error rates down to a logical error budget small enough for Shor’s algorithm to finish a full RSA-2048 or ECDLP-256 factorization. Most loud 2026 announcements live two to three orders of magnitude below the threshold that matters, with logical qubit counts in the low double digits.

The reason qubit counts mislead is that surface-code overhead grows fast in the code distance d, which in turn grows with the target logical error rate. A useful back-of-envelope model for the physical-qubit count is:

**N_phys ≈ 2 · d² · N_log,  d ≈ 2 · ln(N_log / p_L) / ln(p_th / p)**

Here p is the physical two-qubit gate error rate, p_th is the surface-code threshold (near 10⁻²), p_L is the target logical error rate, and N_log is the number of logical qubits Shor needs. Plugging in representative values—p = 3 × 10⁻³, p_th = 10⁻², N_log ≈ 6,000, and p_L ≈ 10⁻¹⁵—lands near the widely cited figure of roughly 20 million physical qubits to break RSA-2048. This is why the same 20-million estimate keeps reappearing despite ever-rising raw qubit announcements: those announcements rarely move any of the variables that actually drive the number.

The real lever is the gate error rate, not the headcount. Pushing p down by a factor of three roughly halves the required code distance d and quarters N_phys. Conversely, pushing the physical qubit count up without lowering p does almost nothing useful for an attacker holding harvested ciphertext. The development that would genuinely move the cryptographic horizon is a two-qubit gate error rate sustained near 5 × 10⁻⁴ across a connected lattice of thousands of qubits—a far less photogenic milestone than “ten thousand physical qubits” and one that press roundups almost never frame this way. For decision-makers, the practical takeaway is the same regardless of which milestone the headlines celebrate: the migration imperative is driven by data shelf-life and the multi-year cost of migration, not by any single qubit-count announcement.

# 5. Store Now, Decrypt Later: Why We Must Act Now

Intelligence agencies and state-sponsored hackers are actively intercepting and storing encrypted communications today—military blueprints, diplomatic cables, corporate trade secrets, and private messaging backups. The data is currently unreadable, but adversaries are playing a long game: when a CRQC is built, they will decrypt everything retroactively. This strategy is known as Store Now, Decrypt Later (SNDL), also called Harvest Now, Decrypt Later (HNDL).

## 5.1 The Y2Q Urgency

Three colliding timelines demand immediate action:

**Data Shelf-Life:** Medical records, military secrets, and classified communications need to remain confidential for 25–50 years. If a CRQC arrives in 15 years, data encrypted today will be exposed before its secrecy window closes.

**Embedded Hardcoded Systems:** Satellites, smart grids, and modern vehicles have RSA or ECC cryptography hardcoded into silicon chips. These devices cannot be easily patched and are deployed for 20-year lifespans. They must be manufactured with quantum-safe chips now.

**The Migration Marathon:** The last major cryptographic upgrade took the industry nearly two decades to fully implement. Upgrading the entire internet is like rebuilding an airplane while it is in flight. Waiting for a CRQC to be built before starting migration means arriving decades too late.

## 5.2 The HNDL Counterpoint: Plaintext Leaks Before Ciphertext Breaks

The Store Now, Decrypt Later threat is real, but it should not crowd out a present-tense risk that requires no quantum computer at all. The HNDL model assumes adversaries are recording today’s encrypted traffic to break it later. Yet on the same systems that PQC migration targets—especially industrial control systems (ICS) and grid-edge IoT—today’s encrypted traffic is often not even the most useful thing to capture, because the devices are leaking plaintext through ordinary memory-handling and authentication bugs that have nothing to do with cryptography.

A single week of CISA advisories in May 2026 illustrates the gap. ABB AC500 V2 programmable logic controllers (firmware 2.5.2 and 2.5.3) were found to expose fragments of earlier Modbus telegrams to an attacker who probes the right path—and because Modbus is the lingua franca of factory floors and substations, a device that leaks prior session state leaks operational intent. Other advisories in the same series covered an EV-charging wallbox vulnerable to a heap-pollution path that could rewrite firmware, a camera product still shipping a 2016-era media-player component with inherited vulnerabilities, an unauthenticated remote-reboot flaw, and a configuration tool handing application secrets to anyone on the local network. None of these care about Shor’s algorithm; they are classical, present-tense, and produce material for the same adversary sooner and with far less ceremony than harvesting ciphertext to break years from now.

The lesson is not that PQC migration can wait—it cannot—but that the grid-edge attack surface that needs ML-KEM key establishment and ML-DSA- or SLH-DSA-signed firmware is the same surface still shipping decade-old vulnerable components. PQ key exchange sits on top of devices that need to stop leaking state before they need to stop using ECDH. Promising plumbing exists for the constrained-device case: the IETF’s LAKE working group is developing PQ-EDHOC, a post-quantum variant of the lightweight EDHOC key-establishment protocol designed to run on controllers too small for full TLS. A serious quantum-IoT security program plans for both races at once. A useful field metric for the ICS side is the count of deployed device families whose key-establishment stacks have moved to ML-KEM and whose firmware update paths are signed with a post-quantum signature—the number that actually closes the harvest-now window for a substation.

## 5.3 Why Perfect Forward Secrecy Does Not Survive the Transition

A common objection to the harvest-now urgency runs as follows: modern TLS already provides Perfect Forward Secrecy (PFS), so even if a server’s long-term private key is later compromised, past sessions stay protected—doesn’t that defeat store-now-decrypt-later? Against a classical adversary, yes. PFS works by negotiating a unique ephemeral key for every session (via ephemeral Diffie-Hellman, DHE or ECDHE) and discarding it immediately afterward, so there is no long-term key whose later theft unlocks the archive. That guarantee is exactly what a cryptographically relevant quantum computer dissolves. The ephemeral keys are indeed deleted, but the public key-exchange parameters that derived them travelled across the wire in the clear and sit inside the adversary’s recorded handshake. Shor’s algorithm solves the discrete-logarithm problem those parameters rest on, so a quantum adversary can reconstruct the ephemeral shared secret retroactively from the captured handshake—no server key required. The practical conclusion is blunt: PFS remains valuable against classical threats such as server compromise and key leakage, but it is not a defense against a harvested-traffic quantum attack. Only moving the key exchange itself to a quantum-resistant primitive—hybrid ML-KEM today—closes that window.

## 5.4 Information Half-Life: Which Harvested Data Still Matters Later

The Mosca inequality above frames the urgency in terms of three durations, and the one organizations control least is the shelf-life of their secrets. It is worth refining that term, because treating all harvested data as equally valuable overstates the problem in some places and understates it in others. A useful way to think about it borrows from nuclear physics: information has a half-life. Just as a radioactive sample loses a predictable fraction of its potency over time, the value of a stolen secret decays at a rate that depends entirely on what the secret is. A quantum adversary who decrypts a harvested archive a decade from now is not holding fresh intelligence; they are holding whatever still matters after that decade has passed.

Some data has a half-life measured in seconds. A one-time login token, a session identifier, or an authentication challenge is worthless the moment the session ends, so a quantum computer that recovers it in ten years recovers nothing of use. Other data has a half-life measured in decades or longer—and this is where harvest-now-decrypt-later genuinely bites. Medical records, government identity numbers, biometric templates, sealed legal proceedings, state secrets, and the genome of a patient do not expire; a person’s diagnosis or fingerprint is as sensitive in 2040 as it is today. For a public-serving institution such as a library, the long-half-life categories are concrete: patron borrowing histories, identity and address records, and any retained reading or research activity. The practical effect is that this framing turns one frightening question into a manageable triage. Rather than asking the unbounded question “could this traffic be recorded?”—the answer is almost always yes—an organization asks the bounded one: “which of our data will still cause harm if it is exposed after a quantum computer arrives?” That subset is where migration is genuinely urgent, and it is usually far smaller and more identifiable than the total volume of data being protected. The point is not to relax the harvest-now warning but to aim it: short-half-life secrets can wait their turn, while genuinely long-lived data is exactly what should move to quantum-resistant protection first.

# 6. What is Post-Quantum Cryptography?

## 6.1 Clearing the Biggest Myth

Post-Quantum Cryptography (PQC) does not mean using a quantum computer to encrypt data. There are two entirely distinct fields:

**Quantum Cryptography (Hardware):** Uses actual quantum physics (e.g., shooting individual photons through fiber-optic cables) for Quantum Key Distribution (QKD). Requires highly specialized, expensive hardware.

**Post-Quantum Cryptography (Software):** New mathematical algorithms written in standard programming languages (C, Rust, Python) that compile and run on normal silicon CPUs—your laptop, smartphone, or web server. PQC is simply an upgrade to existing mathematical libraries.

## 6.2 What Makes Math “Quantum-Safe”

For an algorithm to be considered post-quantum, it must meet one strict requirement: brute force must be the only way to break it, even with a quantum computer. If a quantum computer is forced to guess one-by-one rather than using a mathematical shortcut, it will take billions of years—just like a classical computer.

## 6.3 The Goldilocks Engineering Problem

A viable PQC algorithm must simultaneously be: (1) hard for classical computers to break, (2) hard for quantum computers to break, and (3) light enough that a battery-powered smartphone can compute the forward direction in milliseconds. Finding math that is impossible for a supercomputer to reverse but instant for a smartphone to create is profoundly difficult. Moreover, PQC keys tend to be much larger—a standard ECC key is 256 bits, while some PQC keys are tens of thousands of bits—creating bandwidth optimization challenges.

## 6.4 PQC vs. QKD: Two Ideas That Are Not Interchangeable

A persistent confusion in the marketplace treats “post-quantum cryptography,” “quantum cryptography,” and “quantum key distribution” as if they were branding variations on a single idea. They are not. PQC, as described above, is classical software that runs on ordinary CPUs and slots into existing protocols, certificates, and key exchanges. Quantum Key Distribution (QKD) is something else entirely: it uses the physics of quantum measurement—BB84 relies on non-orthogonal photon states, E91 on entanglement and Bell-inequality violation—to establish a shared key over specialized hardware. The two solve different problems and are not substitutes for each other.

The practical consequences matter for any decision-maker evaluating vendor claims. QKD is largely point-to-point; scaling it across routed networks generally requires trusted relay nodes or dedicated fiber. It does not solve endpoint compromise, it does not authenticate identity on its own, and it does nothing for the application layer, key storage, or operational practice. Feeding QKD-established keys into ordinary symmetric encryption does not escape computational assumptions—it merely improves one stage of key establishment. QKD can be valuable in narrow, high-assurance contexts such as fixed links between data centers or government sites, but “we should all move to QKD” is not a general-purpose security strategy. For the routed internet, PQC—not QKD—is the practical path, and the two should never be conflated on a procurement slide.

## 6.5 “Quantum-Safe” Is a Present-Tense Judgment, Not a Permanent Certificate

The word “quantum-safe” sounds final, as if it certified immortality. The history of the standardization process argues for humility. The clearest cautionary tale is the collapse of SIKE, the isogeny-based scheme that had survived years of NIST review and advanced to the fourth round—by every institutional signal, a serious contender. On 1 August 2022, two cryptographers (Castryck and Decru) posted an attack that broke the level-1 parameter set in roughly ten minutes on a single laptop core, with later optimizations cutting the time to seconds. The weapon was neither a quantum algorithm nor even a new classical one: it was a 1997 theorem by mathematician Ernst Kani, published in a pure-mathematics journal with no cryptographic intent. SIKE’s key exchange happened to leak exactly the information Kani’s reducibility criterion could exploit. A result dormant in the literature for twenty-five years walked through the front door of a NIST finalist and destroyed it over a weekend.

This is not an argument against migration. NIST’s lattice-based standards (ML-KEM, ML-DSA) are unaffected by the SIKE attack, and the diversification principle described in the next section exists precisely to contain this kind of surprise. The lesson is narrower and more durable: PQC rests on hardness assumptions that are believed—not proved—to resist attack, exactly as RSA and ECC always have. “Quantum-safe” describes a present-tense engineering judgment about the best available evidence, not a guarantee that holds forever. That is why crypto-agility—the ability to swap a primitive without rebuilding the system—belongs in the design from day one, a theme developed in §18.

# 7. The Five Families of Post-Quantum Cryptography

NIST deliberately standardized algorithms from multiple mathematical families so that a breakthrough against one does not compromise the entire ecosystem. Three algorithms received final FIPS standards in August 2024; others remain under consideration or serve as cautionary examples.

The diversification principle is critical: for twenty years, the internet relied on a single mathematical basket (prime factoring and discrete logarithms). Cryptographers building PQC recognized they could not afford to repeat that mistake. If a hacker discovers a shortcut to solve one family, the others survive.

# 8. PQC Algorithm Reference Table

|              |                             |                    |                                        |                                                             |                                                                             |                                                           |                                                                                   |
|--------------|-----------------------------|--------------------|----------------------------------------|-------------------------------------------------------------|-----------------------------------------------------------------------------|-----------------------------------------------------------|-----------------------------------------------------------------------------------|
| **Family**   | **Algorithm**               | **FIPS**           | **Job**                                | **Core Math**                                               | **Why It Won**                                                              | **Key Sizes**                                             | **Real-World Status**                                                             |
| Lattice      | ML-KEM (CRYSTALS-Kyber)     | FIPS 203           | Key Exchange (KEM)                     | MLWE — noisy multi-dimensional grids; both sides add noise  | Faster than ECC; scalable tiers (512/768/1024 = 2×2/3×3/4×4)                | PK: 1,184 B CT: 1,088 B Fits 1,500 B MTU                  | Chrome/Cloudflare hybrid TLS live; Apple PQ3; Signal PQXDH; BoringSSL/OpenSSL     |
| Lattice      | ML-DSA (CRYSTALS-Dilithium) | FIPS 204           | Digital Signatures                     | MLWE (same family as ML-KEM)                                | Fast verification; ideal for TLS certs and server auth                      | Larger sigs than classical, but manageable                | OpenSSL/BoringSSL; CNSA 2.0 mandates ML-DSA-87                                    |
| Hash         | SLH-DSA (SPHINCS+)          | FIPS 205           | Digital Signatures (backup)            | Merkle trees + hash functions (different math from lattice) | Survives if lattice breaks; most battle-tested primitives                   | Much larger signatures; slower generation                 | NIST standardized; LMS/XMSS (SP 800-208) for code/firmware signing                |
| Lattice      | FN-DSA (FALCON)             | FIPS 206 (in dev.) | Digital Signatures (compact)           | NTRU lattices + FFT sampling (Fast-Fourier)                 | Smallest signatures of the lattice signatures; good for tight bandwidth     | Sig: ~666 B (512); compact but tricky float-point signing | FIPS 206 draft in development; complements ML-DSA                                 |
| Code         | HQC                         | Pending            | Key Exchange (KEM, non-lattice backup) | Error-correcting codes (Hamming Quasi-Cyclic)               | Provides non-lattice alternative to ML-KEM; survives if lattice math breaks | Larger ciphertexts than ML-KEM; moderate performance      | Selected by NIST Mar 2025 for standardization; Meta cryptographers are co-authors |
| Code         | Classic McEliece            | Under consid.      | Key Exchange (static)                  | Error-correcting codes                                      | Unbroken since 1978; longest track record                                   | PK: 1+ MB (too large for web/mobile)                      | Suited for static high-security environments                                      |
| Multivariate | Various (niche)             | None               | Ultra-small signatures                 | Systems of polynomial equations (NP-hard)                   | Tiny signature sizes for constrained IoT                                    | Small sigs but fragile schemes                            | Many broken during NIST competition; no standard winner                           |
| Isogeny      | SIKE (broken)               | None               | N/A                                    | Bridges between elliptic curves                             | Had smallest keys of any PQC family                                         | N/A                                                       | Broken in 2022 by classical attack on desktop in ~1 hour                          |

# 9. Learning With Errors: The Mathematical Foundation of PQC

Before examining how specific algorithms like ML-KEM work, it is essential to understand the mathematical puzzle that underpins them: Learning With Errors (LWE) and its practical evolution into Module Learning With Errors (MLWE).

## 9.1 The Baseline: Systems of Linear Equations

A standard system of linear equations—the kind taught in high-school algebra—is trivially easy for computers to solve. A standard laptop can solve a system of 10,000 equations with 10,000 unknowns in a fraction of a second using Gaussian elimination. Because it is so easy, clean systems of equations cannot be used for cryptography.

## 9.2 LWE: Adding Intentional Noise

In 2005, computer scientist Oded Regev proposed a transformative idea: take an easily solvable system of equations and intentionally corrupt each equation with a tiny random error. The errors are minuscule—like adding random pennies to restaurant bills—but they compound into mathematical chaos. A computer attempting standard algebra finds that its assumptions from one equation contradict the next. To find the secret variables (the private key), the attacker is forced to simultaneously guess the exact error on every equation—a problem Regev proved to be NP-Hard. Even a fully-armed quantum computer running interference algorithms is overwhelmed by the random noise.

## 9.3 The File Size Crisis: Pure LWE’s Fatal Flaw

Pure LWE was a breakthrough for quantum-proof security, but it had a fatal engineering flaw. To make the puzzle hard enough to resist a supercomputer, you need thousands of variables and thousands of equations. Storing a matrix of 1,000 equations with 1,000 variables requires 1,000,000 numbers. Transmitting these million-number matrices over a network made public keys several megabytes in size—far too large for the modern internet.

## 9.4 MLWE: Compressing the Math with Polynomial Modules

To solve the file size problem, cryptographers upgraded LWE to MLWE (Module Learning With Errors). Instead of storing thousands of individual numbers in a giant grid, MLWE groups the numbers into structured blocks called polynomials—each containing 256 values arranged in a specific mathematical pattern. Because the numbers follow predictable structure, the computer transmits only a few polynomial “blocks” rather than millions of loose numbers. The result: public keys shrink from several megabytes to approximately 1,100 bytes—small enough to fit in a standard internet packet.

## 9.5 Why Modules Enable Developer Scalability

An earlier approach called Ring-LWE bundled all numbers into one giant block, but this was inflexible—changing the security level required rebuilding everything from scratch. MLWE uses medium-sized modular blocks that developers can snap together like Lego pieces. The ML-KEM standard tiers demonstrate this elegance:

- **ML-KEM-512:** 2×2 module grid — standard security (equivalent to AES-128), efficient for everyday browsing.

- **ML-KEM-768:** 3×3 module grid — high security (equivalent to AES-192), used in X-Wing hybrid.

- **ML-KEM-1024:** 4×4 module grid — top-secret military security (equivalent to AES-256).

The underlying math code never changes. Increasing security means adding one more module to the equation—no library rewrites required. This is why NIST and the industry specifically chose MLWE as the mathematical engine for the new internet security standards.

# 10. How ML-KEM (Kyber) Works: The KEM Protocol

ML-KEM is not a traditional encryption algorithm. It is a Key Encapsulation Mechanism (KEM)—its sole job is to securely transport a small symmetric key (256 bits) between two parties. The actual data encryption uses fast symmetric ciphers like AES-256-GCM.

## 10.1 The Three-Step Handshake

**Step 1 — Key Generation (Server):** The server generates a private key (a clean lattice matrix) and a public key (the same matrix with deliberate MLWE noise injected). The noisy public key is sent to the client.

**Step 2 — Encapsulation (Client):** The client generates a random 256-bit symmetric key, mixes it into the server’s noisy public key, then adds even more noise of its own. The resulting ciphertext is pure chaos to any observer.

**Step 3 — Decapsulation (Server):** The server applies its private key to the ciphertext. Because the private key is the exact mathematical trapdoor, it cancels all noise layers, recovering the clean 256-bit symmetric key. Both sides now share the same key, and the TLS session proceeds with AES.

## 10.2 Scalability Tiers

- **ML-KEM-512:** 2×2 module matrix — fastest, standard security

- **ML-KEM-768:** 3×3 module matrix — high security (used in X-Wing hybrid)

- **ML-KEM-1024:** 4×4 module matrix — top-secret tier (CNSA 2.0 mandate)

# 11. How ML-DSA (CRYSTALS-Dilithium) Works: Quantum-Safe Digital Signatures

While ML-KEM protects confidentiality by securely transporting keys, the internet also needs quantum-safe digital signatures to protect authentication and integrity. CRYSTALS-Dilithium—standardized by NIST as ML-DSA (Module-Lattice-Based Digital Signature Algorithm, FIPS 204)—is the primary signature algorithm for the post-quantum era.

## 11.1 The Relationship Between Kyber and Dilithium

Kyber and Dilithium are sister algorithms designed by the same research team (hence the matching “CRYSTALS” prefix). Both share the same underlying mathematical engine: Module Lattices (MLWE). This shared foundation is a significant advantage for developers: a single optimized lattice math library can power both key exchange (ML-KEM) and digital signatures (ML-DSA), saving code space and reducing implementation complexity.

## 11.2 Core Mechanism: Fiat-Shamir with Aborts

When Dilithium signs a document, it must prove knowledge of the private key (a secret point on a lattice grid) without revealing that key. The mechanism is called Fiat-Shamir with Aborts:

- **Commitment:** The signer chooses a random point on the lattice grid and commits to it.

- **Challenge:** A challenge value is derived from the document being signed combined with the commitment.

- **Noise (the sandstorm):** Before responding, the signer adds massive amounts of intentional lattice noise to obscure the relationship between the response and the private key.

- **Response:** The signer produces a response that a verifier can check against the public key and the document.

- **Verification:** The verifier confirms the math aligns without ever seeing the private key.

## 11.3 The Abort Mechanic: Preventing Information Leaks

The “Aborts” in “Fiat-Shamir with Aborts” is a critical safety mechanism. Before outputting a signature, the algorithm inspects the math it just created. If the random noise accidentally failed to hide the algebraic relationship to the private key—like a sandstorm with the wind blowing in a straight line, revealing the exact path—the algorithm immediately aborts, discards the signature, generates fresh noise, and tries again. This rejection sampling loop typically completes in microseconds and ensures that only signatures leaking zero information about the private key are ever published.

## 11.4 The Signature Size Trade-Off

Dilithium is extremely fast for CPUs to compute because it relies on simple matrix math. However, its signatures are significantly larger than classical equivalents:

- **Classical ECDSA signature:** approximately 64 bytes.

- **ML-DSA-44 (Dilithium) signature:** approximately 2,420 bytes.

This size increase has real-world implications for TLS. When visiting a website, the server sends a certificate chain where each certificate is signed. With Dilithium signatures, the total TLS handshake inflates from approximately 2–3 kilobytes (classical) to 10–15 kilobytes (PQC with Kyber + Dilithium). While acceptable for laptops on fast connections, this can cause lag on weak mobile connections and may overwhelm constrained IoT devices with limited memory. Engineers are actively working on certificate chain compression to mitigate this overhead.

## 11.5 Deployment Targets

Over the next five to ten years, ML-DSA will replace almost every digital signature in daily use:

- **Web Certificates:** Certificate Authorities like Let’s Encrypt and GlobalSign are already testing Dilithium for signing TLS certificates.

- **Software Updates:** Operating systems and app stores will use ML-DSA to sign patches, preventing quantum hackers from injecting malware through forged updates.

- **Blockchain:** Next-generation decentralized networks will adopt ML-DSA for wallet ownership and transaction validation.

## 11.6 Companion Scheme: How SLH-DSA (SPHINCS+) Works

ML-DSA is the workhorse signature, but the diversification principle demands a backup built on entirely different math—so that a future break against lattices does not take every quantum-safe signature down with it. That backup is SLH-DSA (FIPS 205), standardized from SPHINCS+. Where ML-DSA leans on the same module-lattice problems as ML-KEM, SLH-DSA leans only on the security of cryptographic hash functions—preimage resistance, second-preimage resistance, and collision resistance—which is the most conservative assumption available, because Grover’s algorithm merely halves a hash’s effective strength rather than breaking it the way Shor’s breaks lattices’ algebraic cousins. SLH-DSA pays for that conservatism with larger signatures and slower signing, which is why it is positioned as a security-margin backup rather than the everyday default.

The word “stateless” in the scheme’s description carries real operational weight. Earlier hash-based schemes such as LMS and XMSS are stateful: each one-time key may be used exactly once, and the signer must reliably remember which keys have been spent. Lose track of that state—through a crash, a restored backup, or a cloned virtual machine—and a reused one-time key can catastrophically weaken security. SLH-DSA removes that burden by deriving the needed one-time key from the secret key and a randomized, message-dependent process, so there is no counter to maintain and no state to corrupt. For long-lived signing infrastructure, eliminating an entire class of operational footgun is worth a great deal.

Internally, SLH-DSA assembles a signature from three layers of hashing. At the base are one-time signatures built with WOTS+ (the Winternitz scheme), which sign a single value by revealing intermediate points along repeated hash chains—the verifier simply hashes the revealed values forward and checks that they arrive at the published public key. Because each WOTS+ key is safe for only one message, a second layer called FORS signs the actual message digest by selecting one secret leaf from each of several small hash trees. Finally, a hypertree—a tree of Merkle trees, where each lower tree’s root is authenticated by the tree above it—binds the enormous set of one-time keys to a single public root. Signing hashes the message with a randomizer, uses FORS to sign the digest, then walks WOTS+ signatures and Merkle authentication paths up through the hypertree; verification reverses the walk and accepts only if the final computed root matches the public key.

The payoff is trustworthiness under harsh assumptions rather than speed or compactness. SLH-DSA is the natural choice where a wide security margin matters more than signature size—long-term and archival signing, firmware and code signing, and security-critical infrastructure expected to remain verifiable for decades. It is the answer to the question the diversification principle implies: if lattices were to fall, the internet would still have a standardized signature scheme resting on nothing more exotic than the humble hash function.

## 11.7 Signatures That Must Outlive Their Own Cryptography: Audit Trails

The archival role just described has a sharp practical edge in one place many institutions overlook: the audit trail. A signed audit log, a notarized record, or a regulatory filing is signed once but must remain verifiable for as long as the law or the institution requires it to be trusted—often years or decades. That inverts the harvest-now-decrypt-later problem from §5 into what is better called trust-now-forge-later. The danger is not that an adversary reads the log; it is that, once the signature algorithm protecting it becomes forgeable, the adversary can fabricate or alter records after the fact and produce signatures that still validate—silently destroying the integrity guarantee the log existed to provide. Retention regimes such as financial-transaction record-keeping, electronic health records, and evidence chains all assume a signature made today will still mean something when it is examined far in the future, which is precisely the assumption a future quantum computer removes for classical signatures.

The remedy is to sign long-lived records with a post-quantum signature now, so their verifiability does not expire when classical cryptography does—and, during the transition, to do so in the hybrid fashion of §12, pairing a classical and a post-quantum signature so the record is trusted by current systems while gaining future-proof protection. The obvious objection is overhead: post-quantum signatures are larger than the classical ones (§18 quantifies the cost), and an audit system can generate enormous numbers of events. The standard answer is a structural one that reuses the Merkle-tree idea already at the heart of SLH-DSA. Rather than sign every event individually, a system batches many events, builds a Merkle tree over them, and applies one post-quantum signature to the single root; each event then carries only a short authentication path proving its membership in that signed batch. The large signature cost is paid once per batch and amortized across thousands of records, so tamper-evidence scales to high-volume logs without a signature attached to every line. The design lesson generalizes: when integrity must outlast the cryptography that produced it, the question is not only which algorithm to use but how to structure the data so that strong, future-proof signatures remain affordable at volume.

# 12. The Hybrid Transition Strategy

Because PQC algorithms are mathematically young (roughly a decade of study vs. forty years for RSA), the industry is deploying hybrid cryptography—wrapping data in both a classical and a PQC lock simultaneously. If the PQC algorithm is ever broken, the classical layer still holds; if the classical layer falls to quantum attack, the PQC layer survives.

The X-Wing hybrid KEM (X25519 + ML-KEM-768) combines classical Elliptic Curve Diffie-Hellman with NIST’s primary lattice standard in a single operation. This approach is explicitly endorsed by NCSC, NSA, NIST, and the EU as the responsible default during migration.

Meta’s migration framework explicitly prioritizes the hybrid approach, layering a PQC primitive on top of an established classical one so that an adversary would need to break both layers to compromise the system. The recent cryptanalysis and invalidation of SIKE—a final-round NIST candidate broken in 2022—underscores why relying entirely on newer PQC standards without a classical safety net would be premature.

# 13. The Collapsing Threat Timeline

## 13.1 Mosca’s Inequality

If X + Y \> Z, you have already failed for that data class—where X is how long your data must remain confidential, Y is your migration timeline, and Z is time until a CRQC exists.

## 13.2 Collapsing Resource Estimates

- **Gidney (May 2025):** RSA-2048 factoring revised from 20 million noisy qubits down to under 1 million. 20× reduction in six years.

- **Iceberg Quantum (Feb 2026):** Proposed quantum LDPC codes suggesting RSA-2048 tractable with fewer than 100,000 physical qubits. Simulation-based, not yet experimentally validated.

- **Google/Stanford/Ethereum Foundation (Mar 2026):** ECDLP-256 breakable with fewer than 500,000 physical qubits in minutes. ECC no longer buys extra migration time over RSA. The 57-page whitepaper (“Securing Elliptic Curve Cryptocurrencies against Quantum Vulnerabilities”) puts the logical-qubit cost at roughly 1,200 logical qubits with 90 million Toffoli gates, or 1,450 logical qubits with 70 million Toffoli gates—an order-of-magnitude spacetime-volume improvement over prior single-instance estimates. Notably, the authors validated the figures with a zero-knowledge proof rather than publishing the attack circuit itself, an early example of responsible cryptanalysis disclosure.

- **Caltech–Berkeley–Oratomic (Mar 2026):** A preprint exploring neutral-atom quantum computers estimates Shor’s algorithm could be implemented with as few as 10,000–20,000 atomic qubits. In one proposed design, a system with roughly 26,000 qubits could crack Bitcoin’s elliptic-curve encryption in a few days, while tougher targets like RSA-2048 would require additional time and resources.

## 13.3 The AI-Accelerated Threat

The quantum timeline is only one attack vector. AI-assisted cryptanalysis is compressing the cost of finding implementation flaws in deployed cryptographic code. Cryptographic code is small, well-bounded, has crisp correctness criteria, and a rich history of subtle defects—exactly the profile AI tools excel at scrutinizing. This means harvested ciphertext may become decryptable before a CRQC exists, through classical implementation flaws discovered at AI-assisted scale.

The defensive side of this equation is also accelerating. Anthropic’s Project Glasswing, announced in May 2026, deploys advanced AI models to identify thousands of zero-day vulnerabilities across critical software—operating systems, web browsers, and foundational infrastructure—in collaboration with partners including Google, Microsoft, NVIDIA, and Palo Alto Networks. While primarily a defensive initiative, it demonstrates that AI tools are already capable of scrutinizing code at a scale and speed that fundamentally changes the cryptographic security landscape in both directions.

# 14. Quantum Impact Reference: What Breaks vs. What Survives

When a CRQC is built, the internet’s cryptographic tools will divide cleanly into two categories. The asymmetric layer—key exchange, digital signatures, and identity—is completely broken. The symmetric layer—bulk encryption and hashing—survives with minor key-size upgrades.

|                       |                                           |                                                                                 |                                                  |
|-----------------------|-------------------------------------------|---------------------------------------------------------------------------------|--------------------------------------------------|
| **Category**          | **Examples**                              | **Quantum Impact**                                                              | **Required Action**                              |
| Asymmetric Encryption | RSA, ECC, Diffie-Hellman                  | Completely broken by Shor’s Algorithm                                           | Replace with PQC (ML-KEM, ML-DSA)                |
| Digital Signatures    | RSA-PSS, ECDSA, EdDSA                     | Completely broken—forged signatures enable malicious updates, certificate fraud | Replace with ML-DSA or SLH-DSA                   |
| Key Exchanges         | TLS handshakes (ECDHE, RSA key transport) | Completely broken—all past and future sessions exposed                          | Deploy hybrid (X-Wing) or pure PQC KEM           |
| Symmetric Encryption  | AES-128, AES-256                          | Grover’s halves effective key length                                            | Upgrade AES-128 → AES-256 (already quantum-safe) |
| Hashing               | SHA-256, SHA-384, SHA-512                 | Grover’s provides modest speedup                                                | Upgrade to SHA-384 or SHA-512                    |
| Blockchain / Crypto   | Bitcoin, Ethereum wallet signatures       | Wallet signatures forgeable—ownership collapses                                 | Migrate signature schemes to PQC                 |

## 14.1 A Closer Look: Which Zero-Knowledge Proof Systems Survive

The breaks-versus-survives divide extends into a domain that the table above does not capture but that matters increasingly for blockchain and Layer-2 systems: zero-knowledge proofs (ZKPs). A ZKP lets one party prove a statement is true without revealing why, and these systems now underpin private transactions and rollup scaling. Their quantum posture is decided by a single design choice—what cryptographic primitive anchors the proof—and the same two quantum algorithms govern the outcome. Shor’s algorithm breaks anything resting on the elliptic-curve discrete logarithm, while Grover’s only halves the strength of hash functions, leaving them secure at adequate output sizes.

That dividing line is clean. Proof systems whose security reduces to elliptic-curve assumptions—Groth16, PLONK, Marlin, and Sonic (which rely on pairings or KZG polynomial commitments), along with Bulletproofs (Pedersen commitments)—are completely broken by a cryptographically relevant quantum computer. The break is retroactive and total: an attacker who can solve the discrete logarithm can recover the secret “toxic waste” behind a trusted setup and forge arbitrary proofs that pass verification, including for transactions finalized years earlier. By contrast, proof systems built only on hash functions—STARKs and the FRI-based family including Plonky2, Plonky3, Ligero, Aurora, and Virgo—remain post-quantum secure, because their soundness rests on hashing rather than algebraic structure Shor’s algorithm can unravel.

The migration path is often less drastic than “rewrite everything,” because in several systems the vulnerability is isolated to the commitment scheme rather than the circuit logic. PLONK-style arithmetization, for example, survives if its KZG commitments are replaced with a FRI-based scheme—which is precisely the move Plonky2 and Plonky3 make. The practical guidance for a decision-maker is the same as for the rest of the migration: if an application’s security horizon exceeds the plausible CRQC arrival window, eliminate elliptic-curve-based proof systems from new designs and confirm a documented path to a hash-based commitment for anything already deployed.

## 14.2 A Closer Look: Blockchain at Q-Day (Bitcoin and Ethereum)

Public blockchains are the clearest worked example of the “what breaks” question, because they make the quantum-vulnerable cryptography visible to anyone and immutable by design. Both Bitcoin and Ethereum sign transactions with ECDSA over the secp256k1 curve—exactly the elliptic-curve discrete logarithm that the Google–Stanford–Ethereum Foundation whitepaper estimates a future machine could break with under 500,000 physical qubits—and Ethereum’s scaling stack adds further pairing-based cryptography on top. The crucial subtlety is one of exposure: an address is normally a hash of the public key, and a hash resists Shor’s algorithm. But the moment an account transacts, its public key is revealed on-chain and stays there permanently, where a future quantum adversary can recover the private key from it. This is the on-chain expression of the address-as-hash identity trap from §18.3: hashing protects an account only until its first spend, after which the protection is gone for good. Combined with harvest-now-decrypt-later—the entire ledger can be archived today for cheap—the quantum timeline becomes largely irrelevant for any high-value wallet whose key has ever been exposed.

Ethereum’s response illustrates how migration friction scales with where the primitive lives. In early 2026 the Ethereum Foundation stood up a dedicated post-quantum team and published a multi-fork roadmap (informally, the “Strawmap”) targeting quantum-resistant cryptography across the consensus layer through roughly 2029. That roadmap names four distinct quantum-vulnerable areas, each with a different blast radius: the ECDSA signatures on ordinary user accounts (an account-level problem—painful but migratable wallet by wallet), the BLS signatures validators use to finalize blocks (a consensus-layer problem), the KZG polynomial commitments that rollups post for data availability, and the application-layer zero-knowledge proofs surveyed above. The latter three are protocol-level and require hard forks rather than wallet upgrades. The proposed account-level escape routes are instructive for any system designer: smart-contract wallets (account abstraction) can already adopt a post-quantum signature scheme without a base-layer change, while a draft proposal (EIP-8141, “frame transactions”) would decouple the signature scheme from the account entirely so that any NIST-standard or future algorithm can validate a transaction—the protocol-level embodiment of crypto-agility.

Bitcoin’s first concrete step is narrower and reflects its more conservative governance. BIP 360, added to the official proposal repository in early 2026, introduces a new output type called Pay-to-Merkle-Root (P2MR) that commits the locking script only to the Merkle root of a script tree—a hash—rather than to a public-key point. Its sole job is to eliminate the long-exposure vulnerability that Taproot quietly introduced: a Taproot key-path output writes an elliptic-curve point on-chain from the moment it is created, exposing it for years before it is ever spent. P2MR removes that key-path option, so no persistent curve point sits in the UTXO set and the only exposure window shrinks back to the brief moment of spending. It is explicitly a first step and not full post-quantum Bitcoin—the leaf scripts still use classical signatures, and post-quantum signature schemes such as ML-DSA are planned as follow-on proposals. The recurring decision-maker lesson across both chains is the same one §18.3 frames in general terms: agility is cheapest when designed in advance, immutable verifiers and hash-derived identities are the expensive cases, and a credible migration plan also has to answer the governance question of what happens to coins and accounts that never migrate.

## 14.3 A Closer Look: Fully Homomorphic Encryption on the “Survives” Side

The “what survives” column of the table above is populated mostly by symmetric and hash-based primitives, but one of its more interesting residents is a comparatively young technology: fully homomorphic encryption (FHE). FHE allows computation to be performed directly on encrypted data, producing an encrypted result that, once decrypted, matches the result of running the same computation on the plaintext. The data is never exposed in the clear during processing—a cloud provider, an analytics vendor, or an untrusted server can compute on information it is never able to read. For an institution that handles sensitive records but wants to outsource computation, that is a categorically different privacy guarantee from ordinary encryption, which must decrypt before it can compute.

What makes FHE relevant to this document is the reason it lands on the survives side. The leading FHE schemes are built on the same lattice and Learning-With-Errors foundations described in §9—the very hardness assumptions that ML-KEM and ML-DSA rest on. FHE therefore inherits their quantum resistance rather than needing a separate migration story: a technology an organization might adopt for privacy reasons turns out to already be post-quantum by construction. This is a useful corrective to the common assumption that the quantum transition is purely a defensive scramble to replace what breaks. Some of the cryptography arriving now expands what is possible—computing on data that stays encrypted end to end—while happening to stand on quantum-resistant ground. The honest caveat is maturity and cost: FHE remains computationally expensive and is practical today mainly for targeted workloads rather than general-purpose computing, so for a decision-maker it belongs on the watch-and-pilot list rather than the immediate-migration list. But it illustrates that the lattice mathematics underwriting the PQC standards is also underwriting a broader generation of privacy technology.

# 15. Global Regulatory Convergence

Major Western regulators have converged on two deadlines: 2030 for critical infrastructure and high-priority systems, and 2035 for full migration. Every regulator asks for cryptographic inventory as the first deliverable.

|                            |                                                                                                                                            |                                                                                                                         |
|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| **Jurisdiction**           | **Key Mandates**                                                                                                                           | **Timeline**                                                                                                            |
| United States (NIST / NSA) | FIPS 203–205 finalized Aug 2024. NIST IR 8547: RSA-2048/P-256 deprecated 2030, disallowed 2035. CNSA 2.0: ML-KEM-1024, ML-DSA-87, AES-256. | Code signing preferred 2025. New acquisitions Jan 2027. Firmware exclusive 2030. All systems 2033. Full migration 2035. |
| United States (Executive)  | NSM-10; OMB M-23-02; Quantum Computing Cybersecurity Preparedness Act; EO 14144 (TLS 1.3 federal-wide).                                    | Federal TLS 1.3 by Jan 2030. Inventory and planning now.                                                                |
| United Kingdom (NCSC)      | Three-phase migration plan. Aimed at large orgs, CNI, and bespoke IT estates.                                                              | Phase 1 (to 2028): Discovery. Phase 2 (2028–2031): High priority. Phase 3 (2031–2035): Complete migration.              |
| European Union             | NIS Coop Group Roadmap. COM(2026) 13: PQC mandatory in NIS2. HNDL recognized as “likely occurring already now.” Recommends ML-KEM-768.     | National strategies by 2026. Critical migrated by 2030. Medium/low risk by 2035.                                        |
| Other                      | UAE: PQC migration plans 2026. Australia ASD: pure-PQC 2030. Singapore MAS & HK HKMA: financial sector advisories.                         | Varies; converging on 2030–2035 window.                                                                                 |

## 15.1 Europe’s Digital-Identity Mandate Meets a Certification Bottleneck

The European regulatory picture shows how a mandate can move faster than the supply chain beneath it. The amended digital-identity framework—eIDAS 2 (Regulation (EU) 2024/1183)—requires every member state to make a European Digital Identity (EUDI) Wallet available to its residents and businesses, with regulated service providers, including financial institutions, obliged to accept it; legal analyses point to readiness obligations landing around 2026 and wallet acceptance for payments by late 2027. That is a hard deadline arriving while the post-quantum certificate supply chain is not yet ready to meet it. The gap is structural rather than a matter of will: several certificate authorities can already issue private ML-DSA certificates for internal use, but no European qualified trust-service provider (QTSP) can yet issue the publicly trusted, eIDAS-qualified certificates (the QWAC and QSealC types that the wallet ecosystem depends on) using a post-quantum signature. Issuing those requires audited operations and hardware security modules certified to FIPS 140-3 or Common Criteria, and PQC-capable HSM firmware is only at the very beginning of that certification path—a process measured in many months, not weeks. New secure-element hardware previewed by vendors such as Samsung and Thales in early 2026 is a step forward, but the audit-and-certify pipeline behind a publicly trusted certificate cannot be skipped.

The practical takeaway for a decision-maker is that the migration is not gated solely by algorithm availability—ML-DSA has been a finalized standard since 2024—but by the slow-moving certification and audit infrastructure that converts a standardized algorithm into a publicly trusted credential. Where that infrastructure is not yet ready, the layer that can move first is transport security: hybrid TLS with ML-KEM can be deployed on the connections between institutions today without waiting for qualified PQC certificates, which is why transport-layer key exchange is consistently the earliest and lowest-friction place to begin closing the harvest-now window.

# 16. Real-World Deployment Status

|                                                 |                                                                         |                                                                                                                                   |
|-------------------------------------------------|-------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| **Platform**                                    | **Implementation**                                                      | **Notes**                                                                                                                         |
| Google Chrome + Cloudflare                      | Hybrid TLS handshake (X25519 + ML-KEM-768)                              | Already live in production; most Chrome users are performing PQC handshakes.                                                      |
| Apple iMessage                                  | PQ3 protocol using ML-KEM for key wrapping                              | Deployed across iOS/macOS; protects against HNDL.                                                                                 |
| Signal                                          | PQXDH protocol using ML-KEM                                             | Post-quantum key exchange in production messaging.                                                                                |
| Meta (Facebook, WhatsApp, Messenger, Instagram) | Hybrid PQC across internal infrastructure; ML-KEM and ML-DSA deployment | PQ protections deployed across significant portions of internal traffic. Multi-year rollout. Meta cryptographers co-authored HQC. |
| BoringSSL (Google)                              | ML-KEM integrated                                                       | Backend foundation for Chrome, Android, GCP.                                                                                      |
| OpenSSL                                         | ML-KEM and ML-DSA integrated                                            | Backbone of internet server infrastructure worldwide.                                                                             |
| LibOQS (Linux Foundation PQCA)                  | Open-source PQC library with ML-KEM, ML-DSA, and additional algorithms  | Part of the Post-Quantum Cryptography Alliance; Meta supports and contributes.                                                    |
| HSM Vendors                                     | Firmware updates for FIPS PQC support                                   | Silicon-level support at hardware security boundary.                                                                              |
| Certificate Authorities                         | Let’s Encrypt and GlobalSign testing ML-DSA for TLS certificate signing | Preparing for post-quantum certificate chains in production.                                                                      |

## 16.1 Post-Quantum Defaults Have Arrived in Everyday Tools

The clearest sign that PQC has moved from pilot to baseline is that ordinary practitioners now encounter it without seeking it out. In early 2026, OpenSSH 10.0 made a hybrid post-quantum key exchange (mlkem768x25519-sha256) the default for key agreement, and SSH clients now emit a warning—“connection is not using a post-quantum key exchange algorithm … vulnerable to store-now-decrypt-later attacks”—whenever a session falls back to classical-only cryptography. Administrators across many platforms reported encountering it simply by upgrading their client, which is precisely the point: the store-now-decrypt-later threat is now surfaced at the level of a routine file transfer rather than confined to security white papers.

The same shift is visible across mainstream platforms and network gear. Microsoft has made ML-KEM and ML-DSA generally available across Windows Server 2025, Windows 11 (24H2 and 25H2), and .NET 10, so applications can call quantum-resistant primitives through the operating system rather than bundling their own. Network-infrastructure vendors are shipping post-quantum key exchange for site-to-site VPNs—Palo Alto Networks’ PAN-OS, for instance, supports quantum-resistant IKEv2 tunnels built on the relevant IETF drafts. Adoption depth still lags this availability, however. Industry surveys in 2026 placed only a small single-digit percentage of enterprises—on the order of five percent—in the “deployed” category, with a larger share (around forty percent in one study) merely in “active transition,” a label that often includes planning and assessment rather than shipped cryptographic change. The capability is now within reach by default; closing the gap between availability and actual negotiated use is the work that remains—the wire-level question raised in §18.4.

# 17. PQC in Telecommunications: The 5G Core Case Study

The 5G Core (5GC) network represents one of the most significant real-world deployment targets for post-quantum cryptography. Unlike previous mobile generations that relied primarily on symmetric-key cryptography with Subscriber Identity Modules (SIMs), the 5G Core architecture is fundamentally cloud-native and microservice-oriented, with Network Functions (NFs) communicating over Public Key Infrastructure (PKI)-based mechanisms—particularly TLS and OAuth 2.0. This heavy reliance on asymmetric cryptography makes the 5GC uniquely vulnerable to quantum attack.

## 17.1 Why 5G Is Especially Vulnerable

The 5GC runs ten or more essential Network Functions (NRF, AMF, UPF, UDR, UDM, AUSF, NSSF, BSF, PCF, SMF) as interconnected microservices, each establishing TLS connections with the others. Every service-to-service call relies on PKI for mutual authentication and confidentiality. A quantum adversary executing a Store Now, Decrypt Later strategy against intercepted 5G inter-function traffic could retroactively compromise subscriber authentication, session establishment, and policy enforcement. The virtualization and software-defined nature of the 5GC provides opportunities for agile cryptographic migration—but also expands the attack surface.

## 17.2 Lab-Validated Performance Impact

A 2026 literature review evaluated hybrid PQC deployment in a lab-scale 5GC environment using open5gs compiled against liboqs (the Open Quantum Safe library). The testbed integrated hybrid KEMs and hybrid digital signature algorithms into the TLS layer connecting all ten Network Functions. Key findings:

- **Hybrid KEMs Tested:** p256_bikel1, p384_bikel3 (code-based BIKE), and p521_frodo1344shake (lattice-based FrodoKEM), all combined with ECC secp256r1.

- **Hybrid Signatures Tested:** p512_falcon513 (lattice-based Falcon), p384_mldsa66 (ML-DSA/Dilithium), and sphincssha2129ssimple (hash-based SPHINCS+), all combined with ECC secp256r1 or RSA.

## 17.3 Performance Results

Under normal operating conditions (up to 120 simulated User Equipment sessions), the study found no clear difference between conventional and PQC algorithms in median performance. The quantitative results for a representative hybrid configuration (p384_bikel3 KEM with p384_mldsa65 signatures):

|                          |                        |                |            |
|--------------------------|------------------------|----------------|------------|
| **Metric**               | **Conventional (ECC)** | **Hybrid PQC** | **Change** |
| Median UE Setup Duration | 257 ms                 | 264 ms         | +2.7%      |
| 99th Percentile Setup    | 505 ms                 | 669 ms         | +32.5%     |
| SBI Data Rate            | 111.0 KB/s             | 114.8 KB/s     | +3.4%      |

At the 95th percentile, a distinct latency jump of approximately 200 ms was observed, likely attributable to an internal queue batching mechanism rather than the cryptographic overhead itself. Outlier cases (100th percentile) showed more significant divergence, suggesting potential impacts on user experience in rare edge cases.

## 17.4 Implications for PQC Migration

The key conclusion is that the 5G Core can technically support PQC without substantial impact on network usability, computational overhead, or message size. This result corroborates similar contemporary research and provides empirical evidence that the hybrid transition strategy—already endorsed by regulators for web and enterprise systems—is equally viable for telecommunications infrastructure.

## 17.5 Future Directions: KEMTLS and IPsec

Researchers identified two promising areas for further 5G PQC integration. First, KEMTLS—a TLS variant that replaces handshake signatures entirely with KEM operations—could offer better efficiency for PQC-heavy environments by eliminating the signature size overhead during connection establishment. Second, PQC integration into IPsec (used between the Radio Access Network and the 5GC) remains an open area of investigation that would extend quantum protection to the radio interface.

# 18. Developer Migration Considerations

PQC is not a drop-in replacement. The transition fundamentally changes the physical properties of security systems:

- **Database schemas:** VARCHAR(255) columns for public keys must be migrated to accommodate keys of 1,000+ bytes.

- **Network fragmentation:** PQC keys and certificates may exceed the 1,500-byte MTU limit, requiring packet fragmentation and increasing latency.

- **IoT constraints:** Devices with 8–16 KB of RAM face significant challenges processing 1,200-byte PQC keys. Dilithium’s 2.4 KB signatures may overwhelm constrained sensors designed for 2 KB payloads.

- **The key hierarchy trap:** AES-256 at rest is quantum-safe, but the asymmetric layers wrapping, managing, and authenticating those keys (RSA-OAEP, ECDH, KMS TLS) are fully exposed. Breaking the wrapping layer is equivalent to breaking the data.

- **CPU vs. network bottleneck shift:** PQC lattice math uses matrix operations that modern CPUs compute faster than RSA’s big-integer division. The bottleneck shifts from CPU to network bandwidth.

- **Embedded/hardcoded systems:** Satellites, smart grids, and vehicles with cryptography baked into silicon cannot receive software patches. New hardware must be manufactured with quantum-safe chips before deployment into 20-year lifespans.

- **TLS handshake inflation:** Certificate chains using Dilithium signatures inflate PQC handshakes to 10–15 KB (vs. 2–3 KB classical), creating challenges for weak mobile connections and constrained network environments.

- **KEMTLS as a mitigation path:** KEMTLS is a promising TLS alternative that replaces handshake signatures with KEM operations. By eliminating the need for large PQC signatures during connection setup, KEMTLS could significantly reduce the handshake inflation problem—particularly beneficial for bandwidth-constrained environments like IoT and mobile networks.

- **Cryptographic inventory:** Before migration begins, organizations need a complete map of where cryptography is used. Meta’s approach combines automated discovery with developer reporting to capture edge cases and legacy systems.

- **PQC guardrails:** Organizations should prevent new systems from being designed with quantum-vulnerable algorithms. This includes updating internal cryptography guidelines, discouraging creation of new quantum-vulnerable keys, and blocking usage of affected APIs in centrally managed build systems.

## 18.1 When Probability Becomes a Side-Channel

Choosing a quantum-resistant algorithm is necessary but not sufficient. A mathematically sound algorithm can still leak secrets if its implementation is flawed—a lesson with a long classical pedigree (timing attacks, cache attacks, power analysis) that applies just as forcefully to the systems being built today. The failure rarely looks dramatic. It is usually a single misplaced operation, an unconditional gate where a conditional one belonged, or a missing check that quietly alters behavior the test suite never inspects.

A particularly instructive class of failure is when the leak is statistical—when the probability distribution of outputs itself becomes the side-channel. The detection method is simple arithmetic: compute the distribution a correct implementation should produce (for a balanced system, a uniform expectation), measure what the implementation actually produces, and treat the deviation as signal rather than noise. Expressed plainly, the exploitable quantity is the gap between observed and expected frequency:

**bias = P(observed) − P(expected)**

Once a dominant outcome emerges where none should, it carries recoverable information. In the deliberately broken teaching examples that motivate this point, the dominant outcome seeds a deterministic key and the protected secret is recovered by reversing trivial encryption—a reminder that a leak need not break the underlying primitive to be fatal; it only needs to make the secret guessable. The same shape recurs across very different domains, which is what makes it worth recognizing rather than treating each instance as exotic:

|                  |                                                         |
|------------------|---------------------------------------------------------|
| **Domain**       | **Representative Side-Channel**                         |
| Cryptography     | Timing attacks on non-constant-time operations          |
| CPUs             | Spectre and Meltdown speculative-execution leakage      |
| Networking       | Packet-timing and traffic analysis                      |
| Machine Learning | Model and membership-inference leakage                  |
| Quantum Systems  | Measurement-distribution inference from biased circuits |

The practical takeaway for a PQC migration is that the attack surface is not always the algorithm; often it is the implementation. A migration is not finished when ML-KEM or ML-DSA is selected—the deployed code must also resist statistical and side-channel leakage through constant-time, masked, and distribution-preserving implementations, a discipline that deserves its own validation effort beyond algorithm choice.

## 18.2 Cryptographic Bills of Materials (CBOMs): Operationalizing Inventory

The cryptographic inventory described above is only as good as the tooling that produces it, and “where is cryptography used?” turns out to be a deceptively hard question to answer at scale. A Cryptographic Bill of Materials (CBOM) is the artifact that makes the inventory concrete: a structured, machine-readable record of the cryptographic assets in a system—algorithms, keys, protocols, and their properties (modes, key lengths, OIDs)—together with evidence of where each was found. It is the cryptographic analogue of the Software Bill of Materials (SBOM) many IT teams already maintain; the two are complementary, giving full-stack visibility from software dependencies down to the cryptographic primitives they rely on.

The most important practical lesson is that a complete inventory requires discovery along two distinct axes, because neither alone is sufficient. Source-code scanning detects cryptographic API usage—the algorithms a codebase invokes—but it cannot see the runtime cryptographic materials that ship with a deployment: TLS certificates on disk, private keys, java.security policy files, or OpenSSL configuration that pins cipher suites. Artifact and container-image scanning catches that second category. An organization that scans only its source code will produce a confident-looking inventory that silently omits much of what is actually protecting—or failing to protect—its systems in production.

Open-source tooling for this work exists and is institutionally anchored. The CBOM Kit—originally built by IBM Research and donated in 2025 to the Post-Quantum Cryptography Alliance (PQCA), a project of the Linux Foundation—is a representative example, organized into five components that cover both discovery axes:

|                    |                                                                                                                             |
|--------------------|-----------------------------------------------------------------------------------------------------------------------------|
| **Component**      | **Role**                                                                                                                    |
| sonar-cryptography | Source-code detection engine; identifies cryptographic API usage in Java, Python, and Go.                                   |
| cbomkit-lib        | Standalone library wrapping the detection engine for use without a full scanning server.                                    |
| cbomkit-action     | GitHub Action that runs the scanner inside CI/CD pipelines for continuous inventory.                                        |
| cbomkit            | Full application: stores and visualizes CBOMs and evaluates them against compliance policies.                               |
| cbomkit-theia      | Filesystem and container-image scanner; finds runtime artifacts (certificates, keys, cipher config) that source scans miss. |

Two properties make this approach durable rather than a one-time audit. First, the output is a recognized interoperability standard—CycloneDX (v1.6), which extends the widely adopted SBOM format with a dedicated cryptographic-asset component carrying OIDs, primitives, modes, key lengths, and the file-and-line evidence of where each was found—so a CBOM produced by one tool can be consumed by another. Second, the inventory feeds compliance evaluation directly: detected assets are checked against a whitelist of approved quantum-safe algorithms, with anything unrecognized flagged as non-compliant or unknown. That closes the loop from “what cryptography do we have?” to “what of it is not yet quantum-safe?”—and, run continuously in CI/CD, keeps the answer current as the codebase evolves.

## 18.3 Cryptographic Agility: Where the Algorithm Lives Decides How Hard Migration Is

Every consideration in this section ultimately serves one capability: cryptographic agility, the ability to retire a broken primitive and adopt a new one without rebuilding the system around it. The migration record shows why this is the real deliverable rather than a buzzword. MD5 was broken in 2004 yet lingered in production certificates until 2012; SHA-1 was theoretically dead in 2005 and practically broken in 2017, then took years of coordination across browsers and certificate authorities to remove; RSA-1024 was deprecated by NIST in 2011 and still ran in enterprise systems a decade later. The pattern is not negligence—it is migration friction. Knowing a primitive is broken is the easy part; being able to swap it out without breaking everything is the hard part, and different systems possess wildly different amounts of that ability.

The decisive factor is architectural: where in the stack the algorithm choice lives. TLS has absorbed roughly a million upgrades because algorithm selection happens at the negotiation layer—client and server agree on a cipher during the handshake, so retiring a weak algorithm means simply ceasing to advertise it, and adding a new one means appending it to the list. The rest of the protocol does not care. Systems with high agility put the primitive where negotiation happens; systems with low agility bake it into an immutable execution layer. Blockchains and zero-knowledge rollups sit at the painful end of this spectrum: a rollup’s verifier contract implements a specific proof system at the bytecode level and is deliberately immutable, so changing it can require a new trusted setup, a fresh security audit, a governance vote, and an unsolved question of what to do with every proof already verified under the old system.

A useful diagnostic separates two kinds of rigidity that are easy to conflate. Architectural rigidity—a verifier wired in as a single immutable contract, or the absence of a written transition protocol for historical artifacts—is an engineering problem, fixable with patterns like a registry that maps algorithm identifiers to implementations behind a stable interface. Mathematical rigidity is different: a ZK circuit is defined over a specific finite field, and that field is present in every constraint, so moving to a quantum-safe algebraic setting means rewriting the circuit from scratch—an open research problem, not a refactoring sprint. There is also an identity trap unique to ledgers: when an address is derived as a hash of a public key, migrating the signature scheme generates a new address and abandons the account’s history, because in that design the primitive is the identity rather than merely attesting to it. The takeaway for any system expected to outlive a single cryptographic generation is to put the primitive at a negotiation boundary, write the state-continuity and sunset plan before it is needed, and know in advance whether a given dependency is architectural or mathematical—because the response to each is completely different.

## 18.4 Configuration Is Not Negotiation: Wire-Level PQC Verification

The CBOM discipline of §18.2 answers what cryptography a system contains; it does not answer what cryptography a system actually uses on a live connection. Those are different questions, and the gap between them is where many PQC programs quietly fail. A server can be fully configured to support ML-KEM and still negotiate a classical key exchange with every client that connects—the configuration says one thing, the wire says another. A complete migration program therefore needs a runtime counterpart to static inventory: verification of what each TLS handshake actually negotiated, read from the bytes on the wire.

In TLS 1.3 the moment of truth is the ServerHello, the server’s binding commitment to a single key-exchange group for that session, and it is the last handshake message visible in plaintext before encryption begins. The named group carried in its key_share extension is the definitive signal of cryptographic posture. Two bytes settle the question, and a packet capture in a tool like Wireshark makes the difference tangible: a classical X25519 key share is 32 bytes, whereas the hybrid X25519MLKEM768 key share runs over 1,100 bytes because the ML-KEM-768 public key rides alongside the classical one—the post-quantum key material is literally visible in the raw packet.

|                    |                         |                                                                                                                        |
|--------------------|-------------------------|------------------------------------------------------------------------------------------------------------------------|
| **Classification** | **Wire Signal**         | **What It Means**                                                                                                      |
| Classical only     | 0x001D (X25519)         | Session key established with classical cryptography; no quantum protection, regardless of what the server can support. |
| Hybrid confirmed   | 0x11EC (X25519MLKEM768) | Session protected by both X25519 and ML-KEM-768 (IANA group 4588); secure unless both are broken.                      |
| Unknown            | Unrecognized group      | Identifier not in the known registry; flagged for manual review rather than assumed safe.                              |

Wire-level verification exposes a failure mode that no configuration audit can detect: the application-layer-versus-transport-layer mismatch. A server may initialize post-quantum primitives at the application layer—its monitoring endpoint confirms they are loaded, a configuration audit reports PQC support, certificate inspection finds nothing wrong—while its TLS frontend runs a classical build with no PQC group support and negotiates classical X25519 on every connection. The application-layer PQC is cryptographically isolated from the transport security layer, and only ServerHello parsing reveals it. This is not an edge case; it is the default state of systems that began PQC work at the application layer without upgrading the TLS frontend. One further subtlety undercuts most deployment surveys: a server selects a key-share group only from those the client advertises, so a measurement client running stock tooling that offers only classical groups will record classical negotiation even against a fully PQC-capable server—meaning surveys systematically undercount real capability unless the measurement tooling is itself PQC-capable. The operational question that closes this loop is concrete: of the TLS sessions your infrastructure completed in the last twenty-four hours, what percentage actually negotiated a hybrid or post-quantum key exchange? An organization that cannot answer that knows its configuration, not its posture.

## 18.5 The Cost of Keys and Signatures: A Sizing Lens for Algorithm Choice

When more than one quantum-safe signature scheme fits a job, the deciding factor is often size—but raw byte counts mislead, because in TLS the public key and the signature are not transmitted equally often. A server sends its certificate’s public key once, but signatures appear several times across a certificate chain and handshake. A useful weighting popularized by Cloudflare captures this asymmetry in a single figure of merit, where smaller is better:

**Cost = 6 × sig + 2 × pk**

Because the signature term carries three times the weight of the public-key term, a scheme with a small signature can win even if its public key is comparatively large—and a scheme with a tiny public key but a bulky signature, such as SLH-DSA, scores poorly. Under this lens the classical baselines (EdDSA, ECDSA) remain smallest, FN-DSA (Falcon) is the most economical of the standardized post-quantum signatures, ML-DSA sits a step behind it, and SLH-DSA is the most expensive—consistent with its role as a conservative, security-margin backup rather than an everyday default. The framework is a practical reminder that “which PQC signature?” is partly a bandwidth-budget question, and the answer depends on where in the certificate hierarchy the algorithm sits and how often its output crosses the wire.

This sizing pressure is also why NIST is running a separate “additional signatures” on-ramp alongside the finalized standards, hunting for general-purpose schemes—especially non-lattice ones—with better size or diversity properties. As of 2026 that process has narrowed to a third round of nine candidates: FAEST, HAWK, MAYO, MQOM, QR-UOV, SDitH, SNOVA, SQIsign, and UOV. Several of the multivariate entrants (MAYO, QR-UOV, SNOVA, and UOV itself) are pursued precisely for their compact signatures, which would score well on the cost metric above—though, as the SIKE collapse in §6 warns, a favorable size profile is no substitute for surviving sustained cryptanalysis, and several of these candidates have already absorbed attacks during evaluation.

## 18.6 A Quieter Corner: Is Format-Preserving Encryption Quantum-Safe?

One category of encryption rarely appears in PQC discussions but sits in many institutional databases: format-preserving encryption (FPE). FPE encrypts a value so that the ciphertext keeps the same shape as the plaintext—a sixteen-digit card number becomes a different sixteen-digit number, a nine-digit identifier stays nine digits. That property is what lets organizations protect sensitive fields without rebuilding every database schema and downstream form that expects a particular length and character set, which is why FPE is common in payments, healthcare, and library patron records. The natural question for a migration planner is whether FPE, too, needs to be swapped for something post-quantum.

The reassuring part of the answer is that the NIST-specified FPE methods are built on AES, a symmetric cipher. As §14 explains, symmetric encryption is not broken by Shor’s algorithm; it faces only Grover’s quadratic speed-up, answered by using an adequate key length. So the quantum margin of FPE is, like that of AES itself, a key-size question rather than an existential one—and not where the real risk lives. The instructive part of the answer is that FPE’s genuine weaknesses have nothing to do with quantum computers at all. They come from the small, enumerable domains FPE is often asked to protect. When the universe of possible plaintexts is tiny—think of a field that can only hold a few thousand valid values—an attacker who can observe or request enough encryptions can mount statistical and reconstruction attacks regardless of key strength, and deterministic FPE (the same input always producing the same output under a given key and tweak) leaks equality, letting an adversary link and count records even without decrypting them.

This is exactly the class of vulnerability that has driven NIST’s ongoing revision of the FPE standard. The original 2016 specification (SP 800-38G) defined two methods, FF1 and FF3; researchers subsequently found that both were exploitable when the domain was too small, and that FF3’s tweak handling was independently weak. NIST’s draft revision (SP 800-38G Rev. 1, with a second public draft in 2025) responds by removing the original FF3 method entirely, increasing the minimum domain size for FF1, and tightening its implementation rules. It is worth being precise here, because secondary summaries often garble it: the draft removes FF3, not the later patched variant FF3-1, and as of 2026 the revision remains a draft rather than a finalized standard. The practical takeaway for a planner mirrors the theme of §6—quantum-safe is a present-tense judgment, not a permanent label. For FPE specifically, the live questions are whether the domain is large enough to resist enumeration, whether tweaks are used well enough to avoid leaking equality, and whether the deployment tracks the current draft—well before anyone needs to worry about a quantum computer.

# 19. The NIST Standardization Process

To prevent internet fragmentation—where Apple invents one math and Google invents another—the National Institute of Standards and Technology (NIST) stepped in as the global referee. In 2016, NIST announced a worldwide competition inviting the world’s best mathematicians and cryptographers to submit post-quantum algorithms.

Over eight years, submissions were subjected to brutal global peer review. Hackers and academics spent years trying to crack each other’s work. Some algorithms were broken in days; others survived years before a fatal flaw emerged. The most dramatic casualty was SIKE (isogeny-based), shattered in 2022 by two researchers using a standard desktop.

In August 2024, NIST published the first official standardized PQC algorithms: FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), and FIPS 205 (SLH-DSA). In March 2025, NIST selected HQC (Hamming Quasi-Cyclic) as a fifth algorithm for standardization—a code-based KEM that provides a critical non-lattice backup to ML-KEM. HQC is built on different mathematical foundations than ML-KEM, ensuring that if a weakness is discovered in lattice-based approaches, an alternative method for post-quantum key exchange remains available. Additional algorithms remain under evaluation, including Classic McEliece for static high-security environments and a separate “additional signatures” on-ramp launched to broaden the signature portfolio beyond the two lattice schemes and one hash scheme already standardized. As of 2026 that on-ramp has advanced to a third round of nine candidates—FAEST, HAWK, MAYO, MQOM, QR-UOV, SDitH, SNOVA, SQIsign, and UOV—spanning multivariate, code-based, MPC-in-the-head, and isogeny constructions, with NIST particularly interested in general-purpose, non-lattice options for mathematical diversity.

A fourth signature algorithm rounds out the standardization roadmap: FN-DSA (FIPS 206), based on the FALCON scheme. Like ML-DSA, FN-DSA is lattice-based, but it is built on the NTRU lattice problem and uses floating-point Fast Fourier sampling to produce compact signatures—substantially smaller than ML-DSA’s—at the cost of a more delicate, harder-to-implement signing procedure. NIST selected FALCON to complement the existing three standards, giving deployers a small-signature option for bandwidth-constrained contexts where ML-DSA’s larger signatures are impractical. As of this writing FIPS 206 remains in development: NIST submitted the draft standard for approval in August 2025 and has previewed the Initial Public Draft, with the final standard widely expected in late 2026 or early 2027. Because FALCON’s signing is delicate, FN-DSA is anticipated to fit best at the root and intermediate certificate tiers—where signing is infrequent and tightly controlled—rather than on frequently signed leaf certificates.

# 20. Enterprise PQC Migration: Meta’s Framework

In April 2026, Meta published a comprehensive PQC migration framework—one of the most detailed enterprise playbooks publicly available—offering practical guidance for any organization navigating the transition. The framework is built around two core concepts: a maturity model for assessing readiness and a six-step migration strategy.

## 20.1 PQC Maturity Levels

Meta proposes five maturity levels, laddered by how rapidly an organization can respond to a quantum-relevant event:

- **PQ-Unaware:** The organization is not aware of the quantum threat. Most vulnerable position.

- **PQ-Aware:** Initial assessment completed, but no protections designed.

- **PQ-Ready:** Post-quantum solution implemented but not yet deployed in production.

- **PQ-Hardened:** All available PQ protections deployed, with some gaps remaining for primitives not yet developed.

- **PQ-Enabled:** Full quantum protection achieved. The ultimate goal.

## 20.2 The Six-Step Migration Strategy

- **Step 1 — Prioritization:** Classify applications by risk. High: SNDL-vulnerable systems. Medium: online quantum attack targets. Low: symmetric-only systems.

- **Step 2 — Cryptographic Inventory:** Map all cryptographic usage using automated discovery tools supplemented by developer reporting.

- **Step 3 — Address External Dependencies:** Identify blockers: community standards (NIST, IETF, ISO), hardware support (HSMs, CPUs), and production PQC implementations (LibOQS).

- **Step 4 — Design PQC Components:** Select algorithms per NIST recommendations: ML-KEM for key exchange, ML-DSA for signatures. Prefer ML-KEM-768 with exceptions for ML-KEM-512 where performance is prohibitive.

- **Step 5 — Implement PQC Guardrails:** Update internal guidelines, discourage new quantum-vulnerable keys, block affected APIs in build systems.

- **Step 6 — Integrate PQC Components:** Deploy via hybrid approach or replacement. Meta prioritizes hybrid to maintain a classical safety net.

## 20.3 Key Takeaways for Any Organization

Meta’s framework emphasizes four principles: effectiveness (withstand quantum adversaries), timeliness (align with evolving standards), performance (no degradation of user experience), and cost efficiency (balance investment with risk). The framework acknowledges that full PQ-Enabled status may take years of phased work—but every step up the maturity ladder reduces an organization’s exposure window.

## 20.4 Estimating the Effort: From Open-Ended Migration to a Countable Number

A maturity model tells an organization where it stands; it does not tell leadership how much work remains or what that work will cost. That gap is where most migration plans stall, because “move everything to post-quantum cryptography” sounds boundless and therefore un-budgetable. A useful complement to the maturity ladder is a volume-based estimation model that turns the migration into a countable quantity. The central idea is the migration unit: a single discrete place where cryptography is used and must be changed—a certificate, a key store, a protocol endpoint, an embedded library, a hardware security module integration. An organization first counts its migration units (the cryptographic inventory it should already be building), then assigns each one a complexity tier reflecting how hard that particular change will be. A TLS endpoint behind a modern load balancer is low-complexity; a cryptographic routine baked into firmware on fielded devices is high-complexity, and may be effectively immovable until the next hardware refresh.

Total effort then falls out of a simple volume calculation—the number of migration units multiplied by the effort each tier demands—rather than a single intimidating guess. The value of this approach is not arithmetic precision; the early numbers will be rough. Its value is that it converts an open-ended anxiety into a defensible estimate that can be staffed, scheduled, and revised as the inventory sharpens. It also exposes the shape of the problem: most organizations discover that a small number of high-complexity units (often the un-upgradable embedded and legacy systems) dominate the total, which is precisely the information needed to sequence the work and to decide where compensating controls must stand in for migration that cannot happen on time.

# 21. Sources

*ShreehariMenon, "What is Cryptography and Why It Matters Today?" MeetCyber, Feb 6, 2026.*

*ShreehariMenon, "Encryption vs Hashing vs Digital Signatures: Understanding the Core of Digital Security," MeetCyber, Feb 13, 2026.*

*ShreehariMenon, "Symmetric vs. Asymmetric Encryption Explained," MeetCyber, Feb 20, 2026.*

*ShreehariMenon, "How Internet Security Works: TLS, HTTPS & Certificates," MeetCyber, Feb 27, 2026.*

*ShreehariMenon, "RSA Explained: The Simple Math Behind Internet Security," MeetCyber, Mar 6, 2026.*

*ShreehariMenon, "ECC Explained: The Geometry Powering Modern Digital Security," MeetCyber, Mar 13, 2026.*

*ShreehariMenon, "Why Current Cryptography Will Eventually Break," MeetCyber, Mar 20, 2026.*

*ShreehariMenon, "The Quantum Threat: How Quantum Computers Will Break Modern Cryptography," MeetCyber, Mar 27, 2026.*

*ShreehariMenon, "What is Post-Quantum Cryptography? The Internet’s New Armor," MeetCyber, Apr 2, 2026.*

*ShreehariMenon, "Classical vs Post-Quantum Cryptography: What Developers Need to Know," MeetCyber, Apr 10, 2026.*

*ShreehariMenon, "The NIST Post-Quantum Cryptography Standardization Process," MeetCyber, Apr 17, 2026.*

*ShreehariMenon, "Types of PQC Algorithms Overview — The Five Families of Defense," MeetCyber, Apr 24, 2026.*

*ShreehariMenon, "Beyond RSA: How Lattices Are Building Quantum-Resistant Security," MeetCyber, Apr 30, 2026.*

*ShreehariMenon, "Learning With Errors: The Core Puzzle of Post-Quantum Cryptography," MeetCyber, May 8, 2026.*

*ShreehariMenon, "How CRYSTALS-Kyber Uses Noisy Math to Defeat Quantum Computers," MeetCyber, May 16, 2026.*

*ShreehariMenon, "How CRYSTALS-Dilithium Protects the Internet from Quantum Hackers," MeetCyber, May 2026.*

*Lizzie Danielson, "Cryptographic Algorithms Made Simple for Digital Security," Huntress, Jul 30, 2025.*

*Brett Crawley, "Get PQC Ready PDQ — Part 1: Quantum, AI, and the Window That’s Already Closing," Medium, May 13, 2026.*

*Rafael Misoczki, Isaac Elbaz, and Forrest Mertens, "Post-Quantum Cryptography Migration at Meta: Framework, Lessons, and Takeaways," Engineering at Meta, Apr 16, 2026.*

*Craig Costello, "Quantum Computers Could Break Encryption Far Sooner Than We Realized," ScienceAlert / The Conversation, Apr 13, 2026.*

*Anthropic, "Project Glasswing: Securing Critical Software for the AI Era," Anthropic Blog, May 2026.*

*NIST, FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA), August 2024.*

*NIST IR 8547, "Transition to Post-Quantum Cryptography Standards," November 2024.*

*Shashank, "What is Cryptography? — It’s Types, Algorithms and Features," Edureka, Feb 6, 2025.*

*"\[Literature Review\] Post-Quantum Cryptography in the 5G Core," 2026. (Lab-validated PQC performance benchmarks in open5gs/liboqs 5GC testbed.)*

*Farida Ismail, "They’re Already Stealing Your Encrypted Data. They Just Can’t Read It Yet.," Medium, May 2026.*

*Shujaatali Badami, "When Quantum Advantage Becomes a Distraction," Medium, May 2026. (Surface-code overhead model; ICS/firmware-leak counterpoint; CISA ICSA-26-146 advisory series; PQ-EDHOC.)*

*Huzaifah Tahir, "Grover Bug: Exploiting Quantum Bias," Medium, May 2026. (Pedagogical CTF challenge illustrating statistical measurement bias as a side-channel.)*

*Huzaifah Tahir, "Quantum Teleportation Bug: Exploiting Measurement Bias in a Broken Quantum Protocol," Medium, May 2026. (Pedagogical CTF challenge; bias = P(observed) − P(expected) detection method; cross-domain side-channel mapping.)*

*Shubham Kumar, "PQCA CBOM Kit (formerly IBM)," Medium, Feb 28, 2026. (Cryptographic Bill of Materials concept; CycloneDX v1.6 cryptographic-asset format; source-code vs. runtime-artifact discovery; PQCA/Linux Foundation CBOM Kit components and quantum-safe compliance checking.)*

*Denys Popov, "SPHINCS+ — The Stateless Hash-Based Signature Scheme," Medium, Apr 22, 2026. (SLH-DSA mechanism: WOTS+ one-time signatures, FORS, Merkle trees, and hypertree; statelessness versus stateful LMS/XMSS; conservative hash-based security margin.)*

*Ümit Aygül, "ZKP Systems Series" (Articles 5, 7, 8): "Hash Functions All the Way Down," "The Quantum Threat: Which Proof Systems Survive," and "The Grand Comparison," Medium, Apr 2026. (Quantum posture of zero-knowledge proof systems; ECDLP/KZG/pairing-based systems broken by Shor’s; hash- and FRI-based systems quantum-safe.)*

*Tin Erispe, "Cryptographic Agility," Medium, Apr 24, 2026. (Negotiation-layer versus execution-layer algorithm placement; TLS handshake agility; immutable blockchain/ZK-rollup verifiers; architectural versus mathematical rigidity; the address-as-hash identity-coupling trap.)*

*Darwin Gosal, "Quantum-Safe, or Quantum-Scented?," Medium, May 12, 2026. (PQC versus QKD versus quantum cryptography distinctions; BB84/E91; the Castryck–Decru SIKE break and the limits of the “quantum-safe” label; crypto-agility as the real enterprise task.)*

*Muhammad Ibrahim, "Wire-Level PQC Detection: What Your TLS Handshakes Are Actually Saying," Level Up Coding, Apr 17, 2026. (Configuration versus negotiation; ServerHello key_share parsing; named-group identifiers 0x001D and 0x11EC; application-layer versus transport-layer PQC mismatch; client-side measurement undercount.)*

*Shiva Kumar Billana, "I Built a Quantum-Safe TLS Server Using Post-Quantum Cryptography," Medium, May 12, 2026. (Hybrid PQC TLS demo with liboqs/oqs-provider; ML-DSA-65 certificates; Wireshark evidence of the 1,124-byte X25519MLKEM768 key share versus 32-byte classical X25519.)*

*Pranshu Rastogi, “What Breaks When the Q-Day Arrives on Ethereum? P1: Signatures” and “P2: ZK Proofs,” Medium, Mar 2026. (Ethereum quantum-vulnerable surface—ECDSA accounts, BLS validator signatures, KZG commitments, ZK proofs; public-key exposure on first transaction; the Ethereum Foundation Strawmap roadmap; EIP-8141 frame transactions and account abstraction as post-quantum migration paths.)*

*Ümit Aygül, “BIP 360 and the Quantum Threat to Bitcoin: A Cryptographic Deep Dive,” Medium, Apr 2026. (Pay-to-Merkle-Root (P2MR) output type; Taproot’s long-exposure key-path flaw; long- versus short-exposure quantum attack models; post-quantum signatures as a planned follow-on.)*

*Google Quantum AI, Ethereum Foundation, and Stanford University, “Securing Elliptic Curve Cryptocurrencies against Quantum Vulnerabilities: Resource Estimates and Mitigations,” Mar 30, 2026. (ECDLP-256 on secp256k1 with ≤1,200 logical qubits / 90M Toffoli gates or ≤1,450 / 70M; \<500,000 physical qubits; zero-knowledge-proof responsible disclosure.)*

*Radu Popa, “The Quantum-Safe Internet Started in 2025. Europe’s Financial Infrastructure Hasn’t Caught Up.,” Medium, Mar 2026. (eIDAS 2 / EUDI Wallet mandate; the QTSP gap between private and publicly trusted ML-DSA certificates; EN 319 411-2 audit and FIPS 140-3 / Common Criteria HSM certification as the bottleneck; transport-layer hybrid TLS as the low-friction first step.)*

*Mhidat, “The Quantum Threat: Why Perfect Forward Secrecy Alone Is No Longer Enough,” Medium, Mar 2026. (Why PFS protects against classical key compromise but not against a harvested-traffic quantum attack; Microsoft and Palo Alto Networks PQC deployment status.)*

*Prof. Bill Buchanan OBE FRSE, “The Cost of PQC Keys and Signatures,” Medium, Mar 2026. (The Cloudflare sizing metric Cost = 6 × sig + 2 × pk; relative cost of EdDSA/ECDSA, FN-DSA, ML-DSA, and SLH-DSA; the NIST additional-signatures on-ramp candidates.)*

*Duplys, “Harvest Now, Decrypt Later: The Information Half-Life Problem,” TLS-Cryptography blog, 2026. (The nuclear-physics half-life analogy for harvested data; the insight that not all intercepted data still holds value when a CRQC arrives, refining the Mosca inequality into a per-asset judgment.)*

*Gutschow, “Is Your Format-Preserving Encryption Quantum-Safe?” 2026, read alongside NIST SP 800-38G Rev. 1 (2nd Public Draft, Feb 2025). (Why the real quantum-era weakness in FPE is small enumerable domains and determinism rather than key size; the draft revision’s removal of FF3 and tightening of FF1.)*

*Kamimura, “Hybrid PQC Signatures for Tamper-Evident Audit Trails,” SSRN working paper, 2026. (The trust-now-forge-later problem for long-retention audit logs; Merkle-root batching to amortize a large post-quantum signature across many logged events.)*

*Wisdom (PL Capital), “Fully Homomorphic Encryption as a Bet on Quantum Resilience,” 2026. (Why FHE’s lattice/LWE foundation makes it inherently quantum-resistant, and why compute-on-ciphertext belongs in the “what survives” column of the quantum-impact analysis.)*

*Ropponen, “Estimating the Quantum-Safe Transformation,” 2026. (A volume-based migration-effort model built on “migration units” and complexity tiers, turning an open-ended migration into a countable, plannable estimate.)*

*“Whether you eat or drink, or whatever you do, do it all for the glory of God.”*

— 1 Corinthians 10:31