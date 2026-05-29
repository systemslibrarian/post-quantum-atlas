import { ImageResponse } from "next/og";
import type { ReactElement } from "react";

export const OG_SIZE = { width: 1200, height: 630 };

interface OgProps {
  tag: string;
  title: string;
  subtitle: string;
  accentHex?: string;
  visual?: ReactElement;
}

export function renderOg({ tag, title, subtitle, accentHex = "#a78bfa", visual }: OgProps) {
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
            `radial-gradient(ellipse at 20% 30%, ${accentHex}26 0%, transparent 55%),` +
            "radial-gradient(ellipse at 85% 80%, rgba(56,189,248,0.10) 0%, transparent 55%)," +
            "#0a0e17",
          color: "#f1f5f9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 20, color: "#94a3b8", letterSpacing: 4, textTransform: "uppercase" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `${accentHex}30`, border: `1px solid ${accentHex}66`, display: "flex", alignItems: "center", justifyContent: "center", color: accentHex, fontSize: 24 }}>⚛</div>
          <span>Post-Quantum Atlas</span>
          <span style={{ color: "#475569" }}>·</span>
          <span style={{ color: accentHex }}>{tag}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
            <div style={{ display: "flex", fontSize: 78, fontWeight: 700, lineHeight: 1.05, color: accentHex }}>
              {title}
            </div>
            <div style={{ display: "flex", fontSize: 28, color: "#cbd5e1", lineHeight: 1.35, marginTop: 16 }}>
              {subtitle}
            </div>
          </div>
          {visual && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 280, height: 280, flexShrink: 0 }}>
              {visual}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 20, color: "#64748b" }}>
          <span>systemslibrarian.github.io/post-quantum-atlas</span>
          <span>Sibling to the Cipher Museum</span>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
