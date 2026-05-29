"use client";

import { useEffect } from "react";

// Registers the service worker once on mount.
// basePath is set to /post-quantum-atlas in next.config.ts, so sw.js lives there.
export default function SwRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const swUrl = `${window.location.origin}/post-quantum-atlas/sw.js`;
    navigator.serviceWorker
      .register(swUrl, { scope: "/post-quantum-atlas/" })
      .catch(() => { /* swallowing; offline support is a nice-to-have */ });
  }, []);

  return null;
}
