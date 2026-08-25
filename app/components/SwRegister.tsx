"use client";

import { useEffect } from "react";

// Registers the service worker once on mount.
// basePath is set to /post-quantum-atlas in next.config.ts, so sw.js lives there.
export default function SwRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/post-quantum-atlas";
    const swUrl = `${window.location.origin}${basePath}/sw.js`;
    navigator.serviceWorker
      .register(swUrl, { scope: `${basePath}/` })
      .catch(() => { /* swallowing; offline support is a nice-to-have */ });
  }, []);

  return null;
}
