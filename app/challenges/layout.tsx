import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Challenges",
  description: "Five short puzzles on post-quantum cryptography: which TLS handshake survived, which certificate is PQC-signed, FIPS number mapping, the broken family, and a Mosca verdict.",
  openGraph: {
    title: "Post-Quantum Atlas — Challenges",
    description: "Five puzzles drawn from the halls and the atlas.",
  },
};

export default function ChallengesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
