import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atlas",
  description: "Interactive labs for post-quantum cryptography: algorithm cards, the impact map, Mosca's inequality, and the TLS handshake theater.",
  openGraph: {
    title: "Post-Quantum Atlas — interactive labs",
    description: "Algorithm cards, the impact map, Mosca's inequality, the TLS handshake theater.",
  },
};

export default function AtlasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
