import { ImageResponse } from "next/og";

// Prerendered at build time. 1200×630 is the OG-card standard.
// `dynamic = "force-static"` is required because the project uses output: "export".
export const dynamic = "force-static";
export const alt = "Post-Quantum Atlas — interactive learning for post-quantum cryptography";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(167,139,250,0.18) 0%, transparent 55%)," +
            "radial-gradient(ellipse at 85% 80%, rgba(56,189,248,0.12) 0%, transparent 55%)," +
            "#0a0e17",
          color: "#f1f5f9",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header strip */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "#94a3b8", letterSpacing: 4, textTransform: "uppercase" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(167,139,250,0.18)", border: "1px solid rgba(167,139,250,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa", fontSize: 28 }}>
            ⚛
          </div>
          <span>Post-Quantum Atlas</span>
        </div>

        {/* Main row: title left, sonar visual right */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
            <div style={{ display: "flex", fontSize: 90, fontWeight: 700, lineHeight: 1.05 }}>
              The future
            </div>
            <div style={{ display: "flex", fontSize: 90, fontWeight: 700, lineHeight: 1.05, color: "#a78bfa", marginBottom: 18 }}>
              wing of the museum.
            </div>
            <div style={{ display: "flex", fontSize: 30, color: "#cbd5e1", lineHeight: 1.35, maxWidth: 720 }}>
              Six halls, eight labs, ten challenges. ML-KEM through Mosca&apos;s inequality, hands-on.
            </div>
          </div>

          {/* Sonar visual */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 320, height: 320, flexShrink: 0 }}>
            <svg width="320" height="320" viewBox="0 0 100 100">
              {/* Concentric reference rings */}
              <circle cx="50" cy="50" r="44" fill="none" stroke="#334155" strokeWidth="0.2" strokeDasharray="0.4 0.6" />
              <circle cx="50" cy="50" r="34" fill="none" stroke="#334155" strokeWidth="0.2" strokeDasharray="0.4 0.6" />
              <circle cx="50" cy="50" r="24" fill="none" stroke="#a78bfa" strokeWidth="0.5" strokeOpacity="0.7" />
              {/* Pulse */}
              <circle cx="50" cy="50" r="14" fill="none" stroke="#a78bfa" strokeWidth="0.6" strokeOpacity="0.95" />
              {/* Crosshair */}
              <line x1="6" y1="50" x2="94" y2="50" stroke="#334155" strokeWidth="0.15" />
              <line x1="50" y1="6" x2="50" y2="94" stroke="#334155" strokeWidth="0.15" />
              {/* Core */}
              <circle cx="50" cy="50" r="3" fill="#a78bfa" />
              {/* Anchor dots (labels omitted — satori does not render <text>) */}
              {[-90, -30, 30, 90, 150, -150].map((angle, i) => {
                const r = 32;
                const rad = (angle * Math.PI) / 180;
                const x = 50 + r * Math.cos(rad);
                const y = 50 + r * Math.sin(rad);
                return (
                  <circle key={i} cx={x} cy={y} r="1.8" fill="#a78bfa" fillOpacity="0.75" />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Footer strip */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22, color: "#64748b" }}>
          <span>systemslibrarian.github.io/post-quantum-atlas</span>
          <span>Sibling to the Cipher Museum</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
