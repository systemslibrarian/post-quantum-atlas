// app/components/SonarHero.tsx
// Quantum sonar — three pulsing rings around a central node. The signature visual.

export default function SonarHero({ size = 320 }: { size?: number }) {
  return (
    <div
      className="relative mx-auto"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="sonarCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#a78bfa" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0a0e17" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sonarRing" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#a78bfa" stopOpacity="0" />
            <stop offset="60%" stopColor="#a78bfa" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.45" />
          </radialGradient>
        </defs>

        {/* Soft ambient glow */}
        <circle cx="50" cy="50" r="48" fill="url(#sonarCore)" opacity="0.4" />

        {/* Pulsing rings — staggered animation delays */}
        <g style={{ transformOrigin: "50% 50%" }}>
          <circle cx="50" cy="50" r="22" fill="none" stroke="#a78bfa" strokeWidth="0.4" strokeOpacity="0.7" className="sonar-ring" style={{ animationDelay: "0s" }} />
          <circle cx="50" cy="50" r="22" fill="none" stroke="#a78bfa" strokeWidth="0.4" strokeOpacity="0.5" className="sonar-ring" style={{ animationDelay: "1.3s" }} />
          <circle cx="50" cy="50" r="22" fill="none" stroke="#a78bfa" strokeWidth="0.4" strokeOpacity="0.35" className="sonar-ring" style={{ animationDelay: "2.6s" }} />
        </g>

        {/* Static reference rings */}
        <circle cx="50" cy="50" r="32" fill="none" stroke="#334155" strokeWidth="0.15" strokeDasharray="0.4 0.6" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#334155" strokeWidth="0.12" strokeDasharray="0.3 0.7" />

        {/* Crosshair axes */}
        <line x1="6"  y1="50" x2="94" y2="50" stroke="#334155" strokeWidth="0.08" />
        <line x1="50" y1="6"  x2="50" y2="94" stroke="#334155" strokeWidth="0.08" />

        {/* Core node */}
        <circle cx="50" cy="50" r="3" fill="#a78bfa" />
        <circle cx="50" cy="50" r="6" fill="none" stroke="#a78bfa" strokeWidth="0.3" strokeOpacity="0.5" />

        {/* Algorithm anchor points around the ring */}
        {[
          { angle: -90, label: "ML-KEM" },
          { angle: -30, label: "ML-DSA" },
          { angle: 30,  label: "SLH-DSA" },
          { angle: 90,  label: "X25519" },
          { angle: 150, label: "HQC" },
          { angle: -150, label: "FALCON" },
        ].map(({ angle, label }, i) => {
          const r = 32;
          const rad = (angle * Math.PI) / 180;
          const x = 50 + r * Math.cos(rad);
          const y = 50 + r * Math.sin(rad);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="1.4" fill="#a78bfa" fillOpacity="0.6" />
              <text
                x={x}
                y={y + 3.2}
                textAnchor="middle"
                fontSize="2"
                fill="#94a3b8"
                fontFamily="JetBrains Mono, monospace"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
