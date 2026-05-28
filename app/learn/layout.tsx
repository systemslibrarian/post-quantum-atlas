import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn",
  description: "A guided 6-module, 21-lesson path through post-quantum cryptography — from foundations to real-world deployment.",
  openGraph: {
    title: "Post-Quantum Atlas — Learning Path",
    description: "6 modules. 21 lessons. From cryptographic foundations through ML-KEM, ML-DSA, and the migration playbook.",
  },
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
