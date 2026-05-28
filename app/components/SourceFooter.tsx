import Link from "next/link";

export const REFDOC_VERSION = "v3.8";
export const REFDOC_DATE = "May 2026";

export default function SourceFooter({ centered = true }: { centered?: boolean }) {
  return (
    <div className={`text-[11px] text-[var(--color-text-muted)]/70 ${centered ? "text-center" : ""}`}>
      Knowledge sourced from{" "}
      <Link href="/about" className="underline hover:text-[var(--color-text-secondary)]">
        RefDoc.md
      </Link>{" "}
      <span className="font-[family-name:var(--font-mono)]">{REFDOC_VERSION}</span> · {REFDOC_DATE}
    </div>
  );
}
