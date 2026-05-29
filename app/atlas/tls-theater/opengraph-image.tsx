import { renderOg, OG_SIZE } from "../../lib/og-template";

export const dynamic = "force-static";
export const alt = "TLS Handshake Theater — with a quantum attacker";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OG() {
  return renderOg({
    tag: "TLS theater",
    title: "Watch it break.",
    subtitle: "Step through a TLS 1.3 handshake. Then toggle the quantum attacker.",
    accentHex: "#a78bfa",
    visual: (
      <svg width="280" height="280" viewBox="0 0 100 100">
        <circle cx="20" cy="50" r="8" fill="#38bdf8" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="0.5" />
        <circle cx="80" cy="50" r="8" fill="#a78bfa" fillOpacity="0.25" stroke="#a78bfa" strokeWidth="0.5" />
        {[25, 40, 55, 70].map((y, i) => (
          <line
            key={i}
            x1={i % 2 === 0 ? 30 : 70}
            y1={y}
            x2={i % 2 === 0 ? 70 : 30}
            y2={y}
            stroke={i < 2 ? "#fbbf24" : "#34d399"}
            strokeWidth="0.6"
            strokeOpacity="0.85"
          />
        ))}
      </svg>
    ),
  });
}
