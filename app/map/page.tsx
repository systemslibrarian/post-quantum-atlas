"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Map as MapIcon, GraduationCap, Sparkles, Atom, ArrowRight
} from "lucide-react";
import { modules } from "../lib/curriculum";
import { labs, lessonsForLab } from "../lib/labs";

interface Node {
  id: string;
  kind: "hall" | "lab" | "challenges" | "entrance";
  title: string;
  subtitle: string;
  href: string;
  hex: string;
}

export default function MapPage() {
  const [hover, setHover] = useState<string | null>(null);

  const hallNodes: Node[] = modules.map((m) => ({
    id: `hall:${m.id}`,
    kind: "hall",
    title: m.title,
    subtitle: `Hall ${m.order} · ${m.lessons.length} exhibits`,
    href: `/learn/${m.id}`,
    hex: hueByOrder(m.order),
  }));

  const labNodes: Node[] = Object.values(labs).map((l) => ({
    id: `lab:${l.id}`,
    kind: "lab",
    title: l.title,
    subtitle: l.blurb,
    href: l.href,
    hex: "#38bdf8",
  }));

  const challengesNode: Node = {
    id: "challenges",
    kind: "challenges",
    title: "Challenges",
    subtitle: "Ten short puzzles",
    href: "/challenges",
    hex: "#fbbf24",
  };

  const edges: { from: string; to: string }[] = useMemo(() => {
    const out: { from: string; to: string }[] = [];
    for (const lab of Object.values(labs)) {
      for (const ref of lessonsForLab(lab.id)) {
        out.push({ from: `hall:${ref.moduleId}`, to: `lab:${lab.id}` });
      }
    }
    return out;
  }, []);

  function isRelated(nodeId: string): boolean {
    if (!hover) return false;
    if (hover === nodeId) return true;
    return edges.some(e =>
      (e.from === hover && e.to === nodeId) || (e.to === hover && e.from === nodeId)
    );
  }

  return (
    <div className="min-h-screen">
      <main id="main">
        <section className="max-w-6xl mx-auto px-6 pt-10 sm:pt-12 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-[family-name:var(--font-display)] font-medium mb-4">
            <MapIcon size={14} aria-hidden="true" />
            Museum map
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            The whole museum in one glance.
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            Six halls down the left; six labs and the challenges room down the right.
            Lines show which lab continues which exhibit. Hover any node to light up its neighbors.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-10">
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/40 p-3 sm:p-4">
            <MapSvg
              halls={hallNodes}
              labs={labNodes}
              challenges={challengesNode}
              edges={edges}
              hover={hover}
              isRelated={isRelated}
              onHover={setHover}
            />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
                <GraduationCap size={14} aria-hidden="true" /> Halls
              </h2>
              <ul className="space-y-1.5">
                {hallNodes.map(n => (
                  <li key={n.id}>
                    <Link href={n.href} className="block px-3 py-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-[var(--color-text-primary)]">{n.title}</span>
                        <ArrowRight size={14} className="text-[var(--color-text-muted)]" aria-hidden="true" />
                      </div>
                      <div className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider font-[family-name:var(--font-display)]">
                        {n.subtitle}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
                <MapIcon size={14} aria-hidden="true" /> Labs &amp; rooms
              </h2>
              <ul className="space-y-1.5">
                {[...labNodes, challengesNode].map(n => (
                  <li key={n.id}>
                    <Link href={n.href} className="block px-3 py-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-[var(--color-text-primary)]">{n.title}</span>
                        <ArrowRight size={14} className="text-[var(--color-text-muted)]" aria-hidden="true" />
                      </div>
                      <div className="text-[11px] text-[var(--color-text-muted)] leading-snug">
                        {n.subtitle}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border-subtle)] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs italic text-[var(--color-text-muted)]/60">
            <Link href="/about" className="underline hover:text-[var(--color-text-secondary)]">About</Link>
            <span className="mx-2">·</span>
            <Link href="/" className="underline hover:text-[var(--color-text-secondary)]">Entrance</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

function hueByOrder(order: number): string {
  return ["#34d399", "#38bdf8", "#f87171", "#a78bfa", "#fbbf24", "#06b6d4"][order - 1] ?? "#a78bfa";
}

interface MapSvgProps {
  halls: Node[];
  labs: Node[];
  challenges: Node;
  edges: { from: string; to: string }[];
  hover: string | null;
  isRelated: (id: string) => boolean;
  onHover: (id: string | null) => void;
}

function MapSvg({ halls, labs, challenges, edges, hover, isRelated, onHover }: MapSvgProps) {
  // Layout in a 1000x600 virtual canvas.
  const W = 1000;
  const H = 600;
  const halfH = H - 40;
  const leftX = 200;
  const rightX = 800;

  const hallY = (i: number) => 40 + (halfH / (halls.length + 1)) * (i + 1);
  const rightItems = [...labs, challenges];
  const rightY = (i: number) => 40 + (halfH / (rightItems.length + 1)) * (i + 1);

  const positions = new Map<string, { x: number; y: number }>();
  halls.forEach((n, i) => positions.set(n.id, { x: leftX, y: hallY(i) }));
  rightItems.forEach((n, i) => positions.set(n.id, { x: rightX, y: rightY(i) }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Museum map of halls and labs">
      {/* Column labels */}
      <text x={leftX} y={24} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="Outfit, sans-serif" letterSpacing="2">
        HALLS
      </text>
      <text x={rightX} y={24} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="Outfit, sans-serif" letterSpacing="2">
        LABS &amp; CHALLENGES
      </text>

      {/* Edges */}
      {edges.map((e, i) => {
        const a = positions.get(e.from);
        const b = positions.get(e.to);
        if (!a || !b) return null;
        const highlighted = hover ? (hover === e.from || hover === e.to) : false;
        const mx = (a.x + b.x) / 2;
        return (
          <path
            key={i}
            d={`M ${a.x + 80} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x - 80} ${b.y}`}
            stroke={highlighted ? "#a78bfa" : "#334155"}
            strokeOpacity={highlighted ? 0.9 : (hover ? 0.15 : 0.45)}
            strokeWidth={highlighted ? 1.4 : 0.8}
            fill="none"
          />
        );
      })}

      {/* Nodes */}
      {halls.map((n, i) => (
        <NodeShape key={n.id} node={n} x={leftX} y={hallY(i)} anchor="left" related={hover ? isRelated(n.id) : true} dimmed={!!hover && !isRelated(n.id)} onHover={onHover} />
      ))}
      {rightItems.map((n, i) => (
        <NodeShape key={n.id} node={n} x={rightX} y={rightY(i)} anchor="right" related={hover ? isRelated(n.id) : true} dimmed={!!hover && !isRelated(n.id)} onHover={onHover} />
      ))}
    </svg>
  );
}

function NodeShape({
  node, x, y, anchor, related, dimmed, onHover,
}: {
  node: Node; x: number; y: number; anchor: "left" | "right"; related: boolean; dimmed: boolean; onHover: (id: string | null) => void;
}) {
  const w = 160;
  const h = 36;
  const rx = anchor === "left" ? x - w / 2 : x - w / 2;
  const ry = y - h / 2;
  const opacity = dimmed ? 0.3 : 1;

  // We render a transparent <a> wrapping the rect+label so clicks navigate.
  return (
    <g
      style={{ opacity, transition: "opacity 0.2s" }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.id)}
      onBlur={() => onHover(null)}
    >
      <a href={node.href} aria-label={`${node.title} — ${node.subtitle}`}>
        <rect
          x={rx}
          y={ry}
          rx={8}
          ry={8}
          width={w}
          height={h}
          fill={`${node.hex}${related ? "33" : "1a"}`}
          stroke={node.hex}
          strokeOpacity={related ? 0.9 : 0.4}
          strokeWidth={related ? 1.4 : 0.8}
        />
        <text
          x={x}
          y={y - 2}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#f1f5f9"
          fontFamily="Outfit, sans-serif"
        >
          {truncate(node.title, 22)}
        </text>
        <text
          x={x}
          y={y + 11}
          textAnchor="middle"
          fontSize="8"
          fill="#94a3b8"
          fontFamily="JetBrains Mono, monospace"
        >
          {truncate(node.subtitle, 32)}
        </text>
      </a>
    </g>
  );
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
