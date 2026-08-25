import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (process.env.NODE_ENV === "production" ? "/post-quantum-atlas" : "");

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Post-Quantum Atlas",
    short_name: "PQ Atlas",
    description: "An interactive learning system for post-quantum cryptography.",
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#0a0e17",
    theme_color: "#0a0e17",
    icons: [
      {
        src: `${basePath}/icon-192.svg`,
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: `${basePath}/icon-512.svg`,
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    categories: ["education", "reference", "developer"],
  };
}
