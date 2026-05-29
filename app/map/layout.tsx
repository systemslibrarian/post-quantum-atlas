import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Museum map",
  description: "The whole Post-Quantum Atlas in one glance — six halls, eight labs, the challenges room, and the lines between them.",
  openGraph: {
    title: "Post-Quantum Atlas — Museum Map",
    description: "Halls and labs at a glance.",
  },
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
