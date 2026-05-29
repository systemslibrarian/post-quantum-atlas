// app/components/Diagram.tsx
// Inline SVG explainer diagrams used by lesson sections.
// Each diagram is a self-contained pure component with sensible defaults.

export type DiagramId =
  | "cia-triad"
  | "rsa-trapdoor"
  | "symmetric-vs-asymmetric"
  | "tls-handshake"
  | "lattice-lwe"
  | "byte-sizes";

interface DiagramProps {
  id: DiagramId;
  caption?: string;
}

export default function Diagram({ id, caption }: DiagramProps) {
  const Component = registry[id];
  return (
    <figure className="my-8">
      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/40 p-4 sm:p-6">
        <Component />
      </div>
      {caption && (
        <figcaption className="mt-2 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

const registry: Record<DiagramId, () => React.ReactElement> = {
  "cia-triad": CiaTriad,
  "rsa-trapdoor": RsaTrapdoor,
  "symmetric-vs-asymmetric": SymmetricAsymmetric,
  "tls-handshake": TlsHandshake,
  "lattice-lwe": LatticeLwe,
  "byte-sizes": ByteSizes,
};

// ─────────────────────────────────────────────────────────────────────────────
// 1) CIA Triad
// Three overlapping circles with cryptographic tools labeled.
// ─────────────────────────────────────────────────────────────────────────────
function CiaTriad() {
  return (
    <svg viewBox="0 0 400 320" className="w-full h-auto" role="img" aria-label="The CIA triad: three overlapping circles for Confidentiality, Integrity, and Authentication, intersecting at trust.">
      <title>The CIA triad</title>
      {/* Triangle reference lines (very faint) */}
      <polygon points="200,60 90,250 310,250" fill="none" stroke="#1e293b" strokeWidth="0.5" />

      {/* Three circles */}
      <circle cx="200" cy="120" r="85" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeOpacity="0.7" strokeWidth="1.5" />
      <circle cx="150" cy="200" r="85" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeOpacity="0.7" strokeWidth="1.5" />
      <circle cx="250" cy="200" r="85" fill="rgba(52,211,153,0.12)" stroke="#34d399" strokeOpacity="0.7" strokeWidth="1.5" />

      {/* Labels */}
      <text x="200" y="60" textAnchor="middle" fontSize="14" fontWeight="700" fill="#a78bfa" fontFamily="Outfit, sans-serif">Confidentiality</text>
      <text x="200" y="78" textAnchor="middle" fontSize="10" fill="#cbd5e1" fontFamily="JetBrains Mono, monospace">AES · ML-KEM</text>

      <text x="78" y="270" textAnchor="middle" fontSize="14" fontWeight="700" fill="#38bdf8" fontFamily="Outfit, sans-serif">Integrity</text>
      <text x="78" y="286" textAnchor="middle" fontSize="10" fill="#cbd5e1" fontFamily="JetBrains Mono, monospace">SHA-256 · HMAC</text>

      <text x="322" y="270" textAnchor="middle" fontSize="14" fontWeight="700" fill="#34d399" fontFamily="Outfit, sans-serif">Authentication</text>
      <text x="322" y="286" textAnchor="middle" fontSize="10" fill="#cbd5e1" fontFamily="JetBrains Mono, monospace">ML-DSA · Ed25519</text>

      {/* Center "trust" */}
      <circle cx="200" cy="180" r="22" fill="#0a0e17" stroke="#f1f5f9" strokeOpacity="0.5" strokeWidth="0.8" />
      <text x="200" y="178" textAnchor="middle" fontSize="11" fontWeight="600" fill="#f1f5f9" fontFamily="Outfit, sans-serif">trust</text>
      <text x="200" y="192" textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="JetBrains Mono, monospace">TLS · PKI</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2) RSA Trapdoor
// Multiplying two primes (easy) vs factoring N (hard).
// ─────────────────────────────────────────────────────────────────────────────
function RsaTrapdoor() {
  return (
    <svg viewBox="0 0 600 280" className="w-full h-auto" role="img" aria-label="RSA trapdoor: multiplying two primes is fast; factoring the product is infeasible without the secret.">
      <title>The RSA trapdoor</title>
      {/* Top: easy direction */}
      <g>
        <rect x="20" y="40" width="80" height="40" rx="8" fill="rgba(52,211,153,0.15)" stroke="#34d399" strokeWidth="1" />
        <text x="60" y="58" textAnchor="middle" fontSize="11" fill="#34d399" fontFamily="JetBrains Mono, monospace">prime P</text>
        <text x="60" y="72" textAnchor="middle" fontSize="9" fill="#cbd5e1" fontFamily="JetBrains Mono, monospace">2,048-bit</text>

        <rect x="120" y="40" width="80" height="40" rx="8" fill="rgba(52,211,153,0.15)" stroke="#34d399" strokeWidth="1" />
        <text x="160" y="58" textAnchor="middle" fontSize="11" fill="#34d399" fontFamily="JetBrains Mono, monospace">prime Q</text>
        <text x="160" y="72" textAnchor="middle" fontSize="9" fill="#cbd5e1" fontFamily="JetBrains Mono, monospace">2,048-bit</text>

        <path d="M 210 60 L 330 60" stroke="#34d399" strokeWidth="1.5" markerEnd="url(#arrowGreen)" />
        <text x="270" y="50" textAnchor="middle" fontSize="11" fill="#34d399" fontFamily="Outfit, sans-serif">multiply</text>
        <text x="270" y="76" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="JetBrains Mono, monospace">~1 ms</text>

        <rect x="340" y="35" width="240" height="50" rx="8" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1" />
        <text x="460" y="55" textAnchor="middle" fontSize="11" fill="#a78bfa" fontFamily="JetBrains Mono, monospace">N = P × Q</text>
        <text x="460" y="72" textAnchor="middle" fontSize="9" fill="#cbd5e1" fontFamily="JetBrains Mono, monospace">4,096-bit (the public key)</text>
      </g>

      {/* Divider */}
      <line x1="40" y1="130" x2="560" y2="130" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
      <text x="300" y="125" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="Outfit, sans-serif" letterSpacing="2">THE TRAPDOOR</text>

      {/* Bottom: hard direction */}
      <g>
        <rect x="340" y="170" width="240" height="50" rx="8" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1" />
        <text x="460" y="190" textAnchor="middle" fontSize="11" fill="#a78bfa" fontFamily="JetBrains Mono, monospace">N (the public key)</text>
        <text x="460" y="207" textAnchor="middle" fontSize="9" fill="#cbd5e1" fontFamily="JetBrains Mono, monospace">all you know without the secret</text>

        <path d="M 340 195 L 220 195" stroke="#f87171" strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#arrowRed)" />
        <text x="280" y="185" textAnchor="middle" fontSize="11" fill="#f87171" fontFamily="Outfit, sans-serif">factor?</text>
        <text x="280" y="210" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="JetBrains Mono, monospace">classical: &gt; age of universe</text>

        <rect x="120" y="170" width="80" height="50" rx="8" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3 3" />
        <text x="160" y="190" textAnchor="middle" fontSize="11" fill="#a78bfa" fillOpacity="0.6" fontFamily="JetBrains Mono, monospace">P? Q?</text>
        <text x="160" y="206" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="JetBrains Mono, monospace">the private key</text>

        <text x="60" y="195" textAnchor="middle" fontSize="9" fill="#f87171" fontFamily="Outfit, sans-serif">Shor&apos;s:</text>
        <text x="60" y="210" textAnchor="middle" fontSize="9" fill="#f87171" fontFamily="JetBrains Mono, monospace">~minutes</text>
      </g>

      <defs>
        <marker id="arrowGreen" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
        </marker>
        <marker id="arrowRed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171" />
        </marker>
      </defs>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3) Symmetric vs Asymmetric
// Side-by-side panels showing the two key models.
// ─────────────────────────────────────────────────────────────────────────────
function SymmetricAsymmetric() {
  return (
    <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Symmetric encryption uses one shared key; asymmetric encryption uses a public-private key pair.">
      <title>Symmetric vs. asymmetric encryption</title>
      {/* Divider */}
      <line x1="320" y1="20" x2="320" y2="260" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />

      {/* LEFT — Symmetric */}
      <text x="160" y="32" textAnchor="middle" fontSize="13" fontWeight="600" fill="#34d399" fontFamily="Outfit, sans-serif" letterSpacing="2">SYMMETRIC</text>
      <text x="160" y="48" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="JetBrains Mono, monospace">AES · ChaCha20</text>

      {/* Alice */}
      <circle cx="60" cy="120" r="22" fill="rgba(52,211,153,0.15)" stroke="#34d399" strokeWidth="1" />
      <text x="60" y="124" textAnchor="middle" fontSize="11" fill="#34d399" fontFamily="Outfit, sans-serif">Alice</text>
      <KeyIcon cx={60} cy={170} tone="#34d399" />
      <text x="60" y="200" textAnchor="middle" fontSize="9" fill="#cbd5e1" fontFamily="JetBrains Mono, monospace">shared key</text>

      {/* Bob */}
      <circle cx="260" cy="120" r="22" fill="rgba(52,211,153,0.15)" stroke="#34d399" strokeWidth="1" />
      <text x="260" y="124" textAnchor="middle" fontSize="11" fill="#34d399" fontFamily="Outfit, sans-serif">Bob</text>
      <KeyIcon cx={260} cy={170} tone="#34d399" />
      <text x="260" y="200" textAnchor="middle" fontSize="9" fill="#cbd5e1" fontFamily="JetBrains Mono, monospace">shared key (same)</text>

      {/* Ciphertext */}
      <path d="M 82 120 L 238 120" stroke="#34d399" strokeWidth="1.2" markerEnd="url(#arrowG)" />
      <text x="160" y="112" textAnchor="middle" fontSize="9" fill="#34d399" fontFamily="JetBrains Mono, monospace">ciphertext</text>

      <text x="160" y="235" textAnchor="middle" fontSize="10" fill="#f87171" fontFamily="Outfit, sans-serif">Problem: how do they share the key?</text>

      {/* RIGHT — Asymmetric */}
      <text x="480" y="32" textAnchor="middle" fontSize="13" fontWeight="600" fill="#a78bfa" fontFamily="Outfit, sans-serif" letterSpacing="2">ASYMMETRIC</text>
      <text x="480" y="48" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="JetBrains Mono, monospace">RSA · ECC · ML-KEM</text>

      <circle cx="380" cy="120" r="22" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1" />
      <text x="380" y="124" textAnchor="middle" fontSize="11" fill="#a78bfa" fontFamily="Outfit, sans-serif">Alice</text>
      <KeyIcon cx={380} cy={170} tone="#a78bfa" />
      <text x="380" y="200" textAnchor="middle" fontSize="9" fill="#cbd5e1" fontFamily="JetBrains Mono, monospace">private key</text>

      <circle cx="580" cy="120" r="22" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1" />
      <text x="580" y="124" textAnchor="middle" fontSize="11" fill="#a78bfa" fontFamily="Outfit, sans-serif">Bob</text>
      <KeyIcon cx={580} cy={170} tone="#a78bfa" open />
      <text x="580" y="200" textAnchor="middle" fontSize="9" fill="#cbd5e1" fontFamily="JetBrains Mono, monospace">Alice&apos;s public key</text>

      <path d="M 558 120 L 402 120" stroke="#a78bfa" strokeWidth="1.2" markerEnd="url(#arrowQ)" />
      <text x="480" y="112" textAnchor="middle" fontSize="9" fill="#a78bfa" fontFamily="JetBrains Mono, monospace">encrypted with public key</text>

      <text x="480" y="235" textAnchor="middle" fontSize="10" fill="#34d399" fontFamily="Outfit, sans-serif">Solves: public key is shared openly.</text>

      <defs>
        <marker id="arrowG" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
        </marker>
        <marker id="arrowQ" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#a78bfa" />
        </marker>
      </defs>
    </svg>
  );
}

function KeyIcon({ cx, cy, tone, open = false }: { cx: number; cy: number; tone: string; open?: boolean }) {
  return (
    <g>
      <circle cx={cx - 8} cy={cy} r="6" fill="none" stroke={tone} strokeWidth="1.5" />
      {open && <circle cx={cx - 8} cy={cy} r="3" fill="none" stroke={tone} strokeWidth="1" />}
      <rect x={cx - 2} y={cy - 2} width="14" height="4" fill={tone} />
      <rect x={cx + 6} y={cy - 4} width="3" height="6" fill={tone} />
      <rect x={cx + 10} y={cy - 4} width="2" height="5" fill={tone} />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4) TLS Handshake — static sequence diagram
// ─────────────────────────────────────────────────────────────────────────────
function TlsHandshake() {
  const steps = [
    { id: 1, dir: "right", label: "Client Hello", detail: "ciphers + key share" },
    { id: 2, dir: "left",  label: "Server Hello + Certificate", detail: "cipher + cert (CA-signed)" },
    { id: 3, dir: "right", label: "Key share / Finished", detail: "derive session key" },
    { id: 4, dir: "both",  label: "Application data", detail: "AES-GCM" },
  ];
  const colW = 220;
  const startY = 80;
  const stepH = 50;

  return (
    <svg viewBox="0 0 600 320" className="w-full h-auto" role="img" aria-label="TLS 1.3 handshake: client and server exchange hellos, derive a session key, then switch to symmetric AES-GCM.">
      <title>TLS 1.3 handshake</title>
      {/* Columns */}
      <text x="100" y="40" textAnchor="middle" fontSize="13" fontWeight="600" fill="#38bdf8" fontFamily="Outfit, sans-serif">Client (browser)</text>
      <text x="500" y="40" textAnchor="middle" fontSize="13" fontWeight="600" fill="#a78bfa" fontFamily="Outfit, sans-serif">Server (example.com)</text>
      <line x1="100" y1="55" x2="100" y2="290" stroke="#38bdf8" strokeOpacity="0.4" strokeDasharray="3 3" />
      <line x1="500" y1="55" x2="500" y2="290" stroke="#a78bfa" strokeOpacity="0.4" strokeDasharray="3 3" />

      {steps.map((s, i) => {
        const y = startY + i * stepH;
        const isAsym = i < 2;
        const tone = isAsym ? "amber" : "emerald";
        const toneHex = isAsym ? "#fbbf24" : "#34d399";
        return (
          <g key={s.id}>
            {s.dir === "right" && (
              <line x1="100" y1={y} x2="500" y2={y} stroke={toneHex} strokeWidth="1.5" markerEnd={`url(#arrow-r-${tone})`} />
            )}
            {s.dir === "left" && (
              <line x1="500" y1={y} x2="100" y2={y} stroke={toneHex} strokeWidth="1.5" markerEnd={`url(#arrow-l-${tone})`} />
            )}
            {s.dir === "both" && (
              <>
                <line x1="100" y1={y} x2="500" y2={y} stroke={toneHex} strokeWidth="1.5" markerEnd={`url(#arrow-r-${tone})`} />
                <line x1="500" y1={y + 12} x2="100" y2={y + 12} stroke={toneHex} strokeWidth="1.5" markerEnd={`url(#arrow-l-${tone})`} />
              </>
            )}
            <text x={300} y={y - 6} textAnchor="middle" fontSize="11" fontWeight="600" fill={toneHex} fontFamily="Outfit, sans-serif">
              {s.id}. {s.label}
            </text>
            <text x={300} y={y + (s.dir === "both" ? 27 : 14)} textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="JetBrains Mono, monospace">
              {s.detail}
            </text>
          </g>
        );
      })}

      {/* Phase labels */}
      <rect x="20" y="65" width="14" height="105" fill="#fbbf24" fillOpacity="0.15" />
      <text x="27" y="65" textAnchor="end" fontSize="9" fill="#fbbf24" fontFamily="Outfit, sans-serif" transform="rotate(-90 27 65)" letterSpacing="2">ASYMMETRIC</text>

      <rect x="20" y="175" width="14" height="105" fill="#34d399" fillOpacity="0.15" />
      <text x="27" y="175" textAnchor="end" fontSize="9" fill="#34d399" fontFamily="Outfit, sans-serif" transform="rotate(-90 27 175)" letterSpacing="2">SYMMETRIC</text>

      <defs>
        <marker id="arrow-r-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
        </marker>
        <marker id="arrow-l-amber" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 10 0 L 0 5 L 10 10 z" fill="#fbbf24" />
        </marker>
        <marker id="arrow-r-emerald" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
        </marker>
        <marker id="arrow-l-emerald" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 10 0 L 0 5 L 10 10 z" fill="#34d399" />
        </marker>
      </defs>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5) Lattice / LWE
// 2D lattice grid with intentional noise dots overlaid.
// ─────────────────────────────────────────────────────────────────────────────
function LatticeLwe() {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= 8; i++) {
    for (let j = 0; j <= 8; j++) {
      points.push({ x: i, y: j });
    }
  }
  // Deterministic pseudo-random offsets so SSR is stable.
  function noiseFor(i: number, j: number): { dx: number; dy: number } {
    const seed = (i * 73 + j * 131) % 100 / 100;
    const seed2 = (i * 191 + j * 23) % 100 / 100;
    return { dx: (seed - 0.5) * 0.5, dy: (seed2 - 0.5) * 0.5 };
  }

  const scale = 36;
  const ox = 60;
  const oy = 40;

  return (
    <svg viewBox="0 0 600 360" className="w-full h-auto" role="img" aria-label="A clean 2D lattice on the left, the same lattice perturbed by tiny noise vectors on the right.">
      <title>Lattice and the Learning With Errors problem</title>

      {/* LEFT: clean lattice */}
      <text x="170" y="30" textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="Outfit, sans-serif" letterSpacing="2">CLEAN LATTICE</text>
      {points.map((p, i) => (
        <circle key={`c-${i}`} cx={ox + p.x * scale * 0.7} cy={oy + p.y * scale * 0.7} r="2.5" fill="#34d399" />
      ))}
      <text x="170" y="340" textAnchor="middle" fontSize="10" fill="#34d399" fontFamily="Outfit, sans-serif">Gaussian elimination → seconds.</text>

      {/* RIGHT: noisy */}
      <text x="450" y="30" textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="Outfit, sans-serif" letterSpacing="2">LATTICE + NOISE</text>
      {points.map((p, i) => {
        const { dx, dy } = noiseFor(p.x, p.y);
        const cx = 340 + p.x * scale * 0.7 + dx * 8;
        const cy = oy + p.y * scale * 0.7 + dy * 8;
        return (
          <g key={`n-${i}`}>
            <line x1={340 + p.x * scale * 0.7} y1={oy + p.y * scale * 0.7} x2={cx} y2={cy} stroke="#a78bfa" strokeOpacity="0.4" strokeWidth="0.5" />
            <circle cx={cx} cy={cy} r="2.5" fill="#a78bfa" />
            <circle cx={340 + p.x * scale * 0.7} cy={oy + p.y * scale * 0.7} r="1" fill="#334155" />
          </g>
        );
      })}
      <text x="450" y="340" textAnchor="middle" fontSize="10" fill="#a78bfa" fontFamily="Outfit, sans-serif">Find the secret? NP-Hard.</text>

      {/* Divider */}
      <line x1="300" y1="40" x2="300" y2="320" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6) Byte-size comparator
// Horizontal bars to scale (log-ish so McEliece doesn't dwarf everything).
// ─────────────────────────────────────────────────────────────────────────────
interface SizeRow { name: string; bytes: number; note: string; tone: string; }

function ByteSizes() {
  const rows: SizeRow[] = [
    { name: "X25519 public key",  bytes: 32,      note: "classical ECDH",       tone: "#34d399" },
    { name: "Ed25519 signature",  bytes: 64,      note: "classical",            tone: "#34d399" },
    { name: "ML-KEM-768 public key", bytes: 1184, note: "FIPS 203 · hybrid",    tone: "#a78bfa" },
    { name: "ML-KEM-768 ciphertext", bytes: 1088, note: "FIPS 203",             tone: "#a78bfa" },
    { name: "ML-DSA-65 signature",   bytes: 3309, note: "FIPS 204",             tone: "#a78bfa" },
    { name: "FALCON-512 signature",  bytes: 666,  note: "compact lattice sig",  tone: "#38bdf8" },
    { name: "SLH-DSA-128s signature",bytes: 7856, note: "FIPS 205 · hash-based",tone: "#fbbf24" },
    { name: "Classic McEliece PK",   bytes: 261120, note: "static / archival",   tone: "#f87171" },
  ];

  // Logarithmic scale to keep the smallest readable next to the largest.
  const maxLog = Math.log2(rows[rows.length - 1].bytes + 1);
  function width(bytes: number): number {
    return (Math.log2(bytes + 1) / maxLog) * 440;
  }

  return (
    <svg viewBox="0 0 640 360" className="w-full h-auto" role="img" aria-label="Byte sizes drawn to logarithmic scale: classical algorithms are tens of bytes; ML-KEM and ML-DSA are kilobytes; SPHINCS+ is around 8 KB; Classic McEliece is hundreds of kilobytes.">
      <title>Key and signature sizes compared</title>
      <text x="320" y="22" textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="Outfit, sans-serif" letterSpacing="2">SIZES — LOG SCALE</text>

      {rows.map((r, i) => {
        const y = 50 + i * 36;
        const w = width(r.bytes);
        return (
          <g key={i}>
            <text x="180" y={y + 3} textAnchor="end" fontSize="10" fill="#cbd5e1" fontFamily="Outfit, sans-serif">{r.name}</text>
            <rect x="190" y={y - 10} width={w} height="16" rx="3" fill={r.tone} fillOpacity="0.25" stroke={r.tone} strokeWidth="0.7" />
            <text x={195 + w} y={y + 3} fontSize="10" fill={r.tone} fontFamily="JetBrains Mono, monospace">
              {r.bytes.toLocaleString()} B
            </text>
            <text x="180" y={y + 16} textAnchor="end" fontSize="8" fill="#64748b" fontFamily="JetBrains Mono, monospace">{r.note}</text>
          </g>
        );
      })}
    </svg>
  );
}

// Re-export the registry IDs for the curriculum type to consume.
export const DIAGRAM_IDS: DiagramId[] = [
  "cia-triad",
  "rsa-trapdoor",
  "symmetric-vs-asymmetric",
  "tls-handshake",
  "lattice-lwe",
  "byte-sizes",
];
