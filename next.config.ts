import type { NextConfig } from "next";

// GitHub Pages serves the site under https://<user>.github.io/<repo>/.
// In production we set basePath = "/post-quantum-atlas" so all asset URLs work.
// Override with NEXT_PUBLIC_BASE_PATH if the repo or deployment target changes.
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.NODE_ENV === "production" ? "/post-quantum-atlas" : "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  // GH Pages can't run the Next image optimizer.
  images: { unoptimized: true },
};

export default nextConfig;
