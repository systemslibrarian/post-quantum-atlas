"use client";

import { Compass } from "lucide-react";
import { openTour } from "./Tour";

export default function TourButton() {
  return (
    <button
      onClick={openTour}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-quantum)]/15 border border-[var(--color-quantum)]/30 text-[var(--color-quantum)] text-xs font-[family-name:var(--font-display)] font-medium hover:bg-[var(--color-quantum)]/25 transition-colors"
    >
      <Compass size={12} aria-hidden="true" />
      Take the tour
    </button>
  );
}
