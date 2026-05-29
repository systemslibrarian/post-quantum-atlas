import { renderOg, OG_SIZE } from "../../lib/og-template";

export const dynamic = "force-static";
export const alt = "Breaks vs. Survives — the quantum impact map";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OG() {
  return renderOg({
    tag: "Impact map",
    title: "Breaks. Survives.",
    subtitle: "What falls to Shor's. What stands with upgrades. What replaces them.",
    accentHex: "#f87171",
    visual: (
      <svg width="280" height="280" viewBox="0 0 100 100">
        <rect x="10" y="10" width="38" height="38" rx="4" fill="#f87171" fillOpacity="0.18" stroke="#f87171" strokeOpacity="0.7" strokeWidth="0.5" />
        <line x1="14" y1="14" x2="44" y2="44" stroke="#f87171" strokeOpacity="0.6" strokeWidth="0.4" />
        <line x1="14" y1="44" x2="44" y2="14" stroke="#f87171" strokeOpacity="0.6" strokeWidth="0.4" />
        <rect x="52" y="10" width="38" height="38" rx="4" fill="#fbbf24" fillOpacity="0.18" stroke="#fbbf24" strokeOpacity="0.7" strokeWidth="0.5" />
        <rect x="10" y="52" width="38" height="38" rx="4" fill="#34d399" fillOpacity="0.18" stroke="#34d399" strokeOpacity="0.7" strokeWidth="0.5" />
        <rect x="52" y="52" width="38" height="38" rx="4" fill="#a78bfa" fillOpacity="0.18" stroke="#a78bfa" strokeOpacity="0.7" strokeWidth="0.5" />
      </svg>
    ),
  });
}
