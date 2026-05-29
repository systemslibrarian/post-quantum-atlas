import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search every hall, exhibit, lab, algorithm, and page in the Post-Quantum Atlas.",
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
