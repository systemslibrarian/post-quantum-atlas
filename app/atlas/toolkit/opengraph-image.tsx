import { renderOg, OG_SIZE } from "../../lib/og-template";

export const dynamic = "force-static";
export const alt = "PQC Toolkit — filterable algorithm cards";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OG() {
  return renderOg({
    tag: "Toolkit",
    title: "The PQC toolkit.",
    subtitle: "ML-KEM · ML-DSA · SLH-DSA · FN-DSA · HQC · Classic McEliece · SIKE.",
    accentHex: "#38bdf8",
    visual: (
      <svg width="280" height="280" viewBox="0 0 100 100">
        {[0, 1, 2].map(row =>
          [0, 1, 2].map(col => (
            <rect
              key={`${row}-${col}`}
              x={15 + col * 25}
              y={15 + row * 25}
              width="20"
              height="20"
              rx="3"
              fill="#38bdf8"
              fillOpacity={0.1 + (row + col) * 0.05}
              stroke="#38bdf8"
              strokeOpacity="0.7"
              strokeWidth="0.4"
            />
          ))
        )}
      </svg>
    ),
  });
}
