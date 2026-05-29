import type { MetadataRoute } from "next";
import { modules } from "./lib/curriculum";
import { labs } from "./lib/labs";

const BASE = "https://systemslibrarian.github.io/post-quantum-atlas";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();

  const staticRoutes = [
    "",
    "/atlas/",
    "/migration/",
    "/challenges/",
    "/map/",
    "/search/",
    "/about/",
    "/learn/complete/",
    "/learn/capstone/",
  ];

  const labRoutes = Object.values(labs).map(l => l.href + "/");

  const halls = modules.map(m => `/learn/${m.id}/`);
  const exhibits: string[] = [];
  for (const m of modules) for (const l of m.lessons) exhibits.push(`/learn/${m.id}/${l.id}/`);

  const all = [...staticRoutes, ...labRoutes, ...halls, ...exhibits];

  return all.map(p => ({
    url: BASE + p,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : p.startsWith("/atlas") || p === "/challenges/" ? 0.8 : 0.6,
  }));
}
