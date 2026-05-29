import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Challenges",
  description: "Ten short puzzles on post-quantum cryptography: handshake survival, PQC signatures, FIPS mapping, the broken family, Mosca verdicts, CNSA 2.0, X-Wing, qubit collapse, and 2030.",
  openGraph: {
    title: "Post-Quantum Atlas — Challenges",
    description: "Ten puzzles drawn from the halls and the atlas.",
  },
};

export default function ChallengesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
