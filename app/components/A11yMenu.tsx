"use client";

import { useEffect, useRef, useState } from "react";
import { Accessibility, Type, Eye, RotateCcw, X } from "lucide-react";

const STORAGE_KEY = "pq-atlas-a11y-v1";

interface State {
  contrast: "default" | "high";
  fontScale: 1 | 1.125 | 1.25;
}

const defaultState: State = { contrast: "default", fontScale: 1 };

function applyState(s: State) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.contrast = s.contrast;
  document.documentElement.style.fontSize = `${s.fontScale * 100}%`;
}

function loadState(): State {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<State>;
    return {
      contrast: parsed.contrast === "high" ? "high" : "default",
      fontScale: parsed.fontScale === 1.125 || parsed.fontScale === 1.25 ? parsed.fontScale : 1,
    };
  } catch { return defaultState; }
}

export default function A11yMenu() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>(defaultState);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = loadState();
    setState(s);
    applyState(s);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function update(next: Partial<State>) {
    const merged = { ...state, ...next } as State;
    setState(merged);
    applyState(merged);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)); } catch { /* noop */ }
  }

  function reset() {
    setState(defaultState);
    applyState(defaultState);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Accessibility settings"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-mid)] transition-colors"
      >
        <Accessibility size={13} aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-40 w-64 p-4 rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border-mid)] shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)]">
              Accessibility
            </h3>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
              <X size={12} />
            </button>
          </div>

          <Row icon={<Eye size={12} aria-hidden="true" />} label="Contrast">
            <Pill active={state.contrast === "default"} onClick={() => update({ contrast: "default" })}>Default</Pill>
            <Pill active={state.contrast === "high"} onClick={() => update({ contrast: "high" })}>High</Pill>
          </Row>

          <Row icon={<Type size={12} aria-hidden="true" />} label="Text size">
            <Pill active={state.fontScale === 1} onClick={() => update({ fontScale: 1 })}>100%</Pill>
            <Pill active={state.fontScale === 1.125} onClick={() => update({ fontScale: 1.125 })}>112%</Pill>
            <Pill active={state.fontScale === 1.25} onClick={() => update({ fontScale: 1.25 })}>125%</Pill>
          </Row>

          <button
            onClick={reset}
            className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] px-3 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] transition-colors"
          >
            <RotateCcw size={10} aria-hidden="true" /> Reset
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-display)] mb-1.5">
        {icon} {label}
      </div>
      <div className="flex gap-1">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex-1 text-xs px-2 py-1.5 rounded-md font-[family-name:var(--font-display)] transition-colors ${
        active ? "bg-[var(--color-text-primary)] text-[var(--color-surface)]"
               : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
      }`}
    >
      {children}
    </button>
  );
}
