import { renderOg, OG_SIZE } from "../../lib/og-template";

export const dynamic = "force-static";
export const alt = "Mosca's inequality — are you already late?";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OG() {
  return renderOg({
    tag: "Mosca",
    title: "X + Y > Z.",
    subtitle: "Data lifetime plus migration time vs. the quantum clock.",
    accentHex: "#fbbf24",
    visual: (
      <svg width="280" height="280" viewBox="0 0 100 100">
        <rect x="10" y="35" width="80" height="6" rx="2" fill="#fbbf24" fillOpacity="0.25" stroke="#fbbf24" strokeWidth="0.5" />
        <rect x="10" y="48" width="40" height="6" rx="2" fill="#38bdf8" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="0.5" />
        <rect x="50" y="48" width="20" height="6" rx="2" fill="#a78bfa" fillOpacity="0.25" stroke="#a78bfa" strokeWidth="0.5" />
        <line x1="70" y1="30" x2="70" y2="65" stroke="#f87171" strokeWidth="0.4" strokeDasharray="2 2" />
      </svg>
    ),
  });
}
