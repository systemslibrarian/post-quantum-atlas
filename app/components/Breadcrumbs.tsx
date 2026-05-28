"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getModule, getLesson } from "../lib/curriculum";
import { labs } from "../lib/labs";

interface Crumb {
  label: string;
  href?: string;
}

function buildCrumbs(pathname: string): Crumb[] {
  const segs = pathname.split("/").filter(Boolean);
  if (segs.length === 0) return [];

  const crumbs: Crumb[] = [{ label: "Entrance", href: "/" }];

  // /learn/<moduleId>/<lessonId>
  if (segs[0] === "learn") {
    crumbs.push({ label: "Halls", href: "/learn/foundations" });
    const modId = segs[1];
    const lessonId = segs[2];
    if (modId) {
      const mod = getModule(modId);
      crumbs.push({ label: mod?.title ?? modId, href: lessonId ? `/learn/${modId}` : undefined });
      if (lessonId) {
        const data = getLesson(modId, lessonId);
        crumbs.push({ label: data?.lesson.title ?? lessonId });
      }
    }
    return crumbs;
  }

  // /atlas[/<lab>]
  if (segs[0] === "atlas") {
    crumbs.push({ label: "Atlas", href: segs[1] ? "/atlas" : undefined });
    const labId = segs[1];
    if (labId) {
      const lab = labs[labId];
      crumbs.push({ label: lab?.title ?? labId });
    }
    return crumbs;
  }

  if (segs[0] === "challenges") { crumbs.push({ label: "Challenges" }); return crumbs; }
  if (segs[0] === "about")      { crumbs.push({ label: "About" });      return crumbs; }

  // Fallback: title-case the segments.
  for (let i = 0; i < segs.length; i++) {
    crumbs.push({
      label: segs[i].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      href: i < segs.length - 1 ? "/" + segs.slice(0, i + 1).join("/") : undefined,
    });
  }
  return crumbs;
}

export default function Breadcrumbs() {
  const pathname = usePathname() ?? "/";
  const crumbs = buildCrumbs(pathname);
  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="border-b border-[var(--color-border-subtle)]/60 bg-[var(--color-surface)]/40">
      <ol className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] overflow-x-auto whitespace-nowrap">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={11} className="text-[var(--color-text-muted)]/60" aria-hidden="true" />}
              {c.href && !last ? (
                <Link href={c.href} className="hover:text-[var(--color-text-secondary)] transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span className={last ? "text-[var(--color-text-secondary)]" : ""} aria-current={last ? "page" : undefined}>
                  {c.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
