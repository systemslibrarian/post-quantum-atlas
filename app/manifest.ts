import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Post-Quantum Atlas",
    short_name: "PQ Atlas",
    description: "An interactive learning system for post-quantum cryptography.",
    start_url: "/post-quantum-atlas/",
    scope: "/post-quantum-atlas/",
    display: "standalone",
    background_color: "#0a0e17",
    theme_color: "#0a0e17",
    icons: [
      {
        src: "/post-quantum-atlas/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/post-quantum-atlas/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    categories: ["education", "reference", "developer"],
  };
}
