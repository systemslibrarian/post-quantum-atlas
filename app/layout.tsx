import type { Metadata, Viewport } from "next";
import "./globals.css";
import CommandPalette from "./components/CommandPalette";
import MuseumNav from "./components/MuseumNav";
import Breadcrumbs from "./components/Breadcrumbs";
import Tour from "./components/Tour";
import SwRegister from "./components/SwRegister";

export const metadata: Metadata = {
  metadataBase: new URL("https://systemslibrarian.github.io/post-quantum-atlas/"),
  title: {
    default: "Post-Quantum Atlas — An interactive PQC learning system",
    template: "%s · Post-Quantum Atlas",
  },
  description: "An interactive learning system for post-quantum cryptography. 6 modules, 21 lessons, and a growing atlas of hands-on labs — from RSA and ECC through Shor's, Mosca's inequality, ML-KEM, ML-DSA, and hybrid TLS migration.",
  keywords: ["post-quantum cryptography", "PQC", "ML-KEM", "ML-DSA", "SLH-DSA", "Kyber", "Dilithium", "quantum computing", "TLS", "NIST FIPS 203", "FIPS 204", "FIPS 205", "Mosca's inequality"],
  authors: [{ name: "Paul Clark", url: "https://github.com/systemslibrarian" }],
  openGraph: {
    type: "website",
    title: "Post-Quantum Atlas",
    description: "An interactive learning system for post-quantum cryptography. Follow the path, or explore the map.",
    siteName: "Post-Quantum Atlas",
  },
  twitter: {
    card: "summary_large_image",
    title: "Post-Quantum Atlas",
    description: "An interactive learning system for post-quantum cryptography.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e17",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Outfit:wght@300;400;500;600;700;800&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="grain">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-3 focus:py-2 focus:rounded focus:bg-[var(--color-accent)] focus:text-[var(--color-surface)] focus:font-medium"
        >
          Skip to main content
        </a>
        <div className="mesh-bg" />
        <MuseumNav />
        <Breadcrumbs />
        {children}
        <CommandPalette />
        <Tour />
        <SwRegister />
      </body>
    </html>
  );
}
